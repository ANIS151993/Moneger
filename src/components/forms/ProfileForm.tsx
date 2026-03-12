"use client";

import type { ChangeEvent } from "react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

function formatStatusLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Unable to read the selected photo"));
        return;
      }

      resolve(reader.result);
    };

    reader.onerror = () => reject(new Error("Unable to read the selected photo"));
    reader.readAsDataURL(file);
  });
}

export function ProfileForm({
  userId,
  email,
  settings
}: {
  userId: string;
  email?: string | null;
  settings?: SettingsRecord;
}) {
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
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

    startTransition(async () => {
      try {
        await ledgerService.saveProfile(userId, values);
        setMessage("Profile saved locally.");
      } catch (error) {
        setFormError(error instanceof Error ? error.message : "Unable to save profile");
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
      setFormError("Select a JPG, PNG, or WEBP image");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_PHOTO_BYTES) {
      setFormError("Profile photo must be 2 MB or smaller");
      event.target.value = "";
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setValue("avatarDataUrl", dataUrl, { shouldDirty: true, shouldValidate: true });
      setMessage("Profile photo ready. Save profile to keep it.");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to load the selected photo");
    } finally {
      event.target.value = "";
    }
  }

  function handleRemovePhoto() {
    setValue("avatarDataUrl", "", { shouldDirty: true, shouldValidate: true });
    setMessage("Profile photo removed. Save profile to apply the change.");
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
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200">Profile Studio</p>
              <h2 className="mt-3 truncate text-3xl font-semibold tracking-tight">{displayName}</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-200">{summary}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.22em] text-slate-300">{email || "Local account"}</p>
            </div>
          </div>
          <div className="rounded-[24px] border border-white/15 bg-white/10 px-4 py-4 shadow-lg backdrop-blur">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Storage</p>
            <p className="mt-2 text-sm font-medium text-white">Saved only on this device</p>
            <p className="mt-1 max-w-xs text-sm leading-6 text-slate-300">
              Your profile photo and personal details stay in the browser unless you later add remote sync.
            </p>
          </div>
        </div>
      </div>

      <form className="grid gap-5 p-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Full name" error={errors.fullName?.message}>
            <Input placeholder="Anis Rahman" {...register("fullName")} />
          </FormField>
          <FormField label="Contact number" error={errors.contactNumber?.message}>
            <Input placeholder="+880 17XX-XXXXXX" {...register("contactNumber")} />
          </FormField>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Occupation" error={errors.occupation?.message}>
            <Input placeholder="Founder, Designer, Engineer" {...register("occupation")} />
          </FormField>
          <FormField label="Gender" error={errors.gender?.message}>
            <Select {...register("gender")}>
              <option value="">Select gender</option>
              {genders.map((gender) => (
                <option key={gender} value={gender}>
                  {formatStatusLabel(gender)}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Marital status" error={errors.maritalStatus?.message}>
            <Select {...register("maritalStatus")}>
              <option value="">Select status</option>
              {maritalStatuses.map((status) => (
                <option key={status} value={status}>
                  {formatStatusLabel(status)}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Location" error={errors.location?.message}>
            <Input placeholder="Dhaka, Bangladesh" {...register("location")} />
          </FormField>
        </div>

        <FormField
          label="Profile photo"
          error={errors.avatarDataUrl?.message}
          hint="JPG, PNG, or WEBP up to 2 MB. Stored locally."
        >
          <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                Upload photo
                <input accept="image/png,image/jpeg,image/webp" className="hidden" type="file" onChange={handlePhotoChange} />
              </label>
              <Button type="button" variant="ghost" onClick={handleRemovePhoto}>
                Remove photo
              </Button>
            </div>
          </div>
        </FormField>

        <FormField label="Profile note" error={errors.bio?.message} hint="Short intro shown in your workspace cards.">
          <Textarea placeholder="Tell future-you what this workspace is for." {...register("bio")} />
        </FormField>

        {message ? <p className="text-sm font-medium text-emerald-600">{message}</p> : null}
        {formError ? <p className="text-sm font-medium text-rose-600">{formError}</p> : null}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save profile"}
          </Button>
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
            Reset changes
          </Button>
        </div>
      </form>
    </Card>
  );
}
