import type { CurrencyCode, DebtStatus, IncomeFrequency, MaritalStatus, OwedStatus } from "@/types/finance";

export const supportedCurrencies: CurrencyCode[] = ["USD", "BDT"];

export const incomeFrequencies: IncomeFrequency[] = ["daily", "weekly", "monthly", "one-time"];

export const incomeCategories = [
  "Salary",
  "Business",
  "Freelance",
  "Investments",
  "Rental",
  "Other"
];

export const expenseCategories = [
  "Housing",
  "Food",
  "Transport",
  "Utilities",
  "Health",
  "Education",
  "Shopping",
  "Travel",
  "Other"
];

export const debtStatuses: DebtStatus[] = ["unpaid", "partial", "paid", "overdue"];

export const owedStatuses: OwedStatus[] = ["pending", "partial", "settled", "overdue"];

export const maritalStatuses = [
  "single",
  "married",
  "engaged",
  "separated",
  "divorced",
  "widowed",
  "prefer-not-to-say"
] as const satisfies readonly Exclude<MaritalStatus, "">[];

export const banks = [
  "DBBL",
  "BRAC Bank",
  "City Bank",
  "HSBC",
  "Chase",
  "Bank of America",
  "Wells Fargo"
];
