export const siteRoutes = {
  home: "/",
  about: "/about",
  writing: "/writing",
  blog: "/blog",
  contact: "/contact",
  privacy: "/privacy",
} as const;

export type RouteKey = keyof typeof siteRoutes;

export interface NavLink {
  label: string;
  href: string;
  ariaLabel?: string;
}

export interface SocialLink {
  label: string;
  href: string;
  ariaLabel?: string;
  external?: boolean;
}

export interface CtaLink {
  label: string;
  href: string;
  ariaLabel?: string;
}

export const siteIdentity = {
  fullName: "Itunu Adegbayi",
  role: "Writer & Storyteller",
  summary:
    "Independent writer crafting thoughtful narratives across culture, brand storytelling, and editorial essays.",
  heroTagline: "Crafting narratives that connect, clarify, and compel.",
};

export const navigation: { primary: NavLink[]; secondary: NavLink[] } = {
  primary: [
    { label: "Home", href: siteRoutes.home },
    { label: "About", href: siteRoutes.about },
    { label: "Writing", href: siteRoutes.writing },
    { label: "Blog", href: siteRoutes.blog },
    { label: "Contact", href: siteRoutes.contact },
  ],
  secondary: [{ label: "Privacy", href: siteRoutes.privacy }],
};

export const callsToAction = {
  primary: { label: "Work with me", href: siteRoutes.contact, ariaLabel: "Work with Itunu" },
  secondary: { label: "Read writing", href: siteRoutes.blog },
};

export const socialLinks: SocialLink[] = [
  {
    label: "Email",
    href: "mailto:hello@itunus.com",
    ariaLabel: "Email Itunu",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/itunu-adegbayi",
    external: true,
    ariaLabel: "Connect on LinkedIn",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/itunu_adegbayi/",
    external: true,
    ariaLabel: "Follow on Instagram",
  },
  {
    label: "Substack",
    href: "https://substack.com/@itunus",
    external: true,
    ariaLabel: "Read Itunu's Substack",
  },
];

export const footerCopy = {
  note:
    "Portfolio and journal for Itunu Adegbayi. Stories across culture, strategy, and human-centric work.",
};
