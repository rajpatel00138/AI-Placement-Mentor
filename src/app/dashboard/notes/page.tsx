"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Plus,
  Search,
  Pin,
  Trash2,
  Tag,
  Check,
  Clock,
  Eye,
  Edit3,
  Sparkles,
  ArrowLeft,
  X,
  Bold,
  Italic,
  Heading,
  List,
  CheckSquare,
  Code,
  Quote,
  Loader2,
  AlertTriangle,
  FolderOpen,
} from "lucide-react";
import { NoteRecord } from "@/lib/notes/types";

export default function NotesPage() {
  const [notes, setNotes] = useState<NoteRecord[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);

  // Editor states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isPinned, setIsPinned] = useState(false);
  const [newTagInput, setNewTagInput] = useState("");
  const [isAddingTag, setIsAddingTag] = useState(false);

  // Status and UI
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "editor">("list");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);

  // Fetch all notes
  const fetchNotes = useCallback(async () => {
    try {
      const res = await fetch("/api/notes");
      if (res.ok) {
        const data = await res.json();
        if (data.notes && Array.isArray(data.notes)) {
          setNotes(data.notes);
          if (data.notes.length > 0 && !selectedNoteId) {
            const firstNote = data.notes[0];
            setSelectedNoteId(firstNote.id);
            setTitle(firstNote.title);
            setContent(firstNote.content);
            setTags(firstNote.tags || []);
            setIsPinned(firstNote.isPinned);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load notes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedNoteId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Load a note into editor
  const handleSelectNote = (note: NoteRecord) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setSelectedNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags || []);
    setIsPinned(note.isPinned);
    setSaveStatus("saved");
    setMobileView("editor");
    setIsAddingTag(false);
  };

  // Perform API Save
  const saveNoteToServer = useCallback(
    async (noteId: string, updatedFields: { title: string; content: string; tags: string[]; isPinned: boolean }) => {
      setSaveStatus("saving");
      try {
        const res = await fetch(`/api/notes/${noteId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedFields),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.note) {
            setNotes((prev) =>
              prev.map((n) => (n.id === noteId ? data.note : n))
            );
            setSaveStatus("saved");
          }
        } else {
          setSaveStatus("unsaved");
        }
      } catch (err) {
        console.error("Save note failed:", err);
        setSaveStatus("unsaved");
      }
    },
    []
  );

  // Trigger debounced autosave when editor state changes
  const triggerAutoSave = useCallback(
    (newTitle: string, newContent: string, newTags: string[], newPinned: boolean) => {
      if (!selectedNoteId) return;
      setSaveStatus("unsaved");

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        saveNoteToServer(selectedNoteId, {
          title: newTitle,
          content: newContent,
          tags: newTags,
          isPinned: newPinned,
        });
      }, 700);
    },
    [selectedNoteId, saveNoteToServer]
  );

  // Create new note
  const handleCreateNote = async () => {
    try {
      setIsCreating(true);
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Untitled Note",
          content: "",
          tags: [],
          isPinned: false,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.note) {
          setNotes((prev) => [data.note, ...prev]);
          handleSelectNote(data.note);
          setTimeout(() => {
            titleInputRef.current?.focus();
            titleInputRef.current?.select();
          }, 100);
        }
      }
    } catch (err) {
      console.error("Error creating note:", err);
    } finally {
      setIsCreating(false);
    }
  };

  // Delete note
  const handleDeleteNote = async (noteId: string) => {
    try {
      const res = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const remaining = notes.filter((n) => n.id !== noteId);
        setNotes(remaining);
        setDeleteConfirmId(null);

        if (selectedNoteId === noteId) {
          if (remaining.length > 0) {
            handleSelectNote(remaining[0]);
          } else {
            setSelectedNoteId(null);
            setTitle("");
            setContent("");
            setTags([]);
            setIsPinned(false);
            setMobileView("list");
          }
        }
      }
    } catch (err) {
      console.error("Delete note error:", err);
    }
  };

  // Toggle Pin on active note
  const handleTogglePin = (noteId?: string) => {
    const targetId = noteId || selectedNoteId;
    if (!targetId) return;

    const note = notes.find((n) => n.id === targetId);
    if (!note) return;

    const newPinned = targetId === selectedNoteId ? !isPinned : !note.isPinned;

    if (targetId === selectedNoteId) {
      setIsPinned(newPinned);
      triggerAutoSave(title, content, tags, newPinned);
    } else {
      saveNoteToServer(targetId, {
        title: note.title,
        content: note.content,
        tags: note.tags,
        isPinned: newPinned,
      });
    }
  };

  // Tag Management
  const handleAddTag = () => {
    const trimmed = newTagInput.trim().replace(/^#/, "");
    if (trimmed && !tags.includes(trimmed)) {
      const updatedTags = [...tags, trimmed];
      setTags(updatedTags);
      setNewTagInput("");
      setIsAddingTag(false);
      triggerAutoSave(title, content, updatedTags, isPinned);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((t) => t !== tagToRemove);
    setTags(updatedTags);
    triggerAutoSave(title, content, updatedTags, isPinned);
  };

  // Markdown Toolbar actions
  const insertMarkdown = (prefix: string, suffix: string = "", placeholder: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || placeholder;

    const newContent =
      content.substring(0, start) +
      prefix +
      selectedText +
      suffix +
      content.substring(end);

    setContent(newContent);
    triggerAutoSave(title, newContent, tags, isPinned);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 10);
  };

  // Keyboard shortcut Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (selectedNoteId) {
          if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
          saveNoteToServer(selectedNoteId, { title, content, tags, isPinned });
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedNoteId, title, content, tags, isPinned, saveNoteToServer]);

  // Extract all unique tags
  const allUniqueTags = useMemo(() => {
    const set = new Set<string>();
    notes.forEach((n) => (n.tags || []).forEach((t) => set.add(t)));
    return Array.from(set);
  }, [notes]);

  // Filter notes
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      if (showPinnedOnly && !n.isPinned) return false;
      if (selectedTag !== "all" && !n.tags.includes(selectedTag)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = n.title.toLowerCase().includes(q);
        const matchesContent = n.content.toLowerCase().includes(q);
        const matchesTags = (n.tags || []).some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesContent && !matchesTags) return false;
      }
      return true;
    });
  }, [notes, showPinnedOnly, selectedTag, searchQuery]);

  // Format relative time helper
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return "Recently";
    }
  };

  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-soft px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles size={13} className="text-accent" />
            <span>Placement Knowledge Base</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-primary">
            Personal Notes & Strategy
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Organize interview takeaways, DSA revision formulas, and placement prep checklists.
          </p>
        </div>

        <button
          onClick={handleCreateNote}
          disabled={isCreating}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-accent hover:bg-accent-hover px-5 py-2.5 text-xs sm:text-sm font-semibold text-on-accent shadow-sm transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50"
        >
          {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          <span>New Note</span>
        </button>
      </div>

      {/* Main Workspace Container */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
        <div className="grid min-h-[680px] lg:grid-cols-[330px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)]">
          {/* ========================================================= */}
          {/* LEFT SIDEBAR: NOTE LIST & FILTERS */}
          {/* ========================================================= */}
          <aside
            className={`border-r border-border bg-elevated p-4 flex flex-col ${
              mobileView === "editor" ? "hidden lg:flex" : "flex"
            }`}
          >
            {/* Search Input */}
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes or tags..."
                className="w-full rounded-xl border border-border bg-base pl-9 pr-8 py-2 text-xs text-primary placeholder:text-muted outline-none transition focus:border-accent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Tag Pills Filter */}
            <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => {
                  setSelectedTag("all");
                  setShowPinnedOnly(false);
                }}
                className={`rounded-lg px-2.5 py-1 font-semibold transition shrink-0 ${
                  selectedTag === "all" && !showPinnedOnly
                    ? "bg-accent text-on-accent shadow-sm"
                    : "border border-border bg-base text-muted hover:text-primary hover:bg-soft"
                }`}
              >
                All ({notes.length})
              </button>

              <button
                onClick={() => setShowPinnedOnly(!showPinnedOnly)}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold transition shrink-0 ${
                  showPinnedOnly
                    ? "bg-accent text-on-accent shadow-sm"
                    : "border border-border bg-base text-muted hover:text-primary hover:bg-soft"
                }`}
              >
                <Pin size={11} className={showPinnedOnly ? "fill-current" : ""} />
                <span>Pinned</span>
              </button>

              {allUniqueTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTag(selectedTag === tag ? "all" : tag);
                    setShowPinnedOnly(false);
                  }}
                  className={`rounded-lg px-2.5 py-1 font-semibold transition shrink-0 ${
                    selectedTag === tag
                      ? "bg-accent text-on-accent shadow-sm"
                      : "border border-border bg-base text-muted hover:text-primary hover:bg-soft"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>

            {/* Notes List */}
            <div className="mt-3 flex-1 overflow-y-auto space-y-2 pr-1">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted">
                  <Loader2 size={24} className="animate-spin text-accent" />
                  <p className="mt-2 text-xs">Loading notes...</p>
                </div>
              ) : filteredNotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-muted px-4">
                  <div className="rounded-2xl border border-border bg-soft p-3 text-accent mb-3">
                    <FolderOpen size={24} />
                  </div>
                  <p className="text-xs font-semibold text-primary">No notes found</p>
                  <p className="mt-1 text-[11px] text-muted">
                    {searchQuery || selectedTag !== "all" || showPinnedOnly
                      ? "Try clearing your active filters."
                      : "Create your first note to begin taking interview notes."}
                  </p>
                  {notes.length === 0 && (
                    <button
                      onClick={handleCreateNote}
                      className="mt-4 rounded-xl bg-accent hover:bg-accent-hover px-3.5 py-1.5 text-xs font-semibold text-on-accent transition"
                    >
                      + Create Note
                    </button>
                  )}
                </div>
              ) : (
                filteredNotes.map((note) => {
                  const isSelected = note.id === selectedNoteId;
                  const firstLine = note.content
                    ? note.content.replace(/^#+\s*/, "").split("\n")[0].slice(0, 75)
                    : "Empty note";

                  return (
                    <div
                      key={note.id}
                      onClick={() => handleSelectNote(note)}
                      className={`group relative rounded-2xl border p-3.5 text-left transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "border-accent bg-soft/60 shadow-sm"
                          : "border-border bg-surface hover:border-accent/40 hover:bg-soft/20"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-xs sm:text-sm text-primary line-clamp-1 flex-1">
                          {note.title || "Untitled Note"}
                        </h3>

                        <div className="flex items-center gap-1 shrink-0">
                          {note.isPinned && (
                            <Pin size={13} className="text-accent fill-accent" />
                          )}
                        </div>
                      </div>

                      <p className="mt-1 text-[11px] leading-relaxed text-muted line-clamp-2">
                        {firstLine}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between gap-2 text-[10px]">
                        <div className="flex flex-wrap gap-1">
                          {(note.tags || []).slice(0, 2).map((t) => (
                            <span
                              key={t}
                              className="rounded-md border border-border bg-base px-1.5 py-0.5 font-medium text-primary"
                            >
                              #{t}
                            </span>
                          ))}
                          {(note.tags || []).length > 2 && (
                            <span className="text-muted">
                              +{note.tags.length - 2}
                            </span>
                          )}
                        </div>

                        <span className="text-muted shrink-0 flex items-center gap-1">
                          <Clock size={10} />
                          {formatTime(note.updatedAt)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Sidebar Summary Footer */}
            <div className="mt-auto pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted">
              <span>{notes.length} total notes</span>
              <span>Markdown ready ⚡</span>
            </div>
          </aside>

          {/* ========================================================= */}
          {/* RIGHT MAIN PANEL: EDITOR / PREVIEW */}
          {/* ========================================================= */}
          <main
            className={`flex flex-col bg-surface overflow-hidden ${
              mobileView === "list" ? "hidden lg:flex" : "flex"
            }`}
          >
            {selectedNoteId && selectedNote ? (
              <div className="flex flex-col h-full">
                {/* Editor Header Toolbar */}
                <header className="border-b border-border px-5 py-3 flex flex-wrap items-center justify-between gap-3 bg-surface">
                  {/* Left Controls */}
                  <div className="flex items-center gap-2">
                    {/* Mobile Back Button */}
                    <button
                      onClick={() => setMobileView("list")}
                      className="lg:hidden rounded-xl border border-border bg-base p-2 text-muted hover:text-primary transition mr-1"
                      title="Back to notes list"
                    >
                      <ArrowLeft size={16} />
                    </button>

                    {/* Pin/Unpin Button */}
                    <button
                      onClick={() => handleTogglePin()}
                      className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                        isPinned
                          ? "border-accent bg-accent/15 text-accent shadow-sm"
                          : "border-border bg-base text-muted hover:text-primary hover:bg-soft"
                      }`}
                      title={isPinned ? "Unpin note" : "Pin note to top"}
                    >
                      <Pin size={13} className={isPinned ? "fill-current" : ""} />
                      <span>{isPinned ? "Pinned" : "Pin"}</span>
                    </button>

                    {/* Tab Switcher: Write vs Preview */}
                    <div className="flex rounded-xl border border-border bg-base p-0.5">
                      <button
                        onClick={() => setActiveTab("write")}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition ${
                          activeTab === "write"
                            ? "bg-surface text-primary shadow-sm"
                            : "text-muted hover:text-primary"
                        }`}
                      >
                        <Edit3 size={12} />
                        <span>Write</span>
                      </button>
                      <button
                        onClick={() => setActiveTab("preview")}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition ${
                          activeTab === "preview"
                            ? "bg-surface text-primary shadow-sm"
                            : "text-muted hover:text-primary"
                        }`}
                      >
                        <Eye size={12} />
                        <span>Preview</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Actions & Autosave Status */}
                  <div className="flex items-center gap-3">
                    {/* Save indicator */}
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      {saveStatus === "saving" ? (
                        <span className="flex items-center gap-1 text-muted">
                          <Loader2 size={12} className="animate-spin text-accent" />
                          <span>Saving...</span>
                        </span>
                      ) : saveStatus === "unsaved" ? (
                        <span className="flex items-center gap-1 text-warning">
                          <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                          <span>Unsaved</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-success">
                          <Check size={12} className="text-success" />
                          <span>Saved</span>
                        </span>
                      )}
                    </div>

                    {/* Delete Action with Confirmation */}
                    {deleteConfirmId === selectedNoteId ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleDeleteNote(selectedNoteId)}
                          className="rounded-xl bg-error hover:bg-error/90 px-3 py-1 text-xs font-semibold text-white shadow-sm transition"
                        >
                          Confirm Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="rounded-xl border border-border bg-base px-2 py-1 text-xs text-muted hover:text-primary"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(selectedNoteId)}
                        className="rounded-xl border border-border bg-base p-2 text-muted hover:border-error/30 hover:bg-error/10 hover:text-error transition"
                        title="Delete note"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </header>

                {/* Note Title & Tags Bar */}
                <div className="p-6 border-b border-border bg-surface space-y-3">
                  <input
                    ref={titleInputRef}
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      triggerAutoSave(e.target.value, content, tags, isPinned);
                    }}
                    placeholder="Untitled Note..."
                    className="w-full bg-transparent text-2xl sm:text-3xl font-extrabold text-primary outline-none placeholder:text-muted"
                  />

                  {/* Tags Manager */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Tag size={13} className="text-muted mr-1" />
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-lg border border-border bg-elevated px-2.5 py-1 text-xs font-semibold text-primary"
                      >
                        <span>#{tag}</span>
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="text-muted hover:text-error transition ml-0.5"
                          title="Remove tag"
                        >
                          <X size={11} />
                        </button>
                      </span>
                    ))}

                    {isAddingTag ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={newTagInput}
                          onChange={(e) => setNewTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddTag();
                            if (e.key === "Escape") setIsAddingTag(false);
                          }}
                          placeholder="Tag name..."
                          autoFocus
                          className="h-7 w-24 rounded-lg border border-accent bg-base px-2 text-xs text-primary outline-none"
                        />
                        <button
                          onClick={handleAddTag}
                          className="h-7 rounded-lg bg-accent px-2 text-xs font-semibold text-on-accent"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => setIsAddingTag(false)}
                          className="h-7 rounded-lg border border-border bg-base px-2 text-xs text-muted"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsAddingTag(true)}
                        className="inline-flex items-center gap-1 rounded-lg border border-dashed border-border bg-base px-2.5 py-1 text-xs text-muted hover:border-accent hover:text-primary transition cursor-pointer"
                      >
                        <Plus size={11} />
                        <span>Add Tag</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Markdown Formatting Toolbar (Visible in Write Tab) */}
                {activeTab === "write" && (
                  <div className="flex flex-wrap items-center gap-1 border-b border-border bg-elevated px-6 py-2 text-xs text-muted">
                    <button
                      onClick={() => insertMarkdown("**", "**", "bold text")}
                      className="rounded-lg p-1.5 hover:bg-soft hover:text-primary transition"
                      title="Bold (**text**)"
                    >
                      <Bold size={14} />
                    </button>
                    <button
                      onClick={() => insertMarkdown("*", "*", "italic text")}
                      className="rounded-lg p-1.5 hover:bg-soft hover:text-primary transition"
                      title="Italic (*text*)"
                    >
                      <Italic size={14} />
                    </button>
                    <button
                      onClick={() => insertMarkdown("### ", "\n", "Heading")}
                      className="rounded-lg p-1.5 hover:bg-soft hover:text-primary transition"
                      title="Heading (### )"
                    >
                      <Heading size={14} />
                    </button>
                    <div className="h-4 w-px bg-border mx-1" />
                    <button
                      onClick={() => insertMarkdown("- ", "\n", "List item")}
                      className="rounded-lg p-1.5 hover:bg-soft hover:text-primary transition"
                      title="Bullet List (- )"
                    >
                      <List size={14} />
                    </button>
                    <button
                      onClick={() => insertMarkdown("- [ ] ", "\n", "Task item")}
                      className="rounded-lg p-1.5 hover:bg-soft hover:text-primary transition"
                      title="Task Checklist (- [ ] )"
                    >
                      <CheckSquare size={14} />
                    </button>
                    <div className="h-4 w-px bg-border mx-1" />
                    <button
                      onClick={() => insertMarkdown("```\n", "\n```", "code")}
                      className="rounded-lg p-1.5 hover:bg-soft hover:text-primary transition"
                      title="Code block (```)"
                    >
                      <Code size={14} />
                    </button>
                    <button
                      onClick={() => insertMarkdown("> ", "\n", "Quote")}
                      className="rounded-lg p-1.5 hover:bg-soft hover:text-primary transition"
                      title="Quote (> )"
                    >
                      <Quote size={14} />
                    </button>
                    <span className="ml-auto text-[11px] text-muted hidden sm:inline">
                      Press Ctrl+S to save instantly
                    </span>
                  </div>
                )}

                {/* Editor / Preview Body Area */}
                <div className="flex-1 overflow-y-auto p-6">
                  {activeTab === "write" ? (
                    <textarea
                      ref={textareaRef}
                      value={content}
                      onChange={(e) => {
                        setContent(e.target.value);
                        triggerAutoSave(title, e.target.value, tags, isPinned);
                      }}
                      placeholder="Write your notes here in Markdown... (e.g. # Heading, - [ ] Task, **bold**)"
                      className="h-full min-h-[420px] w-full resize-none bg-transparent font-mono text-sm leading-relaxed text-primary outline-none placeholder:text-muted"
                    />
                  ) : (
                    <div className="prose max-w-none text-primary leading-relaxed">
                      {content.trim() ? (
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => (
                              <h1 className="text-2xl font-bold text-primary mt-4 mb-2 pb-1 border-b border-border">
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-xl font-bold text-primary mt-3 mb-2">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-lg font-bold text-primary mt-3 mb-1.5">
                                {children}
                              </h3>
                            ),
                            p: ({ children }) => (
                              <p className="text-sm leading-7 text-primary mb-3">
                                {children}
                              </p>
                            ),
                            ul: ({ children }) => (
                              <ul className="list-disc list-inside text-sm space-y-1 mb-3 text-primary">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal list-inside text-sm space-y-1 mb-3 text-primary">
                                {children}
                              </ol>
                            ),
                            li: ({ children }) => (
                              <li className="text-sm text-primary">{children}</li>
                            ),
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-4 border-accent pl-4 py-1 italic text-muted my-3 bg-soft/30 rounded-r-lg">
                                {children}
                              </blockquote>
                            ),
                            code: ({ children }) => (
                              <code className="rounded bg-elevated border border-border px-1.5 py-0.5 font-mono text-xs text-primary font-semibold">
                                {children}
                              </code>
                            ),
                            pre: ({ children }) => (
                              <pre className="rounded-2xl border border-border bg-base p-4 font-mono text-xs overflow-x-auto text-primary my-3">
                                {children}
                              </pre>
                            ),
                          }}
                        >
                          {content}
                        </ReactMarkdown>
                      ) : (
                        <p className="italic text-muted text-sm">
                          Nothing to preview. Switch to the Write tab to add notes.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* No Note Selected State */
              <div className="flex flex-col items-center justify-center h-full py-24 text-center px-4">
                <div className="rounded-3xl border border-border bg-soft p-5 text-accent mb-4 shadow-sm">
                  <FileText size={36} />
                </div>
                <h3 className="text-lg font-bold text-primary">Select or Create a Note</h3>
                <p className="mt-1 text-xs sm:text-sm text-muted max-w-sm">
                  Choose a note from the left sidebar to edit, or click the button below to start a new document.
                </p>
                <button
                  onClick={handleCreateNote}
                  className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-accent hover:bg-accent-hover px-5 py-2.5 text-xs sm:text-sm font-semibold text-on-accent shadow-sm transition hover:scale-105"
                >
                  <Plus size={16} />
                  <span>Create New Note</span>
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
