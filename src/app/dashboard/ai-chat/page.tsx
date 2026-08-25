"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  Plus,
  Trash2,
  MessageSquare,
  Bot,
  User,
  CheckCircle2,
  Copy,
  Check,
  Flame,
  Target,
  PanelLeftClose,
  PanelLeft,
  Compass,
  FileText,
  RefreshCw,
} from "lucide-react";
import { ChatMessageRecord, ChatSessionRecord } from "@/lib/ai/chat-service";

const STARTER_PROMPTS = [
  {
    title: "Resume ATS Polish",
    desc: "How can I optimize my project bullet points for ATS scanners?",
    icon: FileText,
    accent: "text-accent border-accent/20 bg-accent/10",
  },
  {
    title: "DSA 7-Day Roadmap",
    desc: "Give me a high-leverage 7-day practice plan based on my weak topics.",
    icon: Flame,
    accent: "text-accent-secondary border-accent-secondary/20 bg-accent-secondary/10",
  },
  {
    title: "Mock Interview Simulation",
    desc: "Ask me a challenging technical or behavioral interview question for Google.",
    icon: Target,
    accent: "text-success border-success/20 bg-success/10",
  },
  {
    title: "STAR Behavioral Method",
    desc: "Help me structure an answer for: 'Tell me about a time you faced a difficult bug'.",
    icon: Compass,
    accent: "text-warning border-warning/20 bg-warning/10",
  },
];

