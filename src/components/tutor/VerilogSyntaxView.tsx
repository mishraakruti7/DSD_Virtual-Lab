// ==============================================================================
// VerilogSyntaxView Component: Syntax Highlighting for HDL Code in Chat
// ==============================================================================

import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface VerilogSyntaxViewProps {
  code: string;
  language?: string;
}

export const VerilogSyntaxView: React.FC<VerilogSyntaxViewProps> = ({
  code,
  language = 'verilog',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple token highlight function for Verilog
  const highlightVerilog = (text: string) => {
    const lines = text.split('\n');

    return lines.map((line, lineIdx) => {
      // Check for comment
      if (line.trim().startsWith('//')) {
        return (
          <div key={lineIdx} className="text-emerald-600 dark:text-emerald-400 italic">
            {line}
          </div>
        );
      }

      // Tokenize by word boundaries
      const parts = line.split(/(\/\/.*|\b(?:module|endmodule|input|output|inout|wire|reg|always|assign|posedge|negedge|begin|end|case|endcase|if|else|parameter|default|integer|initial)\b|\b\d+'[bB][01_]+|\b\d+'[dD]\d+|\b\d+\b|<=|=|&|\||\^|~)/g);

      return (
        <div key={lineIdx} className="leading-relaxed">
          {parts.map((part, pIdx) => {
            if (!part) return null;

            if (part.startsWith('//')) {
              return (
                <span key={pIdx} className="text-emerald-600 dark:text-emerald-400 italic">
                  {part}
                </span>
              );
            }

            const keywords = [
              'module', 'endmodule', 'input', 'output', 'inout', 'wire', 'reg',
              'always', 'assign', 'posedge', 'negedge', 'begin', 'end', 'case',
              'endcase', 'if', 'else', 'parameter', 'default', 'integer', 'initial'
            ];

            if (keywords.includes(part)) {
              return (
                <span key={pIdx} className="text-purple-600 dark:text-purple-400 font-bold">
                  {part}
                </span>
              );
            }

            if (/^\d+'[bBdD]/.test(part) || /^\d+$/.test(part)) {
              return (
                <span key={pIdx} className="text-amber-600 dark:text-amber-400 font-semibold">
                  {part}
                </span>
              );
            }

            if (['<=', '=', '&', '|', '^', '~'].includes(part)) {
              return (
                <span key={pIdx} className="text-cyan-600 dark:text-cyan-400 font-bold">
                  {part}
                </span>
              );
            }

            return <span key={pIdx}>{part}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="my-2.5 rounded-2xl overflow-hidden border border-cream-border dark:border-darklab-border bg-slate-900 text-slate-100 font-mono text-[11px] shadow-sm">
      {/* Code Header */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-950/80 border-b border-slate-800 text-[10px] text-slate-400">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
          <Terminal className="w-3.5 h-3.5 text-brand-mid" />
          <span>{language || 'VERILOG'}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors py-0.5 px-2 rounded-lg hover:bg-slate-800"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="p-3.5 overflow-x-auto selection:bg-brand-mid/40">
        <pre className="font-mono">
          {language.toLowerCase() === 'verilog' || language.toLowerCase() === 'v'
            ? highlightVerilog(code)
            : code}
        </pre>
      </div>
    </div>
  );
};
