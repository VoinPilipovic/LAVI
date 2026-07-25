"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus } from "lucide-react";
import {
  createService,
  updateService,
  deleteService,
} from "@/actions/service.actions";
import { serviceSchema, type ServiceInput } from "@/schemas/service.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice, formatDuration } from "@/lib/utils";
import type { Tables } from "@/types/supabase";

interface ServicesManagerProps {
  services: Tables<"services">[];
}

interface ServiceFormProps {
  defaultValues: ServiceInput;
  onSubmit: (values: ServiceInput) => void;
  onCancel: () => void;
  isPending: boolean;
  submitLabel: string;
}

function ServiceForm({ defaultValues, onSubmit, onCancel, isPending, submitLabel }: ServiceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 border border-ink-border bg-ink-elevated p-5"
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
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
        <Label htmlFor="description">Description</Label>
        <Input id="description" {...register("description")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="durationMinutes">Duration (min)</Label>
          <Input
            id="durationMinutes"
            type="number"
            aria-invalid={!!errors.durationMinutes}
            aria-describedby={errors.durationMinutes ? "durationMinutes-error" : undefined}
            {...register("durationMinutes")}
          />
          {errors.durationMinutes ? (
            <p id="durationMinutes-error" role="alert" className="text-xs text-destructive">
              {errors.durationMinutes.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            aria-invalid={!!errors.price}
            aria-describedby={errors.price ? "price-error" : undefined}
            {...register("price")}
          />
          {errors.price ? (
            <p id="price-error" role="alert" className="text-xs text-destructive">
              {errors.price.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sortOrder">Display order</Label>
          <Input id="sortOrder" type="number" {...register("sortOrder")} />
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input
            id="isActive"
            type="checkbox"
            className="h-4 w-4 rounded-sm border-ink-border bg-ink"
            {...register("isActive")}
          />
          <Label htmlFor="isActive">Active</Label>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}

const blankService: ServiceInput = {
  name: "",
  description: "",
  durationMinutes: 30,
  price: 0,
  isActive: true,
  sortOrder: 0,
};

export function ServicesManager({ services: initial }: ServicesManagerProps) {
  const router = useRouter();
  const [services, setServices] = useState(initial);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setServices(initial);
  }, [initial]);

  const handleCreate = (values: ServiceInput) => {
    setError(null);
    startTransition(async () => {
      const result = await createService(values);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setIsAdding(false);
      router.refresh();
    });
  };

  const handleUpdate = (id: string, values: ServiceInput) => {
    setError(null);
    startTransition(async () => {
      const result = await updateService({ ...values, id });
      if (!result.success) {
        setError(result.error);
        return;
      }
      setEditingId(null);
      router.refresh();
    });
  };

  const handleDelete = (id: string) => {
    setError(null);
    startTransition(async () => {
      const result = await deleteService(id);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setServices((prev) => prev.filter((service) => service.id !== id));
      router.refresh();
    });
  };

  return (
    <div className="max-w-2xl space-y-6">
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {isAdding ? (
        <ServiceForm
          defaultValues={blankService}
          onSubmit={handleCreate}
          onCancel={() => setIsAdding(false)}
          isPending={isPending}
          submitLabel="Add service"
        />
      ) : (
        <Button type="button" variant="outline" onClick={() => setIsAdding(true)}>
          <Plus className="mr-2 h-4 w-4" strokeWidth={1.5} />
          Add service
        </Button>
      )}

      <div className="divide-y divide-ink-border border-y border-ink-border">
        {services.map((service) =>
          editingId === service.id ? (
            <div key={service.id} className="py-4">
              <ServiceForm
                defaultValues={{
                  name: service.name,
                  description: service.description,
                  durationMinutes: service.duration_minutes,
                  price: service.price,
                  isActive: service.is_active,
                  sortOrder: service.sort_order,
                }}
                onSubmit={(values) => handleUpdate(service.id, values)}
                onCancel={() => setEditingId(null)}
                isPending={isPending}
                submitLabel="Save changes"
              />
            </div>
          ) : (
            <div key={service.id} className="flex items-center justify-between gap-4 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-ivory">{service.name}</p>
                  {!service.is_active ? (
                    <span className="rounded-sm border border-ink-border px-1.5 py-0.5 text-[10px] uppercase text-ivory-dim">
                      Inactive
                    </span>
                  ) : null}
                </div>
                <p className="text-xs text-ivory-dim">
                  {formatDuration(service.duration_minutes)} · {formatPrice(service.price)}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setEditingId(service.id)}
                  aria-label="Edit service"
                  className="p-2 text-ivory-dim transition-colors hover:text-accent"
                >
                  <Pencil className="h-4 w-4" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(service.id)}
                  aria-label="Delete service"
                  className="p-2 text-ivory-dim transition-colors hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
