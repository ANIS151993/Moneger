export const dashboardNavigation = [
  { href: "/dashboard", labelKey: "nav.overview" },
  { href: "/guide", labelKey: "nav.guide" },
  { href: "/income", labelKey: "nav.income" },
  { href: "/expenses", labelKey: "nav.expenses" },
  { href: "/debts", labelKey: "nav.debts" },
  { href: "/owed", labelKey: "nav.moneyOwed" },
  { href: "/banks", labelKey: "nav.banks" },
  { href: "/settings", labelKey: "nav.settings" }
] as const;

export const onboardingNavigation = [
  { href: "/welcome", labelKey: "nav.completeProfile" },
  { href: "/guide", labelKey: "nav.guide" }
] as const;
