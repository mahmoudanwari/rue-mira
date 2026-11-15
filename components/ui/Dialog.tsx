"use client";

import { AnimatePresence, motion, type TargetAndTransition } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";

type Variant = "right" | "left" | "center" | "top" | "full";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Visually hide the title (still announced to screen readers). */
  hideTitle?: boolean;
  variant?: Variant;
  children: ReactNode;
  closeLabel: string;
  className?: string;
  initialFocusSelector?: string;
  footer?: ReactNode;
  headerExtra?: ReactNode;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const panelMotion: Record<Variant, { initial: TargetAndTransition; animate: TargetAndTransition; exit: TargetAndTransition }> = {
  right: { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } },
  left: { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "-100%" } },
  top: { initial: { y: "-100%" }, animate: { y: 0 }, exit: { y: "-100%" } },
  center: {
    initial: { opacity: 0, y: 24, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 16, scale: 0.98 },
  },
  full: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
};

const panelClass: Record<Variant, string> = {
  right: "absolute inset-y-0 right-0 w-full max-w-md",
  left: "absolute inset-y-0 left-0 w-full max-w-sm",
  top: "absolute inset-x-0 top-0 max-h-[92dvh]",
  center: "relative m-4 w-full max-w-5xl max-h-[calc(100dvh-2rem)] rounded-2xl",
  full: "absolute inset-0",
};

/** Accessible modal dialog / drawer: focus trap, Escape to close, scroll lock and focus return. */
export function Dialog({
  open,
  onClose,
  title,
  hideTitle,
  variant = "right",
  children,
  closeLabel,
  className = "",
  initialFocusSelector,
  footer,
  headerExtra,
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    restoreRef.current = document.activeElement as HTMLElement | null;
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    const focusFirst = () => {
      const panel = panelRef.current;
      if (!panel) return;
      const target =
        (initialFocusSelector && panel.querySelector<HTMLElement>(initialFocusSelector)) ||
        panel.querySelector<HTMLElement>("[data-autofocus]") ||
        panel.querySelector<HTMLElement>(FOCUSABLE);
      (target ?? panel).focus({ preventScroll: true });
    };
    const raf = requestAnimationFrame(focusFirst);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (!panelRef.current.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      const r = restoreRef.current;
      if (r && document.contains(r)) r.focus({ preventScroll: true });
    };
  }, [open, initialFocusSelector]);

  const m = panelMotion[variant];
  return (
    <AnimatePresence>
      {open && (
        <div className={`fixed inset-0 z-[80] ${variant === "center" ? "flex items-center justify-center" : ""}`}>
          <motion.div
            className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className={`${panelClass[variant]} flex flex-col overflow-hidden bg-bone shadow-2xl outline-none ${className}`}
            initial={m.initial}
            animate={m.animate}
            exit={m.exit}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className={
                hideTitle
                  ? "absolute right-2 top-2 z-10"
                  : "flex items-center justify-between gap-4 border-b border-line px-5 py-3"
              }
            >
              <h2 id={titleId} className={hideTitle ? "sr-only" : "display text-2xl"}>
                {title}
              </h2>
              <div className="flex items-center gap-1">
                {headerExtra}
                <button type="button" className="icon-btn bg-bone/85" onClick={onClose} aria-label={closeLabel}>
                  <X size={20} strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
            {footer && <div className="border-t border-line bg-paper px-5 py-4">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
