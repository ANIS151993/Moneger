export type CurrencyCode = "USD" | "BDT";
export type Gender = "" | "male" | "female" | "non-binary" | "other" | "prefer-not-to-say";
export type LanguagePreference = "en" | "bn";
export type MaritalStatus = "" | "single" | "married" | "engaged" | "separated" | "divorced" | "widowed" | "prefer-not-to-say";

export type IncomeFrequency = "daily" | "weekly" | "monthly" | "one-time";
export type DebtStatus = "unpaid" | "partial" | "paid" | "overdue";
export type OwedStatus = "pending" | "partial" | "settled" | "overdue";
export type SyncAction = "create" | "update" | "delete";
export type SyncStatus = "queued" | "encrypted" | "uploaded" | "failed";

export interface BaseEntity {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IncomeRecord extends BaseEntity {
  amount: number;
  currency: CurrencyCode;
  source: string;
  category: string;
  frequency: IncomeFrequency;
  note: string;
  date: string;
}

export interface ExpenseRecord extends BaseEntity {
  amount: number;
  currency: CurrencyCode;
  source: string;
  category: string;
  note: string;
  date: string;
}

export interface BankRecord extends BaseEntity {
  bankName: string;
  nickname: string;
  last4: string;
  currency: CurrencyCode;
  note: string;
}

export interface DebtRecord extends BaseEntity {
  creditorName: string;
  creditorEmail: string;
  creditorPhone: string;
  amount: number;
  currency: CurrencyCode;
  note: string;
  createdDate: string;
  settlementDate: string;
  status: DebtStatus;
}

export interface OwedRecord extends BaseEntity {
  debtorName: string;
  debtorEmail: string;
  debtorPhone: string;
  amount: number;
  currency: CurrencyCode;
  note: string;
  createdDate: string;
  settlementDate: string;
  status: OwedStatus;
}

export interface ExchangeRateRecord extends BaseEntity {
  pair: string;
  base: CurrencyCode;
  quote: CurrencyCode;
  rate: number;
  fetchedAt: string;
  source: string;
}

export interface SyncQueueRecord extends BaseEntity {
  entityType: "income" | "expense" | "debt" | "owed" | "bank" | "settings";
  action: SyncAction;
  status: SyncStatus;
  recordId: string;
  encryptedPayload: string | null;
  errorMessage: string;
}

export interface SettingsRecord extends BaseEntity {
  displayCurrency: CurrencyCode;
  languagePreference: LanguagePreference;
  notificationsEnabled: boolean;
  optionalEncryptedSyncEnabled: boolean;
  browserNotificationsPermission: NotificationPermission | "unsupported";
  themePreference: "system" | "light";
  fullName: string;
  contactNumber: string;
  occupation: string;
  gender: Gender;
  maritalStatus: MaritalStatus;
  location: string;
  bio: string;
  avatarDataUrl: string;
}

export type FinanceRecord =
  | IncomeRecord
  | ExpenseRecord
  | BankRecord
  | DebtRecord
  | OwedRecord;

export interface CategoryTotal {
  category: string;
  amount: number;
}

export interface MonthlyTrendPoint {
  label: string;
  income: number;
  expenses: number;
}

export interface ReminderItem {
  id: string;
  type: "debt" | "owed";
  title: string;
  subtitle: string;
  amount: number;
  currency: CurrencyCode;
  dueDate: string;
  severity: "upcoming" | "overdue";
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  amount: number;
  currency: CurrencyCode;
  date: string;
  tone: "income" | "expense" | "debt" | "owed";
}

export interface DashboardSnapshot {
  totalIncome: number;
  totalExpenses: number;
  totalDebt: number;
  totalOwed: number;
  netBalance: number;
  recentActivity: ActivityItem[];
  monthlyTrends: MonthlyTrendPoint[];
  categoryTotals: CategoryTotal[];
  reminders: ReminderItem[];
  debtVsOwed: {
    debt: number;
    owed: number;
  };
}

export interface CurrencyRateMap {
  usdToBdt: number;
  bdtToUsd: number;
  updatedAt: string | null;
}

export interface OptionalEncryptedSyncPayload {
  version: 1;
  userId: string;
  encryptedBlob: string;
  createdAt: string;
}
