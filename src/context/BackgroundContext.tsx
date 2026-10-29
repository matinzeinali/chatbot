import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  BLUR_MAX,
  BLUR_MIN,
  DEFAULT_BACKGROUND_ID,
  DEFAULT_BLUR,
  backgrounds,
  type Background,
} from "../data/backgrounds";
import { extractPalette } from "../lib/palette";

const STORAGE_KEY = "chatbot:background";
const BLUR_KEY = "chatbot:background-blur";

interface BackgroundContextValue {
  background: Background;
  backgrounds: Background[];
  setBackgroundId: (id: string) => void;
  /** Blur in px applied to the background image. */
  blur: number;
  setBlur: (px: number) => void;
}

const BackgroundContext = createContext<BackgroundContextValue | null>(null);

const readStored = (): string => {
  try {
    const id = localStorage.getItem(STORAGE_KEY);
    return backgrounds.some((b) => b.id === id) ? (id as string) : DEFAULT_BACKGROUND_ID;
  } catch {
    return DEFAULT_BACKGROUND_ID;
  }
};

const readStoredBlur = (): number => {
  try {
    const raw = localStorage.getItem(BLUR_KEY);
    const n = raw === null ? NaN : Number(raw);
    return Number.isFinite(n) ? Math.min(BLUR_MAX, Math.max(BLUR_MIN, n)) : DEFAULT_BLUR;
  } catch {
    return DEFAULT_BLUR;
  }
};

const persist = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable: the choice just won't persist */
  }
};

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState(readStored);
  const [blur, setBlurState] = useState(readStoredBlur);

  const setBackgroundId = useCallback((next: string) => {
    setId(next);
    persist(STORAGE_KEY, next);
  }, []);

  const setBlur = useCallback((px: number) => {
    const clamped = Math.min(BLUR_MAX, Math.max(BLUR_MIN, px));
    setBlurState(clamped);
    persist(BLUR_KEY, String(clamped));
  }, []);

  // Tint the UI with colors taken from the current image (falls back to the CSS defaults on failure).
  useEffect(() => {
    const src = (backgrounds.find((b) => b.id === id) ?? backgrounds[0]).src;
    let cancelled = false;
    extractPalette(src)
      .then((p) => {
        if (cancelled) return;
        const root = document.documentElement.style;
        root.setProperty("--color-glow", p.glow);
        root.setProperty("--color-ink", p.ink);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [id]);

  const value = useMemo<BackgroundContextValue>(
    () => ({
      background: backgrounds.find((b) => b.id === id) ?? backgrounds[0],
      backgrounds,
      setBackgroundId,
      blur,
      setBlur,
    }),
    [id, blur, setBackgroundId, setBlur],
  );

  return <BackgroundContext.Provider value={value}>{children}</BackgroundContext.Provider>;
}

export function useBackground() {
  const ctx = useContext(BackgroundContext);
  if (!ctx) throw new Error("useBackground must be used inside <BackgroundProvider>");
  return ctx;
}
