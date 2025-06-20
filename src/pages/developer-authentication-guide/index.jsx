// src/pages/developer-authentication-guide/index.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import CodeBlock from './components/CodeBlock';
import SectionCollapse from './components/SectionCollapse';
import TestingGuideline from './components/TestingGuideline';
import QuickReference from './components/QuickReference';

const DeveloperAuthenticationGuide = () => {
  const { user, userProfile } = useAuth();
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [activeSection, setActiveSection] = useState('overview');

  const toggleStepCompletion = (stepId) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
  };

  const implementationSteps = [
    {
      id: 'jwt-exchange',
      title: 'Update jwt-exchange/index.ts',
      timeEstimate: '15-20 minutes',
      description: 'Enhance the JWT exchange function to properly handle authorization codes',
      status: completedSteps.has('jwt-exchange') ? 'completed' : 'pending'
    },
    {
      id: 'auth-context',
      title: 'Enhance AuthContext.jsx',
      timeEstimate: '20-25 minutes', 
      description: 'Add callback handling and session management',
      status: completedSteps.has('auth-context') ? 'completed' : 'pending'
    },
    {
      id: 'routes',
      title: 'Update Routes.jsx',
      timeEstimate: '10-15 minutes',
      description: 'Add dynamic callback routes for authentication',
      status: completedSteps.has('routes') ? 'completed' : 'pending'
    },
    {
      id: 'profile',
      title: 'Create Profile Component',
      timeEstimate: '15-20 minutes',
      description: 'Build profile display component with user data',
      status: completedSteps.has('profile') ? 'completed' : 'pending'
    },
    {
      id: 'integration',
      title: 'Integration Testing',
      timeEstimate: '10-15 minutes',
      description: 'Test the complete authentication flow',
      status: completedSteps.has('integration') ? 'completed' : 'pending'
    }
  ];

  const jwtExchangeCode = `// supabase/functions/jwt-exchange/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { create } from "https://deno.land/x/djwt@v2.8/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface JWTExchangeRequest {
  authorization_code?: string;
  custom_claims: Record<string, any>;
  exchange_type: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const jwtSecret = Deno.env.get("SUPABASE_JWT_SECRET");
    if (!jwtSecret) {
      throw new Error("JWT secret not configured");
    }

    const { authorization_code, custom_claims, exchange_type }: JWTExchangeRequest = await req.json();

    if (!exchange_type) {
      return new Response(
        JSON.stringify({ error: "Missing exchange_type parameter" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let user = null;
    let session = null;

    // Handle authorization code exchange
    if (exchange_type === "authorization_code" && authorization_code) {
      console.log("Exchanging authorization code for session");
      
      const { data, error } = await supabaseClient.auth.exchangeCodeForSession(authorization_code);
      
      if (error) {
        console.error("Code exchange error:", error);
        return new Response(
          JSON.stringify({ 
            error: "Failed to exchange authorization code",
            message: error.message,
            code: error.name || "code_exchange_failed"
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      user = data.user;
      session = data.session;
      console.log("Code exchange successful for user:", user?.id);
    }

    if (!user) {
      return new Response(
        JSON.stringify({ error: "No user found in exchange process" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create enhanced JWT payload
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = now + (60 * 60); // 1 hour

    const jwtPayload = {
      iss: "voiced-civic-platform",
      sub: user.id,
      aud: "voiced-users",
      exp: expiresAt,
      iat: now,
      jti: crypto.randomUUID(),
      email: user.email,
      email_verified: user.email_confirmed_at !== null,
      app_metadata: user.app_metadata || {},
      user_metadata: user.user_metadata || {},
      platform: "voiced-civic",
      role: user.role || "authenticated",
      ...custom_claims,
      token_type: exchange_type,
      exchange_source: "authorization_code"
    };

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(jwtSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );

    const jwt = await create({ alg: "HS256", typ: "JWT" }, jwtPayload, key);

    console.log(\`JWT token exchanged for user: \${user.id}, type: \${exchange_type}\`);

    return new Response(JSON.stringify({
      jwt_token: jwt,
      expires_at: expiresAt,
      token_type: exchange_type,
      ...(session && { session: session })
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("JWT Exchange Error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Internal server error during JWT exchange",
        message: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});`;

  const authContextCode = `// src/context/AuthContext.jsx (Enhanced AuthCallback Component)
export function AuthCallback() {
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const handleAuthCallback = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        const errorCode = urlParams.get('error_code');
        const errorDescription = urlParams.get('error_description');

        // Handle error cases
        if (error) {
          let userMessage = 'Authentication failed. Please try again.';
          
          if (errorCode === 'otp_expired' || error === 'access_denied') {
            userMessage = 'Your verification link has expired. Please sign up again to receive a new link.';
          } else if (errorDescription) {
            userMessage = decodeURIComponent(errorDescription.replace(/\\+/g, ' '));
          }
          
          console.log('Auth callback error:', { error, errorCode, errorDescription });
          
          if (isMounted) {
            setError(userMessage);
            setStatus('error');
          }
          return;
        }

        // Handle successful code exchange
        if (code) {
          console.log('Processing authorization code...');
          
          const result = await authService.exchangeCodeForSession(code);
          
          if (result?.success && isMounted) {
            console.log('Authorization code exchange successful');
            setStatus('success');
            
            // Redirect to home dashboard
            setTimeout(() => {
              if (isMounted) {
                navigate('/home-dashboard', { replace: true });
              }
            }, 2000);
          } else if (isMounted) {
            console.log('Authorization code exchange failed:', result?.error);
            setError(result?.error || 'Failed to process authentication. Please try again.');
            setStatus('error');
          }
        } else {
          // No code found - redirect to login
          if (isMounted) {
            console.log('No authorization code found, redirecting to login');
            navigate('/login-screen', { replace: true });
          }
        }
      } catch (error) {
        console.log('Auth callback processing error:', error);
        if (isMounted) {
          setError('Something went wrong processing your authentication. Please try again.');
          setStatus('error');
        }
      }
    };

    handleAuthCallback();

    return () => {
      isMounted = false;
    };
  }, [location.search, navigate]);

  // ... render logic for processing, success, and error states
}`;

  const routesCode = `// src/Routes.jsx (Enhanced with Callback Routes)
import { AuthCallback } from "context/AuthContext";
import AuthenticationCallbackHandler from "pages/authentication-callback-handler";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          {/* Existing routes */}
          <Route index element={<HomeDashboard />} />
          <Route path="home-dashboard" element={<HomeDashboard />} />
          <Route path="login-screen" element={<LoginScreen />} />
          <Route path="registration-screen" element={<RegistrationScreen />} />
          {/* ... other routes */}
        </Route>
        
        {/* Authentication callback routes with dynamic parameters */}
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/auth/confirm" element={<AuthCallback />} />
        <Route path="/authentication-callback-handler" element={<AuthenticationCallbackHandler />} />
        
        {/* Dynamic callback routes for magic link parameters */}
        <Route path="/?code=:code*" element={<AuthCallback />} />
        <Route path="/?error=:error*" element={<AuthCallback />} />
        
        <Route path="*" element={<NotFoundErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
};`;

  const profileCode = `// src/pages/profile/index.jsx (New Profile Component)
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import HomeDashboard from '../home-dashboard/index';
import LoginScreen from '../login-screen/index';
import RegistrationScreen from '../registration-screen/index';
import NotFoundErrorPage from '../404-error-page/index';
import { useNavigate, useLocation } from 'react-router-dom';







const Profile = () => {
  const { user, userProfile, loading, authError } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error: {authError}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Please log in to view your profile.</div>
      </div>
    );
  }

  const userTier = userProfile?.tier || 'Free';
  const userEmail = user?.email || 'No email available';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">User Profile</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="text-lg text-gray-900">{userEmail}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subscription Tier
                </label>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
                  <span className={\`\${
                    userTier === 'national' ?'bg-purple-100 text-purple-800' :'bg-green-100 text-green-800'
                  }\`}>
                    {userTier.charAt(0).toUpperCase() + userTier.slice(1)}
                  </span>
                </div>
              </div>
              
              {userProfile?.full_name && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="text-lg text-gray-900">{userProfile.full_name}</div>
                </div>
              )}
              
              {userProfile?.zip_code && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code
                  </label>
                  <div className="text-lg text-gray-900">{userProfile.zip_code}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;`;

  const envCode = `# .env (Environment Variables)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_JWT_SECRET=your-jwt-secret-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Development settings
VITE_APP_ENV=development
VITE_API_BASE_URL=http://localhost:3000`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Supabase Magic Link Authentication Fix</h1>
              <p className="text-gray-600 mt-2">Complete implementation guide for fixing authentication flow in Voiced platform</p>
            </div>
            {user && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Logged in as</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
                <p className="text-sm text-gray-500">Tier: {userProfile?.tier || 'Free'}</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Navigation</h3>
              <nav className="space-y-2">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'implementation', label: 'Implementation Steps' },
                  { id: 'code-examples', label: 'Code Examples' },
                  { id: 'testing', label: 'Testing Guide' },
                  { id: 'reference', label: 'Quick Reference' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      activeSection === item.id
                        ? 'bg-blue-100 text-blue-700 font-medium' :'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Overview Section */}
            {activeSection === 'overview' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Problem Overview</h2>
                <div className="prose max-w-none">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Current Issue</h3>
                    <p className="text-red-700">
                      After clicking the magic link, users are redirected to the site but remain unauthenticated. 
                      The profile page shows no user information (email, tier), indicating the session is not being established.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Root Cause</h3>
                    <ul className="text-blue-700 space-y-1">
                      <li>• Authorization code is not being properly exchanged for session</li>
                      <li>• Missing URL parameter parsing in callback handling</li>
                      <li>• Incomplete integration between Supabase auth and custom JWT system</li>
                      <li>• Missing proper error handling for expired/invalid links</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Solution Approach</h3>
                    <p className="text-green-700">
                      Implement proper callback handling with exchangeCodeForSession, enhance error handling, 
                      and ensure seamless integration with the existing authentication context.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Implementation Steps */}
            {activeSection === 'implementation' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Implementation Progress</h2>
                  
                  <div className="space-y-4">
                    {implementationSteps.map((step, index) => (
                      <div key={step.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <button
                                onClick={() => toggleStepCompletion(step.id)}
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                  step.status === 'completed'
                                    ? 'bg-green-500 border-green-500' :'border-gray-300 hover:border-green-400'
                                }`}
                              >
                                {step.status === 'completed' && (
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </button>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">
                                Step {index + 1}: {step.title}
                              </h3>
                              <p className="text-gray-600 mt-1">{step.description}</p>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {step.timeEstimate}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm text-gray-600">
                        {completedSteps.size} of {implementationSteps.length} completed
                      </span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(completedSteps.size / implementationSteps.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Code Examples */}
            {activeSection === 'code-examples' && (
              <div className="space-y-6">
                <SectionCollapse title="1. JWT Exchange Function (15-20 min)" defaultOpen={true}>
                  <CodeBlock 
                    language="typescript" 
                    code={jwtExchangeCode}
                    filename="supabase/functions/jwt-exchange/index.ts"
                  />
                </SectionCollapse>

                <SectionCollapse title="2. Enhanced AuthContext (20-25 min)">
                  <CodeBlock 
                    language="javascript" 
                    code={authContextCode}
                    filename="src/context/AuthContext.jsx"
                  />
                </SectionCollapse>

                <SectionCollapse title="3. Updated Routes (10-15 min)">
                  <CodeBlock 
                    language="javascript" 
                    code={routesCode}
                    filename="src/Routes.jsx"
                  />
                </SectionCollapse>

                <SectionCollapse title="4. Profile Component (15-20 min)">
                  <CodeBlock 
                    language="javascript" 
                    code={profileCode}
                    filename="src/pages/profile/index.jsx"
                  />
                </SectionCollapse>

                <SectionCollapse title="5. Environment Variables">
                  <CodeBlock 
                    language="plaintext" 
                    code={envCode}
                    filename=".env"
                  />
                </SectionCollapse>
              </div>
            )}

            {/* Testing Guide */}
            {activeSection === 'testing' && (
              <TestingGuideline />
            )}

            {/* Quick Reference */}
            {activeSection === 'reference' && (
              <QuickReference />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperAuthenticationGuide;