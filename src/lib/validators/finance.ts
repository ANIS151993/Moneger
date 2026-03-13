import { z } from "zod";

import {
  debtStatuses,
  expenseCategories,
  genders,
  incomeCategories,
  incomeFrequencies,
  languagePreferences,
  maritalStatuses,
  owedStatuses,
  supportedCurrencies
} from "@/lib/constants/options";

const currencySchema = z.enum(supportedCurrencies as [typeof supportedCurrencies[number], ...typeof supportedCurrencies[number][]]);
const optionalCurrencySchema = z.enum(["", ...supportedCurrencies] as ["", ...typeof supportedCurrencies[number][]]);
const genderSchema = z.enum(["", ...genders] as const);
const languagePreferenceSchema = z.enum(
  languagePreferences.map((item) => item.value) as [
    typeof languagePreferences[number]["value"],
    ...typeof languagePreferences[number]["value"][]
  ]
);
const maritalStatusSchema = z.enum(["", ...maritalStatuses] as const);

export const incomeSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  currency: currencySchema,
  source: z.string().min(2, "Source is required"),
  category: z.enum(incomeCategories as [string, ...string[]]),
  frequency: z.enum(incomeFrequencies),
  note: z.string().max(200).default(""),
  date: z.string().min(1, "Date is required")
});

export const expenseSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  currency: currencySchema,
  source: z.string().min(2, "Merchant is required"),
  category: z.enum(expenseCategories as [string, ...string[]]),
  note: z.string().max(200).default(""),
  date: z.string().min(1, "Date is required")
});

export const debtSchema = z.object({
  creditorName: z.string().min(2, "Creditor name is required"),
  creditorEmail: z.string().email("Enter a valid email").or(z.literal("")),
  creditorPhone: z.string().max(32).default(""),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  currency: z.enum(supportedCurrencies),
  note: z.string().max(200).default(""),
  createdDate: z.string().min(1, "Created date is required"),
  settlementDate: z.string().min(1, "Settlement date is required"),
  status: z.enum(debtStatuses)
});

export const owedSchema = z.object({
  debtorName: z.string().min(2, "Debtor name is required"),
  debtorEmail: z.string().email("Enter a valid email").or(z.literal("")),
  debtorPhone: z.string().max(32).default(""),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  currency: z.enum(supportedCurrencies),
  note: z.string().max(200).default(""),
  createdDate: z.string().min(1, "Created date is required"),
  settlementDate: z.string().min(1, "Settlement date is required"),
  status: z.enum(owedStatuses)
});

export const bankSchema = z.object({
  bankName: z.string().min(2, "Bank name is required"),
  nickname: z.string().min(2, "Nickname is required"),
  last4: z
    .string()
    .regex(/^\d{4}$/, "Last 4 must be exactly four digits"),
  currency: currencySchema,
  note: z.string().max(200).default("")
});

export const settingsSchema = z.object({
  baseCurrency: currencySchema,
  comparisonCurrency: optionalCurrencySchema,
  languagePreference: languagePreferenceSchema,
  notificationsEnabled: z.boolean(),
  optionalEncryptedSyncEnabled: z.boolean(),
  themePreference: z.enum(["system", "light"])
}).refine((value) => value.comparisonCurrency === "" || value.comparisonCurrency !== value.baseCurrency, {
  message: "Comparison currency must be different from the base currency",
  path: ["comparisonCurrency"]
});

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .max(80, "Name must be 80 characters or less")
    .refine((value) => value === "" || value.length >= 2, "Name must be at least 2 characters")
    .default(""),
  contactNumber: z
    .string()
    .trim()
    .max(32, "Contact number must be 32 characters or less")
    .refine(
      (value) => value === "" || /^[0-9+().\-\s]{7,20}$/.test(value),
      "Enter a valid contact number"
    )
    .default(""),
  occupation: z.string().trim().max(80, "Occupation must be 80 characters or less").default(""),
  gender: genderSchema.default(""),
  maritalStatus: maritalStatusSchema.default(""),
  location: z.string().trim().max(80, "Location must be 80 characters or less").default(""),
  bio: z.string().trim().max(240, "Profile note must be 240 characters or less").default(""),
  avatarDataUrl: z
    .string()
    .max(3_000_000, "Profile photo is too large")
    .refine((value) => value === "" || value.startsWith("data:image/"), "Use a valid image file")
    .default("")
});

export type IncomeFormValues = z.input<typeof incomeSchema>;
export type ExpenseFormValues = z.input<typeof expenseSchema>;
export type DebtFormValues = z.input<typeof debtSchema>;
export type OwedFormValues = z.input<typeof owedSchema>;
export type BankFormValues = z.input<typeof bankSchema>;
export type SettingsFormValues = z.input<typeof settingsSchema>;
export type ProfileFormValues = z.input<typeof profileSchema>;

export type IncomeInput = z.output<typeof incomeSchema>;
export type ExpenseInput = z.output<typeof expenseSchema>;
export type DebtInput = z.output<typeof debtSchema>;
export type OwedInput = z.output<typeof owedSchema>;
export type BankInput = z.output<typeof bankSchema>;
export type SettingsInput = z.output<typeof settingsSchema>;
export type ProfileInput = z.output<typeof profileSchema>;
