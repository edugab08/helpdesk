// app/components/Sidebar.tsx
import Link from "next/link"
import { MessageSquare } from "lucide-react"

type Ticket = {
  id: string
  nome: string
  titulo: string
  mensagem: string
  status: "aberto" | "fechado"
}

type SidebarProps = {
  tickets: Ticket[]
  carregando: boolean
  filtroStatus: "aberto" | "fechado"
  setFiltroStatus: (status: "aberto" | "fechado") => void
}

export default function Sidebar({ tickets, carregando, filtroStatus, setFiltroStatus }: SidebarProps) {
  const ticketsAbertos = tickets.filter(t => t.status === "aberto").length
  const ticketsFechados = tickets.filter(t => t.status === "fechado").length
  const ticketsFiltrados = tickets.filter(t => t.status === filtroStatus)

  return (
    <aside className="w-80 md:w-96 bg-slate-950 border-r border-slate-800 flex flex-col z-20 h-full">
      
      {/* Cabeçalho da Sidebar */}
      <div className="p-6 border-b border-slate-800 flex flex-col gap-5">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <MessageSquare size={20} className="text-blue-500" />
          Fila de Atendimentos
        </h2>
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setFiltroStatus("aberto")}
            className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all ${
              filtroStatus === "aberto" ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Em Aberto ({ticketsAbertos})
          </button>
          <button
            onClick={() => setFiltroStatus("fechado")}
            className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all ${
              filtroStatus === "fechado" ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Resolvidos ({ticketsFechados})
          </button>
        </div>
      </div>

      {/* Lista de Chamados */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        
        {carregando ? (
          // ✨ AQUI ESTÁ O SKELETON LOADING ✨
          // Cria 5 blocos falsos piscando para simular o carregamento
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 animate-pulse flex flex-col gap-3 mt-3">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                <div className="h-4 bg-slate-800 rounded-full w-12"></div>
              </div>
              <div className="h-3 bg-slate-800/80 rounded w-3/4"></div>
            </div>
          ))
        ) : ticketsFiltrados.length === 0 ? (
          <p className="text-center text-slate-600 text-sm mt-5">
            Nenhum chamado {filtroStatus === "aberto" ? "em aberto" : "resolvido"}.
          </p>
        ) : (
          [...ticketsFiltrados].reverse().map(ticket => (
            <Link href={`/chamado/${ticket.id}`} key={ticket.id}>
              <div className="p-4 rounded-xl cursor-pointer transition-all border bg-slate-900 border-slate-800 hover:bg-slate-800 hover:border-slate-700 block mt-3">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-white text-sm truncate pr-2">{ticket.nome}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider ${
                    ticket.status === "aberto" ? "bg-yellow-500/10 text-yellow-500" : "bg-green-500/10 text-green-500"
                  }`}>
                    {ticket.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate">{ticket.titulo}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </aside>
  )
}