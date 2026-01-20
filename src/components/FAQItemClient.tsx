'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="rounded-2xl cursor-pointer font-outfit border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between bg-white dark:bg-gray-900 hover:bg-gray-50 cursor-pointer dark:hover:bg-gray-800 transition-colors"
      >
        <h3 className="text-lg font-semibold text-black dark:text-white text-left">
          {question}
        </h3>
        <ChevronDown
          className={`h-5 w-5 text-gray-600 dark:text-gray-400 shrink-0 transition-transform duration-300 ${isOpen ? "transform rotate-180" : ""
            }`}
        />
      </button>

      {isOpen && (
        <div className="px-6 py-5 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black/50 animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-gray-700 text-left dark:text-gray-300 font-inter leading-relaxed">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}
