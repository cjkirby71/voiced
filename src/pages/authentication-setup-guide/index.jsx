// src/pages/authentication-setup-guide/index.jsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { BookOpen, Database, Shield, Users, Key, Zap, CheckCircle } from 'lucide-react';
import SectionCollapse from './components/SectionCollapse';
import CodeBlock from './components/CodeBlock';
import TestingGuideline from './components/TestingGuideline';
import QuickReference from './components/QuickReference';
import JWTGuide from './components/JWTGuide';

const AuthenticationSetupGuide = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: BookOpen },
    { id: 'database', title: 'Database Setup', icon: Database },
    { id: 'authentication', title: 'Auth Implementation', icon: Shield },
    { id: 'jwt-tokens', title: 'JWT Token Exchange', icon: Key },
    { id: 'user-management', title: 'User Management', icon: Users },
    { id: 'testing', title: 'Testing Guide', icon: CheckCircle },
    { id: 'reference', title: 'Quick Reference', icon: Zap }
  ];

  const authFlowCode = `// Complete Authentication Flow Example
import { useAuth } from '../context/AuthContext';

function AuthenticatedApp() {
  const { 
    user, 
    userProfile, 
    jwtToken,
    signIn, 
    signUp, 
    signOut, 
    loading, 
    authError 
  } = useAuth();

  // Sign up new user
  const handleSignUp = async (email, password, userData) => {
    const result = await signUp(email, password, {
      fullName: userData.fullName,
      tier: 'free',
      zipCode: userData.zipCode,
      phoneNumber: userData.phoneNumber
    });
    
    if (result.success) {
      console.log('User created:', result.data);
    } else {
      console.error('Signup failed:', result.error);
    }
  };

  // Sign in existing user
  const handleSignIn = async (email, password) => {
    const result = await signIn(email, password);
    
    if (result.success) {
      console.log('User signed in:', result.data);
      console.log('JWT Token:', jwtToken);
    } else {
      console.error('Login failed:', result.error);
    }
  };

  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {userProfile?.full_name}</h1>
          <p>Tier: {userProfile?.tier}</p>
          <p>JWT Token: {jwtToken ? 'Active' : 'Not available'}</p>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <div>
          <h1>Please Sign In</h1>
          {authError && <p className="error">{authError}</p>}
          {/* Your login form here */}
        </div>
      )}
    </div>
  );
}`;

  const tieredAccessCode = `// Tier-based Content Access
import { useAuth } from '../context/AuthContext';
import authService from '../utils/authService';

function TieredContent() {
  const { userProfile } = useAuth();
  const [content, setContent] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      if (!userProfile) return;
      
      // Check tier access
      const accessResult = await authService.checkTierAccess(
        userProfile.id, 
        'national'
      );
      
      setHasAccess(accessResult.hasAccess);
      
      // Load accessible content
      const contentResult = await authService.getAccessibleArticles(
        userProfile.tier
      );
      
      if (contentResult.success) {
        setContent(contentResult.data);
      }
    };
    
    loadContent();
  }, [userProfile]);

  return (
    <div>
      <h2>Content Access - {userProfile?.tier} tier</h2>
      {!hasAccess && (
        <div className="upgrade-prompt">
          <p>Upgrade to National tier for full access</p>
        </div>
      )}
      
      {content.map(article => (
        <div key={article.id}>
          <h3>{article.title}</h3>
          {article.requires_tier === 'national' && !hasAccess ? (
            <p>🔒 National tier required</p>
          ) : (
            <p>{article.content}</p>
          )}
        </div>
      ))}
    </div>
  );
}`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>Authentication Setup Guide - Voiced Civic Platform</title>
        <meta 
          name="description" 
          content="Complete guide to implementing Supabase authentication with JWT token exchange in the Voiced civic engagement platform" 
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Authentication Setup Guide
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete implementation guide for Supabase authentication with JWT token exchange, 
            user tiers, and secure content access in the Voiced platform.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-8">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Guide Sections</h3>
              </div>
              <nav className="p-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-50 text-blue-700 font-medium' :'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{section.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                {activeSection === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <BookOpen className="w-6 h-6" />
                        Authentication Overview
                      </h2>
                      <p className="text-gray-600 mb-6">
                        The Voiced platform implements a comprehensive authentication system using Supabase 
                        with custom JWT token exchange for enhanced security and user management.
                      </p>
                    </div>

                    <SectionCollapse title="Architecture Features">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-900 mb-2">Supabase Integration</h4>
                          <ul className="text-blue-800 text-sm space-y-1">
                            <li>• Email/password authentication</li>
                            <li>• Social OAuth providers</li>
                            <li>• Automatic session management</li>
                            <li>• Row Level Security (RLS)</li>
                          </ul>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                          <h4 className="font-semibold text-green-900 mb-2">JWT Token Exchange</h4>
                          <ul className="text-green-800 text-sm space-y-1">
                            <li>• Custom claims with user profile</li>
                            <li>• Platform-specific validation</li>
                            <li>• Token refresh mechanism</li>
                            <li>• Enhanced API security</li>
                          </ul>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                          <h4 className="font-semibold text-purple-900 mb-2">User Tier System</h4>
                          <ul className="text-purple-800 text-sm space-y-1">
                            <li>• Free and National tiers</li>
                            <li>• Content access control</li>
                            <li>• Subscription management</li>
                            <li>• Tier-based features</li>
                          </ul>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-4">
                          <h4 className="font-semibold text-orange-900 mb-2">React Integration</h4>
                          <ul className="text-orange-800 text-sm space-y-1">
                            <li>• AuthContext provider</li>
                            <li>• Authentication hooks</li>
                            <li>• Protected routes</li>
                            <li>• Real-time state updates</li>
                          </ul>
                        </div>
                      </div>
                    </SectionCollapse>

                    <SectionCollapse title="Authentication Flow">
                      <CodeBlock code={authFlowCode} language="javascript" />
                    </SectionCollapse>

                    <SectionCollapse title="Tier-based Access Control">
                      <CodeBlock code={tieredAccessCode} language="javascript" />
                    </SectionCollapse>
                  </div>
                )}

                {activeSection === 'database' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Database className="w-6 h-6" />
                      Database Schema Setup
                    </h2>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-blue-800 mb-2">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">Migration Status</span>
                      </div>
                      <p className="text-blue-700">
                        The database schema has been successfully implemented in the migration file:
                        <code className="bg-blue-100 px-2 py-1 rounded ml-2">
                          supabase/migrations/20241216120000_voiced_auth_system.sql
                        </code>
                      </p>
                    </div>

                    <SectionCollapse title="Database Tables">
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold mb-2">user_profiles</h4>
                          <p className="text-sm text-gray-600 mb-2">Intermediary table for user data and tier management</p>
                          <div className="text-xs font-mono bg-white p-2 rounded border">
                            id (UUID, PK) → auth.users(id)<br/>
                            email (TEXT, UNIQUE)<br/>
                            full_name (TEXT)<br/>
                            tier (user_tier ENUM)<br/>
                            zip_code (TEXT)<br/>
                            phone_number (TEXT)<br/>
                            sms_notifications (BOOLEAN)<br/>
                            email_notifications (BOOLEAN)
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold mb-2">user_subscriptions</h4>
                          <p className="text-sm text-gray-600 mb-2">Subscription and payment tracking</p>
                          <div className="text-xs font-mono bg-white p-2 rounded border">
                            id (UUID, PK)<br/>
                            user_id (UUID) → user_profiles(id)<br/>
                            tier (user_tier ENUM)<br/>
                            price_paid (DECIMAL)<br/>
                            payment_method (TEXT)<br/>
                            stripe_subscription_id (TEXT)<br/>
                            status (TEXT)
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold mb-2">polls & articles</h4>
                          <p className="text-sm text-gray-600 mb-2">Tier-based content access tables</p>
                          <div className="text-xs font-mono bg-white p-2 rounded border">
                            requires_tier (user_tier ENUM)<br/>
                            created_by/author_id → user_profiles(id)<br/>
                            RLS policies for tier-based access
                          </div>
                        </div>
                      </div>
                    </SectionCollapse>

                    <SectionCollapse title="Row Level Security (RLS)">
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          RLS policies ensure users can only access content appropriate for their tier level:
                        </p>
                        <div className="bg-green-50 rounded-lg p-4">
                          <h4 className="font-semibold text-green-900 mb-2">Key RLS Policies:</h4>
                          <ul className="space-y-1 text-green-800 text-sm">
                            <li>• <strong>user_profiles:</strong> Users can only view/edit their own profile</li>
                            <li>• <strong>polls:</strong> Access based on user tier vs required tier</li>
                            <li>• <strong>articles:</strong> Content filtered by subscription level</li>
                            <li>• <strong>subscriptions:</strong> Users see only their own subscription data</li>
                          </ul>
                        </div>
                      </div>
                    </SectionCollapse>
                  </div>
                )}

                {activeSection === 'authentication' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Shield className="w-6 h-6" />
                      Authentication Implementation
                    </h2>
                    
                    <SectionCollapse title="AuthContext Setup">
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          The AuthContext provides centralized authentication state management:
                        </p>
                        <div className="bg-blue-50 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-900 mb-2">Available Context Values:</h4>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <strong>State:</strong>
                              <ul className="mt-1 space-y-1 text-blue-800">
                                <li>• user - Supabase user object</li>
                                <li>• userProfile - User profile data</li>
                                <li>• jwtToken - Custom JWT token</li>
                                <li>• loading - Authentication loading state</li>
                                <li>• authError - Error messages</li>
                              </ul>
                            </div>
                            <div>
                              <strong>Functions:</strong>
                              <ul className="mt-1 space-y-1 text-blue-800">
                                <li>• signIn(email, password)</li>
                                <li>• signUp(email, password, userData)</li>
                                <li>• signOut()</li>
                                <li>• updateProfile(updates)</li>
                                <li>• resetPassword(email)</li>
                                <li>• exchangeJWT(customClaims)</li>
                                <li>• refreshJWT(customClaims)</li>
                                <li>• validateJWT(token)</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SectionCollapse>

                    <SectionCollapse title="AuthService Layer">
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          The AuthService class handles all authentication operations with Supabase:
                        </p>
                        <div className="bg-green-50 rounded-lg p-4">
                          <h4 className="font-semibold text-green-900 mb-2">Key Features:</h4>
                          <ul className="space-y-1 text-green-800 text-sm">
                            <li>• Singleton pattern for consistent state</li>
                            <li>• Automatic JWT token exchange on sign in</li>
                            <li>• Profile data integration with JWT claims</li>
                            <li>• Error handling and user feedback</li>
                            <li>• Subscription and tier management</li>
                          </ul>
                        </div>
                      </div>
                    </SectionCollapse>

                    <SectionCollapse title="Protected Routes">
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          Implement route protection based on authentication status:
                        </p>
                        <CodeBlock 
                          code={`// Protected Route Component\nimport { useAuth } from '../context/AuthContext'
;\nimport { Navigate } from 'react-router-dom';
 import Icon from'../../components/AppIcon';

;\n\nfunction ProtectedRoute({ children, requireTier = null }) {\n  const { user, userProfile, loading } = useAuth();\n\n  if (loading) return <div>Loading...</div>;\n  \n  if (!user) {\n    return <Navigate to="/login" replace />;\n  }\n  \n  if (requireTier && userProfile?.tier !== requireTier) {\n    return <Navigate to="/upgrade" replace />;\n  }\n\n  return children;\n}\n\n// Usage in Routes\n<Route path="/dashboard" element={\n  <ProtectedRoute>\n    <Dashboard />\n  </ProtectedRoute>\n} />\n\n<Route path="/national-content" element={\n  <ProtectedRoute requireTier="national">\n    <NationalContent />\n  </ProtectedRoute>\n} />`} 
                          language="javascript" 
                        />
                      </div>
                    </SectionCollapse>
                  </div>
                )}

                {activeSection === 'jwt-tokens' && (
                  <JWTGuide />
                )}

                {activeSection === 'user-management' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Users className="w-6 h-6" />
                      User Management
                    </h2>
                    
                    <SectionCollapse title="User Registration">
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          User registration creates both auth.users and user_profiles records:
                        </p>
                        <CodeBlock 
                          code={`// Registration with Profile Data\nconst handleRegistration = async (formData) => {\n  const userData = {\n    fullName: formData.fullName,\n    tier: 'free', // Default tier\n    zipCode: formData.zipCode,\n    phoneNumber: formData.phoneNumber,\n    smsNotifications: formData.smsNotifications,\n    emailNotifications: true // Default to true\n  };\n  \n  const result = await signUp(\n    formData.email, \n    formData.password, \n    userData\n  );\n  \n  if (result.success) {\n    // User profile automatically created via trigger\n    console.log('Registration successful');\n  }\n};`} 
                          language="javascript" 
                        />
                      </div>
                    </SectionCollapse>

                    <SectionCollapse title="Profile Management">
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          Users can update their profile information and preferences:
                        </p>
                        <CodeBlock 
                          code={`// Profile Update\nconst handleProfileUpdate = async (updates) => {\n  const result = await updateProfile({\n    full_name: updates.fullName,\n    zip_code: updates.zipCode,\n    phone_number: updates.phoneNumber,\n    sms_notifications: updates.smsNotifications,\n    email_notifications: updates.emailNotifications\n  });\n  \n  if (result.success) {\n    // Profile updated and JWT token refreshed\n    console.log('Profile updated:', result.data);\n  }\n};`} 
                          language="javascript" 
                        />
                      </div>
                    </SectionCollapse>

                    <SectionCollapse title="Subscription Management">
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          Handle tier upgrades and subscription management:
                        </p>
                        <CodeBlock 
                          code={`// Tier Upgrade\nconst handleTierUpgrade = async (subscriptionData) => {\n  const result = await authService.upgradeTier(\n    user.id,\n    'national',\n    {\n      price: 5.00,\n      paymentMethod: 'stripe',\n      stripeSubscriptionId: subscriptionData.id\n    }\n  );\n  \n  if (result.success) {\n    // User tier updated and JWT refreshed\n    console.log('Upgraded to national tier');\n  }\n};\n\n// Check Access Rights\nconst checkContentAccess = async (requiredTier) => {\n  const result = await authService.checkTierAccess(\n    user.id, \n    requiredTier\n  );\n  \n  return result.hasAccess;\n};`} 
                          language="javascript" 
                        />
                      </div>
                    </SectionCollapse>
                  </div>
                )}

                {activeSection === 'testing' && (
                  <TestingGuideline />
                )}

                {activeSection === 'reference' && (
                  <QuickReference />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationSetupGuide;