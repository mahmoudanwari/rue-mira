import type { Section } from "@/lib/content/types";

export function SectionsProse({ sections }: { sections: Section[] }) {
  return (
    <div className="prose-rm max-w-2xl">
      {sections.map((s) => (
        <section key={s.heading}>
          <h2>{s.heading}</h2>
          {s.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </section>
      ))}
    </div>
  );
}
