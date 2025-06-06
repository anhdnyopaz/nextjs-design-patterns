'use client';

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeExampleProps {
  title: string;
  code: string;
  explanation: string;
}

export default function CodeExample({ title, code, explanation }: CodeExampleProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
        >
          {isExpanded ? (
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              Ẩn Code
            </span>
          ) : (
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Xem Code
            </span>
          )}
        </button>
      </div>
      
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4 border-l-4 border-blue-500">
        <p className="text-gray-700 leading-relaxed">{explanation}</p>
      </div>
      
      {isExpanded && (
        <div className="mt-4">
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <div className="bg-gray-700 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-gray-300 text-sm font-mono">TypeScript</span>
            </div>
            <div className="overflow-x-auto">
              <SyntaxHighlighter
                language="typescript"
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: '1.5rem',
                  background: 'transparent',
                  fontSize: '14px',
                  lineHeight: '1.5',
                }}
                showLineNumbers={true}
                lineNumberStyle={{
                  color: '#6B7280',
                  fontSize: '12px',
                  paddingRight: '1rem',
                  minWidth: '3rem',
                }}
                wrapLines={true}
                wrapLongLines={true}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 