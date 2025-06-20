// src/pages/authentication-setup-guide/components/SectionCollapse.jsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const SectionCollapse = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      
      {isOpen && (
        <div className="px-6 py-4 bg-white">
          {children}
        </div>
      )}
    </div>
  );
};

export default SectionCollapse;