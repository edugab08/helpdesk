import { z } from "zod"

export const ticketSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 letras."),
  titulo: z.string().min(5, "O título precisa ter pelo menos 5 caracteres."),
  mensagem: z.string().min(10, "Detalhe um pouco mais o seu problema (mínimo 10 caracteres).")
})