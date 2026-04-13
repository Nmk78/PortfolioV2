"use client";

import {
  FormEvent,
  type KeyboardEvent,
  type WheelEvent as ReactWheelEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Send, X } from "lucide-react";
import { useEmployerMode } from "@/components/ui/employer-mode-provider";
import { RAG_EMPTY_REPLY_FALLBACK } from "@/lib/rag/provider-errors";

export type ChatDockMode = "assistant" | "recruiter" | "direct";

function normalizeTelegramUsername(raw: string): string {
  const s = raw.trim();
  return s.startsWith("@") ? s.slice(1) : s;
}

/** First valid @handle in the text (5–32 chars, Telegram rules). */
const TG_HANDLE_IN_MESSAGE = /@([a-zA-Z0-9_]{5,32})\b/;

let messageResponse = "Message sent.";
function parseDirectMessageForTelegram(raw: string):
  | { ok: true; message: string; replyRequested: boolean; telegramUsername: string }
  | { ok: false; error: string } {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, error: "Message is empty." };

  const match = trimmed.match(TG_HANDLE_IN_MESSAGE);
  const replyRequested = Boolean(match);
  const telegramUsername = match ? normalizeTelegramUsername(match[1]!) : "";

  let message = trimmed;
  if (match) {

    messageResponse = `Message sent — I'll get back to you when I can. @${telegramUsername}`;
    message = trimmed.replace(match[0], "").trim();
    message = message.replace(/\n{3,}/g, "\n\n").trim();
  }

  if (!message) {
    return {
      ok: false,
      error:
        "Write your note in the message. Add @YourTelegramUsername if you want a reply on Telegram.",
    };
  }

  return {
    ok: true,
    message,
    replyRequested,
    telegramUsername,
  };
}

const ASSISTANT_INTRO =
  "Hi! Ask about projects or stack — or switch to Message to send an anonymous note to my Telegram.";
const RECRUITER_INTRO =
  "Recruiter mode is active. Paste a JD for a concise fit summary, strengths, and gaps.";

const DIRECT_INTRO =
  "Anonymous message — delivered to my Telegram. Add @YourTelegramUsername anywhere in your message if you want a reply there; otherwise it stays one-way.";

const RAG_TOP_K = 10;

async function readRagChatErrorMessage(response: Response): Promise<string> {
  const fallback = "Could not get an answer. Please try again.";
  try {
    const data = (await response.json()) as { error?: string };
    if (typeof data.error === "string" && data.error.trim()) {
      return data.error.trim();
    }
  } catch {
    /* ignore */
  }
  return fallback;
}

