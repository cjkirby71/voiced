// src/components/ui/AuthDiagnostics.jsx
import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw, Terminal, Eye, EyeOff } from 'lucide-react';
import { authDiagnostics, authFlowDebugger, debugLogger } from '../../utils/debugUtils';
import { useAuth } from '../../context/AuthContext';

const AuthDiagnostics = () => {
  const { user, jwtToken } = useAuth();
  const [diagnostics, setDiagnostics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testCredentials, setTestCredentials] = useState({
    email: 'free@voiced.gov',
    password: 'password123'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [signInDebug, setSignInDebug] = useState(null);
  const [jwtDebug, setJwtDebug] = useState(null);

  // Run diagnostics on component mount
  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const results = await authDiagnostics.runFullDiagnostics();
      setDiagnostics(results);
      debugLogger.info('Diagnostics completed', results);
    } catch (error) {
      debugLogger.error('Diagnostics failed', error);
    } finally {
      setLoading(false);
    }
  };

  const testSignInFlow = async () => {
    setLoading(true);
    try {
      const results = await authFlowDebugger.debugSignIn(
        testCredentials.email,
        testCredentials.password
      );
      setSignInDebug(results);
      debugLogger.info('Sign in debug completed', results);
    } catch (error) {
      debugLogger.error('Sign in debug failed', error);
    } finally {
      setLoading(false);
    }
  };

  const testJWTFlow = async () => {
    setLoading(true);
    try {
      const results = await authFlowDebugger.debugJWTExchange();
      setJwtDebug(results);
      debugLogger.info('JWT debug completed', results);
    } catch (error) {
      debugLogger.error('JWT debug failed', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': case'healthy':
      case true:
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed': case'issues_detected':
      case false:
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'starting':
        return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': case'healthy':
      case true:
        return 'text-green-600';
      case 'failed': case'issues_detected':
      case false:
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Terminal className="w-5 h-5" />
          Authentication Diagnostics
        </h3>
        <button
          onClick={runDiagnostics}
          disabled={loading}
          className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 disabled:opacity-50 flex items-center gap-1"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Run Diagnostics
        </button>
      </div>

      {/* Current User Status */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Current Auth Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            {getStatusIcon(!!user)}
            <span className={getStatusColor(!!user)}>User: {user ? 'Authenticated' : 'Not signed in'}</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(!!jwtToken)}
            <span className={getStatusColor(!!jwtToken)}>JWT: {jwtToken ? 'Available' : 'Not available'}</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(!!user?.email_confirmed_at)}
            <span className={getStatusColor(!!user?.email_confirmed_at)}>Email: {user?.email_confirmed_at ? 'Verified' : 'Not verified'}</span>
          </div>
        </div>
      </div>

      {/* Diagnostics Results */}
      {diagnostics && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">System Health Check</h4>
          
          {/* Summary */}
          <div className={`rounded-lg p-4 border ${
            diagnostics.summary.status === 'healthy' ?'bg-green-50 border-green-200' :'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon(diagnostics.summary.status)}
              <span className={`font-medium ${
                diagnostics.summary.status === 'healthy' ? 'text-green-800' : 'text-red-800'
              }`}>
                {diagnostics.summary.status === 'healthy' ? 'All systems operational' : `${diagnostics.summary.totalIssues} issues detected`}
              </span>
            </div>
            {diagnostics.summary.issues.length > 0 && (
              <ul className="text-sm space-y-1">
                {diagnostics.summary.issues.map((issue, index) => (
                  <li key={index} className="text-red-700">• {issue}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Detailed Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Environment */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                {getStatusIcon(diagnostics.environment.passed)}
                Environment
              </h5>
              <div className="text-sm space-y-1">
                <div className={`flex justify-between ${getStatusColor(diagnostics.environment.checks.supabaseUrl)}`}>
                  <span>Supabase URL:</span>
                  <span>{diagnostics.environment.checks.supabaseUrl ? '✓' : '✗'}</span>
                </div>
                <div className={`flex justify-between ${getStatusColor(diagnostics.environment.checks.supabaseAnonKey)}`}>
                  <span>Anon Key:</span>
                  <span>{diagnostics.environment.checks.supabaseAnonKey ? '✓' : '✗'}</span>
                </div>
                <div className={`flex justify-between ${getStatusColor(diagnostics.environment.checks.supabaseUrlFormat)}`}>
                  <span>URL Format:</span>
                  <span>{diagnostics.environment.checks.supabaseUrlFormat ? '✓' : '✗'}</span>
                </div>
              </div>
            </div>

            {/* Connection */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                {getStatusIcon(diagnostics.connection.success)}
                Connection
              </h5>
              <div className="text-sm space-y-1">
                <div className={`flex justify-between ${getStatusColor(diagnostics.connection.success)}`}>
                  <span>Supabase:</span>
                  <span>{diagnostics.connection.success ? '✓' : '✗'}</span>
                </div>
                {diagnostics.connection.hasSession !== undefined && (
                  <div className={`flex justify-between ${getStatusColor(diagnostics.connection.hasSession)}`}>
                    <span>Session:</span>
                    <span>{diagnostics.connection.hasSession ? '✓' : '✗'}</span>
                  </div>
                )}
                {diagnostics.connection.error && (
                  <div className="text-red-600 text-xs mt-1">
                    {diagnostics.connection.error}
                  </div>
                )}
              </div>
            </div>

            {/* Edge Functions */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                {getStatusIcon(diagnostics.edgeFunctions.jwtExchange.available && diagnostics.edgeFunctions.jwtValidate.available)}
                Edge Functions
              </h5>
              <div className="text-sm space-y-1">
                <div className={`flex justify-between ${getStatusColor(diagnostics.edgeFunctions.jwtExchange.available)}`}>
                  <span>JWT Exchange:</span>
                  <span>{diagnostics.edgeFunctions.jwtExchange.available ? '✓' : '✗'}</span>
                </div>
                <div className={`flex justify-between ${getStatusColor(diagnostics.edgeFunctions.jwtValidate.available)}`}>
                  <span>JWT Validate:</span>
                  <span>{diagnostics.edgeFunctions.jwtValidate.available ? '✓' : '✗'}</span>
                </div>
                {(diagnostics.edgeFunctions.jwtExchange.error || diagnostics.edgeFunctions.jwtValidate.error) && (
                  <div className="text-red-600 text-xs mt-1">
                    {diagnostics.edgeFunctions.jwtExchange.error || diagnostics.edgeFunctions.jwtValidate.error}
                  </div>
                )}
              </div>
            </div>

            {/* Database */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                {getStatusIcon(diagnostics.database.userProfiles.accessible)}
                Database
              </h5>
              <div className="text-sm space-y-1">
                <div className={`flex justify-between ${getStatusColor(diagnostics.database.userProfiles.accessible)}`}>
                  <span>User Profiles:</span>
                  <span>{diagnostics.database.userProfiles.accessible ? '✓' : '✗'}</span>
                </div>
                <div className={`flex justify-between ${getStatusColor(diagnostics.database.polls.accessible)}`}>
                  <span>Polls:</span>
                  <span>{diagnostics.database.polls.accessible ? '✓' : '✗'}</span>
                </div>
                <div className={`flex justify-between ${getStatusColor(diagnostics.database.articles.accessible)}`}>
                  <span>Articles:</span>
                  <span>{diagnostics.database.articles.accessible ? '✓' : '✗'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Authentication Flow Testing */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Authentication Flow Testing</h4>
        
        {/* Test Credentials */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h5 className="font-medium text-gray-900 mb-3">Test Credentials</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={testCredentials.email}
                onChange={(e) => setTestCredentials(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={testCredentials.password}
                  onChange={(e) => setTestCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <button
              onClick={testSignInFlow}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              Test Sign In Flow
            </button>
            <button
              onClick={testJWTFlow}
              disabled={loading || !user}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 text-sm"
            >
              Test JWT Exchange
            </button>
          </div>
        </div>

        {/* Sign In Debug Results */}
        {signInDebug && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              {getStatusIcon(signInDebug.success)}
              Sign In Flow Results
            </h5>
            <div className="space-y-2">
              {signInDebug.steps?.map((step, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{step.step.replace('_', ' ')}:</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(step.status)}
                    <span className={getStatusColor(step.status)}>{step.status}</span>
                  </div>
                </div>
              ))}
              {signInDebug.error && (
                <div className="text-red-600 text-sm mt-2">
                  Error: {signInDebug.error}
                </div>
              )}
            </div>
          </div>
        )}

        {/* JWT Debug Results */}
        {jwtDebug && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              {getStatusIcon(jwtDebug.success)}
              JWT Exchange Results
            </h5>
            <div className="text-sm">
              <div className={`${getStatusColor(jwtDebug.success)} mb-2`}>
                Status: {jwtDebug.success ? 'Success' : 'Failed'}
              </div>
              {jwtDebug.error && (
                <div className="text-red-600 mb-2">
                  Error: {jwtDebug.error}
                </div>
              )}
              {jwtDebug.step && (
                <div className="text-gray-600">
                  Failed at: {jwtDebug.step}
                </div>
              )}
              {jwtDebug.data && (
                <details className="mt-2">
                  <summary className="cursor-pointer font-medium">View Response Data</summary>
                  <pre className="text-xs bg-white p-2 rounded mt-1 overflow-auto">
                    {JSON.stringify(jwtDebug.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="border-t pt-4">
        <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => debugLogger.info('Manual log test', { timestamp: new Date().toISOString() })}
            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Test Console Logging
          </button>
          <button
            onClick={() => window.open('/authentication-setup-guide', '_blank')}
            className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
          >
            Open Setup Guide
          </button>
          <button
            onClick={() => {
              const report = {
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href,
                diagnostics,
                signInDebug,
                jwtDebug
              };
              navigator.clipboard.writeText(JSON.stringify(report, null, 2));
              alert('Debug report copied to clipboard');
            }}
            className="px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200"
          >
            Copy Debug Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthDiagnostics;