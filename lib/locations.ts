import type { SceneKey } from "./scenes";

export type Area = {
  slug: string;
  name: string;
  short: string; // one-line for cards
  guide: string; // 2-3 sentence area guide
  scene: SceneKey;
  /** which property locations belong to this area */
  match: (location: string) => boolean;
};

export const AREAS: Area[] = [
  {
    slug: "yerevan-kentron",
    name: "Yerevan – Kentron",
    short: "The walkable heart of the capital.",
    guide:
      "Kentron is the beating heart of Yerevan — Republic Square, the Cascade, and the city's best cafés, galleries, and theatres, all within walking distance. Apartments here put you in the middle of everything, with the energy of the capital at your door.",
    scene: "city",
    match: (l) => l.includes("Kentron"),
  },
  {
    slug: "yerevan-arabkir",
    name: "Yerevan – Arabkir",
    short: "Leafy, calm, family-friendly Yerevan.",
    guide:
      "Arabkir rises north of the centre — a calm, leafy district popular with families for its quiet streets, parks, and clear views toward Mount Ararat, yet still only minutes from downtown.",
    scene: "city",
    match: (l) => l.includes("Arabkir"),
  },
  {
    slug: "dilijan",
    name: "Dilijan",
    short: "Armenia's forested 'Little Switzerland'.",
    guide:
      "Dilijan, often called Armenia's 'Little Switzerland,' is wrapped in forested hills and mineral springs. It's a favourite for second homes and weekend escapes into nature, with a growing community and excellent schools nearby.",
    scene: "dilijanForest",
    match: (l) => l.includes("Dilijan"),
  },
  {
    slug: "tsaghkadzor",
    name: "Tsaghkadzor",
    short: "Mountain resort & ski town.",
    guide:
      "Tsaghkadzor is Armenia's premier mountain resort, known for its ski slopes and ropeway. Chalets here trade city noise for alpine air and genuine four-season living, an easy drive from Yerevan.",
    scene: "mountains",
    match: (l) => l.includes("Tsaghkadzor"),
  },
  {
    slug: "sevan",
    name: "Sevan",
    short: "Life by the great blue lake.",
    guide:
      "On the shores of Lake Sevan — one of the world's largest high-altitude lakes — Sevan offers cool summers, open water views, and a relaxed pace, all within comfortable reach of the capital.",
    scene: "lakeSevan",
    match: (l) => l.includes("Sevan"),
  },
  {
    slug: "gyumri",
    name: "Gyumri",
    short: "Historic charm at gentle prices.",
    guide:
      "Gyumri, Armenia's second city, charms with its historic Kumayri district, black-and-red tuff architecture, and a warm, creative community — all at notably gentle prices compared with the capital.",
    scene: "city",
    match: (l) => l.includes("Gyumri"),
  },
  {
    slug: "jermuk",
    name: "Jermuk",
    short: "Spa-town air and mineral springs.",
    guide:
      "Jermuk is a tranquil spa town famous for its mineral waters, waterfall, and crisp mountain air — a restorative setting for a getaway home surrounded by forested gorges.",
    scene: "valley",
    match: (l) => l.includes("Jermuk"),
  },
];

export const getArea = (slug: string) => AREAS.find((a) => a.slug === slug);
