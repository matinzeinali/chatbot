import type { ReactNode } from "react";
import { useLocale } from "../../context/LocaleContext";

export const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/10 px-3.5 py-2.5 text-[14px] text-white outline-none transition-colors placeholder:text-white/40 focus:border-white/30";

export function Row({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <div className="min-w-0">
        <p className="m-0 text-[15px] font-medium text-white">{title}</p>
        {description && <p className="m-0 mt-0.5 text-[13px] text-white/55">{description}</p>}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}

export function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 py-2">
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-white/70">
        {label}
      </label>
      {children}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors duration-200 ${
        checked ? "bg-glow" : "bg-white/20"
      }`}
    >
      <span
        className={`absolute left-0.5 top-0.5 size-5 rounded-full bg-white transition-transform duration-200 rtl:left-auto rtl:right-0.5 ${
          checked ? "translate-x-5 rtl:-translate-x-5" : ""
        }`}
      />
    </button>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: T[];
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex rounded-xl bg-white/10 p-1">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          role="radio"
          aria-checked={opt === value}
          onClick={() => onChange(opt)}
          className={`cursor-pointer rounded-lg px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
            opt === value ? "bg-white/20 text-white" : "text-white/60 hover:text-white"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function Slider({
  value,
  min,
  max,
  onChange,
  label,
  unit = "",
}: {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
  unit?: string;
}) {
  const { locale } = useLocale();
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-44 cursor-pointer appearance-none rounded-full bg-white/20 accent-white"
      />
      <output className="w-12 text-end text-[13px] tabular-nums text-white/70">
        {new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(value)}
        {unit}
      </output>
    </div>
  );
}

export function Button({
  children,
  variant = "default",
  onClick,
  type = "button",
  disabled = false,
}: {
  children: ReactNode;
  variant?: "default" | "primary" | "danger";
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const styles = {
    default: "bg-white/10 text-white hover:bg-white/20",
    primary: "bg-glow text-white hover:brightness-125",
    danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20",
  }[variant];
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`cursor-pointer rounded-xl px-4 py-2 text-[14px] font-medium transition disabled:cursor-not-allowed disabled:opacity-45 ${styles}`}
    >
      {children}
    </button>
  );
}
