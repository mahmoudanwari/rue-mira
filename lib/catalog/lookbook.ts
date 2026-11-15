import type { Locale } from "../config";
import { IMAGE_MAP } from "./index";

/** Hotspot positions (% of image width/height) placed on each supplied lookbook photo. */
const HOTSPOTS: Record<string, Record<string, { x: number; y: number }>> = {
  "look-01": { "rm-009": { x: 60, y: 28 }, "rm-019": { x: 41, y: 36 }, "rm-012": { x: 52, y: 66 } },
  "look-02": { "rm-008": { x: 50, y: 28 }, "rm-018": { x: 68, y: 38 }, "rm-013": { x: 44, y: 66 } },
  "look-03": { "rm-005": { x: 55, y: 50 }, "rm-022": { x: 32, y: 66 }, "rm-027": { x: 52, y: 92 } },
  "look-04": { "rm-029": { x: 54, y: 15 }, "rm-003": { x: 55, y: 46 }, "rm-025": { x: 43, y: 93 } },
  "look-05": { "rm-007": { x: 54, y: 24 }, "rm-016": { x: 36, y: 33 }, "rm-021": { x: 42, y: 44 }, "rm-015": { x: 52, y: 70 } },
  "look-06": { "rm-011": { x: 48, y: 30 }, "rm-020": { x: 34, y: 46 }, "rm-012": { x: 50, y: 70 }, "rm-026": { x: 52, y: 93 } },
};

const TITLES: Record<string, Record<Locale, { title: string; note: string }>> = {
  "look-01": {
    en: { title: "City Morning", note: "A crisp oversized shirt, wide denim and a small burgundy bag for errands that turn into coffee." },
    nl: { title: "City Morning", note: "Een fris oversized hemd, wijde denim en een klein bordeaux tasje voor boodschappen die eindigen op een terras." },
    fr: { title: "City Morning", note: "Une chemise oversize nette, un denim large et un petit sac bordeaux pour des courses qui finissent en terrasse." },
  },
  "look-02": {
    en: { title: "Soft Tailoring", note: "Champagne satin and sand pleats under a charcoal blazer — structure without stiffness." },
    nl: { title: "Soft Tailoring", note: "Champagne satijn en zandkleurige plooien onder een antraciet blazer — structuur zonder stijfheid." },
    fr: { title: "Soft Tailoring", note: "Satin champagne et plis sable sous un blazer anthracite — de la structure sans raideur." },
  },
  "look-03": {
    en: { title: "Weekend Light", note: "An olive floral dress, a woven shopper and easy tan sandals for long, slow Saturdays." },
    nl: { title: "Weekend Light", note: "Een olijfgroene bloemenjurk, een gevlochten shopper en makkelijke cognac sandalen voor lange, trage zaterdagen." },
    fr: { title: "Weekend Light", note: "Une robe fleurie olive, un cabas tressé et des sandales camel pour les longs samedis tranquilles." },
  },
  "look-04": {
    en: { title: "After Hours", note: "Dusty rose satin, burgundy slingbacks and a flash of warm gold." },
    nl: { title: "After Hours", note: "Oudroze satijn, bordeaux slingbacks en een vleugje warm goud." },
    fr: { title: "After Hours", note: "Satin vieux rose, slingbacks bordeaux et une touche d’or chaud." },
  },
  "look-05": {
    en: { title: "Workday Edit", note: "Ivory rib, espresso trousers and a cropped trench — the uniform that still feels like you." },
    nl: { title: "Workday Edit", note: "Ivoren rib, een espresso broek en een korte trench — een uniform dat toch als jezelf voelt." },
    fr: { title: "Workday Edit", note: "Côtes ivoire, pantalon espresso et trench court — un uniforme qui vous ressemble." },
  },
  "look-06": {
    en: { title: "Easy Sunday", note: "Oatmeal knit, wide jeans, clean sneakers and a canvas tote for the market run." },
    nl: { title: "Easy Sunday", note: "Havermoutkleurig breiwerk, wijde jeans, strakke sneakers en een canvas shopper voor de markt." },
    fr: { title: "Easy Sunday", note: "Maille flocon d’avoine, jean large, baskets nettes et cabas en toile pour le marché." },
  },
};

export interface Look {
  id: string;
  image: string;
  title: string;
  note: string;
  productIds: string[];
  hotspots: { productId: string; x: number; y: number }[];
}

export function getLooks(locale: Locale): Look[] {
  return IMAGE_MAP.lookbook.map((l) => ({
    id: l.id,
    image: l.image,
    title: TITLES[l.id]?.[locale].title ?? l.title_en,
    note: TITLES[l.id]?.[locale].note ?? "",
    productIds: l.product_ids,
    hotspots: l.product_ids.map((pid, i) => ({ productId: pid, ...(HOTSPOTS[l.id]?.[pid] ?? { x: 50, y: 20 + i * 20 }) })),
  }));
}
