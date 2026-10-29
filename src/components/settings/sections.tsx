import { useRef, useState, type ChangeEvent, type ReactNode } from "react";
import {
  Bell,
  Check,
  CircleHelp,
  Database,
  Lock,
  Palette,
  Sparkles,
  User,
  type LucideIcon,
} from "lucide-react";
import avatar from "../../assets/avatar.jpg";
import { user } from "../../data/chats";
import { useBackground } from "../../context/BackgroundContext";
import { BLUR_MAX, BLUR_MIN } from "../../data/backgrounds";
import { Button, Field, Row, Slider, Toggle, inputClass } from "./controls";
import DatePicker from "./DatePicker";
import Select from "./Select";
import { getTranslation, useLocale, type Locale } from "../../context/LocaleContext";

export interface SettingsCallbacks {
  onNotify: (message: string) => void;
  onExportData: () => void;
  onClearHistory: () => void;
  onProfileChange: (name: string) => void;
}

function readSetting(key: string, fallback: string) {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}

function saveSetting(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { /* Keep this session usable if storage is unavailable. */ }
}

function BlurRow() {
  const { blur, setBlur } = useBackground();
  const { t } = useLocale();
  return (
    <Row title={t("blur")} description={t("blurDescription")}>
      <Slider label={t("blur")} value={blur} min={BLUR_MIN} max={BLUR_MAX} unit={t("backgroundBlurUnit")} onChange={setBlur} />
    </Row>
  );
}

function BackgroundPicker() {
  const { background, backgrounds, setBackgroundId } = useBackground();
  const { t } = useLocale();
  return (
    <div role="radiogroup" aria-label={t("backgroundLabel")} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {backgrounds.map((b) => {
        const selected = b.id === background.id;
        return (
          <button
            key={b.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setBackgroundId(b.id)}
            className="group cursor-pointer text-start"
          >
            <span
              className={`relative block aspect-[4/3] overflow-hidden rounded-xl ring-2 transition ${
                selected ? "ring-white" : "ring-transparent group-hover:ring-white/40"
              }`}
            >
              <img src={b.src} alt="" loading="lazy" className="size-full object-cover" />
              {selected && (
                <span className="absolute end-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-white text-ink">
                  <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                </span>
              )}
            </span>
            <span className={`mt-1.5 block text-[13px] ${selected ? "text-white" : "text-white/60"}`}>{t(`background${b.id[0].toUpperCase()}${b.id.slice(1)}`)}</span>
          </button>
        );
      })}
    </div>
  );
}

function Divided({ children }: { children: ReactNode }) {
  return <div className="divide-y divide-white/10">{children}</div>;
}

function AccountSection({ onNotify, onProfileChange }: SettingsCallbacks) {
  const { t } = useLocale();
  const [name, setName] = useState(() => readSetting("chatbot:account-name", user.name));
  const [email, setEmail] = useState(() => readSetting("chatbot:account-email", ""));
  const [phone, setPhone] = useState(() => readSetting("chatbot:account-phone", ""));
  const [dateOfBirth, setDateOfBirth] = useState(() => readSetting("chatbot:account-date-of-birth", ""));
  const [photo, setPhoto] = useState(() => readSetting("chatbot:account-photo", avatar));
  const photoInput = useRef<HTMLInputElement>(null);
  const [photoError, setPhotoError] = useState("");

  const changePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError(t("chooseImage"));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setPhotoError(t("imageTooLarge"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) return;
      setPhoto(result);
      saveSetting("chatbot:account-photo", result);
      setPhotoError("");
      onNotify(t("profilePhotoUpdated"));
    };
    reader.readAsDataURL(file);
  };

  const saveAccount = () => {
    const cleanName = name.trim();
    if (!cleanName) {
      onNotify(t("enterName"));
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      onNotify(t("validEmail"));
      return;
    }
    saveSetting("chatbot:account-name", cleanName);
    saveSetting("chatbot:account-email", email.trim());
    saveSetting("chatbot:account-phone", phone.trim());
    saveSetting("chatbot:account-date-of-birth", dateOfBirth);
    setName(cleanName);
    setPhone(phone.trim());
    onProfileChange(cleanName);
    onNotify(t("accountSaved"));
  };

  return (
    <>
      <div className="mb-4 flex items-center gap-4">
        <img src={photo} alt={t("account")} className="size-16 rounded-full object-cover" />
        <div className="flex gap-2">
          <input ref={photoInput} type="file" accept="image/*" className="hidden" onChange={changePhoto} />
          <Button onClick={() => photoInput.current?.click()}>{t("changePhoto")}</Button>
          <Button
            variant="danger"
            onClick={() => {
              setPhoto(avatar);
              try { localStorage.removeItem("chatbot:account-photo"); } catch { /* ignore unavailable storage */ }
              onNotify(t("profilePhotoRemoved"));
            }}
          >{t("removePhoto")}</Button>
        </div>
      </div>
      {photoError && <p role="alert" className="m-0 mb-2 text-[13px] text-red-300">{photoError}</p>}
      <div className="grid grid-cols-1 gap-x-5 gap-y-1 md:grid-cols-2">
        <Field label={t("name")} htmlFor="acc-name">
          <input id="acc-name" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label={t("email")} htmlFor="acc-email">
          <input
            id="acc-email"
            type="email"
            className={inputClass}
            placeholder="you@example.com"
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field label={t("phone")} htmlFor="acc-phone">
          <input
            id="acc-phone"
            type="tel"
            autoComplete="tel"
            className={inputClass}
            placeholder={t("phonePlaceholder")}
            dir="ltr"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Field>
        <Field label={t("dateOfBirth")} htmlFor="acc-date-of-birth">
          <DatePicker
            id="acc-date-of-birth"
            value={dateOfBirth}
            onChange={setDateOfBirth}
          />
        </Field>
      </div>
      <div className="mt-3 flex justify-end">
        <Button variant="primary" onClick={saveAccount}>{t("saveChanges")}</Button>
      </div>
    </>
  );
}

