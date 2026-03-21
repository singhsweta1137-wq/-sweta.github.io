// js/config.js — Edit ONLY this file to update the entire portfolio

const CONFIG = {
  // ─── Personal Info ─────────────────────────────────────────────────────────
  name: "Sweta",
  tagline: "Weaving Words into Heritage Narratives",
  email: "singhsweta1137@gmail.com",
  phone: "+91 6300152029",
  location: "Visakhapatnam, India",
  github: "",
  linkedin: "https://www.linkedin.com/in/sweta-027140245/",

  // Hero typing roles
  typingRoles: [
    "Content Writer",
    "Brand Storyteller",
    "Textile Heritage Writer",
    "Creative Communicator",
    "Customer Experience Specialist",
    "Digital Content Strategist",
  ],

  // ─── SEO ───────────────────────────────────────────────────────────────────
  seo: {
    siteUrl: "https://sweta.github.io",
    description:
      "Sweta — Content Writer & Brand Storyteller specialising in textile heritage, Indian handloom narratives, and customer experience. Based in Visakhapatnam, India.",
    keywords:
      "content writer, brand storytelling, Indian handloom, textile heritage, saree content, Kankatala, Visakhapatnam",
    ogImage: "https://sweta.github.io/assets/og-image.png",
    twitterHandle: "@sweta",
    locale: "en_IN",
  },

  // ─── Skills ────────────────────────────────────────────────────────────────
  skillCategories: [
    {
      category: "Content & Communication",
      icon: "✍️",
      skills: [
        { name: "Content Writing", level: 95 },
        { name: "Creative Storytelling", level: 90 },
        { name: "Brand Communication", level: 88 },
        { name: "Product Description Writing", level: 92 },
      ],
    },
    {
      category: "Textile & Domain Knowledge",
      icon: "🧵",
      skills: [
        { name: "Garment Research & Analysis", level: 90 },
        { name: "Indian Handloom & Saree Knowledge", level: 93 },
        { name: "Fabric & Weave Understanding", level: 88 },
        { name: "Heritage Craft Narration", level: 91 },
      ],
    },
    {
      category: "Customer Experience",
      icon: "🤝",
      skills: [
        { name: "Customer Query Resolution", level: 85 },
        { name: "Complaint Handling", level: 83 },
        { name: "CRM & Communication", level: 80 },
        { name: "Client Relationship Management", level: 84 },
      ],
    },
    {
      category: "Soft Skills",
      icon: "💡",
      skills: [
        { name: "Attention to Detail", level: 95 },
        { name: "Creativity", level: 92 },
        { name: "Adaptability", level: 88 },
        { name: "Research Skills", level: 90 },
      ],
    },
  ],

  // ─── Projects ──────────────────────────────────────────────────────────────
  projects: [
    {
      title: "Kankatala Textile Heritage Content",
      description:
        "Developed a comprehensive web content library on Indian handloom heritage for Kankatala Textiles — covering Ikat, Jamdani, Paithani weaves, motif stories, and regional craft traditions.",
      tags: ["Content Writing", "Textile Heritage", "Handloom", "SEO"],
      link: "https://kankatala.com",
      featured: true,
    },
    {
      title: "Brand Storytelling — Saree Collections",
      description:
        "Crafted product narratives for curated saree collections, translating weaving techniques, motif symbolism, and cultural heritage into compelling product descriptions that resonate with modern buyers.",
      tags: ["Brand Story", "Product Writing", "Saree", "E-commerce"],
      link: "#",
      featured: true,
    },
    {
      title: "CMR Digital Content Strategy",
      description:
        "Managed end-to-end digital content at CMR Shopping Mall — from influencer campaign coordination to Shopify product copy optimisation and WhatsApp commerce content.",
      tags: ["Digital Content", "Shopify", "Influencer Marketing", "Strategy"],
      link: "#",
      featured: false,
    },
    {
      title: "Customer Experience Playbook",
      description:
        "Developed standardised response templates and escalation frameworks for Flipkart customer service, improving resolution quality and CRM record accuracy.",
      tags: ["Customer Experience", "CRM", "Documentation"],
      link: "#",
      featured: false,
    },
  ],

  // ─── Experience ────────────────────────────────────────────────────────────
  experience: [
    {
      company: "Kankatala Textiles Pvt. Ltd.",
      role: "Content Writer",
      period: "Jan 2026 – Present",
      type: "Full-time",
      bullets: [
        "Research garment types, weaving techniques, and textile heritage across Indian handloom traditions",
        "Develop website content that narrates the cultural significance of Ikat, Jamdani, Paithani, and other heritage weaves",
        "Collaborate cross-functionally with design and marketing teams for cohesive brand storytelling",
        "Interpret motifs, buttas, borders, and patterns to craft accurate and evocative product descriptions",
      ],
    },
    {
      company: "Ocean Recruiting Agency",
      role: "HR Executive",
      period: "May 2025 – Jun 2025",
      type: "Contract",
      bullets: [
        "Managed end-to-end recruitment for client mandates",
        "Coordinated candidate pipelines and stakeholder communication",
      ],
    },
    {
      company: "Kotak Life",
      role: "Junior Recruiter",
      period: "Jan 2025 – May 2025",
      type: "Full-time",
      bullets: [
        "Sourced and screened candidates for sales and advisory roles",
        "Maintained recruitment trackers and coordinated interview scheduling",
      ],
    },
    {
      company: "CMR Shopping Mall",
      role: "Management Trainee",
      period: "May 2024 – Dec 2024",
      type: "Full-time",
      bullets: [
        "Managed digital content calendars and social media assets",
        "Used Konnect Insights for social listening and customer feedback monitoring",
        "Coordinated influencer marketing campaigns and partnerships",
        "Optimised Shopify product listings and WhatsApp Business content",
      ],
    },
    {
      company: "Xemplar Insights / Quiktrak",
      role: "HR Intern",
      period: "Jun 2023 – Jul 2023",
      type: "Internship",
      bullets: [
        "Supported talent acquisition workflows and candidate database management",
        "Assisted in onboarding coordination and HR documentation",
      ],
    },
    {
      company: "Flipkart",
      role: "Customer Service Representative",
      period: "May 2022 – Jul 2022",
      type: "Internship",
      bullets: [
        "Handled inbound customer queries across product, order, and return categories",
        "Resolved complaints professionally with empathy-led communication",
        "Maintained accurate CRM records and escalation logs",
      ],
    },
  ],

  // ─── Education ─────────────────────────────────────────────────────────────
  education: [
    {
      degree: "MBA — Human Resource, Business Analytics & Marketing",
      institution: "GITAM University",
      year: "2024",
      icon: "🎓",
    },
    {
      degree: "BBA — Bachelor of Business Administration",
      institution: "Dr. Lankapalli Bullaya College",
      year: "2021",
      icon: "🎓",
    },
    {
      degree: "Higher Secondary (Class XII)",
      institution: "Kendriya Vidyalaya",
      year: "2018",
      icon: "📚",
    },
    {
      degree: "Senior Secondary (Class X)",
      institution: "Kendriya Vidyalaya",
      year: "2016",
      icon: "📚",
    },
  ],

  // ─── Blog Posts ────────────────────────────────────────────────────────────
  blogPosts: [
    {
      slug: "ikat-weaving-guide",
      title: "Ikat Weaving: The Ancient Art of Resist-Dyeing India's Finest Fabrics",
      date: "2026-03-10",
      excerpt:
        "A deep dive into Ikat — one of India's most complex weaving traditions — exploring the resist-dyeing process, regional variants, and how to read the patterns in every thread.",
      tags: ["Textile Heritage", "Ikat", "Handloom", "Craft"],
      readingTime: "7 min",
    },
    {
      slug: "saree-content-writing-tips",
      title: "How to Write Compelling Saree Product Descriptions That Actually Sell",
      date: "2026-02-18",
      excerpt:
        "Practical techniques for translating weave complexity, motif symbolism, and cultural heritage into product copy that speaks to both heritage lovers and modern buyers.",
      tags: ["Content Writing", "E-commerce", "Saree", "Copywriting"],
      readingTime: "5 min",
    },
  ],
};

// Make available globally
window.CONFIG = CONFIG;
