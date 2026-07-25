"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createGuestDetailsSchema, type GuestDetailsInput } from "@/schemas/booking.schema";
import { useLocale } from "@/components/providers/locale-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GuestDetailsFormProps {
  defaultValues?: Partial<GuestDetailsInput>;
  onSubmit: (values: GuestDetailsInput) => void;
  onBack: () => void;
}

export function GuestDetailsForm({ defaultValues, onSubmit, onBack }: GuestDetailsFormProps) {
  const { dict } = useLocale();
  const schema = useMemo(
    () => createGuestDetailsSchema(dict.booking.validation),
    [dict.booking.validation],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestDetailsInput>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <p className="text-eyebrow text-[10px]">{dict.booking.details.title}</p>

      <div className="space-y-2">
        <Label htmlFor="name">{dict.booking.details.fullName}</Label>
        <Input
          id="name"
          autoComplete="name"
          placeholder={dict.booking.details.fullNamePlaceholder}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          {...register("name")}
        />
        {errors.name ? (
          <p id="name-error" role="alert" className="text-xs text-destructive">
            {errors.name.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">{dict.booking.details.phone}</Label>
        <Input
          id="phone"
          type="tel"
          autoComplete="tel"
          placeholder={dict.booking.details.phonePlaceholder}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          {...register("phone")}
        />
        {errors.phone ? (
          <p id="phone-error" role="alert" className="text-xs text-destructive">
            {errors.phone.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{dict.booking.details.email}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder={dict.booking.details.emailPlaceholder}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
        {errors.email ? (
          <p id="email-error" role="alert" className="text-xs text-destructive">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          {dict.booking.details.back}
        </Button>
        <Button type="submit" className="flex-1">
          {dict.booking.details.continue}
        </Button>
      </div>
    </form>
  );
}
