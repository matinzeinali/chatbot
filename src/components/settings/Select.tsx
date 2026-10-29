import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useDismiss } from "../../hooks/useDismiss";

interface Props {
  value: string;
  options: Array<string | { value: string; label: string }>;
  onChange: (value: string) => void;
  label: string;
  id?: string;
  className?: string;
}

// Styled replacement for the native <select>, following the listbox keyboard pattern.
export default function Select({ value, options, onChange, label, id, className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const close = () => setOpen(false);
  useDismiss(rootRef, open, close);

  const optionValues = options.map((option) => typeof option === "string" ? option : option.value);
  const openList = () => {
    setHighlight(Math.max(0, optionValues.indexOf(value)));
    setOpen(true);
  };

  const choose = (option: string) => {
    onChange(option);
    close();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) return openList();
      const step = e.key === "ArrowDown" ? 1 : -1;
      setHighlight((h) => (h + step + optionValues.length) % optionValues.length);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (open) choose(optionValues[highlight]);
      else openList();
    } else if (e.key === "Tab") {
      close();
    }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        id={id}
        type="button"
        role="combobox"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onKeyDown}
        className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/10 px-3.5 py-2.5 text-start text-[14px] text-white outline-none transition-colors hover:bg-white/15 focus-visible:border-white/30"
      >
        <span className="truncate">
          {options.map((option) => typeof option === "string" ? { value: option, label: option } : option).find((option) => option.value === value)?.label ?? value}
        </span>
        <ChevronDown
          className={`size-4 shrink-0 text-white/60 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label={label}
          className="absolute left-0 right-0 top-full z-30 m-0 mt-1.5 list-none rounded-2xl border border-white/10 bg-ink/95 p-1.5 shadow-[0_12px_40px_rgb(0_0_0/0.45)] backdrop-blur-xl"
        >
          {options.map((option, i) => {
            const optionValue = typeof option === "string" ? option : option.value;
            const optionLabel = typeof option === "string" ? option : option.label;
            return <li
              key={optionValue}
              role="option"
              aria-selected={optionValue === value}
              onMouseEnter={() => setHighlight(i)}
              onClick={() => choose(optionValue)}
              className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-[14px] text-white transition-colors ${
                i === highlight ? "bg-white/10" : ""
              }`}
            >
              {optionLabel}
              {optionValue === value && <Check className="size-4 shrink-0" aria-hidden="true" />}
            </li>;
          })}
        </ul>
      )}
    </div>
  );
}
