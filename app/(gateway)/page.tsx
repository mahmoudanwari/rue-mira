import Link from "next/link";
import { AssetImage } from "@/components/ui/AssetImage";
import { IMAGE_MAP } from "@/lib/catalog";
import { BASE_PATH, DESIGNER } from "@/lib/config";

const OPTIONS = [
  { locale: "en", name: "English", line: "Everyday, but never ordinary.", cta: "Enter the shop" },
  { locale: "nl", name: "Nederlands", line: "Alledaags, maar nooit gewoon.", cta: "Naar de winkel" },
  { locale: "fr", name: "Français", line: "Du quotidien, jamais ordinaire.", cta: "Entrer dans la boutique" },
] as const;

/**
 * Static language gateway (no server redirect). A tiny inline script sends returning
 * visitors to the language they chose before; everyone else picks a language here.
 */
const PREFERENCE_SCRIPT = `try{var l=localStorage.getItem("rue-mira:locale");if(l==="en"||l==="nl"||l==="fr"){location.replace(${JSON.stringify(BASE_PATH)}+"/"+l+"/")}}catch(e){}`;

export default function Gateway() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: PREFERENCE_SCRIPT }} />
      <main className="grid min-h-dvh lg:grid-cols-2">
        <div className="relative hidden lg:block">
          <AssetImage src={IMAGE_MAP.campaigns["home-hero-mobile"]} alt="" className="h-full w-full" priority sizes="50vw" />
        </div>
        <div className="flex flex-col justify-between gap-12 px-6 py-10 sm:px-12 lg:px-16">
          <div>
            <p className="display text-4xl tracking-[0.2em]">RUE MIRA</p>
            <p className="mt-3 inline-block rounded-full bg-burgundy px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
              Portfolio demo • No real purchases
            </p>
          </div>
          <div>
            <h1 className="display text-5xl sm:text-6xl">
              <span lang="en">Choose your language</span>
              <span className="mt-2 block text-2xl italic text-taupe sm:text-3xl">
                <span lang="nl">Kies je taal</span> · <span lang="fr">Choisissez votre langue</span>
              </span>
            </h1>
            <ul className="mt-10 divide-y divide-line border-y border-line">
              {OPTIONS.map((o) => (
                <li key={o.locale} lang={o.locale}>
                  <Link
                    href={`/${o.locale}/`}
                    hrefLang={o.locale}
                    className="group flex items-center justify-between gap-6 py-6"
                    data-locale={o.locale}
                  >
                    <span>
                      <span className="display block text-4xl transition-colors group-hover:text-burgundy">{o.name}</span>
                      <span className="mt-1 block text-sm text-taupe">{o.line}</span>
                    </span>
                    <span className="btn btn-outline btn-sm shrink-0 group-hover:bg-ink group-hover:text-bone">{o.cta} →</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-taupe">
            RUE MIRA is a fictional brand created for a web-design portfolio. Products, prices and policies are invented; no
            payments are processed and no personal data is collected.
            <br />
            Designed &amp; developed by{" "}
            <a href={DESIGNER.url} target="_blank" rel="noopener" className="font-semibold text-ink underline underline-offset-2">
              {DESIGNER.name}
            </a>
          </p>
        </div>
      </main>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.querySelectorAll("[data-locale]").forEach(function(a){a.addEventListener("click",function(){try{localStorage.setItem("rue-mira:locale",a.getAttribute("data-locale"))}catch(e){}})})`,
        }}
      />
    </>
  );
}
