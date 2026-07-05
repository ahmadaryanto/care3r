import { Job, Source, CuratedDrop } from "./types";

export const jobs: Job[] = [
  {
    id: "j1",
    title: "Release Engineer",
    company: "Jito Labs",
    source: "jobs.solana.com",
    source_url: "https://jobs.solana.com/jobs",
    apply_url: "https://jobs.lever.co/jito.wtf/ce477a0e-0b1d-4c64-b7d6-eb5eadaec530",
    location: "Remote",
    remote: true,
    work_mode: "Remote",
    employment_type: "Full-time",
    category: "Engineering",
    seniority: "Senior",
    description: "Own the operational execution of releases across Jito's validator, block-building, RPC, simulator, and infrastructure systems. High-impact role on core Solana MEV infrastructure.",
    requirements: [
      "Experience owning releases and deployment pipelines at scale",
      "Strong systems / DevOps background",
      "Comfortable with Rust and infrastructure tooling"
    ],
    responsibilities: [
      "Drive release processes for critical Solana components",
      "Improve deployment reliability, observability and rollback strategies",
      "Collaborate with protocol and infra engineers"
    ],
    nice_to_have: ["Previous experience at high-throughput blockchain or trading infra"],
    tags: ["Rust", "Solana", "DevOps", "Infra"],
    ecosystem: "Solana",
    company_type: "Protocol",
    date_posted: "2026-07-01",
    date_added: "2026-07-02",
    featured: true,
    expired: false,
    curator_note: "Excellent role on one of the most important pieces of Solana infrastructure.",
    compensation: "Competitive + equity"
  },
  {
    id: "j2",
    title: "Head of Ecosystem Growth",
    company: "Arbitrum Foundation",
    source: "ethereumjobboard.com",
    source_url: "https://www.ethereumjobboard.com/jobs",
    apply_url: "https://jobs.lever.co/arbitrumfoundation/5c02b8eb-58c4-47e5-ab5f-34ac1820d4a9",
    location: "Remote (Europe / APAC)",
    remote: true,
    work_mode: "Remote",
    employment_type: "Full-time",
    category: "Ecosystem Growth",
    seniority: "Head",
    description: "Lead initiatives to grow and support a vibrant community of developers, partners, and users for Arbitrum. Drive adoption across DeFi, Gaming, AI and consumer verticals.",
    requirements: [
      "10+ years in ecosystem, BD or growth in blockchain/tech",
      "Strong network in Ethereum and L2 ecosystems",
      "Proven track record scaling developer and user adoption"
    ],
    responsibilities: [
      "Define and execute ecosystem growth strategy",
      "Build partnerships and programs for key verticals",
      "Work closely with foundation, delegates and projects"
    ],
    nice_to_have: ["Previous work at major L2 or Ethereum foundation teams"],
    tags: ["Ecosystem", "Growth", "L2", "Ethereum"],
    ecosystem: "L2",
    company_type: "Protocol",
    date_posted: "2026-06-28",
    date_added: "2026-06-29",
    featured: true,
    expired: false,
    compensation: "Significant package for Head-level"
  },
  {
    id: "j3",
    title: "IT Department Lead",
    company: "Nethermind",
    source: "cryptojobslist.com",
    source_url: "https://cryptojobslist.com",
    apply_url: "https://cryptojobslist.com/jobs/it-department-lead-remote-at-nethermind",
    location: "Remote",
    remote: true,
    work_mode: "Remote",
    employment_type: "Full-time",
    category: "Operations",
    seniority: "Lead",
    description: "Own Nethermind's entire Internal IT Department (Platform Engineering, Infrastructure Security, IAM, FinOps). Critical role at a leading Ethereum infrastructure company.",
    requirements: [
      "5+ years leading IT / platform engineering teams",
      "Strong cloud, Kubernetes, DevOps/SRE experience",
      "Hands-on with security, IAM and compliance (SOC2, ISO)"
    ],
    responsibilities: [
      "Lead platform, security and infrastructure for the whole company",
      "Drive strategy alongside CIO",
      "Manage team performance and tooling (including AI workflows)"
    ],
    nice_to_have: ["Web3 / blockchain ecosystem experience"],
    tags: ["IT", "Infra", "Security", "Ethereum"],
    ecosystem: "Ethereum",
    company_type: "Protocol",
    date_posted: "2026-06-10",
    date_added: "2026-06-11",
    featured: false,
    expired: false
  },
  {
    id: "j4",
    title: "Solutions Engineer",
    company: "Aave",
    source: "jobs.avax.network",
    source_url: "https://jobs.avax.network/jobs",
    apply_url: "https://aave.com/careers",
    location: "New York / London (Hybrid)",
    remote: false,
    work_mode: "Hybrid",
    employment_type: "Full-time",
    category: "Business Development",
    seniority: "Mid",
    description: "Join Aave Labs BD team as Solutions Engineer. Bridge engineering and business development — help partners successfully integrate with Aave protocol.",
    requirements: [
      "Strong technical background (engineering or solutions)",
      "Experience with DeFi protocols and smart contracts",
      "Excellent communication and stakeholder skills"
    ],
    responsibilities: [
      "Support enterprise and partner integrations",
      "Build technical POCs and documentation",
      "Translate commercial opportunities into scalable solutions"
    ],
    nice_to_have: ["Previous experience at lending or DeFi protocol"],
    tags: ["DeFi", "Solutions", "BD", "Ethereum"],
    ecosystem: "DeFi",
    company_type: "Protocol",
    date_posted: "2026-06-24",
    date_added: "2026-06-25",
    featured: true,
    expired: false
  },
  {
    id: "j5",
    title: "Senior DevSecOps Engineer",
    company: "Crossmint",
    source: "jobs.solana.com",
    source_url: "https://jobs.solana.com/jobs",
    apply_url: "https://jobs.solana.com/jobs",
    location: "Madrid, Spain",
    remote: false,
    work_mode: "Hybrid",
    employment_type: "Full-time",
    category: "Security",
    seniority: "Senior",
    description: "Strengthen security posture and DevSecOps practices for Crossmint's infrastructure powering NFT and token experiences on Solana and other chains.",
    requirements: [
      "Strong DevSecOps / security engineering background",
      "Experience with cloud security, CI/CD hardening",
      "Familiarity with blockchain or high-scale web apps"
    ],
    responsibilities: [
      "Implement security controls and monitoring",
      "Harden deployment pipelines",
      "Collaborate with engineering on secure-by-design systems"
    ],
    nice_to_have: ["Solana or EVM experience"],
    tags: ["Security", "DevOps", "Solana"],
    ecosystem: "Solana",
    company_type: "Startup",
    date_posted: "2026-07-01",
    date_added: "2026-07-02",
    featured: false,
    expired: false
  },
  {
    id: "j6",
    title: "Cloud Infrastructure Engineer",
    company: "Alchemy",
    source: "jobs.solana.com",
    source_url: "https://jobs.solana.com/jobs",
    apply_url: "https://jobs.ashbyhq.com/alchemy/42c849ce-8a9b-4015-92fb-b8dfad5c5d0d",
    location: "San Francisco / New York",
    remote: true,
    work_mode: "Hybrid",
    employment_type: "Full-time",
    category: "Engineering",
    seniority: "Senior",
    description: "Build and scale the cloud infrastructure that powers the leading web3 development platform used by thousands of teams.",
    requirements: [
      "Deep experience with cloud infrastructure (AWS/GCP)",
      "Strong Kubernetes, Terraform, observability skills",
      "Track record running high-availability systems"
    ],
    responsibilities: [
      "Own critical parts of Alchemy's infra platform",
      "Improve reliability, cost and performance",
      "Partner with product and platform teams"
    ],
    nice_to_have: ["Previous experience at developer platform or infra company"],
    tags: ["Infra", "Cloud", "DevOps", "Ethereum"],
    ecosystem: "Infra",
    company_type: "Startup",
    date_posted: "2026-06-30",
    date_added: "2026-07-01",
    featured: true,
    expired: false
  },
  {
    id: "j7",
    title: "Account Executive",
    company: "Dune",
    source: "ethereumjobboard.com",
    source_url: "https://www.ethereumjobboard.com/jobs",
    apply_url: "https://www.ethereumjobboard.com/jobs",
    location: "Remote, Europe",
    remote: true,
    work_mode: "Remote",
    employment_type: "Full-time",
    category: "Business Development",
    seniority: "Mid",
    description: "Drive sales and adoption of Dune Analytics among protocols, funds, and data-heavy teams in the Ethereum and broader crypto ecosystem.",
    requirements: [
      "2-4 years sales or BD experience (preferably SaaS or data)",
      "Strong understanding of blockchain analytics",
      "Comfortable selling technical products"
    ],
    responsibilities: [
      "Own pipeline and close deals with strategic accounts",
      "Work with product on customer feedback",
      "Represent Dune at events and in the community"
    ],
    nice_to_have: ["Previous crypto or data tooling experience"],
    tags: ["Sales", "BD", "Analytics"],
    ecosystem: "Infra",
    company_type: "Startup",
    date_posted: "2026-06-25",
    date_added: "2026-06-26",
    featured: false,
    expired: false
  },
  {
    id: "j8",
    title: "Senior Fullstack Engineer (Backend Focus)",
    company: "RugsDotFun",
    source: "web3.career",
    source_url: "https://web3.career",
    apply_url: "https://web3.career/senior-fullstack-engineer-backend-focus-rugsdotfun/150325",
    location: "Remote",
    remote: true,
    work_mode: "Remote",
    employment_type: "Full-time",
    category: "Engineering",
    seniority: "Senior",
    description: "Build high-scale backend systems for one of the fastest growing consumer crypto platforms. Strong ownership role.",
    requirements: [
      "Strong backend experience (Node/TS or similar)",
      "Experience with high-throughput systems",
      "Interest in consumer crypto products"
    ],
    responsibilities: [
      "Design and ship core platform features",
      "Optimize performance and reliability",
      "Collaborate closely with frontend and product"
    ],
    nice_to_have: ["Solana or EVM experience"],
    tags: ["Fullstack", "Backend", "Consumer"],
    ecosystem: "Consumer Crypto",
    company_type: "Startup",
    date_posted: "2026-06-10",
    date_added: "2026-06-11",
    featured: false,
    expired: false
  },
  {
    id: "j9",
    title: "Head of Platform Engineering",
    company: "Chronicle",
    source: "cryptocurrencyjobs.co",
    source_url: "https://cryptocurrencyjobs.co",
    apply_url: "https://cryptocurrencyjobs.co/engineering/chronicle-head-of-platform-engineering/",
    location: "Remote",
    remote: true,
    work_mode: "Remote",
    employment_type: "Full-time",
    category: "Engineering",
    seniority: "Lead",
    description: "Lead platform engineering efforts building critical infrastructure for next-generation blockchain data and indexing.",
    requirements: [
      "Experience leading platform / infra teams",
      "Strong distributed systems background",
      "Passion for blockchain data problems"
    ],
    responsibilities: [
      "Define platform roadmap and architecture",
      "Build reliable high-scale data systems",
      "Mentor and grow the engineering team"
    ],
    nice_to_have: ["Previous data infra or indexing work"],
    tags: ["Platform", "Infra", "Data"],
    ecosystem: "Infra",
    company_type: "Startup",
    date_posted: "2026-07-02",
    date_added: "2026-07-03",
    featured: true,
    expired: false,
    compensation: "$180k–240k + tokens"
  },
  {
    id: "j10",
    title: "Staff Backend Engineer",
    company: "OpenSea",
    source: "ethereumjobboard.com",
    source_url: "https://www.ethereumjobboard.com/jobs",
    apply_url: "https://www.ethereumjobboard.com/jobs",
    location: "Remote (US)",
    remote: true,
    work_mode: "Remote",
    employment_type: "Full-time",
    category: "Engineering",
    seniority: "Principal",
    description: "Join OpenSea to build the future of NFTs and digital collectibles at massive scale.",
    requirements: [
      "Strong backend systems experience at scale",
      "Track record of high-impact work on consumer products",
      "Excellent coding and architecture skills"
    ],
    responsibilities: [
      "Own major backend services and APIs",
      "Drive performance and reliability improvements",
      "Collaborate with product and design"
    ],
    nice_to_have: ["Previous marketplace or consumer web experience"],
    tags: ["Backend", "NFT", "Scale"],
    ecosystem: "Consumer Crypto",
    company_type: "Startup",
    date_posted: "2026-06-15",
    date_added: "2026-06-16",
    featured: false,
    expired: false
  },
  {
    id: "j11",
    title: "ZK Proof Engineer",
    company: "Axiom",
    source: "ethereumjobboard.com",
    source_url: "https://www.ethereumjobboard.com/jobs",
    apply_url: "https://www.ethereumjobboard.com/jobs",
    location: "Remote / New York",
    remote: true,
    work_mode: "Remote",
    employment_type: "Full-time",
    category: "Engineering",
    seniority: "Senior",
    description: "Work on cutting-edge zero-knowledge proof systems and zkVM technology at Axiom.",
    requirements: [
      "Strong cryptography or systems engineering background",
      "Experience with ZK or advanced math",
      "Rust or low-level systems experience"
    ],
    responsibilities: [
      "Design and implement ZK circuits and provers",
      "Optimize proof generation performance",
      "Collaborate with research team"
    ],
    nice_to_have: ["Published work or strong open source in ZK"],
    tags: ["ZK", "Cryptography", "Ethereum"],
    ecosystem: "Ethereum",
    company_type: "Startup",
    date_posted: "2026-06-20",
    date_added: "2026-06-21",
    featured: true,
    expired: false,
    compensation: "Competitive + significant equity"
  },
  {
    id: "j12",
    title: "Senior Product Designer",
    company: "Alchemy",
    source: "jobs.solana.com",
    source_url: "https://jobs.solana.com/jobs",
    apply_url: "https://www.alchemy.com/careers",
    location: "San Francisco",
    remote: true,
    work_mode: "Hybrid",
    employment_type: "Full-time",
    category: "Design",
    seniority: "Senior",
    description: "Shape the future of web3 developer tooling and dashboards at Alchemy.",
    requirements: [
      "5+ years product design experience",
      "Strong portfolio with complex web apps and dev tools",
      "Experience collaborating closely with engineers"
    ],
    responsibilities: [
      "Own design for key product surfaces",
      "Drive user research and usability",
      "Evolve Alchemy's design system"
    ],
    nice_to_have: ["Previous web3 or developer platform experience"],
    tags: ["Design", "Product", "DevTools"],
    ecosystem: "Infra",
    company_type: "Startup",
    date_posted: "2026-06-18",
    date_added: "2026-06-19",
    featured: false,
    expired: false
  },
  {
    id: "j13",
    title: "Senior Backend Engineer (Solana)",
    company: "CoW DAO",
    source: "cryptocurrencyjobs.co",
    source_url: "https://cryptocurrencyjobs.co",
    apply_url: "https://cryptocurrencyjobs.co",
    location: "Remote",
    remote: true,
    work_mode: "Remote",
    employment_type: "Full-time",
    category: "Engineering",
    seniority: "Senior",
    description: "Build core backend infrastructure for CoW Protocol, the leading intent-based trading protocol.",
    requirements: [
      "Strong backend engineering (Rust/TS preferred)",
      "Experience with high-performance or trading systems",
      "Interest in MEV and order flow"
    ],
    responsibilities: [
      "Design and implement core protocol services",
      "Optimize for performance and correctness",
      "Work with research and frontend teams"
    ],
    nice_to_have: ["Solana or EVM experience"],
    tags: ["Backend", "Solana", "Trading"],
    ecosystem: "DeFi",
    company_type: "Protocol",
    date_posted: "2026-06-22",
    date_added: "2026-06-23",
    featured: false,
    expired: false
  },
  {
    id: "j14",
    title: "Growth Lead",
    company: "Sempo",
    source: "jobs.solana.com",
    source_url: "https://jobs.solana.com/jobs",
    apply_url: "https://jobs.solana.com/jobs",
    location: "Remote",
    remote: true,
    work_mode: "Remote",
    employment_type: "Full-time",
    category: "Marketing",
    seniority: "Lead",
    description: "Drive growth for Sempo across payments and financial inclusion use cases in emerging markets.",
    requirements: [
      "3+ years growth or marketing in fintech/crypto",
      "Strong analytical + execution skills",
      "Experience in emerging markets or payments a plus"
    ],
    responsibilities: [
      "Design and run acquisition and retention campaigns",
      "Own key growth metrics",
      "Collaborate with product and BD"
    ],
    nice_to_have: ["Previous work in emerging markets or web3 payments"],
    tags: ["Growth", "Marketing", "Payments"],
    ecosystem: "Consumer Crypto",
    company_type: "Startup",
    date_posted: "2026-06-29",
    date_added: "2026-06-30",
    featured: false,
    expired: false
  },
  {
    id: "j15",
    title: "Elite Research Scientist - Frontier AI Evaluation",
    company: "Perle",
    source: "Perle",
    source_url: "https://ats.rippling.com/perle/jobs",
    apply_url: "https://ats.rippling.com/perle/jobs/f14c681e-5431-4677-8faa-a7ab38464863",
    location: "Remote (Egypt, India, Thailand, LATAM, etc.)",
    remote: true,
    work_mode: "Remote",
    employment_type: "Contract",
    category: "Research",
    seniority: "Principal",
    description: "Join an elite, invitation-only network of top researchers to evaluate frontier AI systems. This is not annotation — it is high-rigor scientific adjudication of advanced model outputs in Mathematics, Physics, Neuroscience, or Chemistry.",
    requirements: [
      "PhD or equivalent in Mathematics, Physics, Neuroscience, or Chemistry",
      "Strong peer-reviewed publication record and citations",
      "Top-percentile credentials (Olympiad medals, faculty at leading institutions, or equivalent impact)"
    ],
    responsibilities: [
      "Evaluate advanced scientific reasoning from state-of-the-art AI models",
      "Assess multi-step derivations, proofs, and domain-specific outputs",
      "Provide research-grade corrective feedback at publication-level rigor"
    ],
    nice_to_have: ["Experience with AI model evaluation or LLM research"],
    tags: ["Research", "AI", "Evaluation", "Frontier"],
    ecosystem: "AI x Crypto",
    company_type: "Startup",
    date_posted: "2026-07-04",
    date_added: "2026-07-05",
    featured: true,
    expired: false,
    curator_note: "Extremely high bar. One of the most intellectually demanding opportunities in AI right now."
  },
  {
    id: "j16",
    title: "Egocentric Video Data Contributor",
    company: "Perle",
    source: "Perle",
    source_url: "https://ats.rippling.com/perle/jobs",
    apply_url: "https://ats.rippling.com/perle/jobs/2108cc3c-768b-4535-8e6e-a14651c0405c",
    location: "Egypt (Remote)",
    remote: true,
    work_mode: "Remote",
    employment_type: "Contract",
    category: "Data",
    seniority: "Entry",
    description: "Capture first-person (egocentric) video of everyday life and work to help train next-generation AI and robotics systems. Flexible, hands-free recording using a provided headstrap setup.",
    requirements: [
      "Based in Egypt",
      "18+ years old",
      "Supported phone (iPhone 11+, Pixel 6+, or Galaxy S21+)"
    ],
    responsibilities: [
      "Record 10+ hours per week of natural daily activities and work",
      "Wear a lightweight head-mounted phone setup (hands-free)",
      "Upload footage through the secure Perle app"
    ],
    nice_to_have: ["Experience in hands-on work (construction, kitchen, manufacturing, etc.)"],
    tags: ["Data", "AI Training", "Video"],
    ecosystem: "AI x Crypto",
    company_type: "Startup",
    date_posted: "2026-07-03",
    date_added: "2026-07-04",
    featured: false,
    expired: false
  },
  {
    id: "j17",
    title: "Expert Audio Transcriber, Swahili",
    company: "Perle",
    source: "Perle",
    source_url: "https://ats.rippling.com/perle/jobs",
    apply_url: "https://ats.rippling.com/perle/jobs/ed258dd6-dcfa-4592-a875-32830226a1a2",
    location: "DRC - Remote, Kenya - Remote",
    remote: true,
    work_mode: "Remote",
    employment_type: "Contract",
    category: "Data",
    seniority: "Mid",
    description: "High-accuracy expert transcription for Swahili to power frontier AI training and evaluation systems.",
    requirements: [
      "Native or near-native Swahili fluency",
      "Excellent listening, typing accuracy and cultural nuance"
    ],
    responsibilities: [
      "Transcribe audio with precision following detailed guidelines",
      "Deliver consistent high-quality output"
    ],
    nice_to_have: ["Previous transcription experience"],
    tags: ["Data", "Transcription", "AI", "Swahili"],
    ecosystem: "AI x Crypto",
    company_type: "Startup",
    date_posted: "2026-07-04",
    date_added: "2026-07-05",
    featured: false,
    expired: false
  },
  {
    id: "j18",
    title: "Bahasa Indonesia Language Specialist",
    company: "Perle",
    source: "Perle",
    source_url: "https://ats.rippling.com/perle/jobs",
    apply_url: "https://ats.rippling.com/perle/jobs/bc42a238-5a58-4270-b8dc-142d74fef628",
    location: "Remote (Indonesia)",
    remote: true,
    work_mode: "Remote",
    employment_type: "Contract",
    category: "Data",
    seniority: "Mid",
    description: "Specialized language work supporting frontier AI initiatives with high-quality Indonesian language data and evaluation.",
    requirements: [
      "Native or professional fluency in Bahasa Indonesia",
      "Strong attention to detail and linguistic accuracy"
    ],
    responsibilities: [
      "Contribute expert language data and evaluation",
      "Ensure cultural and contextual fidelity"
    ],
    nice_to_have: ["Experience with AI data or localization"],
    tags: ["Data", "Languages", "AI"],
    ecosystem: "AI x Crypto",
    company_type: "Startup",
    date_posted: "2026-07-05",
    date_added: "2026-07-05",
    featured: true,
    expired: false
  },
  {
    id: "j19",
    title: "Egocentric Video Data Contributor",
    company: "Perle",
    source: "Perle",
    source_url: "https://ats.rippling.com/perle/jobs",
    apply_url: "https://ats.rippling.com/perle/jobs/52a3f5ca-3d2e-41ef-b407-9fdd16015f2c",
    location: "Argentina - Remote, Brazil - Remote",
    remote: true,
    work_mode: "Remote",
    employment_type: "Contract",
    category: "Data",
    seniority: "Entry",
    description: "Capture first-person egocentric video of everyday activities to train AI and robotics systems. Flexible, hands-free contribution.",
    requirements: [
      "Based in Argentina or Brazil",
      "Supported smartphone and willingness to wear headstrap"
    ],
    responsibilities: [
      "Record natural daily routines and work",
      "Submit high-quality footage via secure app"
    ],
    nice_to_have: ["Hands-on work experience"],
    tags: ["Data", "Video", "AI Training"],
    ecosystem: "AI x Crypto",
    company_type: "Startup",
    date_posted: "2026-07-04",
    date_added: "2026-07-05",
    featured: false,
    expired: false
  },
  {
    id: "j20",
    title: "Freelance Audio Contributor – US English",
    company: "Perle",
    source: "Perle",
    source_url: "https://ats.rippling.com/perle/jobs",
    apply_url: "https://ats.rippling.com/perle/jobs/ee27fbdb-a2fd-4c7b-9890-494a00bc0fed",
    location: "United States (Remote)",
    remote: true,
    work_mode: "Remote",
    employment_type: "Contract",
    category: "Data",
    seniority: "Entry",
    description: "Contribute natural US English audio recordings to help build high-quality speech and audio datasets for frontier AI.",
    requirements: [
      "Native US English speaker",
      "Quiet recording environment"
    ],
    responsibilities: [
      "Record clear, natural speech samples",
      "Follow provided guidelines for quality"
    ],
    nice_to_have: ["Previous voice work or data contribution"],
    tags: ["Data", "Audio", "AI"],
    ecosystem: "AI x Crypto",
    company_type: "Startup",
    date_posted: "2026-07-04",
    date_added: "2026-07-05",
    featured: false,
    expired: false
  },
  {
    id: "j21",
    title: "Freelance Audio Contributor – UK English",
    company: "Perle",
    source: "Perle",
    source_url: "https://ats.rippling.com/perle/jobs",
    apply_url: "https://ats.rippling.com/perle/jobs/ca1fb7e5-da08-4bed-bcd2-939b228e5fdf",
    location: "United Kingdom (Remote)",
    remote: true,
    work_mode: "Remote",
    employment_type: "Contract",
    category: "Data",
    seniority: "Entry",
    description: "Record natural UK English audio for advanced AI speech and language model training.",
    requirements: [
      "Native UK English speaker",
      "Suitable recording conditions"
    ],
    responsibilities: [
      "Produce clear natural speech recordings",
      "Adhere to quality and format guidelines"
    ],
    nice_to_have: [],
    tags: ["Data", "Audio", "AI"],
    ecosystem: "AI x Crypto",
    company_type: "Startup",
    date_posted: "2026-07-04",
    date_added: "2026-07-05",
    featured: false,
    expired: false
  },
  {
    id: "j22",
    title: "Expert Audio Transcriber, Urdu",
    company: "Perle",
    source: "Perle",
    source_url: "https://ats.rippling.com/perle/jobs",
    apply_url: "https://ats.rippling.com/perle/jobs/2457f067-f5fd-4046-9736-530f1e46a528",
    location: "India - Remote, Pakistan - Remote",
    remote: true,
    work_mode: "Remote",
    employment_type: "Contract",
    category: "Data",
    seniority: "Mid",
    description: "Expert-level transcription of Urdu audio for high-performance AI training datasets.",
    requirements: [
      "Native-level Urdu fluency",
      "High accuracy in transcription"
    ],
    responsibilities: [
      "Deliver precise, culturally accurate transcriptions",
      "Maintain consistent quality standards"
    ],
    nice_to_have: ["Transcription background"],
    tags: ["Data", "Transcription", "AI", "Urdu"],
    ecosystem: "AI x Crypto",
    company_type: "Startup",
    date_posted: "2026-07-04",
    date_added: "2026-07-05",
    featured: false,
    expired: false
  },
  {
    id: "j23",
    title: "Expert Audio Transcriber, Persian",
    company: "Perle",
    source: "Perle",
    source_url: "https://ats.rippling.com/perle/jobs",
    apply_url: "https://ats.rippling.com/perle/jobs/8e03fab2-705d-4dec-bc5e-a6421d27f3c6",
    location: "Iran - Remote",
    remote: true,
    work_mode: "Remote",
    employment_type: "Contract",
    category: "Data",
    seniority: "Mid",
    description: "Specialized Persian (Farsi) audio transcription supporting cutting-edge AI model development.",
    requirements: [
      "Native Persian fluency",
      "Excellent attention to detail"
    ],
    responsibilities: [
      "Transcribe audio accurately with cultural context",
      "Meet project quality and volume targets"
    ],
    nice_to_have: [],
    tags: ["Data", "Transcription", "AI", "Persian"],
    ecosystem: "AI x Crypto",
    company_type: "Startup",
    date_posted: "2026-07-04",
    date_added: "2026-07-05",
    featured: false,
    expired: false
  },
  {
    id: "j24",
    title: "Expert Audio Transcriber, Portuguese (Brazilian)",
    company: "Perle",
    source: "Perle",
    source_url: "https://ats.rippling.com/perle/jobs",
    apply_url: "https://ats.rippling.com/perle/jobs/0a80af8c-57bb-47ce-8389-b573006b13f2",
    location: "Brazil - Remote",
    remote: true,
    work_mode: "Remote",
    employment_type: "Contract",
    category: "Data",
    seniority: "Mid",
    description: "High-quality Brazilian Portuguese transcription for AI speech and language systems.",
    requirements: [
      "Native Brazilian Portuguese",
      "Strong listening and typing skills"
    ],
    responsibilities: [
      "Accurate transcription of varied audio content",
      "Follow detailed style and quality guidelines"
    ],
    nice_to_have: [],
    tags: ["Data", "Transcription", "AI", "Portuguese"],
    ecosystem: "AI x Crypto",
    company_type: "Startup",
    date_posted: "2026-07-04",
    date_added: "2026-07-05",
    featured: false,
    expired: false
  },
  {
    id: "j25",
    title: "Expert Audio Transcriber, Spanish",
    company: "Perle",
    source: "Perle",
    source_url: "https://ats.rippling.com/perle/jobs",
    apply_url: "https://ats.rippling.com/perle/jobs/a3872291-7f88-47bd-ae9a-f94f80838654",
    location: "Spain - Remote",
    remote: true,
    work_mode: "Remote",
    employment_type: "Contract",
    category: "Data",
    seniority: "Mid",
    description: "Expert Spanish audio transcription to support advanced multilingual AI models.",
    requirements: [
      "Native or fluent Spanish",
      "High transcription accuracy"
    ],
    responsibilities: [
      "Deliver precise transcriptions",
      "Maintain consistency across projects"
    ],
    nice_to_have: [],
    tags: ["Data", "Transcription", "AI", "Spanish"],
    ecosystem: "AI x Crypto",
    company_type: "Startup",
    date_posted: "2026-07-04",
    date_added: "2026-07-05",
    featured: false,
    expired: false
  },
  {
    id: "j26",
    title: "Freelance Transcriptionist — Akan",
    company: "Perle",
    source: "Perle",
    source_url: "https://ats.rippling.com/perle/jobs",
    apply_url: "https://ats.rippling.com/perle/jobs/1b8f1b08-acd7-49b0-98bf-c96a85f3f951",
    location: "Benin - Remote, Côte d'Ivoire - Remote",
    remote: true,
    work_mode: "Remote",
    employment_type: "Contract",
    category: "Data",
    seniority: "Entry",
    description: "Freelance transcription work for Akan language to build diverse AI training datasets.",
    requirements: [
      "Strong Akan language skills",
      "Reliable internet and quiet workspace"
    ],
    responsibilities: [
      "Transcribe audio content accurately",
      "Submit work on time per guidelines"
    ],
    nice_to_have: [],
    tags: ["Data", "Transcription", "AI"],
    ecosystem: "AI x Crypto",
    company_type: "Startup",
    date_posted: "2026-07-04",
    date_added: "2026-07-05",
    featured: false,
    expired: false
  },
  {
    id: "j27",
    title: "Freelance Transcriptionist — Sinhalese",
    company: "Perle",
    source: "Perle",
    source_url: "https://ats.rippling.com/perle/jobs",
    apply_url: "https://ats.rippling.com/perle/jobs/d8bfdd3e-dea8-4a7f-b1c0-2ce3913a00a4",
    location: "Australia - Remote, Kuwait - Remote",
    remote: true,
    work_mode: "Remote",
    employment_type: "Contract",
    category: "Data",
    seniority: "Entry",
    description: "Contribute Sinhalese transcription for global AI language model development.",
    requirements: [
      "Proficient in Sinhalese",
      "Good typing speed and accuracy"
    ],
    responsibilities: [
      "Perform accurate audio transcription",
      "Follow project-specific instructions"
    ],
    nice_to_have: [],
    tags: ["Data", "Transcription", "AI"],
    ecosystem: "AI x Crypto",
    company_type: "Startup",
    date_posted: "2026-07-04",
    date_added: "2026-07-05",
    featured: false,
    expired: false
  },
  {
    id: "j28",
    title: "Social Media & Content Manager",
    company: "Perle",
    source: "Perle",
    source_url: "https://ats.rippling.com/perle/jobs",
    apply_url: "https://ats.rippling.com/perle/jobs/22e1c307-7e30-4148-883f-8beb05cef31f",
    location: "Egypt - Remote, Lebanon - Remote",
    remote: true,
    work_mode: "Remote",
    employment_type: "Full-time",
    category: "Marketing",
    seniority: "Mid",
    description: "Lead social media and content strategy for Perle, an AI infrastructure company working with leading model builders.",
    requirements: [
      "Experience in social media management and content creation",
      "Strong writing skills and understanding of tech/AI space"
    ],
    responsibilities: [
      "Develop and execute content calendar",
      "Grow community and engagement across platforms",
      "Collaborate with product and leadership teams"
    ],
    nice_to_have: ["AI or tech industry experience"],
    tags: ["Marketing", "Content", "Social Media", "AI"],
    ecosystem: "AI x Crypto",
    company_type: "Startup",
    date_posted: "2026-07-05",
    date_added: "2026-07-05",
    featured: true,
    expired: false
  },
  {
    id: "j29",
    title: "Founding Product Designer",
    company: "Monad Labs",
    source: "cryptojobslist.com",
    source_url: "https://cryptojobslist.com",
    apply_url: "https://cryptojobslist.com/jobs/founding-product-designer-at-monad-labs",
    location: "Remote",
    remote: true,
    work_mode: "Remote",
    employment_type: "Full-time",
    category: "Design",
    seniority: "Lead",
    description: "Shape the product experience for one of the most ambitious L1s in crypto. Own design system, user research, and high-impact surfaces.",
    requirements: [
      "5+ years product design experience",
      "Strong systems thinking and interaction design skills",
      "Comfortable in fast-moving, ambiguous environments"
    ],
    responsibilities: [
      "Lead design for core product surfaces",
      "Establish design systems and research practices",
      "Collaborate closely with engineering and founders"
    ],
    nice_to_have: ["Previous web3 or high-growth startup experience"],
    tags: ["Design", "Product", "L1", "Founding"],
    ecosystem: "Infra",
    company_type: "Protocol",
    date_posted: "2026-07-04",
    date_added: "2026-07-04",
    featured: true,
    expired: false,
    compensation: "$160k–220k + equity"
  },
  {
    id: "j30",
    title: "Ecosystem Lead - Asia",
    company: "Sei Network",
    source: "web3.career",
    source_url: "https://web3.career",
    apply_url: "https://web3.career/jobs/ecosystem-lead-asia-sei",
    location: "Remote (APAC)",
    remote: true,
    work_mode: "Remote",
    employment_type: "Full-time",
    category: "Ecosystem Growth",
    seniority: "Lead",
    description: "Grow Sei’s presence across Asia through developer programs, grants, and strategic partnerships.",
    requirements: [
      "Strong network in Asian crypto and developer communities",
      "Experience running grants or ecosystem programs",
      "Excellent communication and cross-cultural skills"
    ],
    responsibilities: [
      "Design and run regional growth initiatives",
      "Support local teams and hackathons",
      "Build relationships with key protocols and VCs"
    ],
    nice_to_have: ["Mandarin or Japanese language skills"],
    tags: ["Ecosystem", "Asia", "Growth", "Grants"],
    ecosystem: "L2",
    company_type: "Protocol",
    date_posted: "2026-07-03",
    date_added: "2026-07-03",
    featured: false,
    expired: false
  },
  {
    id: "j31",
    title: "Head of Research",
    company: "Dragonfly",
    source: "jobs.dragonfly.xyz",
    source_url: "https://jobs.dragonfly.xyz/jobs",
    apply_url: "https://jobs.dragonfly.xyz/jobs/head-of-research",
    location: "Remote",
    remote: true,
    work_mode: "Remote",
    employment_type: "Full-time",
    category: "Research",
    seniority: "Head",
    description: "Lead Dragonfly’s research practice — publish deep dives, support investment decisions, and shape narrative around the portfolio.",
    requirements: [
      "Track record of high-quality crypto research",
      "Strong writing and on-chain analysis skills",
      "Deep understanding of multiple ecosystems"
    ],
    responsibilities: [
      "Publish flagship research reports",
      "Support diligence across the fund",
      "Represent Dragonfly at events and in media"
    ],
    nice_to_have: ["Previous fund or protocol research experience"],
    tags: ["Research", "Writing", "Venture"],
    ecosystem: "Venture / Fund",
    company_type: "Fund",
    date_posted: "2026-06-30",
    date_added: "2026-07-01",
    featured: true,
    expired: false,
    curator_note: "Rare opportunity to shape how one of crypto’s top funds thinks about the space."
  },
  {
    id: "j32",
    title: "Senior Protocol Engineer (Rust)",
    company: "Jito Labs",
    source: "jobs.solana.com",
    source_url: "https://jobs.solana.com/jobs",
    apply_url: "https://jobs.lever.co/jito.wtf",
    location: "Remote",
    remote: true,
    work_mode: "Remote",
    employment_type: "Full-time",
    category: "Engineering",
    seniority: "Senior",
    description: "Work on Jito’s validator client, MEV infrastructure, and block-building systems at the core of Solana.",
    requirements: [
      "Strong Rust experience",
      "Systems programming or distributed systems background",
      "Interest in high-performance blockchain infrastructure"
    ],
    responsibilities: [
      "Design and implement core protocol features",
      "Optimize performance and reliability",
      "Collaborate with the broader Solana community"
    ],
    nice_to_have: ["Previous experience with Solana or high-throughput systems"],
    tags: ["Rust", "Protocol", "MEV", "Solana"],
    ecosystem: "Solana",
    company_type: "Protocol",
    date_posted: "2026-07-05",
    date_added: "2026-07-05",
    featured: true,
    expired: false,
    compensation: "Competitive + meaningful equity"
  },
  {
    id: "j33",
    title: "Marketing Lead",
    company: "Remote3",
    source: "remote3.co",
    source_url: "https://remote3.co",
    apply_url: "https://remote3.co/jobs/marketing-lead",
    location: "Remote",
    remote: true,
    work_mode: "Remote",
    employment_type: "Full-time",
    category: "Marketing",
    seniority: "Lead",
    description: "Own brand, content, and growth marketing for the leading remote web3 job platform.",
    requirements: [
      "3+ years in crypto or tech marketing",
      "Strong content and storytelling skills",
      "Experience with community-led growth"
    ],
    responsibilities: [
      "Develop brand positioning and campaigns",
      "Create high-signal content and newsletters",
      "Drive user acquisition through partnerships"
    ],
    nice_to_have: ["Experience at a job platform or talent marketplace"],
    tags: ["Marketing", "Remote", "Web3"],
    ecosystem: "Multi-chain",
    company_type: "Startup",
    date_posted: "2026-07-02",
    date_added: "2026-07-02",
    featured: false,
    expired: false
  },
  {
    id: "j34",
    title: "Community & DevRel Lead",
    company: "Superteam",
    source: "talent.superteam.fun",
    source_url: "https://talent.superteam.fun/",
    apply_url: "https://talent.superteam.fun/jobs/community-devrel",
    location: "Remote",
    remote: true,
    work_mode: "Remote",
    employment_type: "Full-time",
    category: "Community",
    seniority: "Lead",
    description: "Grow and support the global Superteam community across multiple regions.",
    requirements: [
      "Experience building and scaling crypto communities",
      "Strong presence on Twitter/Discord",
      "Ability to run events and programs"
    ],
    responsibilities: [
      "Design and run community programs and bounties",
      "Support regional leads",
      "Partner with projects in the Superteam network"
    ],
    nice_to_have: ["Solana ecosystem experience"],
    tags: ["Community", "DevRel", "Solana"],
    ecosystem: "Solana",
    company_type: "DAO",
    date_posted: "2026-07-01",
    date_added: "2026-07-01",
    featured: false,
    expired: false
  },
  {
    id: "j35",
    title: "Data Operations Lead",
    company: "Perle",
    source: "talent.yzilabs.com",
    source_url: "https://talent.yzilabs.com/",
    apply_url: "https://ats.rippling.com/perle/jobs",
    location: "Remote",
    remote: true,
    work_mode: "Remote",
    employment_type: "Full-time",
    category: "Operations",
    seniority: "Lead",
    description: "Build and manage high-quality data operations pipelines for frontier AI training and evaluation.",
    requirements: [
      "Experience leading distributed operations or data teams",
      "Strong process design and quality control skills",
      "Comfortable working with technical stakeholders"
    ],
    responsibilities: [
      "Design scalable data collection and QA workflows",
      "Manage global contributor networks",
      "Drive operational excellence and metrics"
    ],
    nice_to_have: ["Background in AI data or annotation platforms"],
    tags: ["Operations", "Data", "AI"],
    ecosystem: "AI x Crypto",
    company_type: "Startup",
    date_posted: "2026-07-04",
    date_added: "2026-07-04",
    featured: true,
    expired: false
  }
];

