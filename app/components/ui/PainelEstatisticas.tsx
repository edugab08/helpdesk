"use client"

import { TicketPlus, BarChart3, AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

type Ticket = {
  id: string
  nome: string
  titulo: string
  mensagem: string
  status: "aberto" | "fechado"
}

type Props = {
  tickets: Ticket[]
}

export default function PainelEstatisticas({ tickets }: Props) {
  const totalTickets = tickets.length
  const ticketsAbertos = tickets.filter(t => t.status === "aberto").length
  const ticketsFechados = tickets.filter(t => t.status === "fechado").length

  const dadosStatus = [
    { name: "Em Aberto", value: ticketsAbertos, color: "#eab308" },
    { name: "Resolvidos", value: ticketsFechados, color: "#22c55e" }
  ]

  const dadosSemana = [
    { dia: "Seg", chamados: 12 },
    { dia: "Ter", chamados: 19 },
    { dia: "Qua", chamados: 15 },
    { dia: "Qui", chamados: 22 },
    { dia: "Sex", chamados: totalTickets > 0 ? totalTickets : 8 },
  ]

  return (
    <main className="flex-1 flex flex-col overflow-y-auto relative bg-slate-900">
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-6 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <BarChart3 size={28} className="text-blue-500"/>
          Workspace
        </h1>
        <Link
          href="/novo-chamado"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-lg hover:shadow-blue-600/20 transition-all font-semibold text-sm"
        >
          <TicketPlus size={18}/> Novo Chamado
        </Link>
      </header>

      <div className="p-8 max-w-6xl mx-auto w-full">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 hover:bg-slate-800 transition-colors">
            <p className="text-slate-400 text-sm font-medium mb-3">Total de Interações</p>
            <p className="text-4xl font-bold text-white">{totalTickets}</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 border-t-4 border-t-yellow-500 hover:bg-slate-800 transition-colors">
            <p className="text-slate-400 text-sm font-medium mb-3 flex items-center gap-2">
              <AlertCircle size={16} className="text-yellow-500"/> Em Andamento
            </p>
            <p className="text-4xl font-bold text-white">{ticketsAbertos}</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 border-t-4 border-t-green-500 hover:bg-slate-800 transition-colors">
            <p className="text-slate-400 text-sm font-medium mb-3 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500"/> Finalizados
            </p>
            <p className="text-4xl font-bold text-white">{ticketsFechados}</p>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 h-[350px] flex flex-col">
            <h3 className="text-slate-300 font-semibold mb-4 text-sm">Proporção de Chamados</h3>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dadosStatus} innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value" stroke="none">
                    {dadosStatus.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 h-[350px] flex flex-col">
            <h3 className="text-slate-300 font-semibold mb-4 text-sm">Volume Semanal</h3>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosSemana}>
                  <XAxis dataKey="dia" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} hide />
                  <Tooltip cursor={{ fill: '#334155', opacity: 0.4 }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}/>
                  <Bar dataKey="chamados" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}