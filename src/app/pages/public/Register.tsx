import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

import { useLogin, useRegister } from "@/modules/auth/hooks";
import { type RegisterValues, registerSchema } from "@/modules/auth/schemas";
import type { RegisterInput } from "@/modules/auth/types";

export default function Register() {
  const navigate = useNavigate();
  const registerUser = useRegister();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      full_name: "",
      role: "end_user",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await registerUser.mutateAsync(values as RegisterInput);
      // Auto-login tras registro para mejor UX.
      const result = await login.mutateAsync({
        email: values.email!,
        password: values.password!,
      });
      toast.success(`Cuenta creada. Bienvenido, ${result.user.full_name}`);
      const next = result.user.role === "end_user" ? "/user/city" : "/business";
      navigate(next, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "No pudimos crear la cuenta";
      toast.error(message);
    }
  });

  const busy = isSubmitting || registerUser.isPending || login.isPending;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <MapPin className="w-8 h-8 text-blue-600" />
            <span className="font-bold text-2xl">Mi Punto</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Crear cuenta</h1>
          <p className="text-gray-600 mt-2">Únete a nuestra comunidad</p>
        </div>

        <form onSubmit={onSubmit} className="bg-white p-8 rounded-xl shadow-sm space-y-5" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de cuenta</label>
            <select
              {...register("role")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="end_user">Usuario final</option>
              <option value="business_admin">Administrador de negocio</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
            <input
              type="text"
              autoComplete="name"
              {...register("full_name")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Juan Pérez"
            />
            {errors.full_name && (
              <p className="text-sm text-red-600 mt-1">{errors.full_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
            <input
              type="email"
              autoComplete="email"
              {...register("email")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="tu@email.com"
            />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              autoComplete="new-password"
              {...register("password")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            Registrarse
          </button>

          <p className="text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