export const sources: Source[] = [
  {
    id: "s1",
    name: "Solana Jobs",
    url: "https://jobs.solana.com/jobs",
    description: "Official curated jobs board for the Solana ecosystem (powered by Getro).",
    ecosystem: "Solana",
    category: "Ecosystem",
    last_checked: "2026-07-05",
    indexed_jobs_count: 45,
    active: true
  },
  {
    id: "s2",
    name: "Avalanche Jobs",
    url: "https://jobs.avax.network/jobs",
    description: "Official Avalanche ecosystem opportunities (powered by Getro).",
    ecosystem: "Avalanche",
    category: "Ecosystem",
    last_checked: "2026-07-05",
    indexed_jobs_count: 38,
    active: true
  },
  {
    id: "s3",
    name: "Ethereum Job Board",
    url: "https://www.ethereumjobboard.com/jobs",
    description: "Curated Ethereum and L2 opportunities from the community.",
    ecosystem: "Ethereum",
    category: "Ecosystem",
    last_checked: "2026-07-05",
    indexed_jobs_count: 32,
    active: true
  },
  {
    id: "s4",
    name: "Web3.career",
    url: "https://web3.career",
    description: "Large web3 job aggregator with strong DeFi, protocol and crypto coverage.",
    ecosystem: "Multi-chain",
    category: "Aggregator",
    last_checked: "2026-07-05",
    indexed_jobs_count: 75,
    active: true
  },
  {
    id: "s5",
    name: "CryptoJobsList",
    url: "https://cryptojobslist.com",
    description: "Popular curated crypto job board focused on quality roles. Has public RSS.",
    ecosystem: "Multi-chain",
    category: "Aggregator",
    last_checked: "2026-07-05",
    indexed_jobs_count: 307,
    active: true
  },
  {
    id: "s6",
    name: "Cryptocurrency Jobs",
    url: "https://cryptocurrencyjobs.co",
    description: "High-signal curated crypto and blockchain jobs.",
    ecosystem: "Multi-chain",
    category: "Aggregator",
    last_checked: "2026-07-05",
    indexed_jobs_count: 126,
    active: true
  },
  {
    id: "s7",
    name: "Midnight Network",
    url: "https://midnight.network/careers",
    description: "Careers at the data protection focused blockchain.",
    ecosystem: "Privacy / Protocol",
    category: "Protocol",
    last_checked: "2026-07-04",
    indexed_jobs_count: 8,
    active: true
  },
  {
    id: "s8",
    name: "Dragonfly Jobs",
    url: "https://jobs.dragonfly.xyz/jobs",
    description: "Opportunities at Dragonfly portfolio companies and the firm.",
    ecosystem: "Venture",
    category: "Venture",
    last_checked: "2026-07-05",
    indexed_jobs_count: 19,
    active: true
  },
  {
    id: "s9",
    name: "Block Careers",
    url: "https://block.xyz/careers/jobs",
    description: "Jobs across Block's crypto initiatives (TBD, Cash App).",
    ecosystem: "Bitcoin / Payments",
    category: "Corporate",
    last_checked: "2026-07-04",
    indexed_jobs_count: 12,
    active: true
  },
  {
    id: "s10",
    name: "Crypto Careers",
    url: "https://crypto-careers.com",
    description: "Curated crypto startup and protocol jobs.",
    ecosystem: "Multi-chain",
    category: "Aggregator",
    last_checked: "2026-07-05",
    indexed_jobs_count: 29,
    active: true
  },
  {
    id: "s11",
    name: "BeInCrypto Jobs",
    url: "https://beincrypto.com/jobs",
    description: "Jobs board from the BeInCrypto media network.",
    ecosystem: "Multi-chain",
    category: "Media",
    last_checked: "2026-07-05",
    indexed_jobs_count: 22,
    active: true
  },
  {
    id: "s12",
    name: "JobStash",
    url: "https://jobstash.xyz/jobs",
    description: "Developer-focused crypto jobs aggregator.",
    ecosystem: "Engineering",
    category: "Aggregator",
    last_checked: "2026-07-05",
    indexed_jobs_count: 41,
    active: true
  },
  {
    id: "s13",
    name: "Remote3",
    url: "https://remote3.co",
    description: "Remote-first web3 opportunities.",
    ecosystem: "Multi-chain",
    category: "Remote",
    last_checked: "2026-07-05",
    indexed_jobs_count: 33,
    active: true
  },
  {
    id: "s14",
    name: "YZI Labs Talent",
    url: "https://talent.yzilabs.com/",
    description: "Talent platform from YZI Labs for crypto roles.",
    ecosystem: "Multi-chain",
    category: "Talent Network",
    last_checked: "2026-07-05",
    indexed_jobs_count: 18,
    active: true
  },
  {
    id: "s15",
    name: "Superteam Talent",
    url: "https://talent.superteam.fun/",
    description: "Jobs and talent for the Superteam / Solana ecosystem.",
    ecosystem: "Solana",
    category: "Ecosystem",
    last_checked: "2026-07-05",
    indexed_jobs_count: 27,
    active: true
  },
  {
    id: "s16",
    name: "Perle",
    url: "https://ats.rippling.com/perle/jobs",
    description: "Perle powers frontier AI with expert human intelligence at scale. 61 roles in data contribution, model evaluation, research, specialized transcription, and audio data.",
    ecosystem: "AI x Crypto",
    category: "ATS",
    last_checked: "2026-07-05",
    indexed_jobs_count: 61,
    active: true
  }
];

