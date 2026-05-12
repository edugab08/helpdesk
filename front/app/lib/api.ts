export const API_URL = "https://69c8505d63393440b3178bab.mockapi.io/tickets"

export type Ticket = {
  id: string
  nome: string
  titulo: string
  mensagem: string
  status: "aberto" | "fechado"
}

export type Mensagem = {
  id: string
  texto: string
  remetente: "usuario" | "suporte"
  hora: string
}