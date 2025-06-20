// src/pages/authentication-setup-guide/components/TestingGuideline.jsx
import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Terminal, Users, Bug, Play } from 'lucide-react';
import CodeBlock from './CodeBlock';
import SectionCollapse from './SectionCollapse';
import AuthDiagnostics from '../../../components/ui/AuthDiagnostics';

const TestingGuideline = () => {
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  
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
    },
    {
      email: 'admin@voiced.gov',
      password: 'password123',
      tier: 'national',
      access: 'Admin dashboard'
    }
  ];

  const testingSteps = [
    {
      title: 'Environment Verification',
      description: 'Verify all environment variables and configuration',
      command: 'npm run test:env'
    },
    {
      title: 'Database Migration Check',
      description: 'Ensure database schema is properly applied',
      command: 'supabase db status'
    },
    {
      title: 'Edge Functions Deployment',
      description: 'Verify JWT exchange and validation functions are deployed',
      command: 'supabase functions list'
    },
    {
      title: 'Authentication Flow Test',
      description: 'Test complete authentication flow with debug tools',
      command: 'Use built-in diagnostics panel below'
    }
  ];

  const commonIssuesAndSolutions = [
    {
      issue: 'JWT Exchange Function Returns 500 Error',
      symptoms: [
        'Console shows "Internal server error during JWT exchange"',
        'JWT token is null or undefined after sign in',
        'Network tab shows 500 status from edge function'
      ],
      solutions: [
        'Check if SUPABASE_JWT_SECRET is configured in edge function environment',
        'Verify edge function is deployed: supabase functions deploy jwt-exchange',
        'Check edge function logs: supabase functions logs jwt-exchange',
        'Ensure Supabase project has proper service role permissions'
      ],
      diagnosticSteps: [
        'Run diagnostics panel below to test edge function availability',
        'Check browser network tab for detailed error response',
        'Verify Supabase dashboard shows functions are active'
      ]
    },
    {
      issue: 'User Profile Not Created After Registration',
      symptoms: [
        'User appears in auth.users but not in user_profiles table',
        'Profile data is null or undefined',
        'Tier-based access checks fail'
      ],
      solutions: [
        'Verify handle_new_user() trigger function exists in database',
        'Check if trigger is attached to auth.users table',
        'Ensure user_profiles table has proper RLS policies',
        'Test trigger manually with SQL insert into auth.users'
      ],
      diagnosticSteps: [
        'Check database table user_profiles for new user entries',
        'Run SQL: SELECT * FROM user_profiles WHERE id = \'user_id\'',
        'Verify trigger exists: SELECT * FROM pg_trigger WHERE tgname = \'on_auth_user_created\''
      ]
    },
    {
      issue: 'Network Errors in Production/Live Environment',
      symptoms: [
        'Works in development but fails in production',
        'CORS errors in browser console',
        'Failed to fetch errors on API calls'
      ],
      solutions: [
        'Verify production Supabase URL matches deployed project',
        'Check CORS settings in Supabase dashboard',
        'Ensure all environment variables are set in production',
        'Verify SSL certificates and HTTPS configuration'
      ],
      diagnosticSteps: [
        'Use diagnostics panel to test connection in production',
        'Check browser console for specific CORS error messages',
        'Verify all API endpoints are accessible from production domain'
      ]
    },
    {
      issue: 'Tier-Based Access Control Not Working',
      symptoms: [
        'Free users can access national content',
        'National users get access denied errors',
        'Content filtering not working properly'
      ],
      solutions: [
        'Verify can_access_tier_content() function exists',
        'Check RLS policies on polls and articles tables',
        'Ensure user tier is properly set in user_profiles',
        'Test tier access function manually with SQL'
      ],
      diagnosticSteps: [
        'Run SQL: SELECT tier FROM user_profiles WHERE id = \'user_id\'',
        'Test function: SELECT can_access_tier_content(\'national\')',
        'Check RLS policies: SELECT * FROM pg_policies WHERE tablename = \'polls\''
      ]
    },
    {
      issue: 'Token Refresh Issues',
      symptoms: [
        'User gets logged out unexpectedly',
        'JWT tokens expire without refresh',
        'Session appears active but API calls fail'
      ],
      solutions: [
        'Verify autoRefreshToken is enabled in Supabase client config',
        'Check token refresh logic in AuthContext',
        'Ensure proper error handling for expired tokens',
        'Test token refresh flow manually'
      ],
      diagnosticSteps: [
        'Monitor token expiry times in diagnostics panel',
        'Test JWT refresh functionality',
        'Check browser storage for token persistence'
      ]
    }
  ];

  const liveTesting = {
    preDeployment: [
      'Run full diagnostics in development environment',
      'Test all authentication flows with different user tiers',
      'Verify edge functions work locally with supabase functions serve',
      'Check database migrations are applied correctly',
      'Test error recovery and fallback mechanisms'
    ],
    postDeployment: [
      'Verify environment variables are set in production',
      'Test edge functions are deployed and accessible',
      'Check database connection and RLS policies',
      'Test complete user journey from registration to content access',
      'Monitor error logs and performance metrics'
    ],
    monitoring: [
      'Set up Supabase dashboard monitoring',
      'Monitor edge function logs for errors',
      'Track authentication success/failure rates',
      'Monitor database performance and query times',
      'Set up alerts for critical authentication failures'
    ]
  };

  return (
    <div className="space-y-6">
      {/* Live Diagnostics Panel */}
      <SectionCollapse title="Live Authentication Diagnostics" defaultOpen={true}>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Bug className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800">Real-time Debugging</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Use the diagnostics panel below to test and debug authentication issues in real-time.
                  This tool will help identify the specific problem you're experiencing.
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowDiagnostics(!showDiagnostics)}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4" />
            {showDiagnostics ? 'Hide' : 'Show'} Authentication Diagnostics Panel
          </button>
          
          {showDiagnostics && (
            <div className="border border-gray-200 rounded-lg">
              <AuthDiagnostics />
            </div>
          )}
        </div>
      </SectionCollapse>
      
      {/* Testing Steps */}
      <SectionCollapse title="Systematic Testing Approach">
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
            code={`# 1. Verify environment setup\necho "Checking environment..." \necho "SUPABASE_URL: \$VITE_SUPABASE_URL" \necho "ANON_KEY: \${VITE_SUPABASE_ANON_KEY:0:20}..."

# 2. Test database connection\nsupabase db status\nsupabase functions list

# 3. Deploy edge functions if needed\nsupabase functions deploy jwt-exchange\nsupabase functions deploy jwt-validate

# 4. Start development server\nnpm start

# 5. Navigate to diagnostics\n# Go to /authentication-setup-guide\n# Click "Show Authentication Diagnostics Panel"\n# Run full diagnostics and test flows`}
          />
        </div>
      </SectionCollapse>
      
      {/* Common Issues and Solutions */}
      <SectionCollapse title="Common Issues & Live Debugging Solutions">
        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800">Debugging Approach</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  When you encounter the "same issue" during live testing, follow these specific debugging steps
                  to identify and resolve the problem systematically.
                </p>
              </div>
            </div>
          </div>
          
          {commonIssuesAndSolutions?.map((item, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                {item?.issue}
              </h4>
              
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-gray-800 text-sm mb-2">Symptoms:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {item?.symptoms?.map((symptom, sIndex) => (
                      <li key={sIndex} className="flex items-start space-x-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-800 text-sm mb-2">Solutions:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {item?.solutions?.map((solution, sIndex) => (
                      <li key={sIndex} className="flex items-start space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                        <span>{solution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-800 text-sm mb-2">Diagnostic Steps:</h5>
                  <ul className="text-sm text-blue-600 space-y-1">
                    {item?.diagnosticSteps?.map((step, dIndex) => (
                      <li key={dIndex} className="flex items-start space-x-2">
                        <Terminal className="h-3 w-3 text-blue-600 mt-1 flex-shrink-0" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCollapse>
      
      {/* Test Accounts */}
      <SectionCollapse title="Pre-configured Test Accounts">
        <div className="space-y-4">
          <p className="text-gray-600">
            The following test accounts are automatically created by the migration script 
            for testing tier-based access control:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testAccounts?.map((account, index) => (
              <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold text-blue-900">
                    {account?.tier?.toUpperCase()} Tier
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
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-800">Testing Recommendations</h4>
                <ul className="mt-2 text-sm text-green-700 space-y-1">
                  <li>• Use diagnostics panel above to test each account systematically</li>
                  <li>• Verify JWT token generation for each tier level</li>
                  <li>• Test content access restrictions work properly</li>
                  <li>• Check that profile data is correctly populated</li>
                  <li>• Validate tier upgrade/downgrade functionality</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </SectionCollapse>
      
      {/* Live Environment Testing */}
      <SectionCollapse title="Production/Live Environment Testing">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-800 mb-3">Pre-Deployment</h4>
              <ul className="text-sm text-orange-700 space-y-1">
                {liveTesting.preDeployment?.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-3">Post-Deployment</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                {liveTesting.postDeployment?.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-3">Ongoing Monitoring</h4>
              <ul className="text-sm text-green-700 space-y-1">
                {liveTesting.monitoring?.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-800">Critical Production Checks</h4>
                <p className="text-sm text-red-700 mt-1 mb-3">
                  When you encounter the "same issue" in production, immediately check these items:
                </p>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Environment variables are properly set in production hosting</li>
                  <li>• Supabase edge functions are deployed and active</li>
                  <li>• Database migrations have been applied to production database</li>
                  <li>• CORS settings allow your production domain</li>
                  <li>• SSL/HTTPS configuration is correct</li>
                  <li>• All API endpoints are accessible from production environment</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </SectionCollapse>
      
      {/* Emergency Debugging */}
      <SectionCollapse title="Emergency Debugging Commands">
        <div className="space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Quick Debug Commands</h4>
            <CodeBlock
              language="sql"
              title="Database Debug Queries"
              code={`-- Check user profiles table\nSELECT id, email, full_name, tier, created_at FROM public.user_profiles ORDER BY created_at DESC LIMIT 10;

-- Check auth users\nSELECT id, email, email_confirmed_at, created_at FROM auth.users ORDER BY created_at DESC LIMIT 10;

-- Test tier access function\nSELECT public.can_access_tier_content('national') as can_access_national;

-- Check RLS policies\nSELECT schemaname, tablename, policyname, cmd, qual FROM pg_policies WHERE schemaname = 'public';

-- Check triggers\nSELECT schemaname, tablename, tgname, tgenabled FROM pg_trigger t \nJOIN pg_class c ON t.tgrelid = c.oid \nJOIN pg_namespace n ON c.relnamespace = n.oid \nWHERE n.nspname = 'auth' AND c.relname = 'users';`}
            />
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <CodeBlock
              language="bash"
              title="Supabase CLI Debug Commands"
              code={`# Check project status\nsupabase status

# Check edge functions\nsupabase functions list

# View edge function logs\nsupabase functions logs jwt-exchange\nsupabase functions logs jwt-validate

# Check database migrations\nsupabase db status

# Reset database (CAUTION: Development only)\nsupabase db reset

# Test edge function locally\nsupabase functions serve

# Deploy specific function\nsupabase functions deploy jwt-exchange --debug`}
            />
          </div>
        </div>
      </SectionCollapse>
    </div>
  );
};

export default TestingGuideline;