"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Banknote, Building2, Check, CreditCard, ShieldAlert, Store } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { generateOrderCode, type PaymentLabel } from "@/lib/demo-orders";
import { useI18n } from "@/lib/i18n/client";
import { BagLines, PromoForm, ShippingChoice, TotalsTable, useBag } from "./BagContents";

type Fields = { firstName: string; lastName: string; email: string; street: string; postcode: string; city: string };

/** A clearly fictional sample identity. Kept only in component state — never persisted. */
const SAMPLE: Record<string, Fields> = {
  en: { firstName: "Lena", lastName: "Demo", email: "lena.demo@example.com", street: "Sample Street 12", postcode: "1000", city: "Brussels" },
  nl: { firstName: "Lena", lastName: "Demo", email: "lena.demo@example.com", street: "Voorbeeldstraat 12", postcode: "1000", city: "Brussel" },
  fr: { firstName: "Lena", lastName: "Demo", email: "lena.demo@example.com", street: "Rue de l’Exemple 12", postcode: "1000", city: "Bruxelles" },
};

const STEP_KEYS = ["bag", "delivery", "shipping", "payment", "review"] as const;

export function CheckoutFlow() {
  const { t, fill, money, href, locale } = useI18n();
  const router = useRouter();
  const { lines, totals, shop } = useBag();
  const [step, setStep] = useState(0);
  const [fields, setFields] = useState<Fields>(SAMPLE[locale]);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [payment, setPayment] = useState<PaymentLabel | null>(null);
  const [paymentError, setPaymentError] = useState(false);
  const [placing, setPlacing] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  if (!shop.hydrated) return <div className="h-96 animate-pulse rounded-sm bg-paper" aria-hidden="true" />;

  if (!lines.length && !placing) {
    return (
      <div className="rounded-sm bg-paper px-6 py-20 text-center">
        <p className="display text-3xl">{t.checkout.emptyBag}</p>
        <Link href={href("/shop/")} className="btn btn-primary mt-8">
          {t.common.continueShopping}
        </Link>
      </div>
    );
  }

  const validate = (): boolean => {
    const e: Partial<Record<keyof Fields, string>> = {};
    (Object.keys(fields) as (keyof Fields)[]).forEach((k) => {
      if (!fields[k].trim()) e[k] = t.checkout.required;
    });
    if (!e.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = t.checkout.invalidEmail;
    if (!e.postcode && !/^\d{4}$/.test(fields.postcode.trim())) e.postcode = t.checkout.invalidPostcode;
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) document.getElementById(`co-${first}`)?.focus();
    return !first;
  };

  const next = () => {
    if (step === 1 && !validate()) return;
    if (step === 3 && !payment) {
      setPaymentError(true);
      return;
    }
    setStep((s) => Math.min(STEP_KEYS.length - 1, s + 1));
  };

  const place = () => {
    if (!payment) return;
    setPlacing(true);
    const code = generateOrderCode();
    shop.recordOrder({
      code,
      createdAt: new Date().toISOString(),
      items: lines.map((l) => ({ productId: l.productId, size: l.size, quantity: l.quantity, unitPrice: l.product.price })),
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping,
      total: totals.total,
      shippingMethod: shop.shippingMethod,
      payment,
      promo: shop.promo,
    });
    // Personal fields are discarded here; only the non-personal order record was stored.
    setFields(SAMPLE[locale]);
    router.push(href(`/order-confirmation/?code=${code}`));
  };

  const fieldDefs: { key: keyof Fields; label: string; type?: string; auto: string; half?: boolean }[] = [
    { key: "firstName", label: t.checkout.firstName, auto: "off", half: true },
    { key: "lastName", label: t.checkout.lastName, auto: "off", half: true },
    { key: "email", label: t.checkout.email, type: "email", auto: "off" },
    { key: "street", label: t.checkout.street, auto: "off" },
    { key: "postcode", label: t.checkout.postcode, auto: "off", half: true },
    { key: "city", label: t.checkout.city, auto: "off", half: true },
  ];

  const payments: { id: PaymentLabel; label: string; icon: React.ReactNode }[] = [
    { id: "card", label: t.checkout.payCard, icon: <CreditCard size={20} aria-hidden="true" /> },
    { id: "bank", label: t.checkout.payBank, icon: <Building2 size={20} aria-hidden="true" /> },
    { id: "pickup", label: t.checkout.payPickup, icon: <Banknote size={20} aria-hidden="true" /> },
  ];

  const titles = [t.bag.title, t.checkout.deliveryTitle, t.checkout.methodTitle, t.checkout.paymentTitle, t.checkout.reviewTitle];

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_24rem] lg:gap-16">
      <div>
        <p className="mb-6 flex items-start gap-3 rounded-lg border border-burgundy/30 bg-rose-soft px-4 py-3 text-sm" role="note">
          <ShieldAlert size={18} className="mt-0.5 shrink-0 text-burgundy" aria-hidden="true" />
          {t.checkout.disclaimer}
        </p>

        <nav aria-label={fill(t.checkout.stepOf, { n: step + 1, total: STEP_KEYS.length })}>
          <ol className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {STEP_KEYS.map((k, i) => (
              <li key={k} className="flex-1">
                <button
                  type="button"
                  disabled={i > step}
                  onClick={() => i < step && setStep(i)}
                  aria-current={i === step ? "step" : undefined}
                  className="w-full text-left disabled:cursor-default"
                >
                  <span className={`block h-1 rounded-full transition-colors ${i <= step ? "bg-burgundy" : "bg-line"}`} aria-hidden="true" />
                  <span className={`mt-2 flex items-center gap-1 whitespace-nowrap text-xs ${i === step ? "font-semibold" : "text-taupe"}`}>
                    {i < step && <Check size={12} aria-hidden="true" />}
                    {i + 1}. {t.checkout.steps[k]}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <AnimatePresence mode="wait">
          <motion.section
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8"
            aria-labelledby="step-title"
          >
            <p className="eyebrow">{fill(t.checkout.stepOf, { n: step + 1, total: STEP_KEYS.length })}</p>
            <h2 id="step-title" ref={headingRef} tabIndex={-1} className="display mt-2 text-4xl outline-none" data-testid="step-title">
              {titles[step]}
            </h2>

            {step === 0 && (
              <div className="mt-4">
                <BagLines />
                <div className="mt-4 max-w-sm">
                  <PromoForm />
                </div>
              </div>
            )}

            {step === 1 && (
              <form
                className="mt-6"
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  next();
                }}
              >
                <p className="mb-6 rounded-lg bg-sand px-4 py-3 text-sm">{t.checkout.sampleNote}</p>
                {Object.keys(errors).length > 0 && (
                  <p className="mb-4 text-sm text-danger" role="alert">
                    {t.checkout.errorSummary}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {fieldDefs.map((f) => (
                    <div key={f.key} className={f.half ? "col-span-2 sm:col-span-1" : "col-span-2"}>
                      <label htmlFor={`co-${f.key}`} className="label">
                        {f.label}
                      </label>
                      <input
                        id={`co-${f.key}`}
                        type={f.type ?? "text"}
                        autoComplete={f.auto}
                        inputMode={f.key === "postcode" ? "numeric" : undefined}
                        value={fields[f.key]}
                        onChange={(e) => {
                          setFields((s) => ({ ...s, [f.key]: e.target.value }));
                          setErrors((er) => ({ ...er, [f.key]: undefined }));
                        }}
                        aria-invalid={Boolean(errors[f.key])}
                        aria-describedby={errors[f.key] ? `co-${f.key}-err` : undefined}
                        className="field"
                      />
                      {errors[f.key] && (
                        <p id={`co-${f.key}-err`} className="mt-1 text-xs text-danger">
                          {errors[f.key]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <button type="submit" className="sr-only">
                  {t.checkout.next}
                </button>
              </form>
            )}

            {step === 2 && (
              <div className="mt-6 max-w-lg">
                <ShippingChoice name="co-shipping" />
              </div>
            )}

            {step === 3 && (
              <fieldset className="mt-6 max-w-lg" aria-describedby="pay-note">
                <legend className="sr-only">{t.checkout.paymentTitle}</legend>
                <p id="pay-note" className="mb-4 text-sm text-taupe">
                  {t.checkout.paymentNote}
                </p>
                <div className="grid gap-2">
                  {payments.map((p) => (
                    <label
                      key={p.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                        payment === p.id ? "border-ink bg-paper" : "border-line hover:border-champagne"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={p.id}
                        checked={payment === p.id}
                        onChange={() => {
                          setPayment(p.id);
                          setPaymentError(false);
                        }}
                        className="accent-burgundy"
                      />
                      {p.icon}
                      <span className="text-sm font-semibold">{p.label}</span>
                    </label>
                  ))}
                </div>
                {paymentError && (
                  <p className="mt-2 text-sm text-danger" role="alert">
                    {t.checkout.required}
                  </p>
                )}
              </fieldset>
            )}

            {step === 4 && (
              <div className="mt-6 grid gap-6">
                <dl className="grid gap-4 rounded-lg bg-paper p-5 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="eyebrow">{t.checkout.deliverTo}</dt>
                    <dd className="mt-1">
                      {fields.firstName} {fields.lastName}
                      <br />
                      {fields.street}
                      <br />
                      {fields.postcode} {fields.city}
                    </dd>
                    <button type="button" className="link-underline mt-1 text-xs" onClick={() => setStep(1)}>
                      {t.checkout.edit}
                    </button>
                  </div>
                  <div>
                    <dt className="eyebrow">{t.checkout.method}</dt>
                    <dd className="mt-1 flex items-center gap-1.5">
                      <Store size={15} aria-hidden="true" />
                      {shop.shippingMethod === "home" ? t.bag.shippingHome : t.bag.shippingPickup}
                    </dd>
                    <button type="button" className="link-underline mt-1 text-xs" onClick={() => setStep(2)}>
                      {t.checkout.edit}
                    </button>
                  </div>
                  <div>
                    <dt className="eyebrow">{t.checkout.payment}</dt>
                    <dd className="mt-1">{payments.find((p) => p.id === payment)?.label}</dd>
                    <button type="button" className="link-underline mt-1 text-xs" onClick={() => setStep(3)}>
                      {t.checkout.edit}
                    </button>
                  </div>
                </dl>
                <BagLines readOnly />
              </div>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
              {step > 0 ? (
                <button type="button" className="btn btn-outline" onClick={() => setStep((s) => s - 1)}>
                  {t.checkout.previous}
                </button>
              ) : (
                <Link href={href("/bag/")} className="btn btn-outline">
                  {t.bag.viewBag}
                </Link>
              )}
              {step < STEP_KEYS.length - 1 ? (
                <button type="button" className="btn btn-primary" onClick={next} data-testid="checkout-next">
                  {t.checkout.next}
                </button>
              ) : (
                <button type="button" className="btn btn-accent" onClick={place} disabled={placing} data-testid="place-order">
                  {placing ? t.checkout.placing : `${t.checkout.placeOrder} · ${money(totals.total)}`}
                </button>
              )}
            </div>
          </motion.section>
        </AnimatePresence>
      </div>

      <aside aria-labelledby="co-summary" className="h-fit space-y-5 rounded-sm bg-paper p-6 lg:sticky lg:top-24">
        <h2 id="co-summary" className="display text-3xl">
          {t.bag.summary}
        </h2>
        <ul className="space-y-1 text-sm">
          {lines.map((l) => (
            <li key={`${l.productId}-${l.size}`} className="flex justify-between gap-3">
              <span className="truncate">
                {l.quantity} × {l.product.copy.name} <span className="text-taupe">({l.size === "One Size" ? t.common.oneSize : l.size})</span>
              </span>
              <span className="tabular-nums">{money(l.product.price * l.quantity)}</span>
            </li>
          ))}
        </ul>
        <TotalsTable />
      </aside>
    </div>
  );
}
