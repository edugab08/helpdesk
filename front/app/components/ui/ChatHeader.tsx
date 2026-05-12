"use client"
import Link from "next/link"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { Ticket } from "../../lib/api"

export default function ChatHeader({ ticket, onResolver, salvando }: { ticket: Ticket, onResolver: () => void, salvando: boolean }) {
  return (
    <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between z-10">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-slate-400 hover:text-white transition-colors p-2 bg-slate-800 rounded-lg hover:bg-slate-700">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-bold text-white text-lg">#{ticket.id} - {ticket.titulo}</h1>
          <p className="text-xs text-slate-400">Aberto por {ticket.nome}</p>
        </div>
      </div>
      <div className="flex gap-3 items-center">
        <span className={`text-[10px] font-bold px-3 py-1 rounded-full tracking-wider ${ticket.status === "aberto" ? "bg-yellow-500/10 text-yellow-500" : "bg-green-500/10 text-green-500"}`}>
          {ticket.status.toUpperCase()}
        </span>
        {ticket.status === "aberto" && (
          <button onClick={onResolver} disabled={salvando} className="bg-green-600/20 text-green-500 hover:bg-green-600 hover:text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold border border-green-600/30 disabled:opacity-50 transition-colors">
            <CheckCircle2 size={18} /> {salvando ? "Resolvendo..." : "Resolver Chamado"}
          </button>
        )}
      </div>
    </div>
  )
}