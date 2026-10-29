import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { createSettingsSections } from "./sections";
import { useLocale } from "../../context/LocaleContext";

interface Props {
  onClose: () => void;
  onNotify: (message: string) => void;
  onExportData: () => void;
  onClearHistory: () => void;
  onProfileChange: (name: string) => void;
}

export default function SettingsPanel({ onClose, onNotify, onExportData, onClearHistory, onProfileChange }: Props) {
  const { locale, t } = useLocale();
  const rtl = locale === "fa";
  const settingsSections = createSettingsSections({ onNotify, onExportData, onClearHistory, onProfileChange }, t);
  const [activeId, setActiveId] = useState(settingsSections[0].id);
  const active = settingsSections.find((s) => s.id === activeId) ?? settingsSections[0];
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const appShell = document.getElementById("app-shell");
    if (appShell) appShell.inert = true;
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (event.target instanceof Element && event.target.closest("[data-settings-popup]")) return;
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const insidePanel = panelRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      const settingsPopup = document.querySelector<HTMLElement>("[data-settings-popup]");
      const insidePopup = settingsPopup?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      const focusable = [...(insidePanel ?? []), ...(insidePopup ?? [])];
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
      if (appShell) appShell.inert = false;
      if (previousFocus.current?.isConnected && !previousFocus.current.closest("[inert]")) {
        previousFocus.current.focus();
      } else {
        const accountTrigger = [...document.querySelectorAll<HTMLElement>("[data-account-menu-trigger]")]
          .find((element) => !element.closest("[inert]"));
        (accountTrigger ?? document.getElementById("main-menu-button"))?.focus();
      }
    };
  }, []);

  return createPortal(
    <div
      dir={rtl ? "rtl" : "ltr"}
      lang={locale}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 p-2 backdrop-blur-[12px] md:p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-dialog-title"
        className="flex h-[calc(100dvh-1rem)] max-h-[720px] w-full max-w-[960px] flex-col overflow-hidden rounded-[24px] border border-white/15 bg-ink/55 text-white shadow-[0_24px_80px_rgb(0_0_0/0.5)] backdrop-blur-[22px] md:h-[82dvh] md:rounded-[30px]"
      >
        <header className="flex h-[72px] shrink-0 items-center gap-3 border-b border-white/10 px-4 md:px-7">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t("backToChat")}
            className="flex size-10 cursor-pointer items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            {rtl ? <ArrowRight className="size-5" aria-hidden="true" /> : <ArrowLeft className="size-5" aria-hidden="true" />}
          </button>
          <h1 id="settings-dialog-title" className="m-0 text-[22px] font-semibold text-white">{t("settings")}</h1>
        </header>

        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          <nav
            aria-label={t("settings")}
            className={`flex shrink-0 gap-1 overflow-x-auto border-b border-white/10 p-3 md:w-[280px] md:flex-col md:overflow-y-auto md:border-b-0 md:p-4 ${rtl ? "md:border-l" : "md:border-r"}`}
          >
            {settingsSections.map(({ id, title, description, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveId(id)}
                aria-current={id === activeId ? "page" : undefined}
                className={`flex shrink-0 cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-start transition-colors ${
                  id === activeId ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="size-5 shrink-0" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-[14px] font-medium">{title}</span>
                  <span className="hidden truncate text-[12px] text-white/50 md:block">{description}</span>
                </span>
              </button>
            ))}
          </nav>

          <section aria-labelledby="settings-title" className="min-h-0 flex-1 overflow-y-auto p-5 md:p-8">
            <div className="max-w-[760px]">
              <h2 id="settings-title" className="m-0 text-[20px] font-semibold text-white">{active.title}</h2>
              <p className="m-0 mb-5 mt-1 text-[14px] text-white/55">{active.description}</p>
              {active.content}
            </div>
          </section>
        </div>
      </div>
    </div>,
    document.body,
  );
}
