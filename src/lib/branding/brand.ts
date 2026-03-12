export const brand = {
  name: "Moneger",
  title: "Moneger — Smart Money Manager",
  tagline: "Your Smart Money Manager",
  coreMessage: "Your Money. Your Control.",
  description:
    "Moneger is a privacy-first, local-first money management app to track income, expenses, debt, and owed money with full control over your data.",
  domain: process.env.NEXT_PUBLIC_APP_URL || "https://moneger.marcbd.site",
  colors: {
    primary: "#16A34A",
    secondary: "#0F172A",
    accent: "#38BDF8",
    neutral: "#F1F5F9",
    text: "#1E293B"
  }
};

export const marketingHighlights = [
  "Primary financial records stay on your device in IndexedDB by default.",
  "Offline-first architecture keeps your ledger available without depending on a server.",
  "Firebase is limited to auth, profile metadata, and optional encrypted sync scaffolding."
];
