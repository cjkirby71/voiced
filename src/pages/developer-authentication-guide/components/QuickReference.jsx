// src/pages/developer-authentication-guide/components/QuickReference.jsx
import React from 'react';

const QuickReference = () => {
  const supabaseMethods = [
    {
      method: 'supabase.auth.exchangeCodeForSession(code)',
      description: 'Exchanges authorization code for user session',
      returnType: '{ data: { user, session }, error }'
    },
    {
      method: 'supabase.auth.signInWithPassword({ email, password })',
      description: 'Sign in with email and password',
      returnType: '{ data: { user, session }, error }'
    },
    {
      method: 'supabase.auth.signUp({ email, password, options })',
      description: 'Sign up new user with email and password',
      returnType: '{ data: { user, session }, error }'
    },
    {
      method: 'supabase.auth.getSession()',
      description: 'Get current user session',
      returnType: '{ data: { session }, error }'
    },
    {
      method: 'supabase.auth.onAuthStateChange(callback)',
      description: 'Listen for authentication state changes',
      returnType: '{ data: { subscription }, error }'
    }
  ];

  const commonErrors = [
    {
      error: 'otp_expired',
      meaning: 'Magic link has expired',
      solution: 'Ask user to request a new magic link'
    },
    {
      error: 'access_denied',
      meaning: 'User denied access or link is invalid',
      solution: 'Redirect to signup/login page'
    },
    {
      error: 'invalid_request',
      meaning: 'Authorization code is invalid or missing',
      solution: 'Check URL parameters and redirect to login'
    },
    {
      error: 'server_error',
      meaning: 'Internal server error during exchange',
      solution: 'Log error and show retry option'
    }
  ];

  const urlParameters = [
    {
      parameter: 'code',
      description: 'Authorization code from successful magic link click',
      example: '?code=abc123xyz789'
    },
    {
      parameter: 'error',
      description: 'Error type when authentication fails',
      example: '?error=otp_expired'
    },
    {
      parameter: 'error_code',
      description: 'Specific error code for debugging',
      example: '?error_code=403'
    },
    {
      parameter: 'error_description',
      description: 'Human-readable error description',
      example: '?error_description=Link%20has%20expired'
    }
  ];

  const configurationSettings = [
    {
      setting: 'Site URL',
      value: 'https://voiced-puce.vercel.app',
      description: 'Main site URL in Supabase dashboard'
    },
    {
      setting: 'Redirect URLs',
      value: 'http://localhost:3000, https://voiced-puce.vercel.app',
      description: 'Allowed redirect URLs for magic links'
    },
    {
      setting: 'Email Redirect To',
      value: 'http://localhost:3000/auth/callback',
      description: 'URL to redirect after email confirmation'
    },
    {
      setting: 'JWT Secret',
      value: 'Environment variable: SUPABASE_JWT_SECRET',
      description: 'Secret for signing custom JWT tokens'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Supabase Methods */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Supabase Auth Methods</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Return Type
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {supabaseMethods.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {item.method}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <code>{item.returnType}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* URL Parameters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">URL Parameters Reference</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {urlParameters.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                <code className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                  {item.parameter}
                </code>
              </h3>
              <p className="text-gray-600 text-sm mb-2">{item.description}</p>
              <code className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded block">
                {item.example}
              </code>
            </div>
          ))}
        </div>
      </div>

      {/* Common Errors */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Error Scenarios</h2>
        <div className="space-y-4">
          {commonErrors.map((item, index) => (
            <div key={index} className="border-l-4 border-red-400 pl-4 py-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    <code className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm mr-2">
                      {item.error}
                    </code>
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">{item.meaning}</p>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-xs font-medium text-gray-700">Solution: </span>
                <span className="text-xs text-gray-600">{item.solution}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration Settings */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Supabase Configuration</h2>
        <div className="space-y-4">
          {configurationSettings.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{item.setting}</h3>
              </div>
              <div className="bg-gray-50 rounded p-3 mb-2">
                <code className="text-sm text-gray-800">{item.value}</code>
              </div>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Implementation Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-blue-900 mb-4">Key Implementation Notes</h2>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start">
            <span className="font-bold mr-2">•</span>
            <span>Always use <code className="bg-blue-100 px-1 rounded">exchangeCodeForSession()</code> for magic link callbacks</span>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">•</span>
            <span>Handle both success (code parameter) and error (error parameter) scenarios</span>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">•</span>
            <span>Use <code className="bg-blue-100 px-1 rounded">replace: true</code> when navigating after auth to prevent back button issues</span>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">•</span>
            <span>Set up proper cleanup in useEffect to prevent memory leaks</span>
          </li>
          <li className="flex items-start">
            <span className="font-bold mr-2">•</span>
            <span>Test both local development and production environments</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default QuickReference;