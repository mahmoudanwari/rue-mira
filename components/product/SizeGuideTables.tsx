import type { SiteContent } from "@/lib/content";

export function SizeGuideTables({ guide }: { guide: SiteContent["sizeGuide"] }) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="display text-2xl">{guide.howTo.heading}</h3>
        {guide.howTo.paragraphs.map((p) => (
          <p key={p} className="mt-2 text-sm leading-relaxed text-ink/80">
            {p}
          </p>
        ))}
      </div>
      {guide.tables.map((table) => (
        <div key={table.caption} className="relative overflow-x-auto">
          <table className="w-full min-w-[18rem] border-collapse text-sm">
            <caption className="mb-2 text-left font-semibold">{table.caption}</caption>
            <thead>
              <tr className="border-b border-ink/20 text-left">
                {table.headers.map((h) => (
                  <th key={h} scope="col" className="py-2 pr-4 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row) => (
                <tr key={row.join("-")} className="border-b border-line">
                  {row.map((cell, i) =>
                    i === 0 ? (
                      <th key={i} scope="row" className="py-2 pr-4 text-left font-medium">
                        {cell}
                      </th>
                    ) : (
                      <td key={i} className="py-2 pr-4 tabular-nums text-ink/80">
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
