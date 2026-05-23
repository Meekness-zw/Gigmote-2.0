
import {
    ShieldCheck,
    Cpu,
    Globe,
    Users,
    Briefcase,
    Activity,
    Stethoscope,
    MonitorSmartphone,
    LineChart,
    Banknote,
    Target,
    Bot,
} from "lucide-react";

export const siteContent = {
    /** Core value proposition  used for "Why companies choose" section on home */
    coreValue:
        "We combine global talent, BPO strategy, and AI-powered automation to help UK and North American companies scale smarter  without sacrificing quality or trust.",
    services: [
        {
            slug: "bpo-matchmaking-advisory",
            icon: ShieldCheck,
            title: "BPO Consulting",
            slogan: "Outsource Without Getting It Wrong",
            description:
                "We advise companies before they outsource  so they don't make expensive mistakes. From vendor selection to performance optimization, we design outsourcing models that actually work.",
            features: [
                "BPO strategy & vendor selection",
                "Operating model design (pods, SLAs, QA, metrics)",
                "Transition & onboarding playbooks",
                "Performance optimization (CSAT, FCR, cost-to-serve)",
                "Optimization of existing outsourcing relationships",
            ],
            bestFor: ["SaaS & FinTech Companies", "Startups scaling CX, Ops, or Finance", "Companies dissatisfied with their current BPO"],
            pricing: "Custom Pricing",
            stats: [
                { label: "Cost Reduction", value: "40–60%" },
                { label: "Faster Launch", value: "2–4x" }
            ],
            differentiator: "Most BPO failures aren't talent issues  they're design and execution failures. Gigmote fixes that upstream."
        },
        {
            slug: "global-staffing",
            icon: Users,
            title: "Global Staffing & Recruitment",
            slogan: "Top Remote Talent. No Friction. No Compromise.",
            description:
                "We connect high-performing remote professionals with UK and North American companies  with full vetting, strong communication, and timezone alignment. Not freelance. Not body-shopping. Curated, long-term talent with accountability.",
            features: [
                "Customer Support & CX Specialists",
                "Operations & Admin Professionals",
                "Finance Ops & Accounting Analysts",
                "SDRs & RevOps roles",
                "Technical & AI-adjacent roles",
            ],
            bestFor: [
                "Customer Support & CX",
                "Operations & Finance",
                "Sales Development (SDR / RevOps)",
                "Technical & AI-adjacent roles",
            ],
            pricing: "From $9/hour",
            stats: [
                { label: "Cost Reduction", value: "40–60%" },
                { label: "Retention Focus", value: "Long-term" }
            ],
            differentiator: "This is not a freelance marketplace or body-shopping  it's curated, long-term talent with full accountability."
        },
        {
            slug: "ai-business-solutions",
            icon: Cpu,
            title: "AI Business Solutions",
            slogan: "Automate Busywork. Keep Humans in Control.",
            description:
                "We help businesses automate repetitive work without replacing humans  making teams more productive. From AI chatbots to intelligent agents, we deploy AI that augments your team, not hype-driven automation that breaks trust.",
            features: [
                "Customer support & lead-capture chatbots",
                "Internal helpdesk & knowledge base bots",
                "Ops automation agents (ticket triage, tagging, routing)",
                "Finance agents (invoice processing, reconciliation)",
                "Sales & RevOps agents (CRM updates, follow-ups)",
            ],
            bestFor: ["Customer Support Teams", "Sales & RevOps", "Finance & Back Office Operations", "Founders & Leadership Teams"],
            pricing: "From $3,000 per deployment",
            stats: [
                { label: "Time Saved", value: "1000s hrs" },
                { label: "Efficiency Boost", value: "30–50%" }
            ],
            differentiator: "AI that augments teams  not hype-driven automation that breaks trust."
        }
    ],
    industries: [
        {
            slug: "healthcare",
            icon: Stethoscope,
            title: "Healthcare",
            description: "We support patient communication, admin workflows, and full revenue cycle operations like insurance verification, charge entries, claims submissions etc while maintaining strict compliance and accuracy standards.",
            heroTitle: "Healthcare operations that protect revenue and patient trust."
        },
        {
            slug: "saas",
            icon: MonitorSmartphone,
            title: "SaaS",
            description: "We help SaaS companies scale customer support, revenue operations, onboarding, and retention while maintaining high CSAT.",
            heroTitle: "Customer and revenue operations that keep your SaaS growing."
        },
        {
            slug: "it-web3",
            icon: Cpu,
            title: "IT & Web3",
            description: "We support development, service management, incident response, and infrastructure scaling.",
            heroTitle: "Technical teams that can ship, support, and scale."
        },
        {
            slug: "digital-marketing",
            icon: Activity,
            title: "Digital Marketing",
            description: "We help brands scale campaign execution, reporting, content coordination, and paid media operations while maintaining ROI visibility.",
            heroTitle: "Marketing operations that turn spend into predictable growth."
        },
        {
            slug: "sales-enablement",
            icon: LineChart,
            title: "Sales Enablement",
            description: "We support CRM management, pipeline tracking, outbound coordination, and proposal development to improve close rates and revenue predictability.",
            heroTitle: "Revenue operations that keep your pipeline moving."
        },
        {
            slug: "fintech",
            icon: Banknote,
            title: "FinTech",
            description: "We understand compliance, security, and regulatory complexity. Our teams focus on precision, data protection, and customer trust.",
            heroTitle: "Operational partners who understand compliance, security, and regulation."
        }
    ],
    about: {
        heroTitle: "Built by operators, not recruiters.",
        heroDescription: "We built Gigmote after watching outsourcing fail real businesses. Our model combines high-quality remote talent, proven BPO strategy, and practical AI  so growing companies can scale without the guesswork.",
    },
    company: {
        heroTitle: "Built by operators, not recruiters.",
        heroDescription: "Deep CX, FinTech, and SaaS experience. Metrics-driven, process-first delivery. Human + AI  not one or the other. That's the Gigmote standard.",
        stats: [
            { label: "Average Cost Savings", value: "40%" },
            { label: "Target Markets", value: "North America & Europe" },
            { label: "Talent Pool", value: "5,000+ Pre vetted Professionals" }
        ]
    },
    faqs: [
        {
            question: "How quickly can you scale a team?",
            answer: "We can launch a dedicated team in as little as 2 weeks, thanks to our pre-vetted remote talent pool and structured onboarding playbooks."
        },
        {
            question: "Where are your talent hubs located?",
            answer: "Our remote talent network spans multiple regions  giving you access to top-tier professionals at competitive rates, with strong English communication and timezone alignment for UK and North American companies."
        },
        {
            question: "Do you offer 24/7 support coverage?",
            answer: "Yes. Our remote talent network is strategically positioned for timezone overlap with both the UK and North America, and we can structure follow-the-sun coverage where needed."
        },
        {
            question: "What is your pricing model?",
            answer: "We offer flexible models: hourly staffing from $9/hour, dedicated monthly teams, BPO consulting engagements (custom pricing), and AI deployments from $3,000. We recommend starting with a 30–60 day pilot."
        },
        {
            question: "How is Gigmote different from a freelance marketplace?",
            answer: "We are not a marketplace. Every placement is vetted, full-time, and built for long-term accountability. We design the operating model, set KPIs, and provide optional managed oversight  so you get a real team, not a list of profiles."
        }
    ],
    pricing: {
        heroTitle: "Transparent & Simple Pricing"
    },
    hero: {
        trustBar: "Serving companies worldwide 🌍"
    },
    valueProps: [
        {
            icon: Briefcase,
            title: "Built by operators",
            description: "We've personally built, scaled, and managed global teams across CX, FinTech, and SaaS  so we design systems that work in the real world, not just on paper."
        },
        {
            icon: Target,
            title: "Metrics-driven, process-first",
            description: "Every engagement is designed around your KPIs  with clear SLAs, QA frameworks, and visibility into performance from day one."
        },
        {
            icon: Bot,
            title: "Human + AI model",
            description: "We blend high-performing remote talent with practical AI automation  keeping humans in control for quality and compliance."
        },
        {
            icon: Globe,
            title: "Remote → Global",
            description: "High-quality remote professionals serving UK and North American companies. Strong communication, timezone alignment, and long-term retention focus."
        }
    ],
    howItWorks: [
        {
            step: 1,
            title: "Choose Your Wedge",
            description: "We start focused  CX staffing, Ops hiring, or BPO consulting  so you see results quickly without overcommitting."
        },
        {
            step: 2,
            title: "30–60 Day Pilot",
            description: "We match you with vetted talent or the right BPO partner and run a structured pilot with clear KPIs and full transparency."
        },
        {
            step: 3,
            title: "Layer In AI",
            description: "Once trust is built, we introduce AI agents and automation to reduce repetitive load and boost team productivity."
        },
        {
            step: 4,
            title: "Expand & Optimize",
            description: "We grow the engagement from staffing → consulting → AI  scaling with you as your needs evolve."
        }
    ],
    caseStudies: [
        {
            id: "accounting-financial-operations-optimization",
            industry: "Accounting & Financial Operations",
            title: "Accounting & Financial Operations Optimization",
            challenge:
                "A fast-growing US-based e-commerce brand with $4.2M in annual revenue was battling backlogged bookkeeping, delayed month-end closes, and poor cash flow visibility. Their in-house finance manager was overwhelmed, and hiring two additional U.S. accountants would have cost roughly $165,000 annually including benefits.",
            solution:
                "Gigmote deployed a dedicated offshore accounting pod (senior accountant + junior bookkeeper), streamlined AP/AR, codified monthly close procedures, and integrated reporting dashboards into their Shopify and Stripe stack  all while working within the client's existing tools for full transparency.",
            results: [
                "58% reduction in finance operations cost (~$92,000 annually saved)",
                "Month-end close time cut from 21 days to 6 days",
                "35% improvement in cash flow forecasting accuracy and +8% gross margin lift in two quarters"
            ]
        },
        {
            id: "b2b-sales-development-acceleration",
            industry: "B2B SaaS Sales Development",
            title: "B2B Sales Development Acceleration",
            challenge:
                "A seed-stage U.S. SaaS company selling into logistics providers had strong product-market fit but an inconsistent pipeline. Founders were running outbound themselves, resulting in fewer than 8 qualified demos per month. Hiring U.S.-based SDRs at $70,000–$85,000 each wasn't feasible.",
            solution:
                "Gigmote built and trained a two-person Sales Development team to own outbound prospecting, LinkedIn engagement, CRM hygiene, and pipeline qualification. We implemented scripts, daily activity targets, and a KPI dashboard tied to demos and opportunity conversion.",
            results: [
                "Outbound activity increased by 400% within 45 days",
                "Qualified demos grew to an average of 26 per month",
                "Pipeline value grew from $480k to $2.1M in < 6 months while saving ~$110k annually vs. local hires"
            ]
        },
        {
            id: "digital-marketing-performance-efficiency",
            industry: "Healthcare Technology Company | $10M ARR",
            title: "Digital Marketing Performance & Cost Efficiency",
            challenge:
                "A healthcare technology firm was overspending on U.S.-based marketing contractors while struggling with inconsistent campaign execution and slow content turnaround. Their blended marketing spend exceeded $32,000 per month, yet lead quality remained inconsistent and cost-per-lead (CPL) was rising.",
            solution:
                "Gigmote deployed a dedicated digital marketing team including a performance marketer, content specialist, and marketing operations coordinator. We centralized ad management, rebuilt funnel tracking, implemented structured content calendars, and optimized Google and LinkedIn campaigns. Reporting moved from manual spreadsheets to automated weekly dashboards.",
            results: [
                "42% decrease in cost-per-lead and 55% improvement in paid campaign ROI",
                "3x increase in content production output",
                "$180,000 annual reduction in marketing operational spend and 68% lift in qualified inbound leads"
            ]
        },
        {
            id: "revenue-cycle-management-optimization",
            industry: "Multi-Location Medical Practice | 14 Providers",
            title: "Revenue Cycle Management (RCM) Optimization",
            challenge:
                "A multi-location medical practice was facing rising insurance claim denials, delayed reimbursements, and inconsistent follow-ups. Denial rates had climbed to 18%, and days in accounts receivable averaged 52 days, straining cash flow. Hiring additional in-house billing staff would have added $120,000 annually in payroll costs.",
            solution:
                "Gigmote assembled a specialized Revenue Cycle Management team focused on prior authorizations, claim scrubbing, denial management, and systematic follow-up protocols. We introduced structured SOPs, denial analytics reporting, and daily claim status tracking to improve visibility and accountability.",
            results: [
                "Denial rates reduced from 18% to 7% and days in A/R cut to 31",
                "Net collections increased by 14% and monthly cash flow improved by ~$220,000",
                "Billing operational costs reduced by 46% while funding the opening of an additional specialty clinic"
            ]
        },
        {
            id: "integrated-back-office-sales-support-real-estate",
            industry: "U.S. Real Estate Investment Group | 75+ Properties",
            title: "Integrated Back-Office & Sales Support for Scaling Real Estate Firm",
            challenge:
                "A growing real estate investment firm was struggling to manage property accounting, tenant communications, and investor reporting. Administrative bottlenecks slowed acquisitions, and local hiring costs were limiting expansion plans.",
            solution:
                "Gigmote deployed a hybrid support structure: two accounting specialists, one leasing support coordinator, and a CRM administrator. We standardized reporting for investors, automated rent tracking and follow-ups, and improved acquisition pipeline coordination between brokers and internal teams.",
            results: [
                "52% decrease in operational overhead (~$210,000 in annual savings)",
                "60% faster administrative turnaround times",
                "Property portfolio growth from 75 to 110 properties in 18 months without increasing U.S.-based headcount"
            ]
        }
    ]
};
