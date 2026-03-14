import type { LanguagePreference } from "@/types/finance";
import { translateMessage } from "@/lib/i18n/messages";

const validationMessageMap: Record<string, string> = {
  "Enter a valid email address": "validation.enterValidEmailAddress",
  "Password must be at least 6 characters": "validation.passwordAtLeast6",
  "Password must be at least 8 characters": "validation.passwordAtLeast8",
  "Please confirm your password": "validation.confirmPasswordRequired",
  "Passwords do not match": "validation.passwordsMustMatch",
  "Amount must be greater than zero": "validation.amountGreaterThanZero",
  "Source is required": "validation.sourceRequired",
  "Merchant is required": "validation.merchantRequired",
  "Creditor name is required": "validation.creditorNameRequired",
  "Debtor name is required": "validation.debtorNameRequired",
  "Bank name is required": "validation.bankNameRequired",
  "Nickname is required": "validation.nicknameRequired",
  "Last 4 must be exactly four digits": "validation.last4Digits",
  "Date is required": "validation.dateRequired",
  "Created date is required": "validation.createdDateRequired",
  "Settlement date is required": "validation.settlementDateRequired",
  "Enter a valid email": "validation.enterValidEmail",
  "Name must be 80 characters or less": "validation.nameMax",
  "Name must be at least 2 characters": "validation.nameMin",
  "Contact number must be 32 characters or less": "validation.contactMax",
  "Enter a valid contact number": "validation.contactValid",
  "Occupation must be 80 characters or less": "validation.occupationMax",
  "Location must be 80 characters or less": "validation.locationMax",
  "Profile note must be 240 characters or less": "validation.profileNoteMax",
  "Profile photo is too large": "validation.profilePhotoLarge",
  "Use a valid image file": "validation.validImage",
  "Comparison currency must be different from the base currency": "validation.comparisonCurrencyDifferent"
};

export function translateValidationMessage(language: LanguagePreference, message?: string) {
  if (!message) {
    return "";
  }

  const key = validationMessageMap[message];

  if (!key) {
    return message;
  }

  return translateMessage(language, key);
}
