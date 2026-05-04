import { Loader2, Save } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ErrorState } from "@/app/components/ErrorState";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import {
  useCategories,
  useCities,
  useCreateMyBusiness,
  useMyBusiness,
  useUpdateMyBusiness,
} from "@/modules/businesses/hooks";
import type { BusinessCreateInput, BusinessUpdateInput } from "@/modules/businesses/types";

interface FormValues {
  name: string;
  description: string;
  category_id: number;
  city: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
}

export default function EditBusinessProfile() {
  const myBusinessQuery = useMyBusiness();
  const categoriesQuery = useCategories();
  const citiesQuery = useCities();
  const createMutation = useCreateMyBusiness();
  const updateMutation = useUpdateMyBusiness();

  const business = myBusinessQuery.data ?? null;
  const isCreate = business === null;

  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      category_id: 0,
      city: "",
      address: "",
      phone: "",
      email: "",
      hours: "",
    },
  });

  useEffect(() => {
    if (business) {
      form.reset({
        name: business.name,
        description: business.description ?? "",
        category_id: business.category.id,
        city: business.city,
        address: business.address ?? "",
        phone: business.phone ?? "",
        email: business.email ?? "",
        hours: business.hours ?? "",
      });
    }
  }, [business, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (!values.category_id || !values.city) {
        toast.error("Selecciona categoría y ciudad");
        return;
      }
      if (isCreate) {
        const payload: BusinessCreateInput = {
          name: values.name,
          description: values.description,
          category_id: Number(values.category_id),
          city: values.city,
          address: values.address,
          phone: values.phone || null,
          email: values.email || null,
          hours: values.hours || null,
        };
        await createMutation.mutateAsync(payload);
        toast.success("Negocio creado");
      } else {
        const payload: BusinessUpdateInput = {
          name: values.name,
          description: values.description,
          category_id: Number(values.category_id),
          city: values.city,
          address: values.address,
          phone: values.phone || null,
          email: values.email || null,
          hours: values.hours || null,
        };
        await updateMutation.mutateAsync(payload);
        toast.success("Cambios guardados");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "No pudimos guardar";
      toast.error(message);
    }
  });

  if (myBusinessQuery.isLoading || categoriesQuery.isLoading || citiesQuery.isLoading) {
    return (
      <div className="py-20">
        <LoadingSpinner label="Cargando perfil…" />
      </div>
    );
  }

  if (myBusinessQuery.isError) {
    return (
      <ErrorState title="No pudimos cargar tu negocio" onRetry={() => myBusinessQuery.refetch()} />
    );
  }

  const busy = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isCreate ? "Crear perfil del negocio" : "Editar perfil del negocio"}
        </h1>
        <p className="text-gray-600">
          {isCreate
            ? "Completa la información para que tu negocio aparezca en el catálogo."
            : "Mantén actualizada la información que ven tus clientes."}
        </p>
      </div>

      <form onSubmit={onSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-5">
        <Field label="Nombre del negocio" required>
          <input
            type="text"
            {...form.register("name", { required: true, minLength: 2 })}
            className="biz-input"
            placeholder="Café Aroma"
          />
        </Field>

        <Field label="Descripción">
          <textarea rows={4} {...form.register("description")} className="biz-input resize-none" />
        </Field>

        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Categoría" required>
            <select
              {...form.register("category_id", { required: true, valueAsNumber: true })}
              className="biz-input"
            >
              <option value={0}>Seleccionar…</option>
              {categoriesQuery.data?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Ciudad" required>
            <select {...form.register("city", { required: true })} className="biz-input">
              <option value="">Seleccionar…</option>
              {citiesQuery.data?.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Dirección">
          <input type="text" {...form.register("address")} className="biz-input" />
        </Field>

        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Teléfono">
            <input type="text" {...form.register("phone")} className="biz-input" />
          </Field>
          <Field label="Email de contacto">
            <input type="email" {...form.register("email")} className="biz-input" />
          </Field>
        </div>

        <Field label="Horario">
          <input type="text" {...form.register("hours")} className="biz-input" />
        </Field>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={busy}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isCreate ? "Crear negocio" : "Guardar cambios"}
          </button>
        </div>
      </form>

      <style>{`
        .biz-input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          background: white;
          color: #111827;
        }
        .biz-input:focus {
          outline: none;
          border-color: transparent;
          box-shadow: 0 0 0 2px rgb(59 130 246 / 0.5);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </span>
      {children}
    </label>
  );
}
