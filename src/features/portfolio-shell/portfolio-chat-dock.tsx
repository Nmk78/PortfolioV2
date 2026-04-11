"use client";

import {
  FormEvent,
  type KeyboardEvent,
  type WheelEvent as ReactWheelEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Send, X } from "lucide-react";
import { useEmployerMode } from "@/components/ui/employer-mode-provider";

export type ChatDockMode = "assistant" | "recruiter" | "direct";

const TELEGRAM_USERNAME_RE = /^[a-zA-Z0-9_]{5,32}$/;

function normalizeTelegramUsername(raw: string): string {
  const s = raw.trim();
  return s.startsWith("@") ? s.slice(1) : s;
}

const ASSISTANT_INTRO =
  "Hi! Ask about projects or stack — or switch to Message to send an anonymous note to my Telegram.";
const RECRUITER_INTRO =
  "Recruiter mode is active. Paste a JD for a concise fit summary, strengths, and gaps.";

const DIRECT_INTRO =
  "Anonymous message — delivered to my Telegram. No name or email. Toggle Reply me if you want a response there.";

export function PortfolioChatDock() {
  const { isEmployerMode, setEmployerMode } = useEmployerMode();

  const [dockMode, setDockMode] = useState<ChatDockMode>("assistant");

  const [chatInput, setChatInput] = useState("");
  const [directInput, setDirectInput] = useState("");
  const [jdInput, setJdInput] = useState("");
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [isSendingDirect, setIsSendingDirect] = useState(false);
  const [isDockExpanded, setIsDockExpanded] = useState(false);
  const chatDockRootRef = useRef<HTMLDivElement>(null);
  const composerTextareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);

  const [replyMe, setReplyMe] = useState(false);
  const [telegramUsername, setTelegramUsername] = useState("");

  const [selectedHighlightSkills, setSelectedHighlightSkills] = useState<
    string[]
  >([]);
  const [selectedAnalysisTypes, setSelectedAnalysisTypes] = useState<string[]>(
    [],
  );

  const [chatMessages, setChatMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([
    { role: "assistant", content: ASSISTANT_INTRO },
    { role: "assistant", content: RECRUITER_INTRO },
  ]);

  const [directMessages, setDirectMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([{ role: "assistant", content: DIRECT_INTRO }]);

  const highlightSkillOptions = useMemo(
    () => [
      "React",
      "Next.js",
      "TypeScript",
      "Fullstack",
      "Performance",
      "Accessibility",
    ],
    [],
  );
  const analysisTypeOptions = useMemo(
    () => [
      "Match Analysis",
      "Key Strengths",
      "Impact Metrics",
      "Relevant Work",
    ],
    [],
  );

  const [formError, setFormError] = useState<string | null>(null);

  /** Navbar / mobile pill recruiter toggle stays in sync with dock. */
  useEffect(() => {
    if (isEmployerMode) {
      setDockMode("recruiter");
    } else {
      setDockMode((d) => (d === "recruiter" ? "assistant" : d));
    }
  }, [isEmployerMode]);

  /** Open the panel when switching to Recruiter (from tabs or navbar). */
  useEffect(() => {
    if (dockMode === "recruiter") {
      setIsDockExpanded(true);
    }
  }, [dockMode]);

  /** Collapse when clicking outside the dock (panel + collapsed bar share one root). */
  useEffect(() => {
    if (!isDockExpanded) return;
    function handlePointerDown(event: PointerEvent) {
      const root = chatDockRootRef.current;
      const target = event.target;
      if (!root || !(target instanceof Node)) return;
      if (root.contains(target)) return;
      setIsDockExpanded(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isDockExpanded]);

  /** Escape closes the expanded panel. */
  useEffect(() => {
    if (!isDockExpanded) return;
    function handleKeyDown(event: Event) {
      if (!(event instanceof KeyboardEvent)) return;
      if (event.key === "Escape") {
        event.preventDefault();
        setIsDockExpanded(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDockExpanded]);

  /** Prevent page scroll behind the expanded dock. */
  useEffect(() => {
    if (!isDockExpanded) return;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isDockExpanded]);

  /** Focus composer when the panel opens or mode changes while open. */
  useEffect(() => {
    if (!isDockExpanded) return;
    const id = window.setTimeout(() => {
      composerTextareaRef.current?.focus({ preventScroll: true });
    }, 0);
    return () => clearTimeout(id);
  }, [isDockExpanded, dockMode]);

  function setMode(next: ChatDockMode) {
    setDockMode(next);
    setEmployerMode(next === "recruiter");
    setFormError(null);
  }

  function toggleHighlightSkill(skill: string) {
    setSelectedHighlightSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  }

  function toggleAnalysisType(label: string) {
    setSelectedAnalysisTypes((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label],
    );
  }

  async function submitChatMessage() {
    const prompt = chatInput.trim();
    if (!prompt || isSendingChat) return;

    setChatMessages((prev) => [...prev, { role: "user", content: prompt }]);
    setChatInput("");
    setIsSendingChat(true);

    try {
      const response = await fetch("/api/rag/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: prompt,
          mode: "assistant",
        }),
      });
      if (!response.ok) throw new Error("RAG API unavailable");
      const reply = (await response.text()).trim();
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply || "RAG endpoint connected but no reply returned.",
        },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "RAG API is not connected yet. Endpoint contract: /api/rag/chat.",
        },
      ]);
    } finally {
      setIsSendingChat(false);
    }
  }

  async function submitRecruiterAnalysis() {
    const jd = jdInput.trim();
    if (!jd || isSendingChat) return;

    const skillsNote =
      selectedHighlightSkills.length > 0
        ? `Must-highlight skills: ${selectedHighlightSkills.join(", ")}.\n`
        : "";
    const analysisNote =
      selectedAnalysisTypes.length > 0
        ? `Emphasize: ${selectedAnalysisTypes.join(", ")}.\n`
        : "";

    const recruiterPrompt = `${skillsNote}${analysisNote}Analyze this job description for candidate fit. Keep it concise and impressive for recruiter review. Return: 1) fit summary, 2) strongest matching evidence, 3) likely gaps, 4) recommended interview focus.\n\nJob Description:\n${jd}`;

    setChatMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: `Analyze this JD:\n${jd.slice(0, 260)}${jd.length > 260 ? "..." : ""}`,
      },
    ]);
    setJdInput("");
    setIsSendingChat(true);

    try {
      const response = await fetch("/api/rag/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: recruiterPrompt,
          mode: "recruiter",
          topK: 10,
        }),
      });
      if (!response.ok) throw new Error("Recruiter mode unavailable");
      const reply = (await response.text()).trim();
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            reply ||
            "Recruiter mode ran, but no response text was returned.",
        },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Recruiter mode is not connected yet. Verify /api/rag/chat is available.",
        },
      ]);
    } finally {
      setIsSendingChat(false);
    }
  }

  async function submitDirectMessage() {
    const message = directInput.trim();
    if (!message || isSendingDirect) return;

    let tgUser = "";
    if (replyMe) {
      tgUser = normalizeTelegramUsername(telegramUsername);
      if (!tgUser) {
        setFormError("Add your Telegram username, or turn off Reply me.");
        return;
      }
      if (!TELEGRAM_USERNAME_RE.test(tgUser)) {
        setFormError(
          "Invalid Telegram username (5–32 letters, numbers, underscores).",
        );
        return;
      }
    }
    setFormError(null);

    setDirectMessages((prev) => [...prev, { role: "user", content: message }]);
    setDirectInput("");
    setIsSendingDirect(true);

    try {
      const res = await fetch("/api/contact/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          replyRequested: replyMe,
          ...(replyMe ? { telegramUsername: tgUser } : {}),
        }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        setDirectMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.error ?? "Could not send. Try again.",
          },
        ]);
        return;
      }
      setDirectMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Message sent — I'll get back to you when I can.",
        },
      ]);
      setFormError(null);
      if (replyMe) setTelegramUsername("");
    } catch {
      setDirectMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Network error. Check your connection and try again.",
        },
      ]);
    } finally {
      setIsSendingDirect(false);
    }
  }

  function handleJdAnalyze() {
    void submitRecruiterAnalysis();
  }

  function handleBottomFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (dockMode === "recruiter") return;
    if (dockMode === "direct") {
      void submitDirectMessage();
      return;
    }
    void submitChatMessage();
  }

  function handleBottomInputKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (dockMode === "recruiter") return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (dockMode === "direct") void submitDirectMessage();
      else void submitChatMessage();
    }
  }

  const panelMessages = dockMode === "direct" ? directMessages : chatMessages;
  const isThinking = dockMode === "direct" ? isSendingDirect : isSendingChat;

  /** Keep message list pinned to latest unless user scrolled up. */
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el || !isDockExpanded) return;
    if (!shouldAutoScrollRef.current) return;
    el.scrollTop = el.scrollHeight;
  }, [panelMessages.length, isThinking, isDockExpanded, dockMode]);

  const dockTitle =
    dockMode === "recruiter"
      ? "AI Job Match Analysis"
      : dockMode === "direct"
        ? "Direct message"
        : "Portfolio assistant";

  const dockSubtitle =
    dockMode === "recruiter"
      ? "Paste a JD for a direct fit analysis with recruiter-ready language."
      : dockMode === "direct"
        ? "Anonymous — no account. Delivered to Telegram."
        : "Ask about work, stack, or projects — replies show above.";

  const composerValue =
    dockMode === "recruiter"
      ? jdInput
      : dockMode === "direct"
        ? directInput
        : chatInput;

  function setComposerValue(v: string) {
    if (dockMode === "recruiter") setJdInput(v);
    else if (dockMode === "direct") setDirectInput(v);
    else setChatInput(v);
  }

  const placeholder =
    dockMode === "recruiter"
      ? "Paste the full job description here…"
      : dockMode === "direct"
        ? "Your message… Enter to send, Shift+Enter for a new line"
        : "Ask about projects or stack — Enter sends, Shift+Enter for a new line";

  const sendDisabled =
    dockMode === "recruiter"
      ? isSendingChat || !jdInput.trim()
      : dockMode === "direct"
        ? isSendingDirect || !directInput.trim()
        : isSendingChat || !chatInput.trim();

  function handleMessagesScroll() {
    const el = messagesContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    shouldAutoScrollRef.current = distanceFromBottom < 24;
  }

  function handlePanelWheel(event: ReactWheelEvent<HTMLDivElement>) {
    const messagesEl = messagesContainerRef.current;
    if (!messagesEl) return;

    const target = event.target;
    if (target instanceof Element) {
      const isComposerField = target.closest("textarea, input");
      if (isComposerField && !target.closest("[data-chat-messages]")) return;
    }

    if (messagesEl.scrollHeight <= messagesEl.clientHeight) return;

    event.preventDefault();
    messagesEl.scrollTop += event.deltaY;
    handleMessagesScroll();
  }

  const srComposerLabel =
    dockMode === "recruiter"
      ? "Job description"
      : dockMode === "direct"
        ? "Direct message"
        : "Message — Enter to send, Shift+Enter for new line";

  const activeModeLabel =
    dockMode === "recruiter"
      ? "Recruiter mode"
      : dockMode === "direct"
        ? "Direct mode"
        : "Assistant mode";

  const statusBadgeText =
    dockMode === "direct"
      ? "Private delivery to Telegram"
      : dockMode === "recruiter"
        ? "Context-aware fit summary"
        : "Portfolio knowledge enabled";

  const composerForm = (
    <form onSubmit={handleBottomFormSubmit} className={`w-full min-w-0 ${isDockExpanded ? "opacity-100" : "opacity-90 backdrop-blur-2xl"} transition-opacity duration-200`}>
      <label htmlFor="chat-dock-composer" className="sr-only">
        {srComposerLabel}
      </label>
      {/* Single inset surface — avoids double border vs outer card */}
      <div className="relative rounded-lg border border-foreground/10 bg-background/85 py-1.5 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.03)] transition-[border-color,box-shadow] duration-200 focus-within:border-primary/40 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] dark:bg-foreground/5">
        <textarea
          ref={composerTextareaRef}
          id="chat-dock-composer"
          name="dockComposer"
          rows={dockMode === "recruiter" && isDockExpanded ? 4 : 2}
          value={composerValue}
          onChange={(e) => setComposerValue(e.target.value)}
          onKeyDown={handleBottomInputKeyDown}
          onFocus={() => setIsDockExpanded(true)}
          placeholder={placeholder}
          className={`field-sizing-content w-full min-w-0 resize-none rounded-md border-0 bg-transparent py-2.5 pl-3 font-sans text-sm leading-relaxed text-foreground outline-none transition-shadow duration-200 placeholder:text-theme-subtle focus-visible:ring-0 focus-visible:ring-primary/35 focus-visible:ring-offset-0 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-foreground/20 hover:[&::-webkit-scrollbar-thumb]:bg-foreground/30 ${
            dockMode === "recruiter"
              ? isDockExpanded
                ? "min-h-32 max-h-56 overflow-y-auto pr-12 md:min-h-36"
                : "min-h-14 max-h-56 overflow-y-auto pr-12"
              : "min-h-14 max-h-44 overflow-y-auto pr-12"
          }`}
        />
        {dockMode === "recruiter" ? (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleJdAnalyze}
            disabled={!jdInput.trim()}
            className="absolute bottom-2 right-2 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-accent/85 text-white shadow-sm transition-[background-color,opacity,transform] duration-200 hover:bg-accent active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-accent/35 disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Analyze job description"
          >
            <Send className="h-4 w-4 text-white" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="submit"
            onMouseDown={(e) => e.preventDefault()}
            disabled={sendDisabled}
            className="absolute bottom-2 right-2 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary/90 text-white shadow-sm transition-[background-color,opacity,transform] duration-200 hover:bg-primary active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-primary/35 disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Send message"
          >
            <Send className="h-4 w-4 text-white" aria-hidden="true" />
          </button>
        )}
      </div>
    </form>
  );

  return (
    <div
      ref={chatDockRootRef}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex w-[min(700px,calc(100%-1.5rem))] max-w-5xl flex-col gap-2"
    >
      {isDockExpanded && (
        <div
          onWheelCapture={handlePanelWheel}
          className={`chat-dock-panel-enter relative w-full max-w-5xl rounded-2xl border border-foreground/15 bg-linear-to-b from-background/95 via-background/92 to-background/90 shadow-2xl backdrop-blur-xl transition-[box-shadow,transform] duration-300 ease-out ${
            dockMode === "recruiter" ? "chat-dock-recruiter-glow" : ""
          }`}
        >
          <div className="p-4 md:p-5">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 pr-2">
                <h3 className="font-display text-lg font-semibold tracking-tight text-foreground md:text-xl">
                  {dockTitle}
                </h3>
                <p className="mt-1.5 max-w-md font-sans text-xs leading-relaxed text-theme-muted md:text-[0.8125rem]">
                  {dockSubtitle}
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-foreground/15 bg-background/70 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-theme-subtle">
                    {activeModeLabel}
                  </span>
                  <span className="rounded-full border border-foreground/10 bg-foreground/5 px-2.5 py-1 font-sans text-[10px] font-medium text-theme-muted">
                    {statusBadgeText}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 ml-auto items-center gap-1.5">
                <div
                  className="relative isolate flex min-h-10 shrink-0 gap-1 rounded-full border border-foreground/12 bg-background/70 p-1 shadow-sm"
                  role="tablist"
                  aria-label="Chat mode"
                >
                  {(
                    [
                      ["assistant", "Assistant"],
                      ["recruiter", "Recruiter"],
                      ["direct", "Message"],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      aria-selected={dockMode === id}
                      onClick={() => setMode(id)}
                      className={`relative z-10 min-h-6 whitespace-nowrap rounded-full px-2 py-1 text-center font-sans text-[9px] font-semibold uppercase tracking-wide transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/70 ${
                        dockMode === id
                          ? id === "recruiter"
                            ? "bg-purple-400/50 text-purple-800 dark:text-purple-900"
                            : id === "direct"
                              ? "bg-primary/20 text-primary"
                              : "bg-foreground/12 text-foreground"
                          : "text-theme-muted hover:bg-foreground/5 hover:text-foreground"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setIsDockExpanded(false)}
                  className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-foreground/10 bg-background/80 text-foreground shadow-sm transition-colors duration-200 hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label="Close chat panel"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>


            {dockMode === "direct" && (
              <div className="mb-4 flex flex-col gap-3 border-b ml-auto border-foreground/10 pb-4 sm:flex-row sm:items-center sm:justify-end">
                {/* <span
                  id="dock-reply-label"
                  className="font-mono text-[10px] font-bold uppercase tracking-widest text-theme-subtle"
                >
                  Reply me
                </span> */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <div className="flex min-w-0 max-w-56 items-center gap-1 rounded-lg border border-foreground/12 bg-background/60 px-2 py-1.5">
                      <span className="shrink-0 font-mono text-xs text-theme-muted">
                        @
                      </span>
                      <input
                        type="text"
                        disabled={!replyMe}
                        value={telegramUsername}
                        onChange={(e) =>
                          setTelegramUsername(e.target.value.replace(/\s/g, ""))
                        }
                        placeholder="telegram username"
                        className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-theme-subtle disabled:cursor-not-allowed disabled:opacity-50"
                        autoComplete="username"
                      />
                    </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={replyMe}
                    aria-labelledby="dock-reply-label"
                    onClick={() => {
                      setReplyMe((v) => {
                        const next = !v;
                        if (!next) setTelegramUsername("");
                        return next;
                      });
                      setFormError(null);
                    }}
                    className={`recruiter-switch cursor-pointer shrink-0 border-0 p-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${replyMe ? "is-on" : ""}`}
                  />
                </div>
              </div>
            )}

            {formError && dockMode === "direct" ? (
              <p
                className="mb-2 text-sm text-red-600 dark:text-red-400"
                role="alert"
              >
                {formError}
              </p>
            ) : null}

            <div
              className="flex flex-col overflow-hidden rounded-xl border-0 border-foreground/15 bg-foreground/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] dark:bg-background/50"
              aria-live="polite"
              aria-relevant="additions"
            >
              <div
                ref={messagesContainerRef}
                onScroll={handleMessagesScroll}
                data-chat-messages
                className="h-64 space-y-3 overflow-y-auto overscroll-contain bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.2)_1px,transparent_0)] bg-size-[16px_16px] px-2 py-3 pr-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 hover:[&::-webkit-scrollbar-thumb]:bg-foreground/30 md:h-80 md:px-3 md:py-4 md:pr-2"
              >
                {panelMessages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={
                      message.role === "user"
                        ? "ml-auto w-fit max-w-[min(85%,19rem)] rounded-2xl rounded-br-md border border-primary/30 bg-linear-to-br from-primary to-primary/85 px-3.5 py-2.5 font-sans text-sm leading-relaxed text-primary-foreground shadow-[0_8px_22px_rgba(59,130,246,0.3)]"
                        : "w-fit max-w-[min(90%,23rem)] rounded-2xl rounded-bl-md border border-foreground/20 bg-linear-to-br from-background/95 to-background/75 px-3.5 py-2.5 font-sans text-sm leading-relaxed text-foreground shadow-[0_8px_18px_rgba(15,23,42,0.1)]"
                    }
                  >
                    <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-wide opacity-65">
                      {message.role === "user" ? "You" : dockMode === "direct" ? "Delivery" : "Assistant"}
                    </p>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                ))}
                {isThinking ? (
                  <div className="w-fit max-w-[min(90%,22rem)] rounded-2xl rounded-bl-md border border-foreground/20 bg-linear-to-br from-background/95 to-background/75 px-3.5 py-2.5 font-sans text-sm leading-relaxed text-theme-muted shadow-[0_8px_18px_rgba(15,23,42,0.1)]">
                    <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-wide opacity-65">
                      {dockMode === "direct" ? "Delivery" : "Assistant"}
                    </p>
                    {dockMode === "direct" ? "Sending…" : "Thinking…"}
                  </div>
                ) : null}
              </div>

              <div className="border-t border-foreground/10 bg-background/40 px-3 py-3 md:px-4 md:pb-4 md:pt-3 dark:bg-background/30">
                {composerForm}
              </div>
            </div>
          </div>
        </div>
      )}

      {!isDockExpanded ? <div className="w-full">{composerForm}</div> : null}
    </div>
  );
}
