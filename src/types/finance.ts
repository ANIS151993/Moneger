export type CurrencyCode =
  | "USD"
  | "BDT"
  | "INR"
  | "PKR"
  | "SAR"
  | "RUB"
  | "KGS"
  | "EUR"
  | "NPR"
  | "CAD"
  | "AUD";
export type CountryCode = "US" | "BD" | "IN" | "PK" | "SA" | "RU" | "KG" | "FR" | "DE" | "NP" | "CA" | "AU";
export type Gender = "" | "male" | "female" | "non-binary" | "other" | "prefer-not-to-say";
export type LanguagePreference = "en" | "bn" | "hi" | "ur" | "ar" | "ru" | "ky" | "fr" | "de" | "ne";
export type MaritalStatus = "" | "single" | "married" | "engaged" | "separated" | "divorced" | "widowed" | "prefer-not-to-say";

export type IncomeFrequency = "daily" | "weekly" | "monthly" | "one-time";
export type DebtStatus = "unpaid" | "partial" | "paid" | "overdue";
export type OwedStatus = "pending" | "partial" | "settled" | "overdue";
export type InstallmentFrequency = "weekly" | "biweekly" | "monthly" | "custom";
export type SharingStatus = "local" | "invited" | "matched";
export type SharedAgreementStatus = "invited" | "pending-acceptance" | "agreed" | "cancelled";
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

export interface InstallmentScheduleItem {
  dueDate: string;
  amount: number;
  settled: boolean;
  note: string;
  frequency: InstallmentFrequency;
}

export interface SharedRecordMeta {
  sharedObligationId?: string;
  sharingStatus?: SharingStatus;
  counterpartUserId?: string;
  sharedAgreementStatus?: SharedAgreementStatus;
  sharedCurrentUserAcceptedAt?: string | null;
  sharedCounterpartyAcceptedAt?: string | null;
  sharedUpdatedAt?: string;
}

export interface BankRecord extends BaseEntity {
  country: CountryCode;
  bankName: string;
  nickname: string;
  last4: string;
  currency: CurrencyCode;
  note: string;
}

export interface DebtRecord extends BaseEntity, SharedRecordMeta {
  creditorName: string;
  creditorEmail: string;
  creditorPhone: string;
  amount: number;
  currency: CurrencyCode;
  note: string;
  createdDate: string;
  settlementDate: string;
  status: DebtStatus;
  installments?: InstallmentScheduleItem[];
}

export interface OwedRecord extends BaseEntity, SharedRecordMeta {
  debtorName: string;
  debtorEmail: string;
  debtorPhone: string;
  amount: number;
  currency: CurrencyCode;
  note: string;
  createdDate: string;
  settlementDate: string;
  status: OwedStatus;
  installments?: InstallmentScheduleItem[];
}

export interface ExchangeRateRecord extends BaseEntity {
  pair: string;
  base: CurrencyCode;
  quote: CurrencyCode;
  rate: number;
  fetchedAt: string;
  source: string;
}

export interface ExchangeRateSnapshotRecord extends BaseEntity {
  base: CurrencyCode;
  fetchedAt: string;
  source: string;
  rates: Record<CurrencyCode, number>;
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
  baseCurrency: CurrencyCode;
  comparisonCurrency: CurrencyCode | "";
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
  base: CurrencyCode;
  rates: Record<CurrencyCode, number>;
  updatedAt: string | null;
}

export interface UserDirectoryRecord {
  uid: string;
  email: string;
  emailLower: string;
  displayName: string;
  contactNumber: string;
  location: string;
  avatarDataUrl: string;
  languagePreference: LanguagePreference;
  createdAt: string;
  updatedAt: string;
}

export interface SharedObligationParticipant {
  uid: string | null;
  email: string;
  name: string;
  phone: string;
  acceptedAt: string | null;
}

export interface SharedObligationRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdByUid: string;
  sourceType: "debt" | "owed";
  amount: number;
  currency: CurrencyCode;
  note: string;
  createdDate: string;
  settlementDate: string;
  installments: InstallmentScheduleItem[];
  sourceStatus: string;
  participantUids: string[];
  participantEmails: string[];
  status: SharedAgreementStatus;
  inviteEmailSentAt: string | null;
  creditor: SharedObligationParticipant;
  debtor: SharedObligationParticipant;
}

export interface SharedObligationMessageRecord {
  id: string;
  obligationId: string;
  senderUid: string;
  senderEmail: string;
  senderName: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageNotificationRecord extends BaseEntity {
  type: "shared-message";
  sharedObligationId: string;
  messageId: string;
  counterpartName: string;
  title: string;
  body: string;
  routeHref: string;
  messageCreatedAt: string;
  readAt: string | null;
}

export interface SharedMessageStateRecord extends BaseEntity {
  sharedObligationId: string;
  lastKnownMessageAt: string;
  lastSeenAt: string | null;
}

export interface OptionalEncryptedSyncPayload {
  version: 1;
  userId: string;
  encryptedBlob: string;
  createdAt: string;
}
