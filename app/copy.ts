/**
 * Site copy, transcribed from instructions.md.
 *
 * Kept apart from content.ts deliberately: that module carries the image
 * manifest and ~12KB of inline base64 LQIPs, and is painful to edit. This one
 * is pure prose, so pages stay presentational and copy changes never risk the
 * image data.
 *
 * Text is verbatim from the brief. Where the brief carried markdown artefacts
 * (escaped underscores in the Shorts URLs, a stray "Kl; + button" note) those
 * are dropped, and two client names are corrected per sign-off:
 * TRIDENT REALITY -> TRIDENT REALTY, KOTI RESOR -> KOTI RESORT.
 */

/* ── Home: hero ──────────────────────────────────────────────────────── */

export const hero = {
  eyebrow: "Photography • Films • Digital Content • Immersive Experiences",
  /**
   * Set as two fixed lines: the statement, then the sectors in bronze. The
   * break after "for" is part of the design, so it is structural (two block
   * spans) rather than left to the greedy line-breaker.
   *
   * The escaped characters are non-breaking spaces, and now only guard the
   * wrap *within* each line on narrow viewports. "Storytelling for" is bound
   * so line one never strands "for" on its own at the 2.05rem floor, where the
   * string is within ~10px of a 390px gutter. "Luxury Hospitality" is bound so
   * line two breaks "Architecture and" / "Luxury Hospitality" on phones rather
   * than leaving "Hospitality" alone, which is what the unbound string did.
   *
   * Desktop holds both lines intact from 1024 up.
   */
  headline: {
    lead: "Visual Storytelling\u00a0for",
    accent: "Architecture and Luxury\u00a0Hospitality",
  },
  body: "LATENTIMAGE partners with leading hospitality and real estate brands to transform spaces and experiences into compelling visual content that elevates perception, engages audiences and delivers business impact.",
  primary: { label: "See Our Work", href: "/projects" },
  secondary: { label: "Start a Conversation", href: "/enquire" },
};

/* ── Home: stats band ────────────────────────────────────────────────── */

/**
 * The fourth cell carries no numeral, so it is a distinct variant rather than
 * a counter with an awkward sentinel value.
 */
export type Stat =
  | { kind: "count"; value: number; suffix: string; label: string }
  | { kind: "text"; value: string; label: string };

/** Both variants share the same shape on screen: `value` large, `label` beneath. */
export const stats: Stat[] = [
  { kind: "count", value: 20, suffix: "+", label: "Years" },
  { kind: "count", value: 1000, suffix: "+", label: "Projects" },
  { kind: "count", value: 100, suffix: "+", label: "Brands" },
  { kind: "text", value: "One Distinctive", label: "Point of View" },
];

/* ── Home: what we do ────────────────────────────────────────────────── */

export const whatWeDo = {
  eyebrow: "What We Do",
  headline:
    "We create photographs, films and visual experiences that reveal the character of places and brands.",
  body: "From hospitality and architecture to real estate and lifestyle, we bring together creative direction, production and technology to create content that connects with audiences.",
  items: [
    {
      title: "Photography",
      body: "We create considered, atmospheric imagery that captures the character of spaces, places, people and brands. From architecture and interiors to hospitality, lifestyle and documentary work, our photographs are designed to communicate both visual appeal and a sense of experience.",
    },
    {
      title: "Brand Films",
      body: "We create cinematic films that express the identity, atmosphere and story of a brand. Through thoughtful direction, visual composition, movement and sound, we transform places and experiences into engaging narratives.",
    },
    {
      title: "Advertising Films",
      body: "We develop concept-led advertising films that combine strong visual storytelling with a clear communication objective. Every film is created to capture attention, build brand perception and communicate a memorable campaign idea.",
    },
    {
      title: "Social Content",
      body: "We produce photography and short-form videos that help brands maintain a consistent and engaging presence across digital platforms. The content is designed to be visually distinctive, platform-friendly and aligned with the brand's larger communication direction.",
    },
    {
      title: "AI Visuals",
      body: "We explore AI-assisted imagery and films to create new creative possibilities beyond the physical frame. From conceptual visuals to imaginative campaign content, we combine emerging technology with our understanding of composition, light, atmosphere and storytelling.",
    },
    {
      title: "Immersive Experiences",
      body: "We create 360-degree virtual tours and interactive visual experiences that allow audiences to explore places from wherever they are. These experiences help properties and destinations communicate their spaces in a more engaging, accessible and memorable way.",
    },
  ],
};

