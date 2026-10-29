import { useEffect, useRef, useState } from "react";
import { Archive, Download, Pencil, Pin, Share2, Trash2, type LucideIcon } from "lucide-react";
import DotsVerticalIcon from "../icons/DotsVerticalIcon";
import { useLocale } from "../../context/LocaleContext";

export type ChatAction = "rename" | "pin" | "archive" | "share" | "export" | "delete";

interface MenuEntry {
  action: ChatAction;
  label: string;
  icon: LucideIcon;
  danger?: boolean;
}

const entries: MenuEntry[] = [
  { action: "rename", label: "Rename chat", icon: Pencil },
  { action: "pin", label: "Pin", icon: Pin },
  { action: "archive", label: "Move to archive", icon: Archive },
  { action: "share", label: "Share", icon: Share2 },
  { action: "export", label: "Export", icon: Download },
  { action: "delete", label: "Delete chat", icon: Trash2, danger: true },
];

interface Props {
  title: string;
  pinned?: boolean;
  archived?: boolean;
  onAction?: (action: ChatAction) => void;
  onOpenChange?: (open: boolean) => void;
}

export default function ChatItemMenu({ title, pinned = false, archived = false, onAction, onOpenChange }: Props) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const update = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) update(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") update(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-label={t("chatOptions").replace("{title}", title)}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => update(!open)}
        className={`flex h-[39px] w-6 cursor-pointer items-center justify-center rounded-lg text-white transition-opacity duration-200 hover:opacity-100 focus-visible:opacity-100 group-hover:opacity-60 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      >
        <DotsVerticalIcon className="h-4 w-1" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute end-0 top-full z-50 mt-1 w-[210px] rounded-2xl border border-white/10 bg-ink/95 p-1.5 shadow-[0_12px_40px_rgb(0_0_0/0.45)] backdrop-blur-xl"
        >
          {entries.map(({ action, icon: Icon, danger }) => (
            <div key={action}>
              {danger && <div role="separator" className="mx-2 my-1.5 h-px bg-white/10" />}
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  onAction?.(action);
                  update(false);
                }}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-start text-[14px] transition-colors ${
                  danger ? "text-red-400 hover:bg-red-500/10" : "text-white/90 hover:bg-white/10"
                }`}
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                {action === "pin" && pinned
                  ? t("unpin")
                  : action === "archive" && archived
                    ? t("restoreChat")
                    : t(({ rename: "renameChat", pin: "pin", archive: "archiveChat", share: "share", export: "exportChat", delete: "deleteChat" })[action])}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
