// Central place for the handful of values that aren't code — fill in once
// confirmed and every page picks it up automatically.
export const SITE_CONFIG = {
  name: "Careerwithkumar",
  description:
    "Verified job, internship, and walk-in notifications — govt, private, remote.",
  contactEmail: "careerwithkumar@gmail.com",
  instagramFollowers: 20000, // TODO: not derivable from our DB — update by hand as it grows
  social: {
    instagram: null as string | null, // TODO: e.g. "https://instagram.com/careerwithkumar"
    instagramHandle: null as string | null, // TODO: e.g. "@careerwithkumar"
    whatsapp: null as string | null, // TODO: channel/group link or number
    telegram: null as string | null, // TODO: link, or leave null to hide
  },
};