export const curatedDrops: CuratedDrop[] = [
  {
    id: "d1",
    title: "Best Remote Web3 Jobs This Week",
    description: "Carefully selected fully remote roles across engineering, growth, and product from top protocols and teams.",
    slug: "best-remote-this-week",
    tags: ["Remote", "High-Signal"],
    job_ids: ["j1", "j2", "j6", "j9", "j13"],
    date_published: "2026-07-02",
    featured: true
  },
  {
    id: "d2",
    title: "Crypto BD Roles Worth Watching",
    description: "Business development and ecosystem positions at protocols and funds that are actively expanding.",
    slug: "crypto-bd-roles",
    tags: ["BD", "Ecosystem", "Growth"],
    job_ids: ["j2", "j4", "j7"],
    date_published: "2026-06-30",
    featured: true
  },
  {
    id: "d3",
    title: "Protocol Engineering Opportunities",
    description: "Senior engineering roles at core protocol teams building foundational infrastructure.",
    slug: "protocol-engineering",
    tags: ["Engineering", "Protocol", "Rust", "Infra"],
    job_ids: ["j1", "j6", "j9", "j10"],
    date_published: "2026-07-01",
    featured: true
  },
  {
    id: "d4",
    title: "Ecosystem Growth Roles",
    description: "Roles focused on developer adoption, grants, and strategic expansion across ecosystems.",
    slug: "ecosystem-growth",
    tags: ["Growth", "Ecosystem"],
    job_ids: ["j2", "j4", "j14"],
    date_published: "2026-06-29",
    featured: false
  },
  {
    id: "d5",
    title: "Jobs for Designers in Crypto",
    description: "Product and visual design roles at teams that care deeply about craft and user experience.",
    slug: "designers-in-crypto",
    tags: ["Design"],
    job_ids: ["j12"],
    date_published: "2026-06-28",
    featured: false
  },
  {
    id: "d6",
    title: "High-Signal Infrastructure Roles",
    description: "Frontier roles building the data, indexing and platform layers that power crypto.",
    slug: "infrastructure-roles",
    tags: ["Infra", "Data", "Platform"],
    job_ids: ["j6", "j9", "j11"],
    date_published: "2026-07-01",
    featured: true
  },
  {
    id: "d9",
    title: "Frontier AI Research & Data Roles",
    description: "Elite opportunities in AI model evaluation, research, and high-quality human data at companies powering the next generation of models.",
    slug: "frontier-ai-data",
    tags: ["AI", "Research", "Data"],
    job_ids: ["j15", "j16", "j17", "j18", "j19", "j20", "j23", "j28"],
    date_published: "2026-07-05",
    featured: true
  },
  {
    id: "d10",
    title: "Perle: 61 AI Data & Evaluation Roles",
    description: "Dozens of contract and freelance opportunities at Perle, including frontier AI research evaluation, egocentric video data, expert audio transcription across 40+ languages, and content roles.",
    slug: "perle-ai-data-roles",
    tags: ["AI", "Data", "Transcription", "Research"],
    job_ids: ["j15", "j16", "j17", "j18", "j19", "j20", "j21", "j22", "j23", "j24", "j25", "j26", "j27", "j28"],
    date_published: "2026-07-05",
    featured: true
  },
  {
    id: "d7",
    title: "Early-Stage & Consumer Crypto Roles",
    description: "High ownership opportunities at ambitious teams building consumer and startup primitives.",
    slug: "early-stage-startups",
    tags: ["Startup", "Consumer"],
    job_ids: ["j8", "j13", "j14"],
    date_published: "2026-07-01",
    featured: false
  },
  {
    id: "d8",
    title: "Ethereum & L2 Protocol Roles",
    description: "Key engineering and growth roles across major Ethereum L2s and protocols.",
    slug: "ethereum-l2-roles",
    tags: ["Ethereum", "L2", "Protocol"],
    job_ids: ["j2", "j10", "j11"],
    date_published: "2026-06-26",
    featured: false
  },
  {
    id: "d11",
    title: "Jobs from Top Funds and Venture Networks",
    description: "Roles at leading crypto VCs and their portfolio companies — research, ecosystem, and operations.",
    slug: "top-funds-venture",
    tags: ["Venture", "Fund", "Research"],
    job_ids: ["j31", "j2"],
    date_published: "2026-07-05",
    featured: true
  },
  {
    id: "d12",
    title: "Design & Product Roles in Crypto",
    description: "High-craft design and product opportunities at ambitious protocols and startups.",
    slug: "design-product-crypto",
    tags: ["Design", "Product"],
    job_ids: ["j29", "j4"],
    date_published: "2026-07-04",
    featured: false
  }
];

// Helper to get jobs by ids
export function getJobsByIds(ids: string[]): Job[] {
  return jobs.filter((job) => ids.includes(job.id));
}

// Get featured jobs
export function getFeaturedJobs(): Job[] {
  return jobs.filter((j) => j.featured && !j.expired).slice(0, 6);
}

// Get recently posted
export function getRecentJobs(limit = 12): Job[] {
  return [...jobs]
    .sort((a, b) => new Date(b.date_posted).getTime() - new Date(a.date_posted).getTime())
    .slice(0, limit);
}
