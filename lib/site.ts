const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteConfig = {
  name: "Wazir Trading LLC",
  description:
    "Explore Japanese used vehicles and request clear export information from Wazir Trading LLC's Japan-based operation.",
  url: (configuredUrl || "https://www.wazirtradingllc.com").replace(/\/$/, ""),
  email: "wazirtrading-pc@outlook.jp",
  whatsappNumber: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "818089227375").replace(/\D/g, ""),
  address: {
    streetAddress: "Heights Mizutani 1C, 158-1 Jizou",
    addressLocality: "Kuwana-City",
    addressRegion: "Mie Prefecture",
    addressCountry: "JP",
  },
  social: {
    instagram: "https://www.instagram.com/wazirtradingllc/",
    facebook: "https://www.facebook.com/share/r/1PcvhfmRQy/",
  },
} as const;

export function whatsappUrl(message: string) {
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
