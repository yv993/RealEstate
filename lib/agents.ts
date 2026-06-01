import { IMG } from "./data";

export type Agent = {
  slug: string;
  name: string;
  role: string;
  languages: string[];
  phone: string;
  email: string;
  img: string;
};

export const AGENTS: Agent[] = [
  { slug: "narek-avetisyan", name: "Narek Avetisyan", role: "Founder & Principal", languages: ["Armenian", "Russian", "English"], phone: "+374 10 539 853", email: "narek@evergreen.am", img: IMG("1507003211169-0a1dd7228f2d", 600) },
  { slug: "mariam-grigoryan", name: "Mariam Grigoryan", role: "Head of Curation", languages: ["Armenian", "English", "French"], phone: "+374 10 539 854", email: "mariam@evergreen.am", img: IMG("1494790108377-be9c29b29330", 600) },
  { slug: "tigran-sahakyan", name: "Tigran Sahakyan", role: "Lead Advisor", languages: ["Armenian", "Russian", "English"], phone: "+374 10 539 855", email: "tigran@evergreen.am", img: IMG("1500648767791-00dcc994a43e", 600) },
  { slug: "lilit-hovhannisyan", name: "Lilit Hovhannisyan", role: "Client Concierge", languages: ["Armenian", "Russian", "English"], phone: "+374 10 539 856", email: "lilit@evergreen.am", img: IMG("1438761681033-6461ffad8d80", 600) },
  { slug: "davit-petrosyan", name: "Davit Petrosyan", role: "Investment Advisor", languages: ["Armenian", "English", "Russian"], phone: "+374 10 539 857", email: "davit@evergreen.am", img: IMG("1463453091185-61582044d556", 600) },
  { slug: "anahit-sargsyan", name: "Anahit Sargsyan", role: "Regional Specialist", languages: ["Armenian", "Russian", "English"], phone: "+374 10 539 858", email: "anahit@evergreen.am", img: IMG("1573497019940-1c28c88b4f3e", 600) },
];

/** Deterministically assign an agent to a property so each listing has a contact. */
export const agentForProperty = (id: number) => AGENTS[id % AGENTS.length];