/* ── Home: client brands ─────────────────────────────────────────────── */

/**
 * Rendered white-on-charcoal via a CSS filter, so a brand only qualifies for a
 * logo if its artwork survives being flattened to a single colour.
 *
 * `jlpl.png` and `centralPark.png` do not: both bake a solid background into
 * the artwork (a filled rounded rectangle and a filled seal), so monochroming
 * them yields a white blob. They render as wordmarks until transparent-
 * background versions are supplied.
 *
 * TODO — drop these in and add `src` to the matching rows below:
 *   public/clients/radisson.(webp|png|svg)
 *   public/clients/marriottBonvoy.(webp|png|svg)
 *   public/clients/nirvana.(webp|png|svg)
 */
export type Brand = { label: string; src?: string; width?: number; height?: number };

export const brands: Brand[] = [
  { label: "DLF", src: "/clients/dlf.svg", width: 203, height: 88 },
  { label: "Trident Realty", src: "/clients/tridentRealty.webp", width: 114, height: 78 },
  { label: "Radisson" }, // awaiting artwork
  { label: "Central Park" }, // artwork has a baked-in seal background
  { label: "JLPL" }, // artwork has a baked-in panel background
  { label: "Koti Resort", src: "/clients/kotiResorts.webp", width: 337, height: 120 },
  { label: "Gaj Retreat", src: "/clients/gajRetreat.webp", width: 388, height: 120 },
  { label: "Olive Trotter", src: "/clients/oliveTrotter.webp", width: 258, height: 120 },
  { label: "TDI", src: "/clients/tdi.webp", width: 87, height: 81 },
  { label: "Gillco", src: "/clients/gillco.webp", width: 279, height: 120 },
  { label: "Marriott Bonvoy" }, // awaiting artwork
  { label: "Nirvana" }, // awaiting artwork
];

/* ── Home: shorts rail ───────────────────────────────────────────────── */

/** YouTube Shorts IDs from the brief, with its markdown escaping removed. */
export const shorts = [
  "5apuYnBYZG8",
  "OrCUHr36tOk",
  "acyCb7Je9Qw",
  "dCtpW_4REHc",
  "Spzj2teJBjk",
  "l4JYBGfKp7k",
  "Pgnr_yMvLgY",
];

/* ── Home: why brands work with us ───────────────────────────────────── */

export const whyBrands = {
  eyebrow: "Why Brands Work With Us",
  headline: "We Shape the Way Exceptional Brands Are Seen.",
  body: "LATENTIMAGE is the creative partner behind some of the world's leading hospitality and real estate brands. We transform spaces and experiences into exceptional visual content that elevates brand perception, engages audiences, and delivers measurable business impact.",
  cta: { label: "Start a Conversation", href: "/enquire" },

  story: {
    title: "Our Story",
    body: "Founded over 20 years ago in Chandigarh, at the foothills of the Himalayas, LATENTIMAGE has grown into a pan-India creative studio. Blending artistic vision, technical precision, and a deep understanding of brands, we create exceptional visual stories for hospitality, real estate, architecture, and industry — shaping perception and inspiring experiences.",
  },

  /** Two engagement models, rendered inside the Partnership Model panel. */
  partnership: {
    title: "The Partnership Model",
    models: [
      {
        name: "Retainership Model",
        kicker: "Ongoing Partnership",
        lead: "A consistent creative partner for your brand.",
        body: "Our retainership model is designed for brands that require a continuous flow of high-quality photography, videography, and visual content. We work closely with your team to understand your brand, plan content requirements, and maintain a consistent visual language across campaigns, seasons, properties, and platforms.",
        idealFor:
          "Hospitality groups, hotel chains, real estate developers, and brands with ongoing content requirements.",
      },
      {
        name: "One-Time Content Creation",
        kicker: "Project-based",
        lead: "A focused creative engagement for a specific objective.",
        body: "This model is suited to brands that need a dedicated content creation project — whether it is a new property launch, a hotel shoot, a real estate development, a campaign, or a specific marketing requirement. We work with you to define the scope, creative direction, deliverables, and timeline, then create a tailored body of content that serves the intended purpose.",
        idealFor:
          "New launches, property shoots, campaign films, seasonal campaigns, and specific content requirements.",
      },
    ],
  },

  /** The remaining three panels are plain prose. */
  panels: [
    {
      title: "Our Team",
      paragraphs: [
        "Under the creative direction of Jagjit Singh, an accomplished architecture photographer and filmmaker with over two decades of experience, LATENTIMAGE brings together a team that combines artistic vision, technical expertise, and a deep understanding of the built environment.",
      ],
    },
    {
      title: "Technology",
      paragraphs: [
        "At LATENTIMAGE, we combine decades of visual experience with the possibilities of modern technology. From advanced camera systems, aerial and FPV cinematography, and sophisticated lighting to AI-assisted workflows and emerging creative tools, we continually explore better ways to capture, refine, and communicate visual stories.",
        "Technology helps us work with greater precision, efficiency, and creative freedom — while our understanding of light, space, and storytelling remains at the heart of every image.",
      ],
    },
    {
      title: "Impact",
      paragraphs: [
        "1,000+ photoshoots. Lakhs of moments captured. Millions in ancillary revenue generated for our partners.",
        "Beyond the images, we create desire, inspire experiences, and shape how properties are perceived — delivering emotional value for guests and measurable business value for the brands we work with.",
      ],
    },
  ],
};