function PersonalizationSection({ onNotify }: SettingsCallbacks) {
  const { locale, setLocale, t } = useLocale();
  return (
    <Divided>
      <div className="pb-5">
        <p className="m-0 text-[15px] font-medium text-white">{t("background")}</p>
        <p className="m-0 mb-3 mt-0.5 text-[13px] text-white/55">{t("backgroundDescription")}</p>
        <BackgroundPicker />
      </div>
      <BlurRow />
      <Row title={t("interfaceLanguage")}>
        <div
          role="group"
          aria-label={t("interfaceLanguage")}
          className="grid w-[248px] max-w-[58vw] grid-cols-2 gap-1 rounded-2xl border border-white/[0.08] bg-black/25 p-1"
        >
          {([
            { value: "en", code: "EN", label: t("english") },
            { value: "fa", code: "FA", label: t("persian") },
          ] as const).map(({ value, code, label }) => {
            const active = locale === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setLocale(value as Locale);
                  onNotify(getTranslation(value, "languageSaved"));
                }}
                className={`flex min-h-12 min-w-0 items-center justify-between gap-2 rounded-xl border px-2.5 transition-[background-color,border-color,color,box-shadow] duration-200 ${
                  active
                    ? "border-white/[0.12] bg-white/[0.13] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                    : "border-transparent text-white/50 hover:bg-white/[0.06] hover:text-white/80"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`grid size-7 shrink-0 place-items-center rounded-lg text-[10px] font-bold tracking-wide transition-[background-color,color,transform] duration-200 ${
                    active ? "scale-105 bg-glow text-white" : "bg-white/[0.06] text-white/55"
                  }`}
                >
                  {code}
                </span>
                <span className="min-w-0 flex-1 whitespace-nowrap text-center text-[13px] font-medium">{label}</span>
                <span aria-hidden="true" className={`size-1.5 shrink-0 rounded-full transition-colors ${active ? "bg-white/80" : "bg-transparent"}`} />
              </button>
            );
          })}
        </div>
      </Row>
    </Divided>
  );
}

function AiSection({ onNotify }: SettingsCallbacks) {
  const { t } = useLocale();
  const [model, setModel] = useState(() => readSetting("chatbot:ai-model", "Standard"));
  const [instructions, setInstructions] = useState(() => readSetting("chatbot:ai-instructions", ""));
  return (
    <>
      <Field label={t("defaultModel")} htmlFor="ai-model">
        <Select
          id="ai-model"
          label={t("defaultModel")}
          value={model}
          options={[
            { value: "Standard", label: t("modelStandard") },
            { value: "Advanced", label: t("modelAdvanced") },
            { value: "Fast", label: t("modelFast") },
          ]}
          onChange={setModel}
        />
      </Field>
      <Field label={t("customInstructions")} htmlFor="ai-instructions">
        <textarea
          id="ai-instructions"
          rows={6}
          className={`${inputClass} resize-none`}
          placeholder={t("instructionsPlaceholder")}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </Field>
      <p className="m-0 text-[13px] text-white/50">{t("localAiNote")}</p>
      <div className="mt-4">
        <Button
          variant="primary"
          onClick={() => {
            saveSetting("chatbot:ai-model", model);
            saveSetting("chatbot:ai-instructions", instructions);
            onNotify(t("aiSaved"));
          }}
        >{t("save")}</Button>
      </div>
    </>
  );
}

function PrivacySection({ onNotify, onExportData, onClearHistory }: SettingsCallbacks) {
  const { t } = useLocale();
  const [improve, setImprove] = useState(() => readSetting("chatbot:improve-product", "false") === "true");
  return (
    <Divided>
      <Row title={t("improveProduct")} description={t("improveDescription")}>
        <Toggle label={t("improveProduct")} checked={improve} onChange={(value) => {
          setImprove(value);
          saveSetting("chatbot:improve-product", String(value));
          onNotify(t("privacySaved"));
        }} />
      </Row>
      <Row title={t("exportData")} description={t("exportDescription")}>
        <Button onClick={onExportData}>{t("export")}</Button>
      </Row>
      <Row title={t("clearHistory")} description={t("clearDescription")}>
        <Button variant="danger" onClick={onClearHistory}>{t("clear")}</Button>
      </Row>
    </Divided>
  );
}

function NotificationsSection({ onNotify }: SettingsCallbacks) {
  const { t } = useLocale();
  const [prefs, setPrefs] = useState(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem("chatbot:notifications") ?? "null");
      if (parsed && typeof parsed === "object") return { replies: parsed.replies !== false, product: parsed.product === true, security: parsed.security !== false };
    } catch { /* use defaults */ }
    return { replies: true, product: false, security: true };
  });
  const toggle = (key: keyof typeof prefs) => (value: boolean) => {
    setPrefs((previous) => {
      const next = { ...previous, [key]: value };
      saveSetting("chatbot:notifications", JSON.stringify(next));
      return next;
    });
    onNotify(t("notificationsSaved"));
  };
  return (
    <Divided>
      <Row title={t("repliesReady")} description={t("repliesDescription")}>
        <Toggle label={t("repliesReady")} checked={prefs.replies} onChange={toggle("replies")} />
      </Row>
      <Row title={t("productUpdates")} description={t("repliesDescription")}>
        <Toggle label={t("productUpdates")} checked={prefs.product} onChange={toggle("product")} />
      </Row>
      <Row title={t("securityAlerts")} description={t("repliesDescription")}>
        <Toggle label={t("securityAlerts")} checked={prefs.security} onChange={toggle("security")} />
      </Row>
    </Divided>
  );
}

function SecuritySection({ onNotify }: SettingsCallbacks) {
  const { t } = useLocale();
  return (
    <Divided>
      <Row title={t("changePassword")} description={t("passwordDescription")}>
        <Button onClick={() => onNotify(t("passwordUnavailable"))}>{t("changePassword")}</Button>
      </Row>
      <Row title={t("activeSessions")} description={t("currentSession")}>
        <Button variant="danger" onClick={() => onNotify(t("sessionsUnavailable"))}>{t("signOutSessions")}</Button>
      </Row>
    </Divided>
  );
}

const faqs: [string, string][] = [
  ["faqStart", "faqStartAnswer"],
  ["faqRename", "faqRenameAnswer"],
  ["faqExport", "faqExportAnswer"],
];

function HelpSection({ onNotify }: SettingsCallbacks) {
  const { t } = useLocale();
  return (
    <>
      <Divided>
        {faqs.map(([question, answer]) => (
          <details key={question} className="group py-3">
            <summary className="cursor-pointer list-none text-[15px] font-medium text-white marker:hidden">
              {t(question)}
            </summary>
            <p className="m-0 mt-2 text-[14px] text-white/60">{t(answer)}</p>
          </details>
        ))}
      </Divided>
      <div className="mt-4">
        <Button variant="primary" onClick={() => onNotify(t("supportUnavailable"))}>{t("contactSupport")}</Button>
      </div>
    </>
  );
}

export interface SettingsSection {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  content: ReactNode;
}

export function createSettingsSections(callbacks: SettingsCallbacks, t: (key: string) => string): SettingsSection[] {
  return [
    { id: "account", title: t("account"), description: t("accountDescription"), icon: User, content: <AccountSection {...callbacks} /> },
    { id: "personalization", title: t("personalization"), description: t("personalizationDescription"), icon: Palette, content: <PersonalizationSection {...callbacks} /> },
    { id: "ai", title: t("aiSettings"), description: t("aiDescription"), icon: Sparkles, content: <AiSection {...callbacks} /> },
    { id: "privacy", title: t("privacy"), description: t("privacyDescription"), icon: Database, content: <PrivacySection {...callbacks} /> },
    { id: "notifications", title: t("notifications"), description: t("notificationsDescription"), icon: Bell, content: <NotificationsSection {...callbacks} /> },
    { id: "security", title: t("security"), description: t("securityDescription"), icon: Lock, content: <SecuritySection {...callbacks} /> },
    { id: "help", title: t("help"), description: t("helpDescription"), icon: CircleHelp, content: <HelpSection {...callbacks} /> },
  ];
}
