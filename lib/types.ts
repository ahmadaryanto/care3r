export type WorkMode = "Remote" | "Hybrid" | "On-site";
export type EmploymentType = "Full-time" | "Contract" | "Internship" | "Part-time";
export type Seniority = "Entry" | "Mid" | "Senior" | "Lead" | "Principal" | "Head";
export type Category =
  | "Engineering"
  | "Product"
  | "Design"
  | "Business Development"
  | "Marketing"
  | "Community"
  | "Research"
  | "Operations"
  | "Ecosystem Growth"
  | "DevRel"
  | "Security"
  | "Data"
  | "AI x Crypto";

export type Ecosystem =
  | "Solana"
  | "Ethereum"
  | "Avalanche"
  | "Bitcoin"
  | "DeFi"
  | "Infra"
  | "L2"
  | "AI x Crypto"
  | "Gaming"
  | "Consumer Crypto"
  | "Venture / Fund"
  | "DAO"
  | "Protocol"
  | "Startup"
  | "Multi-chain";

export type CompanyType =
  | "Protocol"
  | "Startup"
  | "Fund"
  | "Infrastructure"
  | "Exchange"
  | "DAO"
  | "Research"
  | "Agency"
  | "Consumer";

export interface Job {
  id: string;
  title: string;
  company: string;
  source: string;
  source_url: string;
  apply_url: string;
  location: string;
  remote: boolean;
  work_mode: WorkMode;
  employment_type: EmploymentType;
  category: Category;
  seniority: Seniority;
  description: string;
  requirements: string[];
  responsibilities: string[];
  nice_to_have: string[];
  tags: string[];
  ecosystem: Ecosystem;
  company_type: CompanyType;
  date_posted: string; // ISO date
  date_added: string;
  featured: boolean;
  expired: boolean;
  curator_note?: string;
  compensation?: string; // e.g. "$140k–180k + equity" or "Competitive"
}

export interface Source {
  id: string;
  name: string;
  url: string;
  description: string;
  ecosystem: string;
  category: string;
  last_checked: string;
  indexed_jobs_count: number;
  active: boolean;
}

export interface CuratedDrop {
  id: string;
  title: string;
  description: string;
  slug: string;
  tags: string[];
  job_ids: string[];
  date_published: string;
  featured: boolean;
}
