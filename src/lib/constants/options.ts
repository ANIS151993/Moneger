import type {
  CurrencyCode,
  DebtStatus,
  Gender,
  IncomeFrequency,
  LanguagePreference,
  MaritalStatus,
  OwedStatus
} from "@/types/finance";

export const supportedCurrencies: CurrencyCode[] = [
  "USD",
  "BDT",
  "INR",
  "PKR",
  "SAR",
  "RUB",
  "KGS",
  "EUR",
  "NPR",
  "CAD",
  "AUD"
];

export const currencyCatalog: Record<CurrencyCode, { code: CurrencyCode; label: string }> = {
  USD: { code: "USD", label: "USD · US Dollar" },
  BDT: { code: "BDT", label: "BDT · Bangladeshi Taka" },
  INR: { code: "INR", label: "INR · Indian Rupee" },
  PKR: { code: "PKR", label: "PKR · Pakistani Rupee" },
  SAR: { code: "SAR", label: "SAR · Saudi Riyal" },
  RUB: { code: "RUB", label: "RUB · Russian Ruble" },
  KGS: { code: "KGS", label: "KGS · Kyrgyzstani Som" },
  EUR: { code: "EUR", label: "EUR · Euro" },
  NPR: { code: "NPR", label: "NPR · Nepalese Rupee" },
  CAD: { code: "CAD", label: "CAD · Canadian Dollar" },
  AUD: { code: "AUD", label: "AUD · Australian Dollar" }
};
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
  "JPMorgan Chase Bank",
  "Bank of America",
  "Wells Fargo Bank",
  "Citibank",
  "Discover Bank",
  "First Citizens Bank",
  "U.S. Bank",
  "PNC Bank",
  "Truist Bank",
  "Capital One",
  "TD Bank",
  "BMO Bank",
  "American Express National Bank",
  "Ally Bank",
  "Charles Schwab Bank",
  "Citizens Bank",
  "Fifth Third Bank",
  "Goldman Sachs Bank USA",
  "Huntington National Bank",
  "KeyBank",
  "M&T Bank",
  "Marcus by Goldman Sachs",
  "Navy Federal Credit Union",
  "Regions Bank",
  "Santander Bank",
  "SoFi Bank",
  "Synchrony Bank",
  "HSBC Bank USA",
  "USAA Federal Savings Bank",
  "Valley Bank",
  "Webster Bank"
];