/* ── Studio page ─────────────────────────────────────────────────────── */

export const studioPage = {
  eyebrow: "The Studio",
  title: "A Photographic Perspective. A Creative Practice.",
  lead: [
    "LATENTIMAGE is a visual creative studio working across architecture, hospitality, real estate and lifestyle.",
    "Photography is at the heart of our practice, but our work extends into films, advertising, social content, AI-generated visuals and immersive experiences.",
    "We create visual communication that reveals the character of places and brands, connects with audiences and gives every project a distinctive point of view.",
  ],

  perspective: {
    eyebrow: "Our Perspective",
    title: "We Look Beyond the Obvious.",
    paragraphs: [
      "A building is more than its structure. A hotel is more than its rooms. A destination is more than its landscape.",
      "The identity of a place is found in its atmosphere, details, people, materials, movement and the experiences it creates.",
      "Our work begins by looking closely, understanding the subject and identifying what makes it distinctive. We then translate that understanding into images, films and visual experiences that feel considered, authentic and memorable.",
    ],
  },

  evolution: {
    eyebrow: "Our Evolution",
    title: "From the Still Image to a Wider Visual Language.",
    paragraphs: [
      "Our practice began with photography and continues to be shaped by the discipline of the still image — light, composition, timing, atmosphere and detail.",
      "As the ways people experience brands have changed, our work has evolved to include moving image, advertising, social content, AI-assisted creation and immersive experiences.",
    ],
    closing:
      "The formats may be different, but the underlying purpose remains the same: to create visual communication with clarity, character and intent.",
    chain: [
      "Still Image",
      "Moving Image",
      "Campaign",
      "Social Content",
      "AI Visuals",
      "Immersive Experiences",
    ],
  },

  beliefs: {
    eyebrow: "What We Believe",
    title: "What Guides the Work.",
    lead: "Our four principles.",
    items: [
      {
        title: "Observation",
        body: "We take time to understand the subject before deciding how it should be represented.",
      },
      {
        title: "Authenticity",
        body: "We aim to create visuals that remain true to the character and experience of a place.",
      },
      {
        title: "Intent",
        body: "Every image, film and format should have a clear purpose.",
      },
      {
        title: "Evolution",
        body: "We explore new technologies and creative processes while remaining grounded in visual craft.",
      },
    ],
  },

  process: {
    eyebrow: "How We Work",
    title: "A Thoughtful Process. A Clear Visual Outcome.",
    paragraphs: [
      "Every project begins with understanding the brief, the audience and the character of the subject.",
      "From the initial idea to the final delivery, we bring together creative direction, production and post-production to create visuals that work across the platforms where they are needed.",
    ],
    steps: [
      { step: "Understand", body: "The place, brand, audience and objective." },
      { step: "Interpret", body: "The story, mood and visual direction." },
      { step: "Create", body: "Photography, films, content or immersive experiences." },
      { step: "Refine", body: "Editing, colour, sound, finishing and adaptation." },
      { step: "Deliver", body: "A coherent set of visuals designed for real-world use." },
    ],
  },

  today: {
    eyebrow: "The Studio Today",
    title: "One Studio. Different Ways of Seeing.",
    paragraphs: [
      "Today, LATENTIMAGE brings together photography, brand films, advertising films, social content, AI-generated visuals and 360-degree virtual experiences.",
      "We work as a focused creative studio, bringing the right combination of visual thinking, production expertise and technology to each assignment.",
      "Whether the requirement is a single defining image or a complete visual content system, every output is guided by the same creative perspective.",
    ],
    disciplines: [
      "Photography",
      "Brand Films",
      "Advertising Films",
      "Social Content",
      "AI Visuals",
      "Immersive Experiences",
    ],
  },

  closing: {
    title: "We create how places are seen.",
    body: "We work with places, properties and brands that have something distinctive to communicate — and help translate that character into a visual language people can recognise, understand and remember.",
    primary: { label: "Explore Our Work", href: "/projects" },
    secondary: { label: "View Our Services", href: "/services" },
  },
};

