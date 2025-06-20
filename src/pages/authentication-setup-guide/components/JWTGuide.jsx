// src/pages/authentication-setup-guide/components/JWTGuide.jsx
import React, { useState } from 'react';
import { Shield, Code, Key } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import JWTTokenDisplay from '../../../components/ui/JWTTokenDisplay';
import CodeBlock from './CodeBlock';
import SectionCollapse from './SectionCollapse';
import Icon from '../../../components/AppIcon';


const JWTGuide = () => {
  const { user, jwtToken } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const codeExamples = {
    exchange: `// Exchange Supabase token for custom JWT
const { exchangeJWT } = useAuth();

const handleJWTExchange = async () => {
  const customClaims = {
    permissions: ['read', 'write'],
    department: 'civic-engagement'
  };
  
  const result = await exchangeJWT(customClaims);
  
  if (result.success) {
    console.log('JWT Token:', result.data.jwt_token);
    console.log('Expires at:', result.data.expires_at);
  } else {
    console.error('Exchange failed:', result.error);
  }
};`,

    refresh: `// Refresh JWT token with updated claims
const { refreshJWT } = useAuth();

const handleJWTRefresh = async () => {
  const updatedClaims = {
    tier: 'national', // Updated user tier
    last_activity: Date.now()
  };
  
  const result = await refreshJWT(updatedClaims);
  
  if (result.success) {
    console.log('Refreshed JWT:', result.data);
  }
};`,

    validate: `// Validate JWT token
const { validateJWT } = useAuth();

const handleJWTValidation = async (token) => {
  const result = await validateJWT(token);
  
  if (result.success && result.data.valid) {
    console.log('Token is valid');
    console.log('Claims:', result.data.claims);
    console.log('Expires at:', result.data.expires_at);
  } else {
    console.log('Token is invalid:', result.error);
  }
};`,

    apiUsage: `// Using JWT token in API requests
const { jwtToken } = useAuth();

const makeAuthenticatedRequest = async () => {
  if (!jwtToken?.jwt_token) {
    console.error('No JWT token available');
    return;
  }
  
  try {
    const response = await fetch('/api/secure-endpoint', {
      method: 'GET',
      headers: {
        'Authorization': \`Bearer \${jwtToken.jwt_token}\`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('API Response:', data);
    } else {
      console.error('API Error:', response.statusText);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
};`,

    serverValidation: `// Server-side JWT validation (Node.js example)
const jwt = require('jsonwebtoken');

const validateJWTMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    // Check token expiry
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    // Validate custom claims
    if (decoded.platform !== 'voiced-civic') {
      return res.status(401).json({ error: 'Invalid token platform' });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};`
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'implementation', label: 'Implementation', icon: Code },
    { id: 'live-demo', label: 'Live Demo', icon: Key }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Shield className="w-6 h-6" />
          JWT Token Exchange Guide
        </h2>
        <p className="text-blue-100">
          Learn how to implement JWT token exchange in your Voiced authentication flow
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <SectionCollapse title="What is JWT Token Exchange?">
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-4">
                JWT (JSON Web Token) exchange allows you to convert your Supabase authentication token 
                into a custom JWT token with enhanced claims and platform-specific information.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Benefits of JWT Exchange:</h4>
                <ul className="space-y-1 text-blue-800">
                  <li>• Custom claims with user profile data</li>
                  <li>• Platform-specific token validation</li>
                  <li>• Enhanced security for API endpoints</li>
                  <li>• Standardized token format across services</li>
                  <li>• Controlled token expiration and refresh</li>
                </ul>
              </div>
            </div>
          </SectionCollapse>

          <SectionCollapse title="Token Flow Architecture">
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Authentication Flow:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">1</div>
                    <span>User signs in with Supabase (email/password, OAuth, etc.)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">2</div>
                    <span>Supabase returns access token and user session</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">3</div>
                    <span>AuthService automatically exchanges token for custom JWT</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">4</div>
                    <span>Custom JWT includes user profile and platform claims</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs">5</div>
                    <span>Application uses JWT for authenticated API requests</span>
                  </div>
                </div>
              </div>
            </div>
          </SectionCollapse>

          <SectionCollapse title="Token Structure">
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Standard JWT Claims:</h4>
                <div className="text-sm space-y-1">
                  <div><code className="bg-white px-2 py-1 rounded">iss</code> - Issuer (voiced-civic-platform)</div>
                  <div><code className="bg-white px-2 py-1 rounded">sub</code> - Subject (user ID)</div>
                  <div><code className="bg-white px-2 py-1 rounded">aud</code> - Audience (voiced-users)</div>
                  <div><code className="bg-white px-2 py-1 rounded">exp</code> - Expiration time</div>
                  <div><code className="bg-white px-2 py-1 rounded">iat</code> - Issued at time</div>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Custom Claims:</h4>
                <div className="text-sm space-y-1">
                  <div><code className="bg-white px-2 py-1 rounded">tier</code> - User subscription tier</div>
                  <div><code className="bg-white px-2 py-1 rounded">zip_code</code> - User location</div>
                  <div><code className="bg-white px-2 py-1 rounded">platform</code> - Platform identifier</div>
                  <div><code className="bg-white px-2 py-1 rounded">role</code> - User role</div>
                  <div><code className="bg-white px-2 py-1 rounded">email_verified</code> - Email verification status</div>
                </div>
              </div>
            </div>
          </SectionCollapse>
        </div>
      )}

      {activeTab === 'implementation' && (
        <div className="space-y-6">
          <SectionCollapse title="1. Exchange Supabase Token for JWT">
            <div className="space-y-4">
              <p className="text-gray-600">
                The AuthContext automatically exchanges tokens, but you can also manually trigger the exchange:
              </p>
              <CodeBlock code={codeExamples.exchange} language="javascript" />
            </div>
          </SectionCollapse>

          <SectionCollapse title="2. Refresh JWT Token">
            <div className="space-y-4">
              <p className="text-gray-600">
                Refresh the JWT token when user profile changes or before expiration:
              </p>
              <CodeBlock code={codeExamples.refresh} language="javascript" />
            </div>
          </SectionCollapse>

          <SectionCollapse title="3. Validate JWT Token">
            <div className="space-y-4">
              <p className="text-gray-600">
                Validate JWT tokens to ensure they're still valid and not expired:
              </p>
              <CodeBlock code={codeExamples.validate} language="javascript" />
            </div>
          </SectionCollapse>

          <SectionCollapse title="4. Using JWT in API Requests">
            <div className="space-y-4">
              <p className="text-gray-600">
                Include the JWT token in the Authorization header for authenticated requests:
              </p>
              <CodeBlock code={codeExamples.apiUsage} language="javascript" />
            </div>
          </SectionCollapse>

          <SectionCollapse title="5. Server-Side Validation">
            <div className="space-y-4">
              <p className="text-gray-600">
                Example of how to validate JWT tokens on your API server:
              </p>
              <CodeBlock code={codeExamples.serverValidation} language="javascript" />
            </div>
          </SectionCollapse>
        </div>
      )}

      {activeTab === 'live-demo' && (
        <div className="space-y-6">
          {user ? (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">Authenticated User</span>
                </div>
                <p className="text-green-700 mt-1">
                  You are signed in as <strong>{user.email}</strong>. 
                  {jwtToken ? 'JWT token is available below.' : 'Generating JWT token...'}
                </p>
              </div>
              
              <JWTTokenDisplay />
            </>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <Shield className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Authentication Required
              </h3>
              <p className="text-yellow-700 mb-4">
                Please sign in to see JWT token exchange in action.
              </p>
              <div className="space-y-2 text-sm text-yellow-600">
                <p>Demo credentials:</p>
                <p><strong>Email:</strong> free@voiced.gov or national@voiced.gov</p>
                <p><strong>Password:</strong> password123</p>
              </div>
            </div>
          )}

          <SectionCollapse title="Testing JWT Token Exchange">
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Test Steps:</h4>
                <ol className="space-y-2 text-blue-800 list-decimal list-inside">
                  <li>Sign in using the login form</li>
                  <li>Observe automatic JWT token generation</li>
                  <li>Click "Validate" to verify token integrity</li>
                  <li>Click "Refresh" to get a new token with updated claims</li>
                  <li>View token claims and expiration details</li>
                  <li>Copy token for testing in external tools</li>
                </ol>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Token Testing Tools:</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>JWT.io:</strong> Decode and inspect JWT tokens
                    <br />
                    <a 
                      href="https://jwt.io" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline"
                    >
                      https://jwt.io
                    </a>
                  </div>
                  <div>
                    <strong>Online JWT Debugger:</strong> Validate token signature and claims
                  </div>
                  <div>
                    <strong>Browser DevTools:</strong> Inspect network requests with JWT headers
                  </div>
                </div>
              </div>
            </div>
          </SectionCollapse>
        </div>
      )}
    </div>
  );
};

export default JWTGuide;