"use client";

import { forwardRef } from "react";

interface TextInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Right-side action element (e.g. send button) */
  action?: React.ReactNode;
}

const TextInput = forwardRef<HTMLTextAreaElement, TextInputProps>(
  ({ action, className = "", ...props }, ref) => {
    return (
      <div className="relative flex items-end bg-grey-50 border border-grey-300 rounded-lg focus-within:border-blue-800 transition-colors">
        <textarea
          ref={ref}
          rows={1}
          className={`flex-1 bg-transparent px-3 py-2.5 text-grey-900 text-sm leading-5 resize-none focus:outline-none ${className}`}
          {...props}
        />
        {action && (
          <div className="shrink-0">{action}</div>
        )}
      </div>
    );
  }
);

TextInput.displayName = "TextInput";
export default TextInput;
