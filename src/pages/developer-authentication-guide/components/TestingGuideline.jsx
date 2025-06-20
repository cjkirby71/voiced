// src/pages/developer-authentication-guide/components/TestingGuideline.jsx
import React, { useState } from 'react';

const TestingGuideline = () => {
  const [completedTests, setCompletedTests] = useState(new Set());

  const toggleTestCompletion = (testId) => {
    const newCompleted = new Set(completedTests);
    if (newCompleted.has(testId)) {
      newCompleted.delete(testId);
    } else {
      newCompleted.add(testId);
    }
    setCompletedTests(newCompleted);
  };

  const localTests = [
    {
      id: 'start-dev',
      title: 'Start Development Server',
      command: 'npm start',
      description: 'Ensure the app starts without errors',
      timeEstimate: '1-2 min'
    },
    {
      id: 'register-new',
      title: 'Register New User',
      command: 'Navigate to /registration-screen',
      description: 'Sign up with a new email address',
      timeEstimate: '2-3 min'
    },
    {
      id: 'check-email',
      title: 'Check Magic Link Email',
      command: 'Check email inbox',
      description: 'Verify magic link email is received',
      timeEstimate: '1-2 min'
    },
    {
      id: 'click-link',
      title: 'Click Magic Link',
      command: 'Click link in email',
      description: 'Should redirect to localhost:3000 with auth code',
      timeEstimate: '1 min'
    },
    {
      id: 'verify-auth',
      title: 'Verify Authentication',
      command: 'Navigate to /profile',
      description: 'Check that user email and tier are displayed',
      timeEstimate: '1 min'
    }
  ];

  const productionTests = [
    {
      id: 'prod-signup',
      title: 'Production Signup',
      command: 'Visit https://voiced-puce.vercel.app/registration-screen',
      description: 'Test signup flow on production site',
      timeEstimate: '2-3 min'
    },
    {
      id: 'prod-magic-link',
      title: 'Production Magic Link',
      command: 'Click magic link in email',
      description: 'Should redirect to voiced-puce.vercel.app',
      timeEstimate: '1 min'
    },
    {
      id: 'prod-auth-verify',
      title: 'Verify Production Auth',
      command: 'Check profile page',
      description: 'Ensure user data loads correctly',
      timeEstimate: '1 min'
    }
  ];

  const troubleshootingSteps = [
    {
      issue: 'Magic link redirects but user not authenticated',
      solutions: [
        'Check browser console for JavaScript errors',
        'Verify Supabase URL configuration in .env',
        'Ensure exchangeCodeForSession is properly implemented',
        'Check if URL parameters are being parsed correctly'
      ]
    },
    {
      issue: 'Email not received',
      solutions: [
        'Check spam/junk folder',
        'Verify Supabase email settings',
        'Ensure redirect URL is configured in Supabase dashboard',
        'Try with a different email provider'
      ]
    },
    {
      issue: 'Profile page shows no data',
      solutions: [
        'Check if user profile is created in database',
        'Verify getUserProfile function is working',
        'Check RLS policies allow profile access',
        'Ensure AuthContext is properly providing user data'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Local Testing */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Local Development Testing</h2>
        <p className="text-gray-600 mb-6">
          Follow these steps to test the authentication flow on your local development environment.
        </p>
        
        <div className="space-y-4">
          {localTests.map((test, index) => (
            <div key={test.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleTestCompletion(test.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                      completedTests.has(test.id)
                        ? 'bg-green-500 border-green-500' :'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {completedTests.has(test.id) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {index + 1}. {test.title}
                    </h3>
                    <p className="text-gray-600 mt-1">{test.description}</p>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
                      {test.command}
                    </code>
                  </div>
                </div>
                <div className="text-sm text-gray-500 ml-4">
                  {test.timeEstimate}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Production Testing */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Production Testing</h2>
        <p className="text-gray-600 mb-6">
          Test the authentication flow on the live Vercel deployment.
        </p>
        
        <div className="space-y-4">
          {productionTests.map((test, index) => (
            <div key={test.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleTestCompletion(test.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                      completedTests.has(test.id)
                        ? 'bg-blue-500 border-blue-500' :'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {completedTests.has(test.id) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {index + 1}. {test.title}
                    </h3>
                    <p className="text-gray-600 mt-1">{test.description}</p>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
                      {test.command}
                    </code>
                  </div>
                </div>
                <div className="text-sm text-gray-500 ml-4">
                  {test.timeEstimate}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Troubleshooting Common Issues</h2>
        
        <div className="space-y-6">
          {troubleshootingSteps.map((item, index) => (
            <div key={index} className="border-l-4 border-yellow-400 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Issue: {item.issue}</h3>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Possible Solutions:</p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {item.solutions.map((solution, sIndex) => (
                    <li key={sIndex}>{solution}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testing Progress */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Testing Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Local Tests</span>
              <span className="text-sm text-gray-600">
                {localTests.filter(test => completedTests.has(test.id)).length} of {localTests.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(localTests.filter(test => completedTests.has(test.id)).length / localTests.length) * 100}%` 
                }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Production Tests</span>
              <span className="text-sm text-gray-600">
                {productionTests.filter(test => completedTests.has(test.id)).length} of {productionTests.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(productionTests.filter(test => completedTests.has(test.id)).length / productionTests.length) * 100}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestingGuideline;