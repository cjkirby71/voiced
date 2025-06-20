// src/pages/authentication-setup-guide/components/QuickReference.jsx
import React from 'react';
import { Book, ExternalLink } from 'lucide-react';

const QuickReference = () => {
  const apiMethods = [
    {
      method: 'supabase.auth.signUp()',
      description: 'Create new user account',
      params: '{ email, password, options }'
    },
    {
      method: 'supabase.auth.signInWithPassword()',
      description: 'Sign in existing user',
      params: '{ email, password }'
    },
    {
      method: 'supabase.auth.signOut()',
      description: 'Sign out current user',
      params: 'none'
    },
    {
      method: 'supabase.auth.getSession()',
      description: 'Get current session',
      params: 'none'
    },
    {
      method: 'supabase.auth.getUser()',
      description: 'Get current user',
      params: 'none'
    },
    {
      method: 'supabase.auth.onAuthStateChange()',
      description: 'Listen for auth events',
      params: 'callback function'
    }
  ];

  const errorCodes = [
    {
      code: 'invalid_credentials',
      description: 'Email/password combination is incorrect',
      solution: 'Verify credentials and try again'
    },
    {
      code: 'email_not_confirmed',
      description: 'User has not confirmed their email',
      solution: 'Send confirmation email or check spam folder'
    },
    {
      code: 'user_not_found',
      description: 'No user found with this email',
      solution: 'Check email or redirect to signup'
    },
    {
      code: 'weak_password',
      description: 'Password does not meet requirements',
      solution: 'Use stronger password (min 6 characters)'
    }
  ];

  const links = [
    {
      title: 'Supabase Auth Documentation',
      url: 'https://supabase.com/docs/guides/auth',
      description: 'Official Supabase authentication guide'
    },
    {
      title: 'Row Level Security',
      url: 'https://supabase.com/docs/guides/auth/row-level-security',
      description: 'Learn about database security policies'
    },
    {
      title: 'React Auth Patterns',
      url: 'https://supabase.com/docs/guides/auth/auth-helpers/react',
      description: 'React-specific authentication patterns'
    }
  ];

  return (
    <section className="bg-white rounded-lg shadow-sm border p-8">
      <div className="flex items-center space-x-3 mb-6">
        <Book className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Quick Reference</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* API Methods */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Core API Methods</h3>
          <div className="space-y-3">
            {apiMethods?.map((method, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="font-mono text-sm text-blue-600 font-semibold">
                  {method?.method}
                </div>
                <p className="text-sm text-gray-600 mt-1">{method?.description}</p>
                <div className="text-xs text-gray-500 mt-1">
                  Parameters: {method?.params}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Common Errors */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Error Handling</h3>
          <div className="space-y-3">
            {errorCodes?.map((error, index) => (
              <div key={index} className="bg-red-50 p-4 rounded-lg">
                <div className="font-mono text-sm text-red-600 font-semibold">
                  {error?.code}
                </div>
                <p className="text-sm text-gray-600 mt-1">{error?.description}</p>
                <div className="text-xs text-green-700 mt-1">
                  Solution: {error?.solution}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* External Links */}
      <div className="mt-8 pt-6 border-t">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {links?.map((link, index) => (
            <a
              key={index}
              href={link?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
            >
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-blue-900 group-hover:text-blue-700">
                  {link?.title}
                </span>
                <ExternalLink className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-sm text-blue-700 mt-1">{link?.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickReference;