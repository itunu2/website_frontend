export const siteRoutes = {
  home: "/",
  about: "/about",
  portfolio: "/writing",
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
  role: "B2B SaaS & Martech Content Writer",
  summary:
    "I help B2B SaaS and Martech teams turn complex products into content that attracts the right buyers and converts them.",
  heroTagline: "B2B Content Made Human.",
};

export const navigation: { primary: NavLink[]; secondary: NavLink[] } = {
  primary: [
    { label: "Home", href: siteRoutes.home },
    { label: "About", href: siteRoutes.about },
    { label: "Portfolio", href: siteRoutes.portfolio },
    { label: "Blog", href: siteRoutes.blog },
    { label: "Contact", href: siteRoutes.contact },
  ],
  secondary: [{ label: "Privacy", href: siteRoutes.privacy }],
};

export const callsToAction = {
  primary: { label: "Let's Talk", href: siteRoutes.contact, ariaLabel: "Contact Itunu" },
  secondary: { label: "See My Work", href: siteRoutes.portfolio },
};

export const socialLinks: SocialLink[] = [
  {
    label: "Email",
    href: "mailto:adegbayiitunuoluwa@gmail.com",
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
    href: "https://substack.com/@queenit",
    external: true,
    ariaLabel: "Read Itunu's Substack",
  },
];

export const footerCopy = {
  note:
    "B2B SaaS & Martech content writer. Helping brands sound like people — and sell like it, too.",
};
