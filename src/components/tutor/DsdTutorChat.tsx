// ==============================================================================
// DsdTutorChat Component: "Ask the DSD Tutor" AI Chatbot
// Slide-in drawer with SSE streaming, markdown/Verilog code rendering,
// context-aware starter prompts, feedback logging, and honest AI disclaimer.
// ==============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  RotateCcw,
  Cpu,
  Layers,
  Check,
  ChevronRight,
  Info,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured, supabase } from '../../lib/supabaseClient';
import { VerilogSyntaxView } from './VerilogSyntaxView';
import { playSoftClick, playSuccessChime } from '../../utils/soundEffects';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  feedback?: 'positive' | 'negative' | null;
}

interface DsdTutorChatProps {
  activeTab: string;
  extraParam?: string | number;
}

export const DsdTutorChat: React.FC<DsdTutorChatProps> = ({ activeTab, extraParam }) => {
  const { user, openAuthModal, isConfigured } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Derive human-readable topic context from current tab & param
  const getTopicContext = (): string => {
    switch (activeTab) {
      case 'theory':
        if (extraParam === 1) return 'Module 1: Sequential Logic & Flip-Flops';
        if (extraParam === 2) return 'Module 2: Logic Families & PLDs (TTL/CMOS, PLA/PAL)';
        if (extraParam === 3) return 'Module 3: Finite State Machines (Mealy/Moore & ASM)';
        if (extraParam === 4) return 'Module 4: Verilog HDL Modeling & Synthesis';
        return 'Theory Modules (Sequential Circuits & HDL)';
      case 'lab':
        return `Lab Manual (Experiment ${extraParam || 1} of 12)`;
      case 'breadboard':
        return 'Virtual Breadboard IC Lab & Circuit Wiring';
      case 'simulators':
        return `Interactive Simulators (${extraParam || 'FSM & RTL Studio'})`;
      case 'analyzer':
        return 'Logic Analyzer Scope & Waveforms';
      case 'quiz':
        return 'Quiz Hub (Bloom Taxonomy Assessment)';
      case 'assessment':
        return 'Internal Assessment Calculator (CO-PO Mapping)';
      case 'projects':
        return 'Mini-Projects & Hardware Schematics';
      case 'glossary':
        return 'DSD Technical Glossary (80+ Terms)';
      default:
        return 'Digital System Design (ECCOR2PC203)';
    }
  };

  const topicContext = getTopicContext();

  // Scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  // Contextual Starter Prompts tailored to active tab
  const getStarterPrompts = () => {
    if (activeTab === 'theory' && extraParam === 4) {
      return [
        'What is the difference between assign and always @(*) ?',
        'Why must non-blocking (<=) be used in sequential blocks?',
        'How do I write a testbench for a 4-bit up/down counter?',
      ];
    }
    if (activeTab === 'theory' && extraParam === 3) {
      return [
        'Why choose a Mealy machine over Moore machine?',
        'How do you design a state diagram for sequence 1011?',
        'What is the difference between state box and decision box in ASM?',
      ];
    }
    if (activeTab === 'breadboard' || activeTab === 'lab') {
      return [
        'What are the VCC and GND pin numbers on 74LS series ICs?',
        'How do I wire IC 7490 as a BCD decade counter?',
        'Why does my breadboard clock signal bounce without a Schmitt trigger?',
      ];
    }
    if (activeTab === 'simulators') {
      return [
        'Explain this state transition row by row',
        'Why is this a Mealy machine instead of Moore?',
        'How do setup time and hold time affect flip-flop timing?',
      ];
    }
    // Default general prompts
    return [
      'Explain the race-around condition in JK flip-flop',
      'How does a Master-Slave flip-flop prevent race-around?',
      'What is the difference between synchronous and asynchronous counters?',
    ];
  };

  // Handle Feedback (thumbs up / thumbs down)
  const handleFeedback = async (messageId: string, rating: 'positive' | 'negative') => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, feedback: rating } : msg))
    );

    if (isConfigured) {
      try {
        await supabase.from('chat_feedback').insert({
          user_id: user?.id || null,
          message_id: messageId,
          rating,
          topic_context: topicContext,
          created_at: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Could not record feedback:', e);
      }
    }
  };

  // Offline / Demo simulated answer generator when Supabase edge function is unconfigured
  const simulateTutorResponse = async (userPrompt: string, tutorMsgId: string) => {
    let fullText = '';
    const lower = userPrompt.toLowerCase();

    if (lower.includes('race-around') || lower.includes('jk flip')) {
      fullText = `### Understanding Race-Around Condition in JK Flip-Flop

In a level-triggered JK flip-flop, when both inputs are HIGH (**J = 1, K = 1**), the output toggles on every clock pulse.

However, if the clock pulse width ($t_p$) is **greater than the propagation delay** of the flip-flop gates ($t_{pd}$):
$$t_p > t_{pd}$$

The output $Q$ toggles multiple times before the clock pulse ends, resulting in an uncertain and chaotic final output. This hazardous phenomenon is called the **Race-Around Condition**.

#### How to Prevent It:
1. **Master-Slave JK Flip-Flop**: Uses two flip-flops in series. The Master responds during clock HIGH, while the Slave updates during clock LOW.
2. **Edge-Triggered Flip-Flop**: Sensitive only during the transition edge ($0 \\rightarrow 1$ or $1 \\rightarrow 0$), where the effective window is much smaller than $t_{pd}$.

\`\`\`verilog
// Edge-triggered JK Flip-Flop with Active-LOW Reset
always @(posedge clk or negedge rst_n) begin
    if (!rst_n)
        q <= 1'b0;
    else case ({j, k})
        2'b00: q <= q;       // No change
        2'b01: q <= 1'b0;    // Reset
        2'b10: q <= 1'b1;    // Set
        2'b11: q <= ~q;      // Clean Toggle (No race-around!)
    endcase
end
\`\`\`

You can test this behavior live on the **Simulators** or **Virtual Breadboard Lab**!`;
    } else if (lower.includes('assign') || lower.includes('blocking') || lower.includes('non-blocking')) {
      fullText = `### Blocking (\`=\`) vs Non-Blocking (\`<=\`) in Verilog HDL

In synthesizable Verilog for **ECCOR2PC203**, always follow these golden rules:

| Assignment | Syntax | Execution | Synthesized Hardware |
| :--- | :--- | :--- | :--- |
| **Blocking** | \`A = B;\` | Evaluated sequentially in order | Pure combinational logic (\`always @(*)\`) |
| **Non-blocking** | \`A <= B;\` | Evaluated in parallel at time step end | Synchronous sequential registers / flip-flops |

#### Golden Rule for SAKEC Students:
- For **combinational logic** (Full Adders, Decoders, Muxes), use \`assign\` or \`always @(*)\` with \`=\`.
- For **sequential logic** (Registers, Counters, Flip-Flops), use \`always @(posedge clk)\` with \`<=\` to eliminate simulation race conditions.`;
    } else {
      fullText = `Hello! I am your **DSD Tutor** for the course **Digital System Design (ECCOR2PC203)** at SAKEC.

Regarding your question about **"${userPrompt}"** in **${topicContext}**:

Digital sequential circuits build upon bistable storage elements (flip-flops) and feedback loops. When analyzing this:
1. First identify whether the circuit is **synchronous** (driven by a common clock) or **asynchronous** (ripple clocked).
2. Write out the **Excitation Table** and **State Transition Table**.
3. Use K-Maps or boolean minimization to derive next-state logic.

\`\`\`verilog
// Example 4-bit Synchronous Binary Counter Register
always @(posedge clk or negedge rst_n) begin
    if (!rst_n)
        count <= 4'b0000;
    else if (enable)
        count <= count + 1'b1;
end
\`\`\`

*(💡 Note: Supabase Edge Function is currently in local preview mode. Once you configure \`VITE_SUPABASE_URL\` and deploy the \`dsd-tutor\` function with your Anthropic key, answers will stream directly from Claude!)*`;
    }

    // Stream text character by character for realistic typing experience
    const chunks = fullText.split(' ');
    let current = '';

    for (let i = 0; i < chunks.length; i++) {
      current += (i === 0 ? '' : ' ') + chunks[i];
      const snapshot = current;
      setMessages((prev) =>
        prev.map((m) => (m.id === tutorMsgId ? { ...m, content: snapshot } : m))
      );
      await new Promise((r) => setTimeout(r, 20 + Math.random() * 25));
    }
  };

  // Main Send Message Handler
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isStreaming) return;

    setErrorMsg(null);
    setInputValue('');
    playSoftClick();

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text,
    };

    const assistantPlaceholderId = `asst_${Date.now()}`;
    const assistantMessage: Message = {
      id: assistantPlaceholderId,
      role: 'assistant',
      content: '',
      feedback: null,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setIsStreaming(true);

    // If Supabase is configured and function is available, call Edge Function
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

    if (isConfigured && supabaseUrl && !supabaseUrl.includes('your-project-id')) {
      try {
        const edgeFunctionUrl = `${supabaseUrl}/functions/v1/dsd-tutor`;
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
        };

        if (user) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.access_token) {
            headers['Authorization'] = `Bearer ${session.access_token}`;
          }
        }

        const response = await fetch(edgeFunctionUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
            topicContext,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Edge Function returned HTTP ${response.status}`);
        }

        // Read streaming SSE response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder('utf-8');
        let accumulated = '';

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            // Parse Server-Sent Events from Anthropic
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.slice(6).trim();
                if (dataStr === '[DONE]') continue;
                try {
                  const parsed = JSON.parse(dataStr);
                  if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                    accumulated += parsed.delta.text;
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === assistantPlaceholderId ? { ...m, content: accumulated } : m
                      )
                    );
                  }
                } catch {
                  // If raw text chunk
                  if (dataStr) {
                    accumulated += dataStr;
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === assistantPlaceholderId ? { ...m, content: accumulated } : m
                      )
                    );
                  }
                }
              }
            }
          }
        }
      } catch (err: any) {
        console.warn('Edge function unavailable, falling back to local simulator:', err);
        // Seamless fallback to offline simulator
        await simulateTutorResponse(text, assistantPlaceholderId);
      }
    } else {
      // Local preview / offline fallback mode
      await simulateTutorResponse(text, assistantPlaceholderId);
    }

    setIsStreaming(false);
    playSuccessChime();
  };

  // Helper to render markdown formatting (tables, code blocks, bold, lists)
  const renderMessageContent = (content: string) => {
    // 1. Split code blocks
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    const parts = [];
    let lastIdx = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIdx) {
        parts.push({ type: 'text', value: content.slice(lastIdx, match.index) });
      }
      parts.push({ type: 'code', lang: match[1] || 'verilog', value: match[2].trim() });
      lastIdx = match.index + match[0].length;
    }

    if (lastIdx < content.length) {
      parts.push({ type: 'text', value: content.slice(lastIdx) });
    }

    return (
      <div className="space-y-2 leading-relaxed text-xs sm:text-sm">
        {parts.map((p, idx) => {
          if (p.type === 'code') {
            return <VerilogSyntaxView key={idx} code={p.value} language={p.lang} />;
          }

          // Simple text formatter for bold, headings, and lists
          const lines = p.value.split('\n');
          return (
            <div key={idx} className="space-y-1">
              {lines.map((line, lIdx) => {
                if (line.startsWith('### ')) {
                  return (
                    <h4 key={lIdx} className="font-display font-extrabold text-sm sm:text-base text-ink-900 dark:text-white pt-1">
                      {line.replace('### ', '')}
                    </h4>
                  );
                }
                if (line.startsWith('#### ')) {
                  return (
                    <h5 key={lIdx} className="font-display font-bold text-xs sm:text-sm text-brand-600 dark:text-brand-400 pt-1">
                      {line.replace('#### ', '')}
                    </h5>
                  );
                }
                if (line.startsWith('- ') || line.startsWith('* ')) {
                  return (
                    <div key={lIdx} className="flex items-start gap-2 pl-2">
                      <span className="text-brand-500 font-bold">•</span>
                      <span>{renderInlineStyles(line.slice(2))}</span>
                    </div>
                  );
                }
                if (/^\d+\.\s/.test(line)) {
                  const num = line.match(/^\d+\./)?.[0];
                  const textContent = line.replace(/^\d+\.\s/, '');
                  return (
                    <div key={lIdx} className="flex items-start gap-2 pl-2">
                      <span className="font-mono font-bold text-brand-600 dark:text-brand-400">{num}</span>
                      <span>{renderInlineStyles(textContent)}</span>
                    </div>
                  );
                }
                return (
                  <p key={lIdx} className="min-h-[1em]">
                    {renderInlineStyles(line)}
                  </p>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  // Helper for inline **bold** and `code`
  const renderInlineStyles = (text: string) => {
    const tokens = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return tokens.map((token, i) => {
      if (token.startsWith('**') && token.endsWith('**')) {
        return (
          <strong key={i} className="font-extrabold text-ink-900 dark:text-white">
            {token.slice(2, -2)}
          </strong>
        );
      }
      if (token.startsWith('`') && token.endsWith('`')) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded bg-cream-soft dark:bg-darklab-subtle border border-cream-border dark:border-darklab-border font-mono text-[11px] text-brand-600 dark:text-brand-300 font-bold"
          >
            {token.slice(1, -1)}
          </code>
        );
      }
      return token;
    });
  };

  return (
    <>
      {/* 1. Floating Trigger Button in Bottom-Right Corner */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-brand-start via-brand-mid to-brand-end text-white font-display font-extrabold text-xs sm:text-sm shadow-xl shadow-brand/35 hover:shadow-brand/50 transition-all group select-none"
          title="Ask the DSD AI Tutor (ECCOR2PC203 Course Assistant)"
          aria-label="Open DSD Tutor Chat"
        >
          {/* Pulsing ring indicator */}
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 ring-4 ring-amber-300/40 dark:ring-amber-500/20 animate-pulse" />

          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          <span className="tracking-tight">Ask DSD Tutor</span>
        </motion.button>
      </div>

      {/* 2. Slide-In Chat Panel (Framer Motion Drawer) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-white/98 dark:bg-[#111119]/98 backdrop-blur-2xl border-l border-cream-border dark:border-darklab-border shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Top Color Accent Line */}
            <div className="h-1.5 w-full bg-gradient-to-r from-brand-start via-brand-mid to-brand-end" />

            {/* Chat Panel Header */}
            <div className="p-4 border-b border-cream-border dark:border-darklab-border flex items-center justify-between gap-3 bg-white/80 dark:bg-darklab-card/80 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-start to-brand-end flex items-center justify-center text-white shadow-sm shadow-brand/30">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-extrabold text-sm sm:text-base text-ink-900 dark:text-cream-paper">
                      DSD AI Tutor
                    </h3>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Online
                    </span>
                  </div>
                  <p className="text-[11px] text-ink-500 dark:text-cream-muted font-sans font-medium">
                    ECCOR2PC203 • SAKEC Course Assistant
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={() => setMessages([])}
                    className="p-2 rounded-xl text-ink-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-cream-soft dark:hover:bg-darklab-base transition-colors"
                    title="Clear Conversation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-ink-400 hover:text-ink-900 dark:hover:text-white hover:bg-cream-soft dark:hover:bg-darklab-base transition-colors"
                  aria-label="Close Chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Context Topic Badge */}
            <div className="px-4 py-2 bg-indigo-50/60 dark:bg-indigo-950/30 border-b border-indigo-100/80 dark:border-indigo-900/40 flex items-center justify-between text-[11px] text-indigo-900 dark:text-indigo-200">
              <div className="flex items-center gap-1.5 truncate">
                <Layers className="w-3.5 h-3.5 text-brand-mid shrink-0" />
                <span className="font-semibold truncate">Active Context: {topicContext}</span>
              </div>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-darklab-base border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 shrink-0">
                Auto-Injected
              </span>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                /* Empty State with Course Starter Questions */
                <div className="h-full flex flex-col justify-center space-y-6 py-6 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-start to-brand-end mx-auto flex items-center justify-center text-white shadow-lg shadow-brand/25">
                    <Cpu className="w-8 h-8" />
                  </div>

                  <div className="space-y-1.5 px-4">
                    <h4 className="font-display font-extrabold text-lg text-ink-900 dark:text-cream-paper">
                      Stuck on a Circuit or HDL code?
                    </h4>
                    <p className="text-xs text-ink-600 dark:text-cream-muted max-w-xs mx-auto leading-relaxed">
                      Ask me to explain flip-flop timing diagrams, state machine design, MSI counter ICs, or review your Verilog HDL line by line!
                    </p>
                  </div>

                  {/* Starter Suggestion Chips */}
                  <div className="space-y-2 text-left pt-2">
                    <div className="text-[11px] font-sans font-bold text-ink-400 dark:text-cream-muted uppercase tracking-wider px-2">
                      Suggested for this section:
                    </div>
                    {getStarterPrompts().map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(prompt)}
                        className="w-full text-left p-3 rounded-2xl bg-cream-soft/70 dark:bg-darklab-card/70 border border-cream-border dark:border-darklab-border hover:border-brand-mid hover:bg-white dark:hover:bg-darklab-base text-xs font-sans font-medium text-ink-800 dark:text-cream-paper transition-all flex items-center justify-between gap-2 shadow-xs group"
                      >
                        <span>{prompt}</span>
                        <ChevronRight className="w-4 h-4 text-brand-mid opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Message List */
                messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-brand-start to-brand-end text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs ${
                          isUser
                            ? 'bg-gradient-to-r from-brand-start via-brand-mid to-brand-end text-white rounded-tr-none'
                            : 'bg-cream-soft/90 dark:bg-darklab-card border border-cream-border dark:border-darklab-border text-ink-900 dark:text-cream-paper rounded-tl-none'
                        }`}
                      >
                        {isUser ? (
                          <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                            {msg.content}
                          </p>
                        ) : (
                          <>
                            {msg.content ? (
                              renderMessageContent(msg.content)
                            ) : (
                              <div className="flex items-center gap-2 text-xs text-ink-500 dark:text-cream-muted py-1">
                                <span className="w-2 h-2 rounded-full bg-brand-mid animate-ping" />
                                <span>Thinking & preparing circuit solution...</span>
                              </div>
                            )}

                            {/* Response Feedback Controls (👍 / 👎) */}
                            {msg.content && !isStreaming && (
                              <div className="mt-3 pt-2 border-t border-cream-border/70 dark:border-darklab-border flex items-center justify-between text-[11px] text-ink-400 dark:text-cream-muted">
                                <span>Was this explanation helpful?</span>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleFeedback(msg.id, 'positive')}
                                    className={`p-1 rounded-lg transition-colors ${
                                      msg.feedback === 'positive'
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                        : 'hover:bg-cream-border dark:hover:bg-darklab-border'
                                    }`}
                                    title="Helpful explanation"
                                  >
                                    <ThumbsUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleFeedback(msg.id, 'negative')}
                                    className={`p-1 rounded-lg transition-colors ${
                                      msg.feedback === 'negative'
                                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                        : 'hover:bg-cream-border dark:hover:bg-darklab-border'
                                    }`}
                                    title="Needs improvement"
                                  >
                                    <ThumbsDown className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {isUser && (
                        <div className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-darklab-subtle text-ink-700 dark:text-cream-paper flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mx-4 mb-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Logged Out Banner */}
            {!user && (
              <div className="px-4 py-1.5 bg-amber-50/70 dark:bg-amber-950/30 border-t border-amber-200/60 dark:border-amber-900/30 flex items-center justify-between text-[11px] text-amber-900 dark:text-amber-200">
                <span>💡 Free guest session active.</span>
                <button
                  onClick={() => openAuthModal('signin')}
                  className="font-bold underline text-brand-600 dark:text-brand-400 hover:text-brand-700"
                >
                  Log in to save history
                </button>
              </div>
            )}

            {/* Footer Input Area */}
            <div className="p-3.5 border-t border-cream-border dark:border-darklab-border bg-white/90 dark:bg-darklab-card/90 space-y-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Ask about ${topicContext}...`}
                  disabled={isStreaming}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-cream-soft/70 dark:bg-darklab-base border border-cream-border dark:border-darklab-border text-xs sm:text-sm text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-mid transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isStreaming}
                  className="btn-brand-gradient p-2.5 rounded-2xl text-white shadow-md shadow-brand/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  aria-label="Send Message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Honest AI Disclaimer */}
              <div className="flex items-center gap-1.5 text-[10px] text-ink-400 dark:text-cream-muted px-1">
                <Info className="w-3 h-3 text-amber-500 shrink-0" />
                <span>
                  AI-generated answers may contain mistakes — always cross-check with your notes, textbook, or professor.
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