export function PortfolioChatDock() {
  const { isEmployerMode, setEmployerMode } = useEmployerMode();

  const [dockMode, setDockMode] = useState<ChatDockMode>("assistant");

  const [chatInput, setChatInput] = useState("");
  const [directInput, setDirectInput] = useState("");
  const [jdInput, setJdInput] = useState("");
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [isSendingDirect, setIsSendingDirect] = useState(false);
  const [isDockExpanded, setIsDockExpanded] = useState(false);
  const composerTextareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);

  const initialChatMessage = isEmployerMode
    ? { role: "assistant", content: RECRUITER_INTRO }
    : { role: "assistant", content: ASSISTANT_INTRO };

  const [chatMessages, setChatMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([initialChatMessage as { role: "user" | "assistant"; content: string }]);

  const [directMessages, setDirectMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([{ role: "assistant", content: DIRECT_INTRO }]);

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
          topK: RAG_TOP_K,
        }),
      });
      if (!response.ok) {
        const errText = await readRagChatErrorMessage(response);
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: errText },
        ]);
        return;
      }

      setChatMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const reader = response.body?.getReader();
      if (!reader) {
        const reply = (await response.text()).trim();
        setChatMessages((prev) => {
          const next = [...prev];
          const i = next.length - 1;
          const last = next[i];
          if (last?.role === "assistant") {
            next[i] = {
              ...last,
              content: reply || RAG_EMPTY_REPLY_FALLBACK,
            };
          }
          return next;
        });
        return;
      }

      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        const chunk = acc;
        setChatMessages((prev) => {
          const next = [...prev];
          const i = next.length - 1;
          const last = next[i];
          if (last?.role === "assistant") {
            next[i] = { ...last, content: chunk };
          }
          return next;
        });
      }
      acc += decoder.decode();
      const finalText = acc.trim();
      setChatMessages((prev) => {
        const next = [...prev];
        const i = next.length - 1;
        const last = next[i];
        if (last?.role === "assistant") {
          next[i] = {
            ...last,
            content: finalText || RAG_EMPTY_REPLY_FALLBACK,
          };
        }
        return next;
      });
    } catch {
      setChatMessages((prev) => {
        const failText =
          "Could not reach the assistant. Check your connection and try again.";
        const next = [...prev];
        const i = next.length - 1;
        const last = next[i];
        if (last?.role === "assistant" && last.content === "") {
          next[i] = { ...last, content: failText };
          return next;
        }
        return [...prev, { role: "assistant", content: failText }];
      });
    } finally {
      setIsSendingChat(false);
    }
  }

  async function submitRecruiterAnalysis() {
    const jd = jdInput.trim();
    if (!jd || isSendingChat) return;

    const recruiterPrompt = `Analyze this job description for candidate fit. Keep it concise and impressive for recruiter review. Return: 1) fit summary, 2) strongest matching evidence, 3) likely gaps, 4) recommended interview focus.\n\nJob Description:\n${jd}`;

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
          topK: RAG_TOP_K,
        }),
      });
      if (!response.ok) {
        const errText = await readRagChatErrorMessage(response);
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: errText },
        ]);
        return;
      }

      setChatMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const reader = response.body?.getReader();
      if (!reader) {
        const reply = (await response.text()).trim();
        setChatMessages((prev) => {
          const next = [...prev];
          const i = next.length - 1;
          const last = next[i];
          if (last?.role === "assistant") {
            next[i] = {
              ...last,
              content: reply || RAG_EMPTY_REPLY_FALLBACK,
            };
          }
          return next;
        });
        return;
      }

      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        const chunk = acc;
        setChatMessages((prev) => {
          const next = [...prev];
          const i = next.length - 1;
          const last = next[i];
          if (last?.role === "assistant") {
            next[i] = { ...last, content: chunk };
          }
          return next;
        });
      }
      acc += decoder.decode();
      const finalText = acc.trim();
      setChatMessages((prev) => {
        const next = [...prev];
        const i = next.length - 1;
        const last = next[i];
        if (last?.role === "assistant") {
          next[i] = {
            ...last,
            content: finalText || RAG_EMPTY_REPLY_FALLBACK,
          };
        }
        return next;
      });
    } catch {
      setChatMessages((prev) => {
        const failText =
          "Could not reach recruiter analysis. Check your connection and try again.";
        const next = [...prev];
        const i = next.length - 1;
        const last = next[i];
        if (last?.role === "assistant" && last.content === "") {
          next[i] = { ...last, content: failText };
          return next;
        }
        return [...prev, { role: "assistant", content: failText }];
      });
    } finally {
      setIsSendingChat(false);
    }
  }

  async function submitDirectMessage() {
    const raw = directInput.trim();
    if (!raw || isSendingDirect) return;

    const parsed = parseDirectMessageForTelegram(raw);
    if (!parsed.ok) {
      setDirectMessages((prev) => [
        ...prev,
        { role: "assistant", content: parsed.error },
      ]);
      return;
    }

    setDirectMessages((prev) => [...prev, { role: "user", content: raw }]);
    setDirectInput("");
    setIsSendingDirect(true);

    try {
      const res = await fetch("/api/contact/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: parsed.message,
          replyRequested: parsed.replyRequested,
          ...(parsed.replyRequested
            ? { telegramUsername: parsed.telegramUsername }
            : {}),
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
          content: messageResponse,
        },
      ]);
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
  }, [panelMessages, isThinking, isDockExpanded, dockMode]);

  const dockTitle =
    dockMode === "recruiter"
      ? "AI Job Match Analysis"
      : dockMode === "direct"
        ? "Direct message"
        : "Portfolio assistant";

  const dockSubtitle =
    dockMode === "recruiter"
      ? "Paste a JD for a direct fit analysis with recruiter mode."
      : dockMode === "direct"
        ? "Anonymous — no account. Include @username in your text if you want a Telegram reply."
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
        ? "Your message… add @username for a reply. Enter sends."
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

    /** Wheel over the message list: overflow-y-auto handles scroll (see Lenis allowNestedScroll). */
    if (target instanceof Element && target.closest("[data-chat-messages]")) {
      return;
    }

    if (messagesEl.scrollHeight <= messagesEl.clientHeight) return;

    const { scrollTop, scrollHeight, clientHeight } = messagesEl;
    const deltaY = event.deltaY;
    const atTop = scrollTop <= 0;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

    if (deltaY < 0 && atTop) return;
    if (deltaY > 0 && atBottom) return;

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

  const composerForm = (
    <form
      onSubmit={handleBottomFormSubmit}
      className={`w-full min-w-0 ${isDockExpanded ? "opacity-100" : "opacity-90"} transition-opacity duration-200`}
    >
      <label htmlFor="chat-dock-composer" className="sr-only">
        {srComposerLabel}
      </label>
      {/* Single inset surface — avoids double border vs outer card */}
      <div className="relative rounded-xl border border-foreground/12 bg-secondary/35 py-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] transition-[border-color,box-shadow,background-color] duration-200 focus-within:border-primary/45 focus-within:bg-background focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.12)] dark:bg-secondary/25 dark:shadow-none dark:focus-within:bg-background/80">
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
          className={`field-sizing-content w-full min-w-0 mt-3 resize-none rounded-[inherit] border-0 bg-transparent py-0 pl-3.5 pr-14 font-sans text-sm leading-relaxed text-foreground outline-none transition-shadow duration-200 placeholder:text-theme-subtle focus-visible:ring-0 focus-visible:ring-primary/35 focus-visible:ring-offset-0 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-foreground/20 hover:[&::-webkit-scrollbar-thumb]:bg-foreground/30 ${
            dockMode === "recruiter"
              ? isDockExpanded
                ? "min-h-21 max-h-56 overflow-y-auto"
                : "min-h-6 max-h-56 overflow-y-auto"
              : "min-h-6 max-h-44 overflow-y-auto"
          }`}
        />
        {dockMode === "recruiter" ? (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleJdAnalyze}
            disabled={!jdInput.trim()}
            className="absolute bottom-0 right-2 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-accent transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Analyze job description"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="submit"
            onMouseDown={(e) => e.preventDefault()}
            disabled={sendDisabled}
            className="absolute bottom-0 right-2 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-primary transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </form>
  );

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex w-[min(700px,calc(100%-1.5rem))] max-w-5xl flex-col gap-2">
      {isDockExpanded && (
        <div
          onWheelCapture={handlePanelWheel}
          className={`chat-dock-panel-enter relative w-full max-w-5xl rounded-2xl border border-foreground/15 bg-background shadow-2xl transition-[box-shadow,transform] duration-300 ease-out ${
            dockMode === "recruiter" ? "chat-dock-recruiter-glow" : ""
          }`}
        >
          <div className="p-4 md:p-6">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 max-w-[min(100%,26rem)] pr-2">
                <h3 className="font-display text-lg font-semibold tracking-tight text-balance text-foreground md:text-xl">
                  {dockTitle}
                </h3>
                <p className="mt-2 max-w-prose text-pretty font-sans text-xs leading-relaxed text-theme-muted md:text-[0.8125rem]">
                  {dockSubtitle}
                </p>
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
                            ? "bg-purple-200/50 text-purple-800"
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

            <div
              className="relative flex flex-col overflow-hidden rounded-xl border border-foreground/12 bg-secondary/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] dark:bg-secondary/15 dark:shadow-none"
              aria-live="polite"
              aria-relevant="additions"
            >
              <div
                ref={messagesContainerRef}
                onScroll={handleMessagesScroll}
                data-chat-messages
                className="relative flex h-[min(22rem,42svh)] max-h-[min(28rem,52svh)] scroll-smooth flex-col gap-4 overflow-y-auto overscroll-contain px-3 py-4 [scrollbar-gutter:stable] [scrollbar-width:thin] md:h-[min(24rem,45svh)] md:max-h-[min(30rem,55svh)] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-foreground/18 hover:[&::-webkit-scrollbar-thumb]:bg-foreground/28 md:px-4 md:py-5"
              >
                {panelMessages.map((message, index) => {
                  const isUser = message.role === "user";
                  const speakerLabel = isUser
                    ? "You"
                    : dockMode === "direct"
                      ? "Delivery"
                      : "Nay Myo Khant";
                  return (
                    <div
                      key={`${message.role}-${index}`}
                      className={`flex min-w-0 flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}
                    >
                      <span
                        className={`max-w-[min(92%,26rem)] px-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-theme-muted ${isUser ? "text-end text-primary" : "text-start"}`}
                      >
                        {speakerLabel}
                      </span>
                      <div
                        className={
                          isUser
                            ? "max-w-[min(92%,24rem)] rounded-2xl rounded-br-sm bg-primary/80 px-3.5 py-2.5 text-sm leading-relaxed text-primary-foreground shadow-[0_6px_20px_rgba(59,130,246,0.28)]"
                            : "max-w-[min(95%,26rem)] rounded-2xl rounded-bl-md border border-foreground/12 bg-background/95 px-3.5 py-2.5 text-sm leading-relaxed text-foreground shadow-sm ring-1 ring-foreground/4 dark:bg-background/90"
                        }
                      >
                        <p className={`whitespace-pre-wrap wrap-break-word ${isUser ? "text-white" : "text-foreground"}`}>
                          {message.content}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {isThinking &&
                (dockMode === "direct" ||
                  panelMessages[panelMessages.length - 1]?.role === "user") ? (
                  <div className="flex min-w-0 flex-col items-start gap-1.5">
                    <span className="px-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-theme-muted">
                      {dockMode === "direct" ? "Delivery" : "Assistant"}
                    </span>
                    <div className="flex max-w-[min(95%,26rem)] items-center gap-2 rounded-2xl rounded-bl-md border border-foreground/12 bg-background/95 px-3.5 py-2.5 text-sm text-theme-muted shadow-sm ring-1 ring-foreground/4 dark:bg-background/90">
                      <span className="inline-flex gap-1" aria-hidden="true">
                        <span className="h-1 w-1 motion-safe:animate-bounce rounded-full bg-foreground/35 [animation-delay:-0.2s]" />
                        <span className="h-1 w-1 motion-safe:animate-bounce rounded-full bg-foreground/35 [animation-delay:-0.1s]" />
                        <span className="h-1 w-1 motion-safe:animate-bounce rounded-full bg-foreground/35" />
                      </span>

                    </div>
                  </div>
                ) : null}
              </div>

              <div className="border-t border-foreground/10 bg-background/80 px-3 py-3 backdrop-blur-[2px] md:px-4 md:pb-4 md:pt-3 dark:bg-background/60">
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
