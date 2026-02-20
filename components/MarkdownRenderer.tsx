import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-sm max-w-none prose-headings:font-heading prose-headings:font-bold prose-headings:text-theme-text prose-p:text-theme-text prose-li:text-theme-text prose-strong:text-theme-text">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline ? (
              <div className="relative group my-4">
                <pre className="block w-full p-4 overflow-x-auto bg-theme-secondary border border-theme-border rounded-md">
                  <code className={`${className} text-theme-text`} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            ) : (
              <code className="px-1.5 py-0.5 text-theme-accent bg-theme-accent-bg rounded text-xs font-mono" {...props}>
                {children}
              </code>
            );
          },
          h1: ({node, ...props}) => <h1 className="text-2xl font-heading text-theme-text pb-2 border-b border-theme-border mt-6 mb-4" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-xl font-heading text-theme-text mt-6 mb-3" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-lg font-heading font-medium text-theme-text mt-4 mb-2" {...props} />,
          p: ({node, ...props}) => <p className="leading-7 mb-4 text-theme-text" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-1 text-theme-text" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-1 text-theme-text" {...props} />,
          li: ({node, ...props}) => <li className="pl-1" {...props} />,
          a: ({node, ...props}) => <a className="text-theme-primary hover:underline underline-offset-2" {...props} />,
          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-theme-border pl-4 italic text-theme-muted my-4" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};