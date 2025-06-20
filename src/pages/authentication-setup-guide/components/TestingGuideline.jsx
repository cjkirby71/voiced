// src/pages/authentication-setup-guide/components/TestingGuideline.jsx
import React from 'react';
import { CheckCircle, AlertCircle, Terminal, Users } from 'lucide-react';
import CodeBlock from './CodeBlock';
import SectionCollapse from './SectionCollapse';

const TestingGuideline = () => {
  const testAccounts = [
    {
      email: 'free@voiced.gov',
      password: 'password123',
      tier: 'free',
      access: 'Polls + 1 article'
    },
    {
      email: 'national@voiced.gov',
      password: 'password123',
      tier: 'national',
      access: 'Full platform access'
    }
  ];

  const testingSteps = [
    {
      title: 'Verify Environment Setup',
      description: 'Ensure all environment variables are configured',
      command: 'echo $VITE_SUPABASE_URL && echo $VITE_SUPABASE_ANON_KEY'
    },
    {
      title: 'Start Development Server',
      description: 'Launch the React application',
      command: 'npm start'
    },
    {
      title: 'Test Authentication Flow',
      description: 'Test signup, login, and logout functionality',
      command: 'Navigate to /login-screen and /registration-screen'
    },
    {
      title: 'Verify Tier Access',
      description: 'Test content access based on user tier',
      command: 'Login with different tier accounts and test content access'
    }
  ];

  const debuggingTips = [
    {
      issue: 'Authentication Not Working',
      solutions: [
        'Check SUPABASE_URL and SUPABASE_ANON_KEY in .env file',
        'Verify Supabase project settings and RLS policies',
        'Check browser console for JavaScript errors',
        'Ensure auth.users table has proper triggers'
      ]
    },
    {
      issue: 'User Profile Not Created',
      solutions: [
        'Verify handle_new_user() trigger function exists',
        'Check if trigger is properly attached to auth.users table',
        'Review raw_user_meta_data structure in signup',
        'Test trigger manually with SQL insert'
      ]
    },
    {
      issue: 'Tier Access Not Working',
      solutions: [
        'Verify RLS policies on content tables',
        'Check can_access_tier_content() function',
        'Ensure user_profiles.tier is properly set',
        'Test tier access with different user accounts'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Testing Steps */}
      <SectionCollapse title="Local Development Testing" defaultOpen={true}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testingSteps?.map((step, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{step?.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{step?.description}</p>
                    <code className="text-xs bg-gray-200 px-2 py-1 rounded mt-2 block">
                      {step?.command}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <CodeBlock
            language="bash"
            title="Complete Testing Sequence"
            code={`# 1. Install dependencies
npm install @supabase/supabase-js

# 2. Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials

# 3. Start development server
npm start

# 4. Test in browser
# Navigate to http://localhost:3000
# Test signup: /registration-screen
# Test login: /login-screen
# Test protected routes with different tier users`}
          />
        </div>
      </SectionCollapse>
      
      {/* Test Accounts */}
      <SectionCollapse title="Pre-configured Test Accounts">
        <div className="space-y-4">
          <p className="text-gray-600">
            The following test accounts are automatically created by the migration script 
            for testing tier-based access control:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testAccounts?.map((account, index) => (
              <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold text-blue-900">
                    {account?.tier?.toUpperCase()} Tier Account
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  <div><strong>Email:</strong> {account?.email}</div>
                  <div><strong>Password:</strong> {account?.password}</div>
                  <div><strong>Access:</strong> {account?.access}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800">Testing Notes</h4>
                <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                  <li>• Test accounts are created during migration</li>
                  <li>• Free tier users can access polls and 1 article</li>
                  <li>• National tier users have full platform access</li>
                  <li>• Use cleanup_test_data() function to reset test data</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </SectionCollapse>
      
      {/* Debugging */}
      <SectionCollapse title="Common Issues & Solutions">
        <div className="space-y-6">
          {debuggingTips?.map((tip, index) => (
            <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-red-800">{tip?.issue}</h4>
                  <ul className="mt-2 space-y-1">
                    {tip?.solutions?.map((solution, sIndex) => (
                      <li key={sIndex} className="text-sm text-red-700 flex items-start space-x-2">
                        <CheckCircle className="h-3 w-3 text-red-600 mt-1 flex-shrink-0" />
                        <span>{solution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Terminal className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-800">Database Debugging Commands</h4>
                <CodeBlock
                  language="sql"
                  title="Useful SQL Queries"
                  code={`-- Check user profiles
SELECT id, email, full_name, tier FROM public.user_profiles;

-- Check auth users
SELECT id, email, created_at FROM auth.users;

-- Test tier access function
SELECT public.can_access_tier_content('national');

-- Check RLS policies
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';

-- Clean up test data
SELECT public.cleanup_test_data();`}
                />
              </div>
            </div>
          </div>
        </div>
      </SectionCollapse>
    </div>
  );
};

export default TestingGuideline;