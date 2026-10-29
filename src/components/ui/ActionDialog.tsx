import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, PencilLine, Share2, Trash2, X } from "lucide-react";
import { useLocale } from "../../context/LocaleContext";
import { Button, inputClass } from "../settings/controls";

export type ActionDialogState =
  | { type: "rename"; id: string; title: string }
  | { type: "delete"; id: string; title: string }
  | { type: "clear-history" }
  | { type: "share"; title: string; content: string };

interface Props {
  dialog: ActionDialogState;
  onClose: () => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onClearHistory: () => void;
  onCopy: (content: string) => Promise<void>;
  onDownload: (title: string, content: string) => void;
}

export default function ActionDialog({ dialog, onClose, onRename, onDelete, onClearHistory, onCopy, onDownload }: Props) {
  const { locale, t } = useLocale();
  const [title, setTitle] = useState(dialog.type === "rename" ? dialog.title : "");
  const [copyError, setCopyError] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    (dialog.type === "rename" ? inputRef.current : dialog.type === "share" ? closeRef.current : cancelRef.current)?.focus();

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (previousFocus.current?.isConnected) previousFocus.current.focus();
    };
  }, [dialog.type]);

  const submitRename = (event: FormEvent) => {
    event.preventDefault();
    if (dialog.type !== "rename") return;
    const cleanTitle = title.trim();
    if (cleanTitle) onRename(dialog.id, cleanTitle);
  };

  const copyShare = async () => {
    if (dialog.type !== "share") return;
    setCopyError("");
    try {
      await onCopy(`${dialog.title}\n\n${dialog.content}`);
    } catch {
      setCopyError(t("copyUnavailable"));
    }
  };

  let heading = "";
  let description = "";
  if (dialog.type === "rename") {
    heading = t("renameDialogTitle");
    description = t("renameDialogDescription");
  }
  if (dialog.type === "delete") {
    heading = t("deleteDialogTitle");
    description = t("deleteConfirmDescription");
  }
  if (dialog.type === "clear-history") {
    heading = t("clearDialogTitle");
    description = t("clearHistoryQuestion");
  }
  if (dialog.type === "share") heading = t("shareDialogTitle");

  const DialogIcon = {
    rename: PencilLine,
    delete: Trash2,
    "clear-history": AlertTriangle,
    share: Share2,
  }[dialog.type];
  const destructive = dialog.type === "delete" || dialog.type === "clear-history";

  const content = (
    <div
      dir={locale === "fa" ? "rtl" : "ltr"}
      lang={locale}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role={dialog.type === "delete" || dialog.type === "clear-history" ? "alertdialog" : "dialog"}
        aria-modal="true"
        aria-labelledby="action-dialog-title"
        aria-describedby={description ? "action-dialog-description" : undefined}
        tabIndex={-1}
        className="action-dialog w-full max-w-[520px] overflow-hidden rounded-[24px] border border-white/10 bg-[#17160f]/95 text-white shadow-[0_28px_90px_rgb(0_0_0/0.58)] backdrop-blur-2xl"
      >
        <header className="flex items-center justify-between gap-4 border-b border-white/[0.08] px-6 py-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className={`grid size-10 shrink-0 place-items-center rounded-2xl border ${
              destructive ? "border-red-300/15 bg-red-400/[0.09] text-red-300" : "border-white/10 bg-white/[0.06] text-white/80"
            }`}>
              <DialogIcon className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 id="action-dialog-title" className="m-0 text-[17px] font-semibold tracking-tight">{heading}</h2>
              {dialog.type === "rename" && (
                <p id="action-dialog-description" className="m-0 mt-0.5 text-[12px] leading-5 text-white/50">{t("renameDialogDescription")}</p>
              )}
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            aria-label={t("closeDialog")}
            onClick={onClose}
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/55 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>

        {dialog.type === "rename" && (
          <form onSubmit={submitRename} className="p-6 pt-5">
            <label htmlFor="rename-chat-title" className="mb-2 block text-[12px] font-medium text-white/65">{t("chatName")}</label>
            <input
              ref={inputRef}
              id="rename-chat-title"
              autoComplete="off"
              maxLength={100}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className={`${inputClass} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-1 focus-visible:ring-offset-ink`}
            />
            <div className="mt-6 flex justify-end gap-2.5">
              <Button onClick={onClose}>{t("cancel")}</Button>
              <Button type="submit" variant="primary" disabled={!title.trim()}>{t("saveChanges")}</Button>
            </div>
          </form>
        )}

        {(dialog.type === "delete" || dialog.type === "clear-history") && (
          <div className="p-6 pt-5">
            {dialog.type === "delete" ? (
              <div className="space-y-3">
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-3">
                  <p className="m-0 mb-1 text-[11px] font-medium text-white/45">{t("chatToDelete")}</p>
                  <p dir="auto" className="m-0 break-words text-[14px] font-medium text-white/90">{dialog.title}</p>
                </div>
                <p id="action-dialog-description" className="m-0 flex items-start gap-2 text-[13px] leading-6 text-red-100/75">
                  <AlertTriangle className="mt-1 size-4 shrink-0 text-red-300/80" aria-hidden="true" />
                  <span>{description}</span>
                </p>
              </div>
            ) : (
              <p id="action-dialog-description" className="m-0 rounded-2xl border border-red-300/10 bg-red-400/[0.055] px-4 py-3 text-[13px] leading-6 text-white/70">{description}</p>
            )}
            <div className="mt-6 flex justify-end gap-2.5">
              <button ref={cancelRef} type="button" onClick={onClose} className="cursor-pointer rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-[14px] font-medium text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50">{t("cancel")}</button>
              <Button
                variant="danger"
                onClick={() => dialog.type === "delete" ? onDelete(dialog.id) : onClearHistory()}
              >{dialog.type === "delete" ? t("confirmDelete") : t("confirmClear")}</Button>
            </div>
          </div>
        )}

        {dialog.type === "share" && (
          <div className="p-6 pt-5">
            <p className="m-0 mb-2 text-[13px] font-medium text-white/65">{t("sharePreview")}</p>
            <div className="max-h-[min(42vh,280px)] overflow-y-auto rounded-xl border border-white/10 bg-white/[0.06] p-4">
              <h3 className="m-0 mb-3 text-[15px] font-semibold">{dialog.title}</h3>
              <p dir="auto" className="m-0 whitespace-pre-wrap break-words text-[13px] leading-6 text-white/75">{dialog.content}</p>
            </div>
            {copyError && <p role="alert" className="m-0 mt-3 text-[13px] text-red-300">{copyError}</p>}
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <Button onClick={onClose}>{t("cancel")}</Button>
              <Button onClick={() => onDownload(dialog.title, dialog.content)}>{t("downloadText")}</Button>
              <Button variant="primary" onClick={copyShare}>{t("copyText")}</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
