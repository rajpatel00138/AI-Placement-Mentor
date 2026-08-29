"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Check, Copy, Terminal } from "lucide-react";

interface MarkdownContentProps {
  content: string;
  isStreaming?: boolean;
}

function CodeBlock({
  language,
  value,
}: {
  language: string;
  value: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-2.5 sm:my-3 w-full max-w-full min-w-0 overflow-hidden rounded-xl border border-border bg-[#121820] text-gray-100 shadow-sm font-mono text-[11px] sm:text-xs">
      {/* Code Header */}
      <div className="flex items-center justify-between border-b border-border/40 bg-[#18222c] px-3 py-1.5 text-muted shrink-0">
        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-gray-300 truncate">
          <Terminal className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-accent shrink-0" />
          <span className="truncate">{language || "code"}</span>
        </div>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1 rounded-md px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-gray-300 hover:bg-white/10 hover:text-white transition cursor-pointer shrink-0 ml-2"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body with contained horizontal scrolling */}
      <pre className="overflow-x-auto p-2.5 sm:p-3.5 leading-relaxed selection:bg-accent/40 w-full max-w-full font-mono text-[11px] sm:text-xs">
        <code className="break-normal whitespace-pre inline-block min-w-full">{value}</code>
      </pre>
    </div>
  );
}

export default function MarkdownContent({ content, isStreaming }: MarkdownContentProps) {
  return (
    <div className="prose-chat text-xs sm:text-sm leading-relaxed break-words w-full max-w-full min-w-0 overflow-hidden">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-sm sm:text-lg font-bold text-primary mt-3 sm:mt-4 mb-1.5 sm:mb-2 first:mt-0 tracking-tight flex items-center gap-1.5">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xs sm:text-base font-bold text-primary mt-2.5 sm:mt-3.5 mb-1 sm:mb-1.5 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs sm:text-sm font-bold text-primary mt-2 sm:mt-3 mb-1 first:mt-0">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-2 sm:mb-2.5 last:mb-0 text-primary leading-relaxed break-words">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="my-1.5 sm:my-2 ml-3.5 sm:ml-4 list-disc space-y-0.5 sm:space-y-1 text-primary marker:text-accent">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-1.5 sm:my-2 ml-3.5 sm:ml-4 list-decimal space-y-0.5 sm:space-y-1 text-primary marker:text-accent font-medium">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed pl-0.5 sm:pl-1 font-normal text-primary break-words">{children}</li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-primary">{children}</strong>
          ),
          em: ({ children }) => <em className="italic text-primary">{children}</em>,
          blockquote: ({ children }) => (
            <blockquote className="my-2 sm:my-3 border-l-3 border-accent/70 bg-soft/25 py-1 px-2.5 sm:px-3.5 rounded-r-xl italic text-muted text-xs sm:text-sm">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-2.5 sm:my-3.5 border-border" />,
          table: ({ children }) => (
            <div className="my-2 sm:my-3 overflow-x-auto rounded-xl border border-border w-full max-w-full">
              <table className="w-full text-left text-xs">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b border-border bg-soft/60 font-semibold text-primary">{children}</thead>
          ),
          tbody: ({ children }) => <tbody className="divide-y divide-border/60">{children}</tbody>,
          tr: ({ children }) => <tr className="hover:bg-soft/20 transition">{children}</tr>,
          th: ({ children }) => <th className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-primary font-semibold">{children}</th>,
          td: ({ children }) => <td className="px-2.5 sm:px-3 py-1.5 sm:py-2 text-primary">{children}</td>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-2 hover:text-accent-hover font-medium transition break-all"
            >
              {children}
            </a>
          ),
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const stringCode = String(children).replace(/\n$/, "");
            const isMultiLine = stringCode.includes("\n");

            if (match || isMultiLine) {
              return (
                <CodeBlock
                  language={match ? match[1] : ""}
                  value={stringCode}
                />
              );
            }

            return (
              <code
                className="rounded-md bg-soft/70 px-1 py-0.5 font-mono text-[11px] sm:text-[12px] font-medium text-primary border border-border/60 break-all"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>

      {/* Blinking typing cursor while streaming */}
      {isStreaming && (
        <span className="inline-block h-3 sm:h-3.5 w-1.5 translate-y-0.5 rounded-xs bg-accent animate-pulse ml-0.5" />
      )}
    </div>
  );
}
