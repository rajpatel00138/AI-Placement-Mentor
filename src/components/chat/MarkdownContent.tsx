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

  const lines = value.split("\n");
  const showLineNumbers = lines.length > 1;

  return (
    <div className="my-3 w-full max-w-full min-w-0 overflow-hidden rounded-xl border border-border/80 bg-[#121820] text-gray-100 shadow-md font-mono text-xs">
      {/* Code Header */}
      <div className="flex items-center justify-between border-b border-border/50 bg-[#18222c] px-3.5 py-2 text-muted shrink-0">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-200 truncate">
          <Terminal className="h-3.5 w-3.5 text-accent shrink-0" />
          <span className="truncate uppercase tracking-wider text-[11px] text-accent font-mono">{language || "pseudocode"}</span>
        </div>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium text-gray-300 hover:bg-white/10 hover:text-white transition cursor-pointer shrink-0 ml-2"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 text-xs">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span className="text-xs">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body with line numbers and horizontal scrolling */}
      <div className="overflow-x-auto p-3.5 leading-relaxed selection:bg-accent/40 w-full max-w-full font-mono text-xs sm:text-[13px]">
        {showLineNumbers ? (
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="select-none pr-4 text-right text-gray-500 text-xs w-8 align-top font-mono">
                    {idx + 1}
                  </td>
                  <td className="whitespace-pre font-mono text-gray-100 align-top">
                    {line || " "}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <pre className="whitespace-pre font-mono text-gray-100">
            <code>{value}</code>
          </pre>
        )}
      </div>
    </div>
  );
}

export function normalizePseudocode(content: string): string {
  if (!content) return "";
  if (content.includes("```")) return content;

  const lines = content.split("\n");
  let inCode = false;
  let codeBuffer: string[] = [];
  const result: string[] = [];

  const isCodeLine = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    return (
      /^(FUNCTION|PROCEDURE|ALGORITHM|CLASS|METHOD)\b/i.test(trimmed) ||
      /^((SET|LET|DECLARE|INIT|VAR)\s+[a-zA-Z0-9_]+)/i.test(trimmed) ||
      /^(FOR|WHILE|DO|REPEAT|UNTIL|FOREACH)\b/i.test(trimmed) ||
      /^(IF|ELSE IF|ELSE|THEN|ELIF|SWITCH|CASE)\b/i.test(trimmed) ||
      /^(RETURN|OUTPUT|PRINT|YIELD|BREAK|CONTINUE)\b/i.test(trimmed) ||
      (inCode && (line.startsWith("  ") || line.startsWith("\t") || trimmed.startsWith("END") || trimmed === "}"))
    );
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (isCodeLine(line)) {
      inCode = true;
      codeBuffer.push(line);
    } else {
      if (inCode) {
        if (line.trim() === "" && i + 1 < lines.length && isCodeLine(lines[i + 1])) {
          codeBuffer.push(line);
          continue;
        }
        result.push("```pseudocode\n" + codeBuffer.join("\n") + "\n```");
        codeBuffer = [];
        inCode = false;
      }
      result.push(line);
    }
  }

  if (inCode && codeBuffer.length > 0) {
    result.push("```pseudocode\n" + codeBuffer.join("\n") + "\n```");
  }

  return result.join("\n");
}

export default function MarkdownContent({ content, isStreaming }: MarkdownContentProps) {
  const processedContent = normalizePseudocode(content || "");

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
            <p className="mb-2 sm:mb-2.5 last:mb-0 text-primary leading-relaxed break-words whitespace-pre-wrap">{children}</p>
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
                  language={match ? match[1] : "pseudocode"}
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
        {processedContent}
      </ReactMarkdown>

      {/* Blinking typing cursor while streaming */}
      {isStreaming && (
        <span className="inline-block h-3 sm:h-3.5 w-1.5 translate-y-0.5 rounded-xs bg-accent animate-pulse ml-0.5" />
      )}
    </div>
  );
}
