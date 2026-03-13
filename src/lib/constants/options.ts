import type {
  CountryCode,
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

export const supportedBankCountries: CountryCode[] = [
  "US",
  "BD",
  "IN",
  "PK",
  "SA",
  "RU",
  "KG",
  "FR",
  "DE",
  "NP",
  "CA",
  "AU"
];

export const bankCountryCatalog: Record<
  CountryCode,
  { code: CountryCode; label: string; currency: CurrencyCode; googleRegionCode: string; banks: string[] }
> = {
  US: {
    code: "US",
    label: "United States",
    currency: "USD",
    googleRegionCode: "us",
    banks: [
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
      "USAA Federal Savings Bank"
    ]
  },
  BD: {
    code: "BD",
    label: "Bangladesh",
    currency: "BDT",
    googleRegionCode: "bd",
    banks: [
      "DBBL",
      "BRAC Bank",
      "City Bank",
      "Eastern Bank",
      "HSBC Bangladesh",
      "Islami Bank Bangladesh",
      "Mutual Trust Bank",
      "Dutch-Bangla Bank",
      "Prime Bank",
      "Sonali Bank"
    ]
  },
  IN: {
    code: "IN",
    label: "India",
    currency: "INR",
    googleRegionCode: "in",
    banks: [
      "State Bank of India",
      "HDFC Bank",
      "ICICI Bank",
      "Axis Bank",
      "Kotak Mahindra Bank",
      "Punjab National Bank",
      "Bank of Baroda",
      "Canara Bank",
      "IndusInd Bank",
      "Union Bank of India"
    ]
  },
  PK: {
    code: "PK",
    label: "Pakistan",
    currency: "PKR",
    googleRegionCode: "pk",
    banks: [
      "HBL",
      "UBL",
      "MCB Bank",
      "Allied Bank",
      "Meezan Bank",
      "Bank Alfalah",
      "Faysal Bank",
      "Standard Chartered Pakistan",
      "Askari Bank",
      "BankIslami Pakistan"
    ]
  },
  SA: {
    code: "SA",
    label: "Saudi Arabia",
    currency: "SAR",
    googleRegionCode: "sa",
    banks: [
      "Al Rajhi Bank",
      "Saudi National Bank",
      "Riyad Bank",
      "Saudi Awwal Bank",
      "Banque Saudi Fransi",
      "Arab National Bank",
      "Alinma Bank",
      "Bank Albilad"
    ]
  },
  RU: {
    code: "RU",
    label: "Russia",
    currency: "RUB",
    googleRegionCode: "ru",
    banks: [
      "Sberbank",
      "VTB Bank",
      "Gazprombank",
      "Alfa-Bank",
      "T-Bank",
      "Rosselkhozbank",
      "Sovcombank",
      "Otkritie Bank"
    ]
  },
  KG: {
    code: "KG",
    label: "Kyrgyzstan",
    currency: "KGS",
    googleRegionCode: "kg",
    banks: [
      "DemirBank",
      "KICB",
      "Optima Bank",
      "Kompanion Bank",
      "Bakai Bank",
      "Dos-Kredobank",
      "Aiyl Bank",
      "MBANK"
    ]
  },
  FR: {
    code: "FR",
    label: "France",
    currency: "EUR",
    googleRegionCode: "fr",
    banks: [
      "BNP Paribas",
      "Societe Generale",
      "Credit Agricole",
      "LCL",
      "Banque Populaire",
      "Caisse d'Epargne",
      "Boursorama Banque",
      "La Banque Postale"
    ]
  },
  DE: {
    code: "DE",
    label: "Germany",
    currency: "EUR",
    googleRegionCode: "de",
    banks: [
      "Deutsche Bank",
      "Commerzbank",
      "DZ Bank",
      "N26",
      "DKB",
      "Postbank",
      "HypoVereinsbank",
      "Sparkasse"
    ]
  },
  NP: {
    code: "NP",
    label: "Nepal",
    currency: "NPR",
    googleRegionCode: "np",
    banks: [
      "Nabil Bank",
      "Global IME Bank",
      "Nepal Investment Mega Bank",
      "NIC Asia Bank",
      "Himalayan Bank",
      "Standard Chartered Nepal",
      "Prabhu Bank",
      "Everest Bank"
    ]
  },
  CA: {
    code: "CA",
    label: "Canada",
    currency: "CAD",
    googleRegionCode: "ca",
    banks: [
      "Royal Bank of Canada",
      "TD Canada Trust",
      "Scotiabank",
      "Bank of Montreal",
      "CIBC",
      "National Bank of Canada",
      "Tangerine",
      "Simplii Financial"
    ]
  },
  AU: {
    code: "AU",
    label: "Australia",
    currency: "AUD",
    googleRegionCode: "au",
    banks: [
      "Commonwealth Bank",
      "Westpac",
      "ANZ",
      "NAB",
      "Macquarie Bank",
      "ING Australia",
      "Bendigo Bank",
      "Suncorp Bank"
    ]
  }
};

const fallbackCountryByCurrency: Record<CurrencyCode, CountryCode> = {
  USD: "US",
  BDT: "BD",
  INR: "IN",
  PKR: "PK",
  SAR: "SA",
  RUB: "RU",
  KGS: "KG",
  EUR: "FR",
  NPR: "NP",
  CAD: "CA",
  AUD: "AU"
};

export function inferBankCountry(bankName: string, currency: CurrencyCode): CountryCode {
  for (const country of supportedBankCountries) {
    if (bankCountryCatalog[country].banks.some((bank) => bank.toLowerCase() === bankName.toLowerCase())) {
      return country;
    }
  }

  return fallbackCountryByCurrency[currency] || "US";
}
