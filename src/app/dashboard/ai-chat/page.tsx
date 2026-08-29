"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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
  Square,
  ArrowDown,
  Clock,
} from "lucide-react";
import { ChatMessageRecord, ChatSessionRecord } from "@/lib/ai/chat-service";
import MarkdownContent from "@/components/chat/MarkdownContent";

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
    title: "STAR Behavioral Coach",
    desc: "Help me structure an answer for: 'Tell me about a time you faced a difficult bug'.",
    icon: Compass,
    accent: "text-warning border-warning/20 bg-warning/10",
  },
];

function formatTime(isoString?: string): string {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  } catch {
    return "";
  }
}

function formatRelativeSessionDate(isoString?: string): string {
  if (!isoString) return "Recent";
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return "Recent";
  }
}

export default function AiMentorChatPage() {
  const [sessions, setSessions] = useState<ChatSessionRecord[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageRecord[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Manual scroll helper
  const scrollToBottom = useCallback((smooth: boolean = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block: "end",
    });
  }, []);

  // Monitor scroll position to show/hide "Scroll to bottom" button
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const distanceToBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    setShowScrollBottom(distanceToBottom > 120);
  };

  // Fixed, unconditional dependency array for auto-scrolling
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages.length, isGenerating]);

  // Adjust textarea height on input change with compact baseline
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      if (inputValue.trim()) {
        const nextHeight = Math.min(Math.max(textarea.scrollHeight, 36), 160);
        textarea.style.height = `${nextHeight}px`;
      }
    }
  }, [inputValue]);

  // Auto-collapse sidebar on mobile screens on mount
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, []);

  // Load messages for a selected session
  const loadSessionMessages = async (sessionId: string) => {
    if (isGenerating) return; // Prevent switching mid-generation
    setActiveSessionId(sessionId);
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
    try {
      const res = await fetch(`/api/chat/sessions/${sessionId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setMessages(json.data);
          setTimeout(() => scrollToBottom(false), 50);
        }
      }
    } catch (e) {
      console.warn("Failed to load session messages:", e);
    }
  };

  // Load chat sessions on initial mount
  useEffect(() => {
    let isMounted = true;
    async function loadSessions() {
      try {
        const res = await fetch("/api/chat/sessions");
        if (res.ok && isMounted) {
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
    }
    loadSessions();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle New Chat creation
  const handleNewChat = () => {
    if (isGenerating && abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
      setStreamingMessageId(null);
    }
    setActiveSessionId(null);
    setMessages([]);
    setInputValue("");
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
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

  // Stop generation action
  const handleStopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
    setStreamingMessageId(null);
  };

  // Send message handler with Realtime SSE Streaming & Fallbacks
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isGenerating) return;

    setInputValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const tempUserId = `user_${Date.now()}`;
    const tempAssistantId = `ai_${Date.now()}`;

    // 1. Optimistically append user message & empty assistant placeholder
    const userMsg: ChatMessageRecord = {
      id: tempUserId,
      sessionId: activeSessionId || "new",
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    const assistantMsg: ChatMessageRecord = {
      id: tempAssistantId,
      sessionId: activeSessionId || "new",
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setIsGenerating(true);
    setStreamingMessageId(tempAssistantId);

    // 2. Setup AbortController for stream cancellation
    const controller = new AbortController();
    abortControllerRef.current = controller;

    let accumulatedContent = "";

    try {
      // 3. Initiate SSE Streaming Request
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: activeSessionId || undefined,
          message: text,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      if (!response.body) {
        throw new Error("ReadableStream not supported by browser/server");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === "start") {
                if (!activeSessionId && data.sessionId) {
                  setActiveSessionId(data.sessionId);
                  setSessions((prev) => {
                    const exists = prev.some((s) => s.id === data.sessionId);
                    if (!exists) {
                      return [
                        {
                          id: data.sessionId,
                          userId: "current",
                          title: data.sessionTitle || text.slice(0, 30),
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        },
                        ...prev,
                      ];
                    }
                    return prev;
                  });
                }
              } else if (data.type === "token") {
                accumulatedContent += data.content;
                const currentChunk = accumulatedContent;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === tempAssistantId
                      ? { ...m, content: currentChunk }
                      : m
                  )
                );
                messagesEndRef.current?.scrollIntoView({
                  behavior: "auto",
                  block: "end",
                });
              } else if (data.type === "done") {
                const finalAssistant = data.assistantMessage || {
                  id: tempAssistantId,
                  sessionId: data.sessionId || activeSessionId || "new",
                  role: "assistant",
                  content: accumulatedContent,
                  createdAt: new Date().toISOString(),
                };

                setMessages((prev) =>
                  prev.map((m) => {
                    if (m.id === tempAssistantId) return finalAssistant;
                    if (m.id === tempUserId && data.userMessage) return data.userMessage;
                    return m;
                  })
                );

                if (data.sessionId) {
                  setActiveSessionId(data.sessionId);
                  setSessions((prev) => {
                    const updated = prev.map((s) =>
                      s.id === data.sessionId
                        ? {
                            ...s,
                            title: data.sessionTitle || s.title,
                            updatedAt: new Date().toISOString(),
                          }
                        : s
                    );
                    if (!updated.some((s) => s.id === data.sessionId)) {
                      return [
                        {
                          id: data.sessionId,
                          userId: "current",
                          title: data.sessionTitle || text.slice(0, 30),
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        },
                        ...updated,
                      ];
                    }
                    return updated;
                  });
                }
              } else if (data.type === "error") {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === tempAssistantId
                      ? {
                          ...m,
                          content: `⚠️ ${data.error || "Unable to complete response."}`,
                        }
                      : m
                  )
                );
              }
            } catch (parseErr) {
              console.warn("Error parsing stream chunk:", parseErr);
            }
          }
        }
      }
    } catch (err: unknown) {
      if ((err as Error)?.name === "AbortError") {
        console.log("User stopped response generation");
      } else {
        console.warn("Streaming failed, executing fallback POST /api/chat:", err);
        try {
          const fallbackRes = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: activeSessionId || undefined,
              message: text,
            }),
          });

          if (fallbackRes.ok) {
            const json = await fallbackRes.json();
            if (json.data) {
              const { sessionId, assistantMessage, sessionTitle } = json.data;
              if (!activeSessionId && sessionId) {
                setActiveSessionId(sessionId);
                setSessions((prev) => [
                  {
                    id: sessionId,
                    userId: "current",
                    title: sessionTitle || text.slice(0, 30),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  },
                  ...prev,
                ]);
              }
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === tempAssistantId ? assistantMessage : m
                )
              );
            }
          } else {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === tempAssistantId
                  ? {
                      ...m,
                      content:
                        "⚠️ Unable to reach AI Placement Mentor. Please check your connection and try again.",
                    }
                  : m
              )
            );
          }
        } catch {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempAssistantId
                ? {
                    ...m,
                    content:
                      "⚠️ Network error while connecting to mentor. Please retry.",
                  }
                : m
            )
          );
        }
      }
    } finally {
      setIsGenerating(false);
      setStreamingMessageId(null);
      abortControllerRef.current = null;
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  // Copy full message content
  const handleCopyMessage = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  // Keyboard navigation for composer: Enter to submit, Shift+Enter for new line
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-8.5rem)] md:h-[calc(100dvh-9rem)] overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-surface shadow-md relative w-full max-w-full">
      {/* ========================================================= */}
      {/* 1. MENTORING SESSIONS SIDEBAR */}
      {/* ========================================================= */}
      <aside
        className={`${
          isSidebarOpen
            ? "w-72 sm:w-80 border-r border-border"
            : "w-0 -translate-x-full border-none"
        } relative flex flex-col bg-elevated/95 transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0 z-30`}
      >
        {/* Sidebar Header */}
        <div className="p-3 sm:p-4 border-b border-border/80 flex items-center justify-between bg-surface/40 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-accent/15 border border-accent/25 text-accent shadow-xs shrink-0">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-primary block leading-tight truncate">
                Mentoring Threads
              </span>
              <span className="text-[10px] text-muted block">
                {sessions.length} {sessions.length === 1 ? "thread" : "threads"}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-xl p-1.5 text-muted hover:bg-soft hover:text-primary transition cursor-pointer"
            title="Collapse Sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>

        {/* New Chat Button CTA */}
        <div className="p-2.5 sm:p-3 shrink-0">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-accent hover:bg-accent-hover px-3.5 py-2 sm:py-2.5 text-xs font-semibold text-on-accent shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>New Mentoring Chat</span>
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto px-2.5 sm:px-3 py-1 space-y-1">
          {sessions.length === 0 ? (
            <div className="py-8 sm:py-12 text-center px-3">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl sm:rounded-2xl bg-soft/50 border border-border/60 text-muted mx-auto mb-2">
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 opacity-60" />
              </div>
              <p className="text-xs font-medium text-primary">No conversations yet</p>
              <p className="text-[10px] sm:text-[11px] text-muted mt-0.5 leading-relaxed">
                Start a chat or pick a starter prompt
              </p>
            </div>
          ) : (
            sessions.map((s) => {
              const isActive = s.id === activeSessionId;
              return (
                <div
                  key={s.id}
                  onClick={() => loadSessionMessages(s.id)}
                  className={`group relative flex items-center justify-between gap-2 rounded-xl sm:rounded-2xl px-3 py-2 text-xs transition cursor-pointer ${
                    isActive
                      ? "bg-soft border border-border text-primary font-semibold shadow-xs"
                      : "text-muted hover:bg-base hover:text-primary border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <MessageSquare
                      className={`h-3.5 w-3.5 flex-shrink-0 ${
                        isActive ? "text-accent" : "text-muted group-hover:text-primary"
                      }`}
                    />
                    <div className="truncate flex-1">
                      <p className="truncate text-xs leading-tight">
                        {s.title || "Mentoring Session"}
                      </p>
                      <span className="text-[10px] text-muted block font-normal mt-0.5">
                        {formatRelativeSessionDate(s.updatedAt)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleDeleteSession(s.id, e)}
                    className="opacity-0 group-hover:opacity-100 rounded-lg p-1 text-muted hover:text-error hover:bg-error/15 transition flex-shrink-0 cursor-pointer"
                    title="Delete Chat"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer Diagnostic Badge */}
        <div className="p-2.5 sm:p-3 border-t border-border bg-base/60 shrink-0">
          <div className="flex items-center gap-2 rounded-xl sm:rounded-2xl border border-success/30 bg-success/10 p-2 text-xs">
            <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-success" />
            <div className="truncate">
              <p className="font-semibold text-primary text-[10px] sm:text-[11px] leading-tight">
                Diagnostic Sync Active
              </p>
              <p className="text-[9px] sm:text-[10px] text-muted truncate">
                ATS, DSA & Mock grounded
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. MAIN CHAT PANEL */}
      {/* ========================================================= */}
      <div className="flex flex-1 flex-col overflow-hidden bg-surface relative min-w-0 w-full max-w-full">
        {/* Chat Top Header */}
        <header className="flex items-center justify-between border-b border-border px-3 sm:px-6 py-2.5 sm:py-3 bg-surface/95 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="rounded-xl sm:rounded-2xl border border-border bg-base p-1.5 sm:p-2 text-muted hover:bg-soft hover:text-primary transition cursor-pointer shrink-0"
                title="Open Sidebar"
              >
                <PanelLeft className="h-4 w-4" />
              </button>
            )}

            <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-xl sm:rounded-2xl bg-accent/15 border border-accent/25 text-accent shadow-xs flex-shrink-0">
              <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>

            <div className="truncate">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="text-xs sm:text-sm font-bold text-primary truncate">
                  AI Placement Mentor
                </h2>
                <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-success animate-pulse flex-shrink-0" />
              </div>
              <p className="text-[10px] sm:text-[11px] text-muted truncate hidden xs:block">
                Personalized guidance powered by your ATS & DSA diagnostics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {messages.length > 0 && (
              <button
                onClick={handleNewChat}
                className="flex items-center gap-1 rounded-lg sm:rounded-xl border border-border bg-base hover:bg-soft px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-primary transition cursor-pointer"
                title="Start a new chat"
              >
                <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-accent" />
                <span>New</span>
              </button>
            )}

            <span className="hidden md:inline-flex items-center gap-1 rounded-full bg-soft/80 border border-border px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-primary shadow-2xs">
              <Sparkles className="h-3 w-3 text-accent" />
              <span>Gemini 3.1 Flash-Lite</span>
            </span>
          </div>
        </header>

        {/* Scrollable Message Thread or Compact Empty State */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6 min-h-0 w-full max-w-full overflow-x-hidden"
        >
          {messages.length === 0 ? (
            /* ========================================================= */
            /* EMPTY STATE: COMPACT, FRIENDLY CHAT WELCOME */
            /* ========================================================= */
            <div className="max-w-2xl mx-auto py-4 sm:py-10 text-center space-y-4 sm:space-y-6 px-1">
              {/* Compact Header Greeting */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl border border-accent/30 bg-accent/10 text-accent shadow-xs mb-0.5">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-lg sm:text-2xl font-bold text-primary tracking-tight">
                  How can I guide your prep today?
                </h3>
                <p className="text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed">
                  Ask for personalized DSA roadmaps, ATS resume bullets, or interview practice.
                </p>
              </div>

              {/* Suggestion Starter Cards */}
              <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2 text-left pt-1">
                {STARTER_PROMPTS.map((prompt) => {
                  const Icon = prompt.icon;
                  return (
                    <button
                      key={prompt.title}
                      onClick={() => handleSendMessage(prompt.desc)}
                      className="group flex flex-col justify-between rounded-xl sm:rounded-2xl border border-border bg-elevated/70 p-3 sm:p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-soft/40 hover:border-accent/40 hover:shadow-sm cursor-pointer text-left w-full"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className={`p-1.5 rounded-lg sm:rounded-xl border ${prompt.accent} flex-shrink-0`}>
                          <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </div>
                        <span className="text-xs font-bold text-primary group-hover:text-accent transition truncate">
                          {prompt.title}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-muted line-clamp-2 leading-relaxed">
                        {prompt.desc}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="pt-1 sm:pt-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-base/60 px-3 py-0.5 text-[10px] sm:text-[11px] text-muted">
                  <Sparkles className="h-3 w-3 text-accent shrink-0" />
                  <span>Click any card to start or type a question below</span>
                </span>
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* MESSAGE THREAD LAYOUT (ChatGPT / Claude Style) */
            /* ========================================================= */
            messages.map((msg) => {
              const isUser = msg.role === "user";
              const isStreamingThis = isGenerating && msg.id === streamingMessageId;

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2 sm:gap-3.5 w-full min-w-0 max-w-full ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* AI Avatar */}
                  {!isUser && (
                    <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-xl sm:rounded-2xl bg-accent/15 border border-accent/30 text-accent flex-shrink-0 mt-0.5 shadow-xs">
                      {isStreamingThis ? (
                        <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin text-accent" />
                      ) : (
                        <Bot className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                      )}
                    </div>
                  )}

                  {/* Message Bubble / Card */}
                  <div
                    className={`relative flex flex-col min-w-0 max-w-[88%] sm:max-w-[80%] md:max-w-[75%] ${
                      isUser ? "items-end" : "items-start flex-1"
                    }`}
                  >
                    <div
                      className={`relative rounded-2xl sm:rounded-3xl p-3 sm:p-5 text-xs sm:text-sm leading-relaxed w-full max-w-full min-w-0 overflow-hidden ${
                        isUser
                          ? "bg-accent text-on-accent rounded-tr-xs shadow-xs"
                          : "border border-border bg-elevated text-primary rounded-tl-xs shadow-xs"
                      }`}
                    >
                      {isUser ? (
                        <div className="whitespace-pre-wrap font-normal text-on-accent text-xs sm:text-sm break-words">
                          {msg.content}
                        </div>
                      ) : (
                        <div className="text-primary text-xs sm:text-sm w-full max-w-full min-w-0 overflow-hidden">
                          {msg.content ? (
                            <MarkdownContent
                              content={msg.content}
                              isStreaming={isStreamingThis}
                            />
                          ) : (
                            /* Typing Placeholder Indicator */
                            <div className="flex items-center gap-2 text-xs text-muted py-1">
                              <span className="flex h-2 w-2 rounded-full bg-accent animate-ping" />
                              <span className="font-medium text-primary text-[11px] sm:text-xs">
                                AI Mentor is analyzing and crafting guidance...
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* AI Message Footer Actions */}
                      {!isUser && msg.content && (
                        <div className="mt-2.5 sm:mt-3.5 flex items-center justify-between border-t border-border/60 pt-1.5 sm:pt-2 text-[10px] sm:text-[11px] text-muted">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <span className="font-semibold text-primary">AI Mentor</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                              {formatTime(msg.createdAt)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopyMessage(msg.content, msg.id)}
                              className="flex items-center gap-1 rounded-md sm:rounded-lg px-1.5 sm:px-2 py-0.5 text-muted hover:bg-soft hover:text-primary transition cursor-pointer"
                              title="Copy response"
                            >
                              {copiedMessageId === msg.id ? (
                                <>
                                  <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-success" />
                                  <span className="text-success font-medium">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* User Timestamp */}
                    {isUser && (
                      <span className="mt-0.5 mr-1 text-[9px] sm:text-[10px] text-muted flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {formatTime(msg.createdAt)}
                      </span>
                    )}
                  </div>

                  {/* User Avatar */}
                  {isUser && (
                    <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-xl sm:rounded-2xl bg-soft border border-border text-primary flex-shrink-0 mt-0.5 shadow-xs font-semibold text-xs">
                      <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                    </div>
                  )}
                </motion.div>
              );
            })
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Scroll To Bottom Floating Button (Positioned cleanly above composer) */}
        <AnimatePresence>
          {showScrollBottom && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => scrollToBottom(true)}
              className="absolute bottom-16 sm:bottom-20 right-4 sm:right-6 z-20 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-border bg-surface text-primary shadow-md hover:bg-soft transition cursor-pointer"
              title="Scroll to bottom"
            >
              <ArrowDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* ========================================================= */}
        {/* 3. COMPACT MODERN CHAT COMPOSER (PINNED BOTTOM) */}
        {/* ========================================================= */}
        <div className="border-t border-border bg-surface/95 px-3 py-2 sm:px-4 sm:py-2.5 backdrop-blur-md shrink-0 w-full max-w-full">
          <div className="max-w-4xl mx-auto">
            {/* Inline Single-Line Auto-Expanding Composer Pill */}
            <div className="relative flex items-end gap-1.5 sm:gap-2 rounded-2xl sm:rounded-3xl border border-border bg-base/80 p-1 sm:p-1.5 shadow-xs focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all">
              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask AI Mentor anything about DSA, roadmap, or resume..."
                disabled={isGenerating}
                rows={1}
                className="flex-1 resize-none bg-transparent px-2.5 py-1.5 text-xs sm:text-sm text-primary placeholder-muted outline-none disabled:opacity-60 min-h-[34px] sm:min-h-[36px] max-h-32 sm:max-h-40 overflow-y-auto leading-relaxed"
              />

              {/* Action Button */}
              <div className="shrink-0 mb-0.5 mr-0.5">
                {isGenerating ? (
                  <button
                    type="button"
                    onClick={handleStopGenerating}
                    className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-error/15 border border-error/30 text-error hover:bg-error hover:text-white shadow-xs transition cursor-pointer"
                    title="Stop generating"
                  >
                    <Square className="h-3 w-3 fill-current" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isGenerating}
                    className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-accent hover:bg-accent-hover text-on-accent shadow-xs transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer"
                    title="Send message"
                  >
                    <Send className="h-3.5 w-3.5 sm:h-3.5 sm:w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Micro Disclaimer */}
            <p className="mt-1 text-center text-[9px] sm:text-[10px] text-muted truncate hidden xs:block">
              Powered by Google Gemini 3.1 Flash-Lite • Grounded in student diagnostics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
