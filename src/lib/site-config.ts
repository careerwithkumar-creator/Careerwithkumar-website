// Central place for the handful of values that aren't code — fill in once
// confirmed and every page picks it up automatically.
export const SITE_CONFIG = {
  name: "Careerwithkumar",
  description:
    "Verified job, internship, and walk-in notifications — govt, private, remote.",
  contactEmail: "careerwithkumar@gmail.com",
  instagramFollowers: 57000, // TODO: not derivable from our DB — update by hand as it grows
  social: {
    instagram: "https://www.instagram.com/careerwithkumar?stkn=YTRiczg1YjRvYW0w&utm_source=qr" as string | null,
    instagramHandle: "@careerwithkumar" as string | null,
    whatsapp: "https://whatsapp.com/channel/0029VbDeAno1NCrKoMlRHH1A" as string | null,
    telegram: null as string | null, // TODO: link, or leave null to hide
  },
};