/* ── Services page ───────────────────────────────────────────────────── */

export type Service = {
  slug: string;
  title: string;
  short: string;
  expanded: string;
  deliverables: string[];
  cta: string;
  note?: string;
};

export const servicesPage = {
  eyebrow: "Services",
  title: "Photography, films, visual content, creative direction and immersive experiences.",
  lead: "Six disciplines, one creative perspective. Every engagement combines the right mix of visual thinking, production expertise and technology.",
  items: [
    {
      slug: "photography",
      title: "Photography",
      short: "Images that reveal the character of spaces, experiences, people and brands.",
      expanded:
        "Photography is at the heart of LATENTIMAGE. We create considered images that communicate architecture, atmosphere, detail and experience — helping properties and brands establish a recognisable visual identity.",
      deliverables: [
        "Architecture photography",
        "Hospitality photography",
        "Interior and exterior photography",
        "Real estate photography",
        "Lifestyle photography",
        "Food and beverage photography",
        "Industrial photography",
        "Destination and documentary photography",
        "Aerial photography",
        "Campaign imagery",
      ],
      cta: "Explore Photography",
    },
    {
      slug: "brand-films",
      title: "Brand Films",
      short: "Cinematic stories that express the character, purpose and experience of a brand.",
      expanded:
        "A brand film is more than a presentation of what a property offers. It is an opportunity to communicate its atmosphere, philosophy and emotional promise. We develop films that give audiences a sense of the place before they arrive.",
      deliverables: [
        "Concept development",
        "Creative direction",
        "Script and treatment",
        "Location and lifestyle filming",
        "Interviews and voice-over",
        "Drone and FPV footage",
        "Editing and colour grading",
        "Multiple campaign formats",
      ],
      cta: "Explore Brand Films",
    },
    {
      slug: "advertising-films",
      title: "Advertising Films",
      short: "Concept-led films created to capture attention and communicate a clear campaign idea.",
      expanded:
        "From property launches and seasonal campaigns to product communication and destination promotions, our advertising films are built around a strong visual idea and a precise message.",
      deliverables: [
        "Campaign concept",
        "Creative treatment",
        "Script and storyboard",
        "Commercial production",
        "Product and property films",
        "Digital advertising edits",
        "Short and long-form versions",
        "Multiple aspect ratios",
      ],
      cta: "Explore Advertising Films",
    },
    {
      slug: "social-content",
      title: "Social Content",
      short: "Photography and motion designed to keep brands visible, relevant and recognisable.",
      expanded:
        "Social content should not feel disconnected from the larger brand. We create a library of photographs, videos and reels that reflects the property's identity while giving it the flexibility to communicate consistently across digital platforms.",
      deliverables: [
        "Reels",
        "Short-form videos",
        "Social photography",
        "Lifestyle and experience content",
        "Behind-the-scenes content",
        "Seasonal content",
        "Property walkthroughs",
        "Monthly content production",
        "Platform-specific edits",
        "Content libraries",
      ],
      cta: "Explore Social Content",
    },
    {
      slug: "ai-visuals",
      title: "AI Visuals",
      short: "Images and films that explore new creative possibilities beyond the physical frame.",
      expanded:
        "Artificial intelligence allows us to explore visual ideas that may not be possible to produce through conventional photography or film. We use AI to develop imaginative campaign visuals, conceptual environments and new forms of visual storytelling — always with clarity about what is real and what is created.",
      deliverables: [
        "AI-generated images",
        "AI-generated videos",
        "Concept visualisation",
        "Campaign experimentation",
        "Mood and atmosphere creation",
        "Hybrid photography and AI compositions",
        "Product and environment visualisation",
        "Creative treatments and storyboards",
      ],
      cta: "Explore AI Visuals",
      note: "AI-generated visuals are intended for conceptual, promotional and imaginative applications. Authentic property imagery remains grounded in the real space.",
    },
    {
      slug: "immersive-experiences",
      title: "Immersive Experiences",
      short: "360-degree virtual tours and interactive experiences that bring places closer to audiences.",
      expanded:
        "A photograph shows a space. An immersive experience allows people to explore it. We create virtual tours that help hotels, resorts, real estate developments and other properties communicate their spaces remotely and more interactively.",
      deliverables: [
        "360-degree virtual tours",
        "Interactive property tours",
        "Digital walkthroughs",
        "Hospitality and real estate tours",
        "Immersive presentations",
      ],
      cta: "Explore Immersive Experiences",
    },
  ] satisfies Service[],
};

