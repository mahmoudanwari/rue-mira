"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/client";

/** Demo-only contact form: input lives in component state and is discarded on submit. Nothing is sent. */
export function ContactForm() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  if (sent) {
    return (
      <p role="status" className="rounded-sm bg-paper p-6 leading-relaxed">
        {t.contact.sent}
      </p>
    );
  }
  return (
    <form
      noValidate
      className="grid gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = new FormData(form);
        const errs: Record<string, boolean> = {};
        for (const k of ["name", "email", "message"]) if (!String(data.get(k) ?? "").trim()) errs[k] = true;
        if (!errs.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.get("email")))) errs.email = true;
        setErrors(errs);
        if (Object.keys(errs).length) {
          form.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
          return;
        }
        form.reset();
        setSent(true);
      }}
    >
      <p className="rounded-lg bg-sand px-4 py-3 text-sm">{t.contact.intro}</p>
      {(
        [
          ["name", t.contact.name, "text"],
          ["email", t.contact.email, "email"],
        ] as const
      ).map(([name, label, type]) => (
        <div key={name}>
          <label htmlFor={`c-${name}`} className="label">
            {label}
          </label>
          <input
            id={`c-${name}`}
            name={name}
            type={type}
            autoComplete="off"
            className="field"
            aria-invalid={Boolean(errors[name])}
            aria-describedby={errors[name] ? `c-${name}-e` : undefined}
          />
          {errors[name] && (
            <p id={`c-${name}-e`} className="mt-1 text-xs text-danger">
              {name === "email" ? t.checkout.invalidEmail : t.checkout.required}
            </p>
          )}
        </div>
      ))}
      <div>
        <label htmlFor="c-topic" className="label">
          {t.contact.topic}
        </label>
        <select id="c-topic" name="topic" className="field">
          {t.contact.topics.split(",").map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="c-message" className="label">
          {t.contact.message}
        </label>
        <textarea
          id="c-message"
          name="message"
          rows={5}
          className="field"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "c-message-e" : undefined}
        />
        {errors.message && (
          <p id="c-message-e" className="mt-1 text-xs text-danger">
            {t.checkout.required}
          </p>
        )}
      </div>
      <button type="submit" className="btn btn-primary justify-self-start">
        {t.contact.send}
      </button>
    </form>
  );
}