export default function AiMentorChatPage() {
  const [sessions, setSessions] = useState<ChatSessionRecord[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageRecord[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on message updates
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Load chat sessions on mount
  const loadSessions = async () => {
    try {
      const res = await fetch("/api/chat/sessions");
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          setSessions(json.data);
          if (json.data.length > 0 && !activeSessionId) {
            loadSessionMessages(json.data[0].id);
          }
        }
      }
    } catch (e) {
      console.warn("Failed to load sessions:", e);
    }
  };

  // Load messages for a session
  const loadSessionMessages = async (sessionId: string) => {
    setActiveSessionId(sessionId);
    try {
      const res = await fetch(`/api/chat/sessions/${sessionId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setMessages(json.data);
        }
      }
    } catch (e) {
      console.warn("Failed to load session messages:", e);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  // Handle New Chat creation
  const handleNewChat = () => {
    setActiveSessionId(null);
    setMessages([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Delete a session
  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/chat/sessions/${sessionId}`, { method: "DELETE" });
      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        if (activeSessionId === sessionId) {
          handleNewChat();
        }
      }
    } catch (err) {
      console.warn("Failed to delete session:", err);
    }
  };

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isLoading) return;

    const userContent = text.trim();
    setInputValue("");

    // Optimistic user message
    const tempUserMsg: ChatMessageRecord = {
      id: `temp_${Date.now()}`,
      sessionId: activeSessionId || "new",
      role: "user",
      content: userContent,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: activeSessionId || undefined,
          message: userContent,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          const { sessionId, assistantMessage, sessionTitle } = json.data;

          if (!activeSessionId) {
            setActiveSessionId(sessionId);
            setSessions((prev) => [
              {
                id: sessionId,
                userId: "current",
                title: sessionTitle || userContent.slice(0, 25),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              ...prev,
            ]);
          }

          setMessages((prev) => {
            const filtered = prev.filter((m) => m.id !== tempUserMsg.id);
            return [...filtered, json.data.userMessage, assistantMessage];
          });
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        setMessages((prev) => [
          ...prev,
          {
            id: `err_${Date.now()}`,
            sessionId: activeSessionId || "err",
            role: "assistant",
            content: `⚠️ ${errJson.error || "Unable to reach mentor. Please try again."}`,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sessionId: activeSessionId || "err",
          role: "assistant",
          content: "⚠️ Network error while connecting to AI mentor. Please check your connection.",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-8.5rem)] overflow-hidden rounded-[28px] border border-border bg-surface shadow-sm backdrop-blur-xl">
      {/* 1. SESSIONS SIDEBAR */}
      <aside
        className={`${
          isSidebarOpen ? "w-80" : "w-0 -translate-x-full lg:w-0 lg:-translate-x-full"
        } relative flex flex-col border-r border-border bg-elevated transition-all duration-300 overflow-hidden flex-shrink-0 z-20`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-soft border border-border text-accent">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-primary">Mentoring Threads</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-lg p-1.5 text-muted hover:bg-soft hover:text-primary transition"
            title="Collapse Sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>

        {/* New Chat CTA */}
        <div className="p-3">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-accent hover:bg-accent-hover px-4 py-3 text-xs font-semibold text-on-accent shadow-sm transition hover:scale-[1.01] active:scale-[0.99]"
          >
            <Plus className="h-4 w-4" />
            <span>New Mentoring Chat</span>
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
          {sessions.length === 0 ? (
            <div className="py-8 text-center px-4">
              <MessageSquare className="h-6 w-6 text-muted mx-auto mb-2 opacity-60" />
              <p className="text-xs text-muted font-medium">No past conversations</p>
              <p className="text-[11px] text-muted mt-1">Start your first mentoring chat above</p>
            </div>
          ) : (
            sessions.map((s) => {
              const isActive = s.id === activeSessionId;
              return (
                <div
                  key={s.id}
                  onClick={() => loadSessionMessages(s.id)}
                  className={`group flex items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-xs transition cursor-pointer ${
                    isActive
                      ? "bg-soft border border-border text-primary font-semibold shadow-sm"
                      : "text-muted hover:bg-base hover:text-primary"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <MessageSquare className={`h-3.5 w-3.5 flex-shrink-0 ${isActive ? "text-accent" : "text-muted"}`} />
                    <span className="truncate">{s.title || "Mentoring Chat"}</span>
                  </div>

                  <button
                    onClick={(e) => handleDeleteSession(s.id, e)}
                    className="opacity-0 group-hover:opacity-100 rounded-lg p-1 text-muted hover:text-error hover:bg-error/10 transition flex-shrink-0"
                    title="Delete Chat"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer Diagnostic Badge */}
        <div className="p-3 border-t border-border bg-base">
          <div className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 p-2.5 text-xs text-success">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-success" />
            <div className="truncate">
              <p className="font-semibold text-primary">Profile Synchronized</p>
              <p className="text-[10px] text-muted">Diagnostic scores active</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CHAT PANEL */}
      <div className="flex flex-1 flex-col overflow-hidden bg-surface relative">
        {/* Chat Top Header */}
        <header className="flex items-center justify-between border-b border-border px-5 py-3.5 bg-surface/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="rounded-xl border border-border bg-base p-2 text-muted hover:bg-soft hover:text-primary transition mr-1"
                title="Open Sidebar"
              >
                <PanelLeft className="h-4 w-4" />
              </button>
            )}

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-soft border border-border text-accent">
              <Bot className="h-5 w-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-primary">AI Placement Mentor</h3>
                <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
              </div>
              <p className="text-[11px] text-muted">
                Grounding advice in your ATS, DSA & mock interview diagnostic
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex rounded-full bg-soft border border-border px-3 py-1 text-xs font-semibold text-primary">
              ⚡ Gemini 2.5 Flash
            </span>
          </div>
        </header>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.length === 0 ? (
            /* EMPTY / WELCOME STATE */
            <div className="max-w-2xl mx-auto py-8 text-center space-y-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-border bg-soft text-accent mx-auto shadow-sm">
                <Sparkles className="h-8 w-8" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-primary sm:text-3xl">
                  Hello! How can I assist your prep today?
                </h2>
                <p className="mt-2 text-sm text-muted max-w-lg mx-auto leading-relaxed">
                  I have full context of your placement readiness diagnostic. Ask me for targeted DSA patterns, resume bullets, or mock interview strategies.
                </p>
              </div>

              {/* Starter Prompt Cards */}
              <div className="grid gap-3 sm:grid-cols-2 text-left pt-2">
                {STARTER_PROMPTS.map((prompt) => {
                  const Icon = prompt.icon;
                  return (
                    <button
                      key={prompt.title}
                      onClick={() => handleSendMessage(prompt.desc)}
                      className="group rounded-2xl border border-border bg-elevated p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-soft hover:shadow-sm"
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className={`p-2 rounded-xl border ${prompt.accent}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-bold text-primary group-hover:text-accent transition">
                          {prompt.title}
                        </span>
                      </div>
                      <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                        {prompt.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* MESSAGE THREAD */
            messages.map((msg, index) => {
              const isUser = msg.role === "user";
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3.5 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-soft border border-border text-accent flex-shrink-0 mt-1">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}

                  <div
                    className={`relative max-w-2xl rounded-2xl p-4 text-sm leading-relaxed ${
                      isUser
                        ? "bg-accent text-on-accent shadow-sm rounded-tr-none"
                        : "border border-border bg-elevated text-primary shadow-sm rounded-tl-none"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {!isUser && (
                      <div className="mt-3 flex items-center justify-between border-t border-border pt-2 text-[11px] text-muted">
                        <span>AI Mentor</span>
                        <button
                          onClick={() => handleCopy(msg.content, index)}
                          className="flex items-center gap-1 text-muted hover:text-primary transition"
                          title="Copy message"
                        >
                          {copiedIndex === index ? (
                            <>
                              <Check className="h-3 w-3 text-success" />
                              <span className="text-success">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-soft border border-border text-primary flex-shrink-0 mt-1">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </motion.div>
              );
            })
          )}

          {/* Typing Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-soft border border-border text-accent">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl border border-border bg-elevated px-4 py-3 text-xs text-muted flex items-center gap-2">
                <RefreshCw className="h-3.5 w-3.5 text-accent animate-spin" />
                <span>AI Mentor is analyzing your diagnostic and crafting guidance...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 3. INPUT BAR (PINNED BOTTOM) */}
        <div className="border-t border-border bg-surface/90 p-4 backdrop-blur-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2.5 max-w-4xl mx-auto"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask AI Mentor anything about your placement roadmap, DSA, or resume..."
                disabled={isLoading}
                className="w-full rounded-2xl border border-border bg-base px-4 py-3.5 text-sm text-primary placeholder-muted outline-none focus:border-accent focus:ring-1 focus:ring-accent transition disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent hover:bg-accent-hover text-on-accent shadow-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <p className="mt-2 text-center text-[10px] text-muted">
            Powered by Google Gemini 2.5 Flash • Contextually grounded in your student diagnostics
          </p>
        </div>
      </div>
    </div>
  );
}
