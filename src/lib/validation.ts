import { z } from "zod";
import { ALLOWED_PROOF_TYPES, MAX_PROOF_SIZE_BYTES } from "./uploads";

export const reservationSchema = z.object({
  lockerId: z.string().min(1),
  name: z.string().trim().min(3, "Informe seu nome completo."),
  rga: z
    .string()
    .trim()
    .min(3, "RGA inválido.")
    .max(20, "RGA inválido."),
  phone: z
    .string()
    .trim()
    .refine((value) => {
      const digits = value.replace(/\D/g, "");
      return digits.length === 10 || digits.length === 11;
    }, "Telefone inválido. Use DDD + número."),
  email: z.string().trim().email("E-mail inválido."),
  termsAccepted: z.literal("on", {
    message: "É necessário aceitar os termos de uso.",
  }),
  proof: z
    .instanceof(File, { message: "Anexe o comprovante de pagamento." })
    .refine((file) => file.size > 0, "Anexe o comprovante de pagamento.")
    .refine(
      (file) => file.size <= MAX_PROOF_SIZE_BYTES,
      "O arquivo deve ter no máximo 5MB."
    )
    .refine(
      (file) => ALLOWED_PROOF_TYPES.includes(file.type),
      "Formato inválido. Envie uma imagem (PNG/JPG/WEBP) ou PDF."
    ),
});

export const lockerCodeSchema = z
  .string()
  .trim()
  .min(1, "Informe o código do armário.")
  .max(20, "Código muito longo.");

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Informe o usuário."),
  password: z.string().min(1, "Informe a senha."),
});
