import { useRef, useState } from "react";
import { LogOut, Settings } from "lucide-react";
import { useDismiss } from "../../hooks/useDismiss";
import DotsVerticalIcon from "../icons/DotsVerticalIcon";
import { useLocale } from "../../context/LocaleContext";

interface Props {
  onOpenSettings?: () => void;
  onLogout?: () => void;
}

const itemClass =
  "flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-start text-[14px] text-white/90 transition-colors hover:bg-white/10";

export default function AccountMenu({ onOpenSettings, onLogout }: Props) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const close = () => {
    setOpen(false);
  };
  useDismiss(rootRef, open, close);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        data-account-menu-trigger
        type="button"
        aria-label={t("accountOptions")}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => (open ? close() : setOpen(true))}
        className={`flex h-12 w-5 cursor-pointer items-center justify-center text-white transition-opacity hover:opacity-100 ${
          open ? "opacity-100" : "opacity-50"
        }`}
      >
        <DotsVerticalIcon className="h-4 w-1" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute bottom-full end-0 z-50 mb-2 w-[210px] rounded-2xl border border-white/10 bg-ink/95 p-1.5 shadow-[0_12px_40px_rgb(0_0_0/0.45)] backdrop-blur-xl"
        >
          <button
            type="button"
            role="menuitem"
            className={itemClass}
            onClick={() => {
              onOpenSettings?.();
              close();
            }}
          >
            <Settings className="size-4 shrink-0" aria-hidden="true" />
            {t("settings")}
          </button>

          <div role="separator" className="mx-2 my-1.5 h-px bg-white/10" />
          <button
            type="button"
            role="menuitem"
            className={`${itemClass} !text-red-400 hover:!bg-red-500/10`}
            onClick={() => {
              onLogout?.();
              close();
            }}
          >
            <LogOut className="size-4 shrink-0" aria-hidden="true" />
            {t("logout")}
          </button>
        </div>
      )}
    </div>
  );
}