/* ── Projects page ───────────────────────────────────────────────────── */

/**
 * The brief says "3 galleries" then lists four disciplines; four is the
 * literal reading. Only Photography has a body of work wired up so far — the
 * rest carry an explicit empty state rather than filler.
 */
export const projectsPage = {
  eyebrow: "Projects",
  title: "Selected visual stories created for architecture, hospitality, real estate and brands.",
  lead: "A cross-section of the work — spaces, experiences and brands, seen through one consistent point of view.",
  galleries: [
    { slug: "photography", label: "Photography", ready: true },
    { slug: "films", label: "Films", ready: false },
    { slug: "digital-content", label: "Digital Content", ready: false },
    { slug: "immersive", label: "Immersive Experiences", ready: false },
  ],
  empty: {
    title: "Gallery coming soon",
    body: "This collection is being prepared. In the meantime, tell us what you are working on and we will share relevant work directly.",
  },
};

/* ── Journal page ────────────────────────────────────────────────────── */

/**
 * PLACEHOLDERS. No posts were supplied with the brief, so these exist to prove
 * the layout and are labelled as such on screen. There is deliberately no
 * [slug] route yet: a static export needs generateStaticParams, and there is
 * nothing real to enumerate.
 */
export const journalPage = {
  eyebrow: "Journal",
  title: "Observations, ideas, stories and perspectives from the world of places and visual culture.",
  lead: "Notes from the studio — on light, architecture, hospitality and the craft of visual storytelling.",
  posts: [
    {
      title: "Reading a building before photographing it",
      excerpt:
        "Why the first hour on site is spent without a camera, and what that time reveals about how a space wants to be seen.",
      topic: "Craft",
    },
    {
      title: "The hour that decides the photograph",
      excerpt:
        "Light does most of the work in architectural photography. Planning a shoot around it is the difference between a record and an image.",
      topic: "Light",
    },
    {
      title: "What hospitality brands actually need from content",
      excerpt:
        "A library, not a campaign. How ongoing visual systems outperform one-off shoots for properties with a year-round audience.",
      topic: "Strategy",
    },
  ],
};

/* ── Enquire page ────────────────────────────────────────────────────── */

export const enquirePage = {
  eyebrow: "Enquire",
  title: "Tell us about your property, project or creative ambition.",
  lead: "Share a little about what you are planning and we will come back to you with a considered response, relevant work and a sense of how we would approach it.",
  projectTypes: [
    "Photography",
    "Brand Films",
    "Advertising Films",
    "Social Content",
    "AI Visuals",
    "Immersive Experiences",
    "Not sure yet",
  ],
};
