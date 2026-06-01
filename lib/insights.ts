import type { SceneKey } from "./scenes";

export type ArticleSection = { heading?: string; body: string };
export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  author: string;
  scene: SceneKey;
  sections: ArticleSection[];
};

export const ARTICLES: Article[] = [
  {
    slug: "buying-an-apartment-in-central-yerevan",
    title: "Buying an Apartment in Central Yerevan: A 2026 Guide",
    excerpt: "What to know about prices, districts, and the buying process in the heart of the capital.",
    date: "2026-04-12",
    author: "Narek Avetisyan",
    scene: "city",
    sections: [
      {
        body: "Central Yerevan — Kentron — remains the most sought-after address in Armenia. Demand is steady, supply is limited, and a renovated apartment near Republic Square or the Cascade tends to hold its value through market cycles. For most buyers, the question isn't whether to buy in Kentron, but which street, which floor, and which building era.",
      },
      {
        heading: "Old stock vs. new builds",
        body: "Soviet-era buildings often offer larger rooms and tall ceilings at lower price-per-square-metre, but may need full renovation. Newer developments cost more up front yet arrive with modern wiring, elevators, and parking. Weigh the renovation budget honestly: a beautiful pre-war flat can become expensive once you factor in plumbing, heating, and windows.",
      },
      {
        heading: "The process, in brief",
        body: "Once you've agreed terms, the sale is registered at the State Committee of the Real Property Cadastre. A clear title check and a written agreement protect both sides. Working with a local advisor keeps the paperwork — and the negotiation — calm and transparent. Plan for a few weeks from offer to keys.",
      },
    ],
  },
  {
    slug: "why-dilijan-is-a-smart-second-home-investment",
    title: "Why Dilijan Is Armenia's Smartest Second-Home Investment",
    excerpt: "Forested air, a growing community, and an easy drive from Yerevan make Dilijan a standout.",
    date: "2026-03-03",
    author: "Mariam Grigoryan",
    scene: "dilijanForest",
    sections: [
      {
        body: "Often called Armenia's 'Little Switzerland,' Dilijan pairs forested hills and mineral springs with a quietly growing community. For buyers seeking a weekend retreat that also rents well in summer, few places in Armenia balance lifestyle and return as neatly.",
      },
      {
        heading: "Lifestyle that holds value",
        body: "Clean air, hiking trails, and proximity to a respected international school have drawn families and remote workers. That steady, year-round interest supports both resale and seasonal rental demand — a healthier foundation than purely speculative markets.",
      },
      {
        heading: "What to look for",
        body: "Prioritise homes with genuine forest or valley views, reliable access in winter, and a sound heating system. A well-built house on a quiet lane will outperform a larger property on a noisy road every time.",
      },
    ],
  },
  {
    slug: "renting-vs-buying-in-armenia",
    title: "Renting vs Buying in Armenia: Which Makes Sense for You?",
    excerpt: "A clear-eyed look at when renting wins, when buying wins, and how to decide.",
    date: "2026-02-10",
    author: "Tigran Sahakyan",
    scene: "valley",
    sections: [
      {
        body: "Both renting and buying can be the right call — it depends on your timeline, your liquidity, and how settled you feel. The mistake is treating one as universally smarter. Here's a simple way to think it through.",
      },
      {
        heading: "When renting wins",
        body: "If you're new to a city or region, renting first lets you learn the neighbourhoods before committing capital. It also keeps you flexible if your plans might change within a year or two. Furnished rentals in Yerevan and the regions make a soft landing easy.",
      },
      {
        heading: "When buying wins",
        body: "If you intend to stay several years, buying usually beats renting once you account for stability and the chance of appreciation in prime areas. Ownership also lets you renovate to your taste — something renters rarely recoup. Run the numbers on a realistic horizon, not a single year.",
      },
    ],
  },
];

export const getArticle = (slug: string) => ARTICLES.find((a) => a.slug === slug);

export function readingMinutes(a: Article): number {
  const words = a.sections.reduce((n, s) => n + (s.heading ? s.heading.split(/\s+/).length : 0) + s.body.split(/\s+/).length, 0);
  return Math.max(1, Math.round(words / 200));
}
