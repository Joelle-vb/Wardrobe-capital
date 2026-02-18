import React from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  placeholder?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, placeholder }) => {
  return (
    <div className="relative w-full h-full font-mono text-sm bg-[#0d1117] border border-gray-700 rounded-lg overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-gray-700 text-xs text-gray-400 select-none">
        <span>INPUT CODE</span>
        <span>{code.length} chars</span>
      </div>
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 w-full p-4 bg-transparent text-gray-300 resize-none focus:outline-none placeholder-gray-600"
        placeholder={placeholder || "// Paste your code here..."}
        spellCheck={false}
      />
    </div>
  );
};