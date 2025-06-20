// src/components/ui/JWTTokenDisplay.jsx
import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check, RefreshCw, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const JWTTokenDisplay = () => {
  const { jwtToken, refreshJWT, validateJWT } = useAuth();
  const [showToken, setShowToken] = useState(false);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  // Copy token to clipboard
  const copyToClipboard = async () => {
    if (!jwtToken?.jwt_token) return;
    
    try {
      await navigator.clipboard.writeText(jwtToken.jwt_token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.log('Failed to copy token:', error);
    }
  };

  // Refresh JWT token
  const handleRefreshToken = async () => {
    setRefreshing(true);
    try {
      await refreshJWT();
    } catch (error) {
      console.log('Failed to refresh token:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Validate JWT token
  const handleValidateToken = async () => {
    setValidating(true);
    setValidationResult(null);
    
    try {
      const result = await validateJWT();
      setValidationResult(result);
    } catch (error) {
      console.log('Failed to validate token:', error);
      setValidationResult({ success: false, error: 'Validation failed' });
    } finally {
      setValidating(false);
    }
  };

  // Format token for display
  const formatToken = (token) => {
    if (!token) return '';
    if (!showToken) {
      return `${token.substring(0, 20)}...${token.substring(token.length - 20)}`;
    }
    return token;
  };

  // Format expiry time
  const formatExpiryTime = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  // Check if token is expired
  const isTokenExpired = (timestamp) => {
    if (!timestamp) return false;
    return Date.now() / 1000 > timestamp;
  };

  if (!jwtToken) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-center text-gray-500">
          <Shield className="w-8 h-8 mx-auto mb-2" />
          <p>No JWT token available</p>
          <p className="text-sm">Sign in to generate a JWT token</p>
        </div>
      </div>
    );
  }

  const isExpired = isTokenExpired(jwtToken.expires_at);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          JWT Token
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleValidateToken}
            disabled={validating}
            className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 disabled:opacity-50 flex items-center gap-1"
          >
            {validating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Shield className="w-4 h-4" />
            )}
            Validate
          </button>
          <button
            onClick={handleRefreshToken}
            disabled={refreshing}
            className="px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 disabled:opacity-50 flex items-center gap-1"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Token Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm font-medium text-gray-700">Status</div>
          <div className={`text-sm ${isExpired ? 'text-red-600' : 'text-green-600'}`}>
            {isExpired ? 'Expired' : 'Active'}
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm font-medium text-gray-700">Type</div>
          <div className="text-sm text-gray-900">{jwtToken.token_type || 'custom_jwt'}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm font-medium text-gray-700">Expires At</div>
          <div className="text-sm text-gray-900">
            {formatExpiryTime(jwtToken.expires_at)}
          </div>
        </div>
      </div>

      {/* Token Display */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">JWT Token</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowToken(!showToken)}
              className="text-gray-500 hover:text-gray-700"
            >
              {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={copyToClipboard}
              className="text-gray-500 hover:text-gray-700"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 font-mono text-sm break-all">
          {formatToken(jwtToken.jwt_token)}
        </div>
      </div>

      {/* Custom Claims Display */}
      {jwtToken.custom_claims && Object.keys(jwtToken.custom_claims).length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Custom Claims</label>
          <div className="bg-gray-50 rounded-lg p-3">
            <pre className="text-sm text-gray-900 whitespace-pre-wrap">
              {JSON.stringify(jwtToken.custom_claims, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Validation Result */}
      {validationResult && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Validation Result</label>
          <div className={`rounded-lg p-3 ${
            validationResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className={`text-sm font-medium ${
              validationResult.success ? 'text-green-800' : 'text-red-800'
            }`}>
              {validationResult.success ? 'Token is valid' : 'Token is invalid'}
            </div>
            {validationResult.error && (
              <div className="text-sm text-red-600 mt-1">
                {validationResult.error}
              </div>
            )}
            {validationResult.success && validationResult.data?.claims && (
              <details className="mt-2">
                <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                  View Claims
                </summary>
                <pre className="text-xs text-gray-600 mt-2 whitespace-pre-wrap">
                  {JSON.stringify(validationResult.data.claims, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>
      )}

      {/* Usage Instructions */}
      <div className="text-xs text-gray-500 border-t pt-4">
        <p className="font-medium mb-1">Usage Instructions:</p>
        <ul className="space-y-1">
          <li>• Use this JWT token for authenticated API requests</li>
          <li>• Include it in the Authorization header as: Bearer {'{token}'}</li>
          <li>• Token contains your user profile and custom claims</li>
          <li>• Refresh the token before it expires for continued access</li>
        </ul>
      </div>
    </div>
  );
};

export default JWTTokenDisplay;