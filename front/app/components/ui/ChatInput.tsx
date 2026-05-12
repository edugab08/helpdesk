"use client" // <--- A MÁGICA ESTÁ AQUI!

import { Send } from "lucide-react"

export default function ChatInput({ 
  novaMensagem, 
  setNovaMensagem, 
  onEnviar, 
  status 
}: { 
  novaMensagem: string, 
  setNovaMensagem: (v: string) => void, 
  onEnviar: (e: React.FormEvent) => void, 
  status: string 
}) {
  return (
    <form onSubmit={onEnviar} className="bg-slate-900 border-t border-slate-800 p-4 flex gap-3">
      <input
        type="text"
        className="flex-1 bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition-all disabled:opacity-50 placeholder-slate-500"
        placeholder={status === "fechado" ? "Este chamado foi encerrado." : "Digite sua resposta..."}
        value={novaMensagem}
        onChange={(e) => setNovaMensagem(e.target.value)}
        disabled={status === "fechado"}
      />
      <button
        type="submit"
        // A proteção que adicionamos para evitar o erro de 'trim'
        disabled={!(novaMensagem || "").trim() || status === "fechado"}
        className="bg-blue-600 text-white p-3 w-12 h-12 rounded-xl flex items-center justify-center hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-600 transition-colors"
      >
        <Send size={20} />
      </button>
    </form>
  )
}