import { motion, useReducedMotion } from "framer-motion";
import { Copy, Pencil, RefreshCw, Share2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { Message } from "../../data/messages";
import Logo from "../icons/Logo";
import AttachmentPreview from "./AttachmentPreview";
import { useLocale } from "../../context/LocaleContext";

interface MessageBubbleProps {
  message: Message;
  regenerating?: boolean;
  onCopy?: (message: Message) => void;
  onShare?: (message: Message) => void;
  onEdit?: (id: string, content: string) => void;
  onRegenerate?: (id: string) => void;
}

const messageActionClass = "grid size-8 cursor-pointer place-items-center rounded-lg border border-white/[0.07] bg-white/[0.035] text-white/50 transition duration-200 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50";

export default function MessageBubble({
  message,
  regenerating = false,
  onCopy,
  onShare,
  onEdit,
  onRegenerate,
}: MessageBubbleProps) {
  const { t } = useLocale();
  const reduceMotion = useReducedMotion();
  const isUser = message.role === "user";
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(message.content);

  const saveEdit = (event: FormEvent) => {
    event.preventDefault();
    const next = draft.trim();
    if (!next) return;
    onEdit?.(message.id, next);
    setEditing(false);
  };

  const actions = (
    <div role="toolbar" aria-label={t("messageActions")} className="flex items-center gap-1 opacity-100 transition-opacity duration-200 md:opacity-0 md:group-hover/message:opacity-100 md:group-focus-within/message:opacity-100">
      <button type="button" aria-label={t("copyText")} title={t("copyText")} onClick={() => onCopy?.(message)} className={messageActionClass}>
        <Copy className="size-3.5" aria-hidden="true" />
      </button>
      <button type="button" aria-label={t("share")} title={t("share")} onClick={() => onShare?.(message)} className={messageActionClass}>
        <Share2 className="size-3.5" aria-hidden="true" />
      </button>
      {isUser && onEdit && (
        <button
          type="button"
          aria-label={t("editPrompt")}
          title={t("editPrompt")}
          onClick={() => {
            setDraft(message.content);
            setEditing(true);
          }}
          className={messageActionClass}
        >
          <Pencil className="size-3.5" aria-hidden="true" />
        </button>
      )}
      {!isUser && onRegenerate && (
        <button
          type="button"
          aria-label={regenerating ? t("regenerating") : t("regenerateAnswer")}
          title={regenerating ? t("regenerating") : t("regenerateAnswer")}
          disabled={regenerating}
          onClick={() => onRegenerate(message.id)}
          className={`${messageActionClass} disabled:cursor-wait disabled:opacity-50`}
        >
          <RefreshCw className={`size-3.5 ${regenerating && !reduceMotion ? "animate-spin" : ""}`} aria-hidden="true" />
        </button>
      )}
    </div>
  );

  return (
    <div
      className={`group/message relative isolate flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      {isUser ? (
        <div className="relative flex max-w-[80%] flex-col items-end gap-2">
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex max-w-full flex-wrap justify-end gap-2">
              {message.attachments.map((a) => (
                <AttachmentPreview key={a.id} attachment={a} />
              ))}
            </div>
          )}
          {editing ? (
            <form onSubmit={saveEdit} className="w-[min(80vw,520px)] max-w-full rounded-2xl border border-white/15 bg-white/[0.06] p-3 shadow-[0_12px_40px_rgb(0_0_0/0.18)]">
              <textarea
                autoFocus
                aria-label={t("editPrompt")}
                dir="auto"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={Math.min(5, Math.max(2, draft.split("\n").length))}
                className="max-h-40 min-h-14 w-full resize-y bg-transparent text-start text-[15px] leading-6 text-white outline-none placeholder:text-white/40"
              />
              <div className="mt-2 flex justify-end gap-2 border-t border-white/[0.08] pt-2">
                <button type="button" onClick={() => setEditing(false)} className="rounded-lg px-3 py-1.5 text-[12px] font-medium text-white/60 transition hover:bg-white/[0.06] hover:text-white">{t("cancel")}</button>
                <button type="submit" disabled={!draft.trim()} className="rounded-lg bg-white/15 px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-40">{t("save")}</button>
              </div>
            </form>
          ) : message.content && (
            <p dir="auto" className="m-0 max-w-full whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-white/15 px-4 py-2.5 text-[16px] leading-6 text-white rtl:rounded-br-2xl rtl:rounded-bl-md">
              {message.content}
            </p>
          )}
          {!editing && actions}
        </div>
      ) : (
        <div className="relative flex max-w-[85%] items-start gap-3">
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-glass">
            <Logo className="h-[18px] w-[13px] text-white" />
          </span>
          <div className="relative min-w-0">
            <p dir="auto" className={`m-0 whitespace-pre-wrap break-words pt-1 text-[16px] leading-6 text-white/90 transition-opacity ${regenerating ? "opacity-55" : ""}`}>
              {message.content}
            </p>
            {regenerating && <p role="status" className="m-0 mt-1 text-[11px] text-white/45">{t("regenerating")}</p>}
            <div className="mt-1">{actions}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export function TypingIndicator() {
  const { t } = useLocale();
  const reduceMotion = useReducedMotion();
  return (
    <div className="flex items-center gap-3 py-1" role="status" aria-label={t("typing")}>
      <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-white/[0.035] shadow-[0_0_24px_rgb(255_255_255/0.08)]">
        <motion.span
          aria-hidden="true"
          animate={reduceMotion ? { rotate: 0 } : { rotate: 360 }}
          transition={reduceMotion ? undefined : { duration: 3.2, ease: "linear", repeat: Infinity }}
          className="absolute inset-[1px] rounded-full border border-white/[0.12] border-t-white/85 border-r-white/45"
        >
          <span className="absolute left-1/2 top-[-2px] size-1.5 -translate-x-1/2 rounded-full bg-white shadow-[0_0_8px_rgb(255_255_255/0.9)]" />
        </motion.span>
        <motion.span
          aria-hidden="true"
          animate={reduceMotion ? { rotate: 0 } : { rotate: -360 }}
          transition={reduceMotion ? undefined : { duration: 4.8, ease: "linear", repeat: Infinity }}
          className="absolute inset-[5px] rounded-full border border-dashed border-white/15"
        >
          <span className="absolute bottom-[-1px] right-[3px] size-1 rounded-full bg-amber-100 shadow-[0_0_7px_rgb(255_255_255/0.8)]" />
        </motion.span>
        <motion.span
          animate={reduceMotion ? { scale: 1, opacity: 1 } : { scale: [0.86, 1.08, 0.86], opacity: [0.72, 1, 0.72] }}
          transition={reduceMotion ? undefined : { duration: 1.7, ease: "easeInOut", repeat: Infinity }}
          className="relative z-10 grid size-7 place-items-center rounded-full border border-white/10 bg-white/[0.07]"
        >
          <Logo className="h-[16px] w-[12px] text-white drop-shadow-[0_0_6px_rgb(255_255_255/0.6)]" />
        </motion.span>
      </span>
      <div className="flex items-center gap-2 text-[12px] font-medium text-white/50">
        <span>{t("thinkingLabel")}</span>
        <span className="flex items-center gap-1" aria-hidden="true">
          {[0, 1, 2].map((dot) => (
            <motion.span
              key={dot}
              animate={reduceMotion ? { opacity: 0.7 } : { opacity: [0.25, 0.9, 0.25], y: [0, -3, 0] }}
              transition={reduceMotion ? undefined : { duration: 0.9, delay: dot * 0.13, ease: "easeInOut", repeat: Infinity }}
              className="size-1 rounded-full bg-white/80"
            />
          ))}
        </span>
      </div>
    </div>
  );
}
