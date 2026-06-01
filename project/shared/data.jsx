// EverGreen — shared content data (EstateDesg styling)
const IMG = (id, w) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w || 900}&q=80`;

const PROPERTIES = [
  { id: 1, price: 1250000, title: "Cedar Ridge Residence",  location: "Aspen, Colorado",      type: "Villa",     beds: 5, baths: 2, area: 320, badge: "For Sale",  img: IMG("1568605114967-8130f3a36994") },
  { id: 2, price: 980000,  title: "Maplewood House",        location: "Portland, Oregon",     type: "House",     beds: 5, baths: 2, area: 280, badge: "For Sale",  img: IMG("1570129477492-45c003edd2be") },
  { id: 3, price: 1456745, title: "Serenity Drive Estate",  location: "Austin, Texas",        type: "Estate",    beds: 5, baths: 2, area: 410, badge: "New",       img: IMG("1600585154340-be6161a56a0c") },
  { id: 4, price: 1356798, title: "Birchwood Manor",        location: "Lake Tahoe, Nevada",   type: "Villa",     beds: 5, baths: 2, area: 365, badge: "For Sale",  img: IMG("1600596542815-ffad4c1539a9") },
  { id: 5, price: 2490899, title: "Forest Lane Villa",      location: "Denver, Colorado",     type: "Villa",     beds: 5, baths: 2, area: 480, badge: "Available", img: IMG("1564013799919-ab600027ffc6") },
  { id: 6, price: 1456745, title: "Willow Creek Cottage",   location: "Asheville, NC",        type: "House",     beds: 5, baths: 2, area: 300, badge: "For Sale",  img: IMG("1605276374104-dee2a0ed3cd6") },
  { id: 7, price: 3250000, title: "Glasshouse Pavilion",    location: "Malibu, California",   type: "Villa",     beds: 4, baths: 4, area: 540, badge: "New",       img: IMG("1613490493576-7fde63acd811") },
  { id: 8, price: 720000,  title: "Riverside Lodge",        location: "Bozeman, Montana",     type: "House",     beds: 3, baths: 2, area: 210, badge: "Available", img: IMG("1512917774080-9991f1c4c750") },
  { id: 9, price: 1890000, title: "Hillside Retreat",       location: "Santa Fe, New Mexico", type: "Estate",    beds: 4, baths: 3, area: 395, badge: "For Sale",  img: IMG("1576941089067-2de3c901e126") },
];

const STATS = [
  { value: 100, suffix: "%",  label: "Satisfied clients" },
  { value: 500, suffix: "+",  label: "Properties sold" },
  { value: 150, suffix: "+",  label: "Cities & regions" },
  { value: 2000, suffix: "+", label: "Positive reviews" },
];

const FAQS = [
  { q: "What types of properties do you sell?",
    a: "We specialize in residential, luxury, and investment properties, offering a curated range to suit every buyer's goals. We connect you with trusted lenders for competitive financing and arrange private showings so you can evaluate each home before making a decision. Listings span a wide spread of price points and locations." },
  { q: "How do I know if a property is a good investment?",
    a: "Our advisors guide you with market insight, comparable-sale data, and long-term appreciation forecasts, so every decision is grounded in evidence rather than guesswork." },
  { q: "Do I need to hire a real estate agent?",
    a: "Not at all — our in-house concierge team represents you end to end, from search to closing, at no extra cost on listed properties." },
  { q: "What's the process for buying a property?",
    a: "Discovery, private viewing, offer, financing, inspection, and closing. We manage each stage and keep you informed throughout with a single dedicated point of contact." },
  { q: "Can I tour a property before purchasing?",
    a: "Yes. Every listing can be viewed privately, in person or via a live guided virtual walkthrough scheduled at your convenience." },
];

const TESTIMONIALS = [
  { quote: "Working with this team was a pleasure. They understood our vision and helped us find a property that exceeded our expectations. We couldn't have done it without them.",
    name: "Sajibur Rahman", role: "Creative Director", img: IMG("1507003211169-0a1dd7228f2d", 400) },
  { quote: "Calm, precise, and never pushy. EverGreen turned what we feared would be stressful into the easiest decision we've made all year.",
    name: "Amara Okafor", role: "Architect", img: IMG("1494790108377-be9c29b29330", 400) },
  { quote: "The level of curation is unmatched. Every home they showed us felt hand-picked for how we actually wanted to live.",
    name: "Daniel Mercer", role: "Founder, Northwind", img: IMG("1500648767791-00dcc994a43e", 400) },
];

window.IMG = IMG;
window.PROPERTIES = PROPERTIES;
window.STATS = STATS;
window.FAQS = FAQS;
window.TESTIMONIALS = TESTIMONIALS;
