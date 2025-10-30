'use client';

import { useState } from 'react';

interface CopyEmailButtonProps {
  email: string;
}

export default function CopyEmailButton({ email }: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={copyToClipboard}
        className="px-6 py-3 border border-slate-300 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-600 rounded-lg font-medium transition-colors"
      >
        Email
      </button>

      {copied && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
          Email copied to clipboard!
        </div>
      )}
    </div>
  );
}
