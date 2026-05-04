import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

import { useLogin } from "@/modules/auth/hooks";
import { type LoginValues, loginSchema } from "@/modules/auth/schemas";
import type { LoginInput, UserRole } from "@/modules/auth/types";

const ROUTE_BY_ROLE: Record<UserRole, string> = {
  end_user: "/user/city",
  business_admin: "/business",
  owner: "/owner",
};

export default function Login() {
  const navigate = useNavigate();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = await login.mutateAsync(values as LoginInput);
      toast.success(`Bienvenido, ${result.user.full_name}`);
      navigate(ROUTE_BY_ROLE[result.user.role], { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "No pudimos iniciar sesión";
      toast.error(message);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-10">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <MapPin className="w-8 h-8 text-blue-600" />
            <span className="font-bold text-2xl">Mi Punto</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Iniciar sesión</h1>
          <p className="text-gray-600 mt-2">Accede a tu cuenta</p>
        </div>

        <form onSubmit={onSubmit} className="bg-white p-8 rounded-xl shadow-sm space-y-5" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              autoComplete="email"
              {...register("email")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="tu@email.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              autoComplete="current-password"
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
            disabled={isSubmitting || login.isPending}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {(isSubmitting || login.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
            Iniciar sesión
          </button>

          <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 leading-relaxed">
            <p className="font-medium text-gray-700 mb-1">Cuentas demo</p>
            <p>Owner: owner@demo.com / owner1234</p>
            <p>Admin negocio: admin1@demo.com / admin1234</p>
            <p>Usuario final: user1@demo.com / user1234</p>
          </div>

          <p className="text-center text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Regístrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
