import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-sm prose-slate max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-900">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline ? (
              <div className="relative group my-4">
                <pre className="block w-full p-4 overflow-x-auto bg-gray-50 border border-gray-200 rounded-md">
                  <code className={`${className} text-gray-800`} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            ) : (
              <code className="px-1.5 py-0.5 text-emerald-700 bg-emerald-50 rounded text-xs font-mono" {...props}>
                {children}
              </code>
            );
          },
          h1: ({node, ...props}) => <h1 className="text-2xl font-serif text-gray-900 pb-2 border-b border-gray-200 mt-6 mb-4" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-xl font-serif text-gray-900 mt-6 mb-3" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-lg font-serif font-medium text-gray-900 mt-4 mb-2" {...props} />,
          p: ({node, ...props}) => <p className="leading-7 mb-4 text-gray-600" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-1 text-gray-600" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-1 text-gray-600" {...props} />,
          li: ({node, ...props}) => <li className="pl-1" {...props} />,
          a: ({node, ...props}) => <a className="text-blue-600 hover:text-blue-800 underline underline-offset-2" {...props} />,
          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-200 pl-4 italic text-gray-500 my-4" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};