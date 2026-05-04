import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

export const registerSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  full_name: z.string().min(2, "Ingresa tu nombre completo").max(120),
  role: z.enum(["business_admin", "end_user"]),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
