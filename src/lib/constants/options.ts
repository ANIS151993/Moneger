import type {
  CurrencyCode,
  DebtStatus,
  Gender,
  IncomeFrequency,
  LanguagePreference,
  MaritalStatus,
  OwedStatus
} from "@/types/finance";

export const supportedCurrencies: CurrencyCode[] = ["USD", "BDT"];
export const languagePreferences = [
  { value: "en", label: "English" },
  { value: "bn", label: "বাংলা" },
  { value: "hi", label: "हिन्दी" },
  { value: "ur", label: "اردو" },
  { value: "ar", label: "العربية" },
  { value: "ru", label: "Русский" },
  { value: "ky", label: "Кыргызча" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "ne", label: "नेपाली" }
] as const satisfies ReadonlyArray<{ value: LanguagePreference; label: string }>;

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

export const genders = [
  "male",
  "female",
  "non-binary",
  "other",
  "prefer-not-to-say"
] as const satisfies readonly Exclude<Gender, "">[];

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
