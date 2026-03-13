"use client";

import type { ChangeEvent } from "react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useI18n } from "@/components/providers/LanguageProvider";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { genders, maritalStatuses } from "@/lib/constants/options";
import { ledgerService } from "@/lib/services/ledger-service";
import { getProfileDisplayName, getProfileSummary } from "@/lib/utils/profile";
import { profileSchema, type ProfileFormValues, type ProfileInput } from "@/lib/validators/finance";
import type { SettingsRecord } from "@/types/finance";

const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
const SUPPORTED_PROFILE_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("PROFILE_PHOTO_READ_ERROR"));
        return;
      }

      resolve(reader.result);
    };

    reader.onerror = () => reject(new Error("PROFILE_PHOTO_READ_ERROR"));
    reader.readAsDataURL(file);
  });
}

export function ProfileForm({
  userId,
  email,
  settings,
  mode = "settings",
  onSaved
}: {
  userId: string;
  email?: string | null;
  settings?: SettingsRecord;
  mode?: "settings" | "onboarding";
  onSaved?: () => void;
}) {
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [isPending, startTransition] = useTransition();
  const { t } = useI18n();
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    setError,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ProfileFormValues, unknown, ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: settings?.fullName || "",
      contactNumber: settings?.contactNumber || "",
      occupation: settings?.occupation || "",
      gender: settings?.gender || "",
      maritalStatus: settings?.maritalStatus || "",
      location: settings?.location || "",
      bio: settings?.bio || "",
      avatarDataUrl: settings?.avatarDataUrl || ""
    }
  });
  const avatarDataUrl = watch("avatarDataUrl");
  const isOnboarding = mode === "onboarding";
  const displayName = getProfileDisplayName({ ...settings, fullName: watch("fullName") }, email);
  const summary = getProfileSummary({
    ...settings,
    occupation: watch("occupation"),
    location: watch("location")
  });

  useEffect(() => {
    reset({
      fullName: settings?.fullName || "",
      contactNumber: settings?.contactNumber || "",
      occupation: settings?.occupation || "",
      gender: settings?.gender || "",
      maritalStatus: settings?.maritalStatus || "",
      location: settings?.location || "",
      bio: settings?.bio || "",
      avatarDataUrl: settings?.avatarDataUrl || ""
    });
  }, [reset, settings]);

  function onSubmit(values: ProfileInput) {
    setMessage("");
    setFormError("");

    if (isOnboarding) {
      clearErrors(["fullName", "contactNumber", "occupation", "gender", "maritalStatus", "location"]);

      const requiredEntries = [
        ["fullName", values.fullName],
        ["contactNumber", values.contactNumber],
        ["occupation", values.occupation],
        ["gender", values.gender],
        ["maritalStatus", values.maritalStatus],
        ["location", values.location]
      ] as const;
      const missingEntries = requiredEntries.filter(([, value]) => !value?.trim());

      if (missingEntries.length > 0) {
        for (const [field] of missingEntries) {
          setError(field, {
            type: "required",
            message: t("profile.requiredForOnboarding")
          });
        }

        setFormError(t("profile.completeRequiredError"));
        return;
      }
    }

    startTransition(async () => {
      try {
        await ledgerService.saveProfile(userId, values);
        setMessage(isOnboarding ? t("profile.onboardingSaved") : t("profile.saved"));
        onSaved?.();
      } catch (error) {
        setFormError(error instanceof Error ? error.message : t("profile.saveError"));
      }
    });
  }

  async function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setMessage("");
    setFormError("");

    if (!SUPPORTED_PROFILE_IMAGE_TYPES.includes(file.type)) {
      setFormError(t("profile.photoTypeError"));
      event.target.value = "";
      return;
    }

    if (file.size > MAX_PHOTO_BYTES) {
      setFormError(t("profile.photoSizeError"));
      event.target.value = "";
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setValue("avatarDataUrl", dataUrl, { shouldDirty: true, shouldValidate: true });
      setMessage(t("profile.photoReady"));
    } catch (error) {
      setFormError(error instanceof Error && error.message !== "PROFILE_PHOTO_READ_ERROR" ? error.message : t("profile.photoReadError"));
    } finally {
      event.target.value = "";
    }
  }

  function handleRemovePhoto() {
    setValue("avatarDataUrl", "", { shouldDirty: true, shouldValidate: true });
    setMessage(t("profile.photoRemoved"));
    setFormError("");
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.35),_transparent_32%),linear-gradient(140deg,#0f172a_0%,#111827_46%,#065f46_100%)] px-6 py-6 text-white">
        <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute left-6 top-4 h-24 w-24 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <ProfileAvatar imageUrl={avatarDataUrl} name={displayName} size="lg" />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200">{t("profile.title")}</p>
              <h2 className="mt-3 truncate text-3xl font-semibold tracking-tight">{displayName}</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-200">{summary}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.22em] text-slate-300">{email || t("profile.localAccount")}</p>
            </div>
          </div>
          <div className="rounded-[24px] border border-white/15 bg-white/10 px-4 py-4 shadow-lg backdrop-blur">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
              {isOnboarding ? t("profile.onboardingTitle") : t("profile.storageTitle")}
            </p>
            <p className="mt-2 text-sm font-medium text-white">
              {isOnboarding ? t("profile.onboardingHeading") : t("profile.storageHeading")}
            </p>
            <p className="mt-1 max-w-xs text-sm leading-6 text-slate-300">
              {isOnboarding ? t("profile.onboardingDescription") : t("profile.storageDescription")}
            </p>
          </div>
        </div>
      </div>

      <form className="grid gap-5 p-6" onSubmit={handleSubmit(onSubmit)}>
        {isOnboarding ? (
          <div className="rounded-[24px] border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm text-emerald-800">
            <p className="font-semibold">{t("profile.completeRequiredTitle")}</p>
            <p className="mt-1 leading-6">{t("profile.completeRequiredDescription")}</p>
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label={t("profile.fullName")} error={errors.fullName?.message}>
            <Input placeholder={t("profile.namePlaceholder")} {...register("fullName")} />
          </FormField>
          <FormField label={t("profile.contactNumber")} error={errors.contactNumber?.message}>
            <Input placeholder={t("profile.contactPlaceholder")} {...register("contactNumber")} />
          </FormField>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label={t("profile.occupation")} error={errors.occupation?.message}>
            <Input placeholder={t("profile.occupationPlaceholder")} {...register("occupation")} />
          </FormField>
          <FormField label={t("profile.gender")} error={errors.gender?.message}>
            <Select {...register("gender")}>
              <option value="">{t("profile.selectGender")}</option>
              {genders.map((gender) => (
                <option key={gender} value={gender}>
                  {t(`options.gender.${gender}`)}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label={t("profile.maritalStatus")} error={errors.maritalStatus?.message}>
            <Select {...register("maritalStatus")}>
              <option value="">{t("profile.selectMaritalStatus")}</option>
              {maritalStatuses.map((status) => (
                <option key={status} value={status}>
                  {t(`options.maritalStatus.${status}`)}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label={t("profile.location")} error={errors.location?.message}>
            <Input placeholder={t("profile.locationPlaceholder")} {...register("location")} />
          </FormField>
        </div>

        <FormField
          label={t("profile.photo")}
          error={errors.avatarDataUrl?.message}
          hint={t("profile.photoHint")}
        >
          <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                {t("profile.photoUpload")}
                <input accept="image/png,image/jpeg,image/webp" className="hidden" type="file" onChange={handlePhotoChange} />
              </label>
              <Button type="button" variant="ghost" onClick={handleRemovePhoto}>
                {t("profile.photoRemove")}
              </Button>
            </div>
          </div>
        </FormField>

        <FormField label={t("profile.note")} error={errors.bio?.message} hint={t("profile.noteHint")}>
          <Textarea placeholder={t("profile.notePlaceholder")} {...register("bio")} />
        </FormField>

        {message ? <p className="text-sm font-medium text-emerald-600">{message}</p> : null}
        {formError ? <p className="text-sm font-medium text-rose-600">{formError}</p> : null}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending ? t("common.saving") : isOnboarding ? t("profile.completeSetup") : t("profile.save")}
          </Button>
          {!isOnboarding ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                reset({
                  fullName: settings?.fullName || "",
                  contactNumber: settings?.contactNumber || "",
                  occupation: settings?.occupation || "",
                  gender: settings?.gender || "",
                  maritalStatus: settings?.maritalStatus || "",
                  location: settings?.location || "",
                  bio: settings?.bio || "",
                  avatarDataUrl: settings?.avatarDataUrl || ""
                });
                setMessage("");
                setFormError("");
              }}
            >
              {t("profile.reset")}
            </Button>
          ) : null}
        </div>
      </form>
    </Card>
  );
}
