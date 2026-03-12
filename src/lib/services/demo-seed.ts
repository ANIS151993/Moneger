"use client";

import { addMonths, subDays } from "date-fns";

import {
  bankRepository,
  debtRepository,
  expenseRepository,
  incomeRepository,
  owedRepository,
  settingsRepository
} from "@/lib/repositories/finance-repositories";

export async function seedDemoDataIfEmpty(userId: string) {
  const existingIncome = await incomeRepository.list(userId);
  if (existingIncome.length > 0) {
    return;
  }

  const now = new Date();

  await Promise.all([
    incomeRepository.create(userId, {
      amount: 4200,
      currency: "USD",
      source: "Acme Labs Payroll",
      category: "Salary",
      frequency: "monthly",
      note: "Primary salary deposit",
      date: subDays(now, 3).toISOString()
    }),
    incomeRepository.create(userId, {
      amount: 65000,
      currency: "BDT",
      source: "Freelance client",
      category: "Freelance",
      frequency: "one-time",
      note: "Landing page redesign project",
      date: subDays(now, 9).toISOString()
    }),
    expenseRepository.create(userId, {
      amount: 980,
      currency: "USD",
      source: "Rent",
      category: "Housing",
      note: "Monthly apartment rent",
      date: subDays(now, 2).toISOString()
    }),
    expenseRepository.create(userId, {
      amount: 8200,
      currency: "BDT",
      source: "Groceries",
      category: "Food",
      note: "Weekly market spend",
      date: subDays(now, 6).toISOString()
    }),
    debtRepository.create(userId, {
      creditorName: "Rahim Uddin",
      creditorEmail: "rahim@example.com",
      creditorPhone: "+8801700000000",
      amount: 18000,
      currency: "BDT",
      note: "Short-term personal loan",
      createdDate: subDays(now, 20).toISOString(),
      settlementDate: addMonths(now, 1).toISOString(),
      status: "partial"
    }),
    owedRepository.create(userId, {
      debtorName: "Nadia Karim",
      debtorEmail: "nadia@example.com",
      debtorPhone: "+8801800000000",
      amount: 240,
      currency: "USD",
      note: "Shared travel booking reimbursement",
      createdDate: subDays(now, 14).toISOString(),
      settlementDate: addMonths(now, 1).toISOString(),
      status: "pending"
    }),
    bankRepository.create(userId, {
      bankName: "BRAC Bank",
      nickname: "Salary Wallet",
      last4: "3201",
      currency: "USD",
      note: "Primary inflow account"
    }),
    bankRepository.create(userId, {
      bankName: "City Bank",
      nickname: "Daily Spend",
      last4: "8427",
      currency: "BDT",
      note: "Debit card for local expenses"
    }),
    settingsRepository.upsert(userId, {
      displayCurrency: "USD",
      notificationsEnabled: true,
      optionalEncryptedSyncEnabled: false,
      browserNotificationsPermission:
        typeof Notification === "undefined" ? "unsupported" : Notification.permission,
      themePreference: "system",
      lastSeededAt: new Date().toISOString()
    })
  ]);
}
