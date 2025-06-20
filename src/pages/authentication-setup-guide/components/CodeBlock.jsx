// src/pages/authentication-setup-guide/components/CodeBlock.jsx
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CodeBlock = ({ code, language = 'javascript', title }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.log('Failed to copy:', error);
    }
  };

  const getLanguageColor = (lang) => {
    const colors = {
      javascript: 'bg-yellow-100 text-yellow-800',
      sql: 'bg-blue-100 text-blue-800',
      bash: 'bg-green-100 text-green-800',
      plaintext: 'bg-gray-100 text-gray-800',
      json: 'bg-purple-100 text-purple-800'
    };
    return colors[lang] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-gray-50 rounded-lg border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-100 border-b">
        <div className="flex items-center space-x-3">
          {title && (
            <span className="text-sm font-medium text-gray-900">{title}</span>
          )}
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getLanguageColor(language)}`}>
            {language}
          </span>
        </div>
        
        <button
          onClick={copyToClipboard}
          className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      
      {/* Code Content */}
      <div className="p-4">
        <pre className="text-sm text-gray-800 overflow-x-auto">
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;