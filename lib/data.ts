// EverGreen — shared content data (Armenia edition, EstateDesg styling)
export const IMG = (id: string, w?: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w || 900}&q=80`;

export type Property = {
  id: number;
  price: number;
  title: string;
  location: string;
  type: string;
  beds: number;
  baths: number;
  area: number;
  badge: string;
  img: string;
  description: string;
  yearBuilt: number;
  garage: number;
  gallery: string[];
  features: string[];
  listingType: "sale" | "rent";
  rentPeriod?: "month";
  lat: number;
  lng: number;
};

// A small reusable gallery built from the existing IMG helper.
const gallery = (...ids: string[]) => ids.map((id) => IMG(id, 1200));

// Verified-loading Unsplash photo pools (exteriors + clean interiors, no people).
const HOUSE_POOL = [
  "1568605114967-8130f3a36994", "1570129477492-45c003edd2be", "1600585154340-be6161a56a0c",
  "1600596542815-ffad4c1539a9", "1564013799919-ab600027ffc6", "1605276374104-dee2a0ed3cd6",
  "1613490493576-7fde63acd811", "1512917774080-9991f1c4c750", "1576941089067-2de3c901e126",
];
const INTERIOR_POOL = [
  "1502672260266-1c1ef2d93688", "1522708323590-d24dbb6b0267", "1583847268964-b28dc8f51f92",
  "1600210492493-0946911123ea", "1560185007-cde436f6a4d0",
];

const rotate = <T,>(arr: T[], n: number) => {
  const k = ((n % arr.length) + arr.length) % arr.length;
  return [...arr.slice(k), ...arr.slice(0, k)];
};

// One scenic shot matching the property's Armenian town (ids mirror lib/scenes).
function sceneIdForLocation(loc: string): string {
  if (loc.includes("Dilijan") || loc.includes("Ijevan")) return "1441974231531-c6227db76b6e"; // forest
  if (loc.includes("Tsaghkadzor")) return "1506905925346-21bda4d32df4"; // mountains
  if (loc.includes("Sevan")) return "1439066615861-d1af74d74000"; // lake
  if (loc.includes("Jermuk") || loc.includes("Goris")) return "1464822759023-fed622ff2c3b"; // valley
  return "1565008576549-57569a49371d"; // Yerevan / Gyumri / default → city
}

// 6–7 images: the property's own exterior, three interiors, two more exteriors,
// and one scenic shot of its town.
function buildGallery(p: { id: number; img: string; location: string }): string[] {
  const main = p.img.replace("w=900", "w=1200");
  const inter = rotate(INTERIOR_POOL, p.id).slice(0, 3).map((id) => IMG(id, 1200));
  const ext = rotate(HOUSE_POOL, p.id + 2).slice(0, 2).map((id) => IMG(id, 1200));
  const scene = IMG(sceneIdForLocation(p.location), 1200);
  return [...new Set([main, ...inter, ...ext, scene])].slice(0, 7);
}

/** Formats a price, adding "/ month" for rentals. */
export function formatPrice(p: Pick<Property, "price" | "listingType" | "rentPeriod">) {
  const base = "$" + p.price.toLocaleString("en-US");
  return p.listingType === "rent" ? `${base} / ${p.rentPeriod ?? "month"}` : base;
}

const RAW: Omit<Property, "lat" | "lng">[] = [
  // ---- For sale -----------------------------------------------------------
  {
    id: 1, listingType: "sale", price: 285000, title: "Kentron Central Apartment", location: "Yerevan – Kentron",
    type: "Apartment", beds: 3, baths: 2, area: 110, badge: "For Sale", img: IMG("1568605114967-8130f3a36994"),
    yearBuilt: 2018, garage: 1,
    description:
      "A bright apartment just steps from Republic Square and the Cascade, in the lively heart of Yerevan. Tall windows, a renovated kitchen, and a balcony overlooking the tree-lined avenue make city living feel calm.",
    gallery: gallery("1568605114967-8130f3a36994", "1600585154340-be6161a56a0c", "1600607687939-ce8a6c25118c", "1512917774080-9991f1c4c750", "1580587771525-78b9dba3b914"),
    features: ["Renovated kitchen", "City-center location", "Balcony over the avenue", "Central heating", "Walk to the Cascade", "Secure entrance"],
  },
  {
    id: 2, listingType: "sale", price: 340000, title: "Arabkir Hillside Home", location: "Yerevan – Arabkir",
    type: "House", beds: 4, baths: 2, area: 180, badge: "For Sale", img: IMG("1570129477492-45c003edd2be"),
    yearBuilt: 2016, garage: 2,
    description:
      "A family house on the quiet uphill streets of Arabkir, with a private garden and clear views toward Mount Ararat. Spacious rooms, warm finishes, and a calm setting just minutes from the city center.",
    gallery: gallery("1570129477492-45c003edd2be", "1600596542815-ffad4c1539a9", "1605276374104-dee2a0ed3cd6", "1512917774080-9991f1c4c750", "1576941089067-2de3c901e126"),
    features: ["Mount Ararat views", "Private garden", "Two-car garage", "Quiet district", "Underfloor heating", "Storage cellar"],
  },
  {
    id: 3, listingType: "sale", price: 410000, title: "Dilijan Forest Villa", location: "Dilijan",
    type: "Villa", beds: 4, baths: 3, area: 260, badge: "New", img: IMG("1600585154340-be6161a56a0c"),
    yearBuilt: 2021, garage: 2,
    description:
      "A serene villa tucked into the forests of Dilijan — Armenia's \"Little Switzerland.\" Vaulted ceilings, a stone fireplace, and a wraparound terrace bring the green hills right to your door.",
    gallery: gallery("1600585154340-be6161a56a0c", "1564013799919-ab600027ffc6", "1613490493576-7fde63acd811", "1568605114967-8130f3a36994", "1600607687939-ce8a6c25118c"),
    features: ["Forest setting", "Stone fireplace", "Wraparound terrace", "Mountain spring water", "Two-car garage", "Floor heating"],
  },
  {
    id: 4, listingType: "sale", price: 365000, title: "Tsaghkadzor Slope Chalet", location: "Tsaghkadzor",
    type: "House", beds: 4, baths: 2, area: 210, badge: "For Sale", img: IMG("1600596542815-ffad4c1539a9"),
    yearBuilt: 2019, garage: 1,
    description:
      "A mountain chalet moments from the Tsaghkadzor ropeway and ski slopes. A double-height living room, a crackling fireplace, and balconies built for fresh alpine mornings year-round.",
    gallery: gallery("1600596542815-ffad4c1539a9", "1576941089067-2de3c901e126", "1570129477492-45c003edd2be", "1564013799919-ab600027ffc6", "1605276374104-dee2a0ed3cd6"),
    features: ["Near the ski ropeway", "Mountain views", "Fireplace", "Ski storage", "Sunny balconies", "Central heating"],
  },
  {
    id: 5, listingType: "sale", price: 520000, title: "Lake Sevan View Estate", location: "Sevan",
    type: "Estate", beds: 5, baths: 3, area: 380, badge: "Available", img: IMG("1564013799919-ab600027ffc6"),
    yearBuilt: 2020, garage: 3,
    description:
      "An elegant estate set above the blue expanse of Lake Sevan, with landscaped grounds and wide terraces for long summer evenings. Generous living spaces and a guest suite make it ideal for gatherings.",
    gallery: gallery("1564013799919-ab600027ffc6", "1613490493576-7fde63acd811", "1600585154340-be6161a56a0c", "1568605114967-8130f3a36994", "1580587771525-78b9dba3b914"),
    features: ["Lake Sevan views", "Landscaped grounds", "Three-car garage", "Large terrace", "Guest suite", "Underfloor heating"],
  },
  {
    id: 6, listingType: "sale", price: 145000, title: "Gyumri Heritage House", location: "Gyumri",
    type: "House", beds: 4, baths: 2, area: 200, badge: "For Sale", img: IMG("1605276374104-dee2a0ed3cd6"),
    yearBuilt: 2002, garage: 1,
    description:
      "A characterful house in Gyumri's historic Kumayri district, built from the city's signature black-and-red tuff stone. Carefully restored interiors keep the craftsmanship while adding modern comfort.",
    gallery: gallery("1605276374104-dee2a0ed3cd6", "1570129477492-45c003edd2be", "1600596542815-ffad4c1539a9", "1576941089067-2de3c901e126", "1512917774080-9991f1c4c750"),
    features: ["Historic tuff stone", "Kumayri old district", "Restored interiors", "Inner courtyard", "Carved wood details", "Central location"],
  },
  {
    id: 7, listingType: "sale", price: 295000, title: "Jermuk Spa Villa", location: "Jermuk",
    type: "Villa", beds: 4, baths: 3, area: 240, badge: "New", img: IMG("1613490493576-7fde63acd811"),
    yearBuilt: 2022, garage: 2,
    description:
      "A restful villa in the spa town of Jermuk, famous for its mineral springs and mountain air. Light-filled rooms, a private sauna, and a balcony facing the surrounding forested gorge.",
    gallery: gallery("1613490493576-7fde63acd811", "1564013799919-ab600027ffc6", "1600585154340-be6161a56a0c", "1568605114967-8130f3a36994", "1600607687939-ce8a6c25118c"),
    features: ["Near mineral springs", "Clean mountain air", "Private sauna", "Two-car garage", "Large balcony", "Gorge views"],
  },
  {
    id: 8, listingType: "sale", price: 98000, title: "Goris Stone Cottage", location: "Goris",
    type: "House", beds: 3, baths: 1, area: 140, badge: "Available", img: IMG("1512917774080-9991f1c4c750"),
    yearBuilt: 2005, garage: 0,
    description:
      "A traditional stone cottage in Goris, framed by dramatic mountain valleys near the cave village of Old Khndzoresk. A fruit garden, a wood stove, and a quiet pace make it a true escape.",
    gallery: gallery("1512917774080-9991f1c4c750", "1576941089067-2de3c901e126", "1605276374104-dee2a0ed3cd6", "1570129477492-45c003edd2be", "1600596542815-ffad4c1539a9"),
    features: ["Traditional stone build", "Mountain valley views", "Fruit garden", "Wood stove", "Quiet setting", "Near Old Khndzoresk"],
  },
  {
    id: 9, listingType: "sale", price: 260000, title: "Ijevan Valley Retreat", location: "Ijevan",
    type: "Estate", beds: 4, baths: 3, area: 300, badge: "For Sale", img: IMG("1576941089067-2de3c901e126"),
    yearBuilt: 2017, garage: 2,
    description:
      "A green retreat in the forested Tavush region, overlooking the Aghstev river valley near Ijevan. Wide terraces, an orchard, and birdsong make it a peaceful base in Armenia's north-east.",
    gallery: gallery("1576941089067-2de3c901e126", "1600585154340-be6161a56a0c", "1564013799919-ab600027ffc6", "1605276374104-dee2a0ed3cd6", "1580587771525-78b9dba3b914"),
    features: ["Tavush forest views", "River valley setting", "Two-car garage", "Fruit orchard", "Sun terrace", "Floor heating"],
  },

  // ---- For rent -----------------------------------------------------------
  {
    id: 10, listingType: "rent", rentPeriod: "month", price: 1400, title: "Cascade District Apartment", location: "Yerevan – Kentron",
    type: "Apartment", beds: 2, baths: 1, area: 85, badge: "For Rent", img: IMG("1600607687939-ce8a6c25118c"),
    yearBuilt: 2019, garage: 0,
    description:
      "A fully furnished apartment beside the Cascade Complex, in the most walkable part of Yerevan. Bright, modern, and ready to move into, with cafés and galleries right outside the door.",
    gallery: gallery("1600607687939-ce8a6c25118c", "1568605114967-8130f3a36994", "1600585154340-be6161a56a0c", "1580587771525-78b9dba3b914", "1512917774080-9991f1c4c750"),
    features: ["Furnished", "Beside the Cascade", "Air conditioning", "Balcony", "Elevator building", "Central heating"],
  },
  {
    id: 11, listingType: "rent", rentPeriod: "month", price: 900, title: "Arabkir Modern Flat", location: "Yerevan – Arabkir",
    type: "Apartment", beds: 2, baths: 1, area: 70, badge: "For Rent", img: IMG("1580587771525-78b9dba3b914"),
    yearBuilt: 2020, garage: 0,
    description:
      "A newly renovated flat on a calm Arabkir street, fully furnished and ready for comfortable everyday living. Close to shops, schools, and quick transport into the city center.",
    gallery: gallery("1580587771525-78b9dba3b914", "1570129477492-45c003edd2be", "1600596542815-ffad4c1539a9", "1568605114967-8130f3a36994", "1576941089067-2de3c901e126"),
    features: ["Furnished", "Newly renovated", "Quiet street", "Balcony", "Parking nearby", "Internet ready"],
  },
  {
    id: 12, listingType: "rent", rentPeriod: "month", price: 1100, title: "Dilijan Garden House", location: "Dilijan",
    type: "House", beds: 3, baths: 2, area: 150, badge: "For Rent", img: IMG("1600585154340-be6161a56a0c"),
    yearBuilt: 2018, garage: 1,
    description:
      "A cozy house with a private garden on the forested edge of Dilijan, perfect for a longer stay in nature. A fireplace, a covered porch, and spring-fresh air just outside town.",
    gallery: gallery("1600585154340-be6161a56a0c", "1564013799919-ab600027ffc6", "1613490493576-7fde63acd811", "1605276374104-dee2a0ed3cd6", "1600607687939-ce8a6c25118c"),
    features: ["Private garden", "Forest setting", "Fireplace", "Off-street parking", "Furnished", "Mountain spring water"],
  },
  {
    id: 13, listingType: "rent", rentPeriod: "month", price: 750, title: "Sevan Lakeside Cabin", location: "Sevan",
    type: "House", beds: 2, baths: 1, area: 95, badge: "For Rent", img: IMG("1564013799919-ab600027ffc6"),
    yearBuilt: 2017, garage: 1,
    description:
      "A simple, charming cabin a short walk from the shores of Lake Sevan. A wood stove, a sunny terrace, and wide water views make it a favourite for seasonal getaways.",
    gallery: gallery("1564013799919-ab600027ffc6", "1576941089067-2de3c901e126", "1512917774080-9991f1c4c750", "1570129477492-45c003edd2be", "1600596542815-ffad4c1539a9"),
    features: ["Walk to Lake Sevan", "Wood stove", "Sun terrace", "Furnished", "Off-street parking", "Great for summers"],
  },
  {
    id: 14, listingType: "rent", rentPeriod: "month", price: 2200, title: "Nork Panorama Apartment", location: "Yerevan – Nork",
    type: "Apartment", beds: 3, baths: 2, area: 130, badge: "For Rent", img: IMG("1613490493576-7fde63acd811"),
    yearBuilt: 2021, garage: 1,
    description:
      "A premium apartment on the Nork heights with panoramic views across Yerevan to Mount Ararat. Fully furnished, with two balconies, underground parking, and a building concierge.",
    gallery: gallery("1613490493576-7fde63acd811", "1564013799919-ab600027ffc6", "1600585154340-be6161a56a0c", "1568605114967-8130f3a36994", "1580587771525-78b9dba3b914"),
    features: ["Panoramic city views", "Furnished", "Underground parking", "Two balconies", "Air conditioning", "Concierge"],
  },

  // ---- New listings -------------------------------------------------------
  {
    id: 15, listingType: "sale", price: 310000, title: "Nork Garden Apartment", location: "Yerevan – Nork",
    type: "Apartment", beds: 3, baths: 2, area: 125, badge: "New", img: IMG("1502672260266-1c1ef2d93688"),
    yearBuilt: 2022, garage: 1,
    description:
      "A bright, contemporary apartment on the green Nork heights, with a generous balcony framing the Yerevan skyline and Mount Ararat beyond. Move-in ready, with quality finishes throughout.",
    gallery: [],
    features: ["Ararat views", "Large balcony", "Modern finishes", "Underground parking", "Air conditioning", "Quiet street"],
  },
  {
    id: 16, listingType: "rent", rentPeriod: "month", price: 1600, title: "Opera District Flat", location: "Yerevan – Kentron",
    type: "Apartment", beds: 2, baths: 1, area: 92, badge: "For Rent", img: IMG("1522708323590-d24dbb6b0267"),
    yearBuilt: 2020, garage: 0,
    description:
      "A stylish furnished flat steps from the Opera House and Northern Avenue, in the most walkable part of Yerevan. Cafés, parks, and galleries are all at your doorstep.",
    gallery: [],
    features: ["Furnished", "By the Opera House", "Walk to Northern Avenue", "Air conditioning", "Elevator building", "Central heating"],
  },
  {
    id: 17, listingType: "sale", price: 390000, title: "Pine Slope Chalet", location: "Tsaghkadzor",
    type: "House", beds: 4, baths: 3, area: 230, badge: "For Sale", img: IMG("1600210492493-0946911123ea"),
    yearBuilt: 2021, garage: 2,
    description:
      "A warm timber-and-stone chalet on a pine slope above Tsaghkadzor, moments from the ropeway. Double-height living, a stone hearth, and balconies built for crisp mountain mornings.",
    gallery: [],
    features: ["Near the ski ropeway", "Stone fireplace", "Double-height living", "Two-car garage", "Mountain views", "Ski storage"],
  },
  {
    id: 18, listingType: "rent", rentPeriod: "month", price: 550, title: "Vardanants Square Loft", location: "Gyumri",
    type: "Apartment", beds: 2, baths: 1, area: 80, badge: "For Rent", img: IMG("1583847268964-b28dc8f51f92"),
    yearBuilt: 2019, garage: 0,
    description:
      "A characterful loft on historic Vardanants Square in Gyumri's Kumayri district, blending black-tuff heritage with a renovated, light-filled interior. Great value in Armenia's creative second city.",
    gallery: [],
    features: ["Historic Kumayri district", "Renovated interior", "High ceilings", "Furnished", "Central location", "Great value"],
  },
  {
    id: 19, listingType: "sale", price: 470000, title: "Harsnaqar Lakeview Villa", location: "Sevan",
    type: "Villa", beds: 5, baths: 3, area: 360, badge: "Available", img: IMG("1560185007-cde436f6a4d0"),
    yearBuilt: 2020, garage: 2,
    description:
      "A bright villa above Lake Sevan with wide water views, landscaped grounds, and an airy great room made for gatherings. Cool summers and a relaxed pace, an easy drive from Yerevan.",
    gallery: [],
    features: ["Lake Sevan views", "Landscaped grounds", "Great room", "Two-car garage", "Underfloor heating", "Guest suite"],
  },
  {
    id: 20, listingType: "rent", rentPeriod: "month", price: 1050, title: "Komitas Avenue Apartment", location: "Yerevan – Arabkir",
    type: "Apartment", beds: 2, baths: 1, area: 78, badge: "For Rent", img: IMG("1570129477492-45c003edd2be"),
    yearBuilt: 2018, garage: 0,
    description:
      "A comfortable, furnished apartment on leafy Komitas Avenue in Arabkir — close to shops, schools, and quick transport into the centre. An easy, everyday Yerevan home.",
    gallery: [],
    features: ["Furnished", "On Komitas Avenue", "Quiet & leafy", "Balcony", "Parking nearby", "Internet ready"],
  },
];

// Real Armenian coordinates per listing (lat, lng).
const COORDS: Record<number, { lat: number; lng: number }> = {
  1: { lat: 40.1792, lng: 44.5152 }, // Yerevan – Kentron
  2: { lat: 40.207, lng: 44.49 }, // Yerevan – Arabkir
  3: { lat: 40.74, lng: 44.862 }, // Dilijan
  4: { lat: 40.53, lng: 44.719 }, // Tsaghkadzor
  5: { lat: 40.556, lng: 44.951 }, // Sevan
  6: { lat: 40.7894, lng: 43.8475 }, // Gyumri
  7: { lat: 39.841, lng: 45.673 }, // Jermuk
  8: { lat: 39.511, lng: 46.338 }, // Goris
  9: { lat: 40.879, lng: 45.147 }, // Ijevan
  10: { lat: 40.188, lng: 44.515 }, // Yerevan – Kentron (Cascade)
  11: { lat: 40.209, lng: 44.488 }, // Yerevan – Arabkir
  12: { lat: 40.742, lng: 44.86 }, // Dilijan
  13: { lat: 40.553, lng: 44.954 }, // Sevan
  14: { lat: 40.185, lng: 44.54 }, // Yerevan – Nork
  15: { lat: 40.187, lng: 44.545 }, // Yerevan – Nork
  16: { lat: 40.183, lng: 44.513 }, // Yerevan – Kentron (Opera)
  17: { lat: 40.531, lng: 44.717 }, // Tsaghkadzor
  18: { lat: 40.788, lng: 43.846 }, // Gyumri
  19: { lat: 40.558, lng: 44.953 }, // Sevan
  20: { lat: 40.208, lng: 44.487 }, // Yerevan – Arabkir
};

// Build a richer 6–7 image gallery (interiors + exteriors + one local scenic) per listing.
export const PROPERTIES: Property[] = RAW.map((p) => ({
  ...p,
  ...COORDS[p.id],
  gallery: buildGallery(p),
}));

export const STATS = [
  { value: 100, suffix: "%", label: "Satisfied clients" },
  { value: 500, suffix: "+", label: "Homes sold across Armenia" },
  { value: 30, suffix: "+", label: "Cities & regions" },
  { value: 1500, suffix: "+", label: "Positive reviews" },
];

export const FAQS = [
  { q: "What types of properties do you offer?",
    a: "We focus on homes across Armenia — apartments in central Yerevan, family houses in Arabkir and Nork, and getaways in Dilijan, Tsaghkadzor, and by Lake Sevan. Listings span a wide range of budgets, for both buying and renting." },
  { q: "How do I know if a property is a good investment?",
    a: "Our advisors share local market data for each district and region — from Kentron to Gyumri — so you can weigh value, demand, and long-term appreciation with confidence rather than guesswork." },
  { q: "Do I need a real estate agent in Armenia?",
    a: "Not at all — our Yerevan-based team represents you end to end, from the first viewing to the notary, at no extra cost on listed properties." },
  { q: "What's the process for buying a property?",
    a: "Discovery, viewing, agreement, and registration at the State Committee of the Real Property Cadastre. We manage each stage and keep you informed throughout with a single dedicated point of contact." },
  { q: "Can I tour a property before deciding?",
    a: "Yes. Every listing can be viewed in person or through a live guided video walkthrough, scheduled around your time in Yerevan or the regions." },
];

export const TESTIMONIALS = [
  { quote: "We wanted a home near the Cascade, and EverGreen found it within a week. Calm, precise, and never pushy — buying in central Yerevan felt effortless.",
    name: "Areg Hakobyan", role: "Creative Director", img: IMG("1507003211169-0a1dd7228f2d", 400) },
  { quote: "They understood exactly what we pictured: a quiet house in Dilijan surrounded by forest. The whole process was warm, local, and professional.",
    name: "Anahit Sargsyan", role: "Architect", img: IMG("1494790108377-be9c29b29330", 400) },
  { quote: "The level of curation is unmatched. Every home they showed us across Yerevan felt hand-picked for how we actually wanted to live.",
    name: "Davit Petrosyan", role: "Founder, Noric Studio", img: IMG("1500648767791-00dcc994a43e", 400) },
];
