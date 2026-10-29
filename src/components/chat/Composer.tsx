import { useEffect, useRef, useState, type ChangeEvent, type DragEvent, type FormEvent, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mic, Paperclip, SendHorizontal, Square } from "lucide-react";
import {
  ACCEPTED_TYPES,
  MAX_ATTACHMENTS,
  MAX_FILE_SIZE,
  type Attachment,
} from "../../data/messages";
import { useSpeechInput } from "../../hooks/useSpeechInput";
import Logo from "../icons/Logo";
import AttachmentPreview from "./AttachmentPreview";
import { useLocale } from "../../context/LocaleContext";

interface Props {
  compact?: boolean;
  thinking?: boolean;
  onSend?: (message: string, attachments: Attachment[]) => void;
}

const toolButton =
  "flex size-9 cursor-pointer items-center justify-center rounded-full text-white/70 transition-[background-color,color,transform] duration-200 hover:-translate-y-0.5 hover:scale-105 hover:bg-white/10 hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:scale-100 disabled:hover:bg-transparent";

export default function Composer({ compact, thinking = false, onSend }: Props) {
  const { t, locale } = useLocale();
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dragDepth = useRef(0);
  const baseText = useRef("");

  const speech = useSpeechInput((transcript) => {
    const base = baseText.current;
    setValue(base && transcript ? `${base} ${transcript}` : base + transcript);
  }, locale === "fa" ? "fa-IR" : "en-US");

  const canSend = value.trim().length > 0 || attachments.length > 0;
  const showLoading = thinking && !canSend;

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    // Only scroll once the text outgrows the max height; sub-pixel rounding under
    // the desktop UI scale otherwise shows a scrollbar on a single line.
    textarea.style.overflowY = textarea.scrollHeight > 160 ? "auto" : "hidden";
  }, [value]);

  const addFiles = (files: FileList | File[]) => {
    setError(undefined);
    const next: Attachment[] = [];
    let rejected: string | undefined;
    for (const file of Array.from(files)) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        rejected = `${file.name}: ${t("onlyFiles")}`;
      } else if (file.size > MAX_FILE_SIZE) {
        rejected = `${file.name}: ${t("tooLarge")}`;
      } else if (attachments.length + next.length >= MAX_ATTACHMENTS) {
        rejected = t("maxFiles");
      } else {
        next.push({
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
        });
      }
    }
    if (rejected) setError(rejected);
    if (next.length) setAttachments((prev) => [...prev, ...next]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => {
      const target = prev.find((a) => a.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((a) => a.id !== id);
    });
  };

  // Release preview URLs of unsent attachments on unmount.
  const pending = useRef(attachments);
  pending.current = attachments;
  useEffect(() => () => pending.current.forEach((a) => URL.revokeObjectURL(a.url)), []);

  const submit = () => {
    if (!canSend) return;
    if (speech.listening) speech.stop();
    onSend?.(value.trim(), attachments); // sent attachments keep their URLs for display in the chat
    setValue("");
    setAttachments([]);
    setError(undefined);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };

  // Enter sends, Shift+Enter inserts a newline.
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = "";
  };

  const hasFiles = (e: DragEvent) => Array.from(e.dataTransfer.types).includes("Files");

  const onDragEnter = (e: DragEvent) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    dragDepth.current += 1;
    setDragging(true);
  };
  const onDragLeave = (e: DragEvent) => {
    if (!hasFiles(e)) return;
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setDragging(false);
  };
  const onDrop = (e: DragEvent) => {
    if (!hasFiles(e)) return;
    e.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const toggleMic = () => {
    if (speech.listening) {
      speech.stop();
    } else {
      baseText.current = value;
      speech.start();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      onDragEnter={onDragEnter}
      onDragOver={(e) => hasFiles(e) && e.preventDefault()}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`group relative flex w-full flex-col rounded-[26px] border bg-glass shadow-[0_10px_40px_rgb(0_0_0/0.25)] transition-[transform,background-color,border-color,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/25 hover:shadow-[0_18px_55px_rgb(0_0_0/0.36),0_0_28px_rgb(255_255_255/0.09)] focus-within:-translate-y-0.5 focus-within:border-white/35 focus-within:bg-white/20 focus-within:shadow-[0_18px_55px_rgb(0_0_0/0.36),0_0_28px_rgb(255_255_255/0.08)] motion-reduce:transform-none motion-reduce:transition-none ${
        compact ? "min-h-[88px]" : "min-h-[104px]"
      } ${dragging ? "border-dashed border-white/60 bg-white/25" : "border-white/15"}`}
    >
      {dragging && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-[26px] bg-black/30 text-[15px] font-medium text-white">
          {t("dropFiles")}
        </div>
      )}

      {attachments.length > 0 && (
        <ul
          aria-label={t("attachments")}
          className="m-0 flex list-none gap-3 overflow-x-auto px-5 pb-1 pt-4"
        >
          {attachments.map((a) => (
            <li key={a.id}>
              <AttachmentPreview attachment={a} onRemove={() => removeAttachment(a.id)} />
            </li>
          ))}
        </ul>
      )}

      <label htmlFor="prompt" className="sr-only">
        {t("message")}
      </label>
      <textarea
        ref={textareaRef}
        id="prompt"
        // Empty: follow the UI language so the placeholder sits on the right in Persian.
        // Typing: follow the text itself.
        dir={value ? "auto" : locale === "fa" ? "rtl" : "ltr"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={speech.listening ? t("listening") : t("messagePlaceholder")}
        rows={1}
        className="chat-composer-input thin-scroll max-h-40 min-h-[40px] flex-1 resize-none bg-transparent px-6 pb-0 pt-4 text-[17px] font-medium leading-[26px] text-white caret-white outline-none placeholder:text-placeholder/80"
      />

      {error && (
        <p role="alert" className="m-0 px-6 pb-1 text-[12px] text-red-300">
          {error}
        </p>
      )}

      <div className="flex items-center gap-1 px-3 pb-2.5">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(",")}
          onChange={handleFileInput}
          className="hidden"
          tabIndex={-1}
        />
        <button
          type="button"
          aria-label={t("attachFiles")}
          title={t("attachFiles")}
          className={toolButton}
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="size-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label={speech.listening ? t("stopVoice") : t("startVoice")}
          aria-pressed={speech.listening}
          title={speech.supported ? t("voiceInput") : t("voiceUnsupported")}
          disabled={!speech.supported}
          className={`${toolButton} ${speech.listening ? "!bg-red-500/25 !text-red-300" : ""}`}
          onClick={toggleMic}
        >
          {speech.listening ? (
            <Square className="size-4 animate-pulse fill-current" aria-hidden="true" />
          ) : (
            <Mic className="size-5" aria-hidden="true" />
          )}
        </button>

        <button
          type="submit"
          aria-label={showLoading ? t("typing") : t("sendMessage")}
          aria-busy={showLoading}
          disabled={!canSend}
          className={`group/send ms-auto flex size-10 cursor-pointer items-center justify-center rounded-full transition-[transform,color,filter] duration-300 ease-out active:scale-90 disabled:cursor-not-allowed disabled:active:scale-100 ${
            showLoading
              ? "text-white"
              : canSend
                ? "text-white hover:scale-110 hover:drop-shadow-[0_0_10px_rgb(255_255_255/0.45)]"
                : "text-white/30"
          }`}
        >
          {showLoading ? (
            <span className="relative grid size-7 place-items-center" aria-hidden="true">
              <motion.span
                animate={reduceMotion ? { rotate: 0 } : { rotate: 360 }}
                transition={reduceMotion ? undefined : { duration: 1.4, ease: "linear", repeat: Infinity }}
                className="absolute inset-0 rounded-full border border-white/15 border-t-white/85 border-r-white/55"
              />
              <Logo className="relative z-10 h-[15px] w-[11px] text-white drop-shadow-[0_0_5px_rgb(255_255_255/0.6)]" />
            </span>
          ) : (
            <SendHorizontal
              strokeWidth={2}
              className={`size-6 transition-transform duration-300 ease-out rtl:-scale-x-100 ${canSend ? "group-hover/send:translate-x-0.5 rtl:group-hover/send:-translate-x-0.5" : ""}`}
              aria-hidden="true"
            />
          )}
        </button>
      </div>
    </form>
  );
}
