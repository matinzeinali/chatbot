import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "../../context/LocaleContext";
import { inputClass } from "./controls";

interface DatePickerProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

type PopupPosition = { top: number; left: number; width: number };

function parseDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

function toIso(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function sameDay(first: Date, second: Date) {
  return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate();
}

export default function DatePicker({ id, value, onChange }: DatePickerProps) {
  const { locale, t } = useLocale();
  const rtl = locale === "fa";
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const selected = parseDate(value);
    const initial = selected ?? new Date();
    return new Date(initial.getFullYear(), initial.getMonth(), 1);
  });
  const [position, setPosition] = useState<PopupPosition | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const selectedDate = parseDate(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const localeTag = rtl ? "fa-IR-u-ca-gregory" : "en-US";
  const numberFormat = new Intl.NumberFormat(rtl ? "fa-IR" : "en-US");
  const monthFormat = new Intl.DateTimeFormat(localeTag, { month: "long", year: "numeric" });
  const dateFormat = new Intl.DateTimeFormat(localeTag, { day: "numeric", month: "long", year: "numeric" });
  const weekFormat = new Intl.DateTimeFormat(localeTag, { weekday: "short" });
  const weekStart = rtl ? 6 : 0;

  const updatePosition = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const width = Math.min(304, window.innerWidth - 24);
    const height = 390;
    const top = rect.bottom + height + 10 <= window.innerHeight
      ? rect.bottom + 8
      : Math.max(12, rect.top - height - 8);
    const alignedLeft = rtl ? rect.right - width : rect.left;
    const left = Math.min(Math.max(12, alignedLeft), window.innerWidth - width - 12);
    setPosition({ top, left, width });
  };

  useEffect(() => {
    if (!open) return;
    updatePosition();
    const onOutsidePointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !popupRef.current?.contains(target)) setOpen(false);
    };
    const reposition = () => updatePosition();
    document.addEventListener("pointerdown", onOutsidePointer);
    document.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    const frame = window.requestAnimationFrame(() => {
      popupRef.current?.querySelector<HTMLButtonElement>("[data-initial-day='true']")?.focus();
    });
    return () => {
      document.removeEventListener("pointerdown", onOutsidePointer);
      document.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
      window.cancelAnimationFrame(frame);
    };
  }, [open]);

  const monthStart = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
  const monthLength = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 0).getDate();
  const leadingDays = (monthStart.getDay() - weekStart + 7) % 7;
  const cellCount = Math.ceil((leadingDays + monthLength) / 7) * 7;
  const dates = Array.from({ length: cellCount }, (_, index) =>
    new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), index - leadingDays + 1),
  );
  const weekdays = Array.from({ length: 7 }, (_, index) =>
    weekFormat.format(new Date(2023, 0, 1 + ((weekStart + index) % 7))),
  );
  const currentMonthDays = dates.filter((date) => date.getMonth() === visibleMonth.getMonth());
  const monthIsCurrent = visibleMonth.getFullYear() === today.getFullYear() && visibleMonth.getMonth() === today.getMonth();

  const shiftMonth = (offset: number) => {
    setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + offset, 1));
  };

  const selectDate = (date: Date) => {
    onChange(toIso(date));
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const clearDate = () => {
    onChange("");
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={`${id}-calendar`}
        onClick={() => {
          if (!open) {
            const current = parseDate(value) ?? new Date();
            setVisibleMonth(new Date(current.getFullYear(), current.getMonth(), 1));
          }
          setOpen((current) => !current);
        }}
        className={`${inputClass} flex items-center justify-between gap-3 text-start`}
      >
        <span className={value ? "text-white" : "text-white/40"}>
          {selectedDate ? dateFormat.format(selectedDate) : t("selectDate")}
        </span>
        <CalendarDays className="size-[17px] shrink-0 text-white/55" aria-hidden="true" />
      </button>

      {open && position && createPortal(
        <div
          ref={popupRef}
          id={`${id}-calendar`}
          role="dialog"
          aria-label={t("dateOfBirth")}
          dir={rtl ? "rtl" : "ltr"}
          lang={locale}
          data-settings-popup="true"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              event.stopPropagation();
              setOpen(false);
              triggerRef.current?.focus();
            }
          }}
          style={{ position: "fixed", top: position.top, left: position.left, width: position.width }}
          className="z-[120] rounded-[20px] border border-white/15 bg-[#17160f]/[0.98] p-3.5 text-white shadow-[0_22px_70px_rgb(0_0_0/0.58)] backdrop-blur-2xl"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.06] text-white/75">
                <CalendarDays className="size-4" aria-hidden="true" />
              </span>
              <span className="truncate text-[14px] font-semibold">{monthFormat.format(visibleMonth)}</span>
            </div>
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                aria-label={t("previousMonth")}
                onClick={() => shiftMonth(-1)}
                className="grid size-8 cursor-pointer place-items-center rounded-lg text-white/65 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45"
              >
                <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label={t("nextMonth")}
                disabled={monthIsCurrent || new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1) > today}
                onClick={() => shiftMonth(1)}
                className="grid size-8 cursor-pointer place-items-center rounded-lg text-white/65 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45 disabled:cursor-not-allowed disabled:opacity-25"
              >
                <ChevronRight className="size-4 rtl:rotate-180" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mb-1 grid grid-cols-7" aria-hidden="true">
            {weekdays.map((day, index) => (
              <span key={`${day}-${index}`} className="grid h-8 place-items-center text-[10px] font-semibold uppercase tracking-wide text-white/40">{day}</span>
            ))}
          </div>
          <div role="group" aria-label={monthFormat.format(visibleMonth)} className="grid grid-cols-7 gap-y-1">
            {dates.map((date, index) => {
              const inMonth = date.getMonth() === visibleMonth.getMonth();
              const isSelected = selectedDate ? sameDay(date, selectedDate) : false;
              const isToday = sameDay(date, today);
              const disabled = !inMonth || date > today;
              const initialDate = selectedDate ? isSelected : isToday || (!currentMonthDays.some((candidate) => sameDay(candidate, today)) && inMonth && date.getDate() === 1);
              return (
                <button
                  key={`${toIso(date)}-${index}`}
                  type="button"
                  aria-label={dateFormat.format(date)}
                  aria-pressed={isSelected}
                  data-initial-day={initialDate ? "true" : undefined}
                  disabled={disabled}
                  onClick={() => selectDate(date)}
                  className={`mx-auto grid size-9 cursor-pointer place-items-center rounded-xl text-[12px] tabular-nums transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45 disabled:cursor-default ${
                    isSelected
                      ? "bg-glow font-semibold text-white shadow-[0_4px_18px_rgb(0_0_0/0.22)]"
                      : isToday
                        ? "border border-white/25 text-white"
                        : inMonth
                          ? "text-white/80 hover:bg-white/10 hover:text-white"
                          : "text-white/20"
                  }`}
                >
                  {numberFormat.format(date.getDate())}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-white/[0.08] pt-3">
            <button
              type="button"
              disabled={!value}
              onClick={clearDate}
              className="cursor-pointer rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-white/55 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-default disabled:opacity-30"
            >
              {t("clearDate")}
            </button>
            <button
              type="button"
              onClick={() => {
                setVisibleMonth(new Date(today.getFullYear(), today.getMonth(), 1));
                selectDate(today);
              }}
              className="cursor-pointer rounded-lg bg-white/[0.07] px-3 py-1.5 text-[12px] font-medium text-white/85 transition hover:bg-white/[0.13]"
            >
              {t("today")}
            </button>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
