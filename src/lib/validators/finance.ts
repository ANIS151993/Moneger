import { z } from "zod";

import {
  debtStatuses,
  expenseCategories,
  incomeCategories,
  incomeFrequencies,
  owedStatuses,
  supportedCurrencies
} from "@/lib/constants/options";

const currencySchema = z.enum(["USD", "BDT"]);

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
  displayCurrency: currencySchema,
  notificationsEnabled: z.boolean(),
  optionalEncryptedSyncEnabled: z.boolean(),
  themePreference: z.enum(["system", "light"])
});

export type IncomeFormValues = z.input<typeof incomeSchema>;
export type ExpenseFormValues = z.input<typeof expenseSchema>;
export type DebtFormValues = z.input<typeof debtSchema>;
export type OwedFormValues = z.input<typeof owedSchema>;
export type BankFormValues = z.input<typeof bankSchema>;
export type SettingsFormValues = z.input<typeof settingsSchema>;

export type IncomeInput = z.output<typeof incomeSchema>;
export type ExpenseInput = z.output<typeof expenseSchema>;
export type DebtInput = z.output<typeof debtSchema>;
export type OwedInput = z.output<typeof owedSchema>;
export type BankInput = z.output<typeof bankSchema>;
export type SettingsInput = z.output<typeof settingsSchema>;
