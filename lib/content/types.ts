export interface Section {
  heading: string;
  paragraphs: string[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface Story {
  slug: string;
  title: string;
  dek: string;
  date: string; // ISO
  image: string;
  imageAlt: string;
  body: string[];
  pull: string;
}

export interface SizeTable {
  caption: string;
  headers: string[];
  rows: string[][];
}

export interface SiteContent {
  about: { intro: string; sections: Section[]; quote: string; portraitAlt: string; studioAlt: string };
  journal: { intro: string; stories: Story[]; readMore: string; backToJournal: string };
  help: { intro: string; faq: FaqItem[] };
  delivery: { intro: string; sections: Section[] };
  sizeGuide: { intro: string; howTo: Section; tables: SizeTable[] };
  privacy: { intro: string; sections: Section[] };
  terms: { intro: string; sections: Section[] };
  demo: { intro: string; sections: Section[] };
}
