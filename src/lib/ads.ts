export const ads = {
  enabled: process.env.NEXT_PUBLIC_ADS_ENABLED === "true",
  publisher: process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "",
  slots: {
    introduction: process.env.NEXT_PUBLIC_AD_SLOT_INTRO || "",
    details: process.env.NEXT_PUBLIC_AD_SLOT_DETAILS || "",
  },
};
