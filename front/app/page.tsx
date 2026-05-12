"use client"

import { useState, useEffect } from "react"
import { Toaster } from "sonner" 
import Sidebar from "./components/ui/Sidebar"
import PainelEstatisticas from "./components/ui/PainelEstatisticas"
import { API_URL, Ticket } from "./lib/api"

export default function Home() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [carregando, setCarregando] = useState(true)
  const [filtroStatus, setFiltroStatus] = useState<"aberto" | "fechado">("aberto")

  useEffect(() => {
    async function carregarTickets() {
      try {
        const resposta = await fetch(API_URL)
        const dados = await resposta.json()
        
        if (Array.isArray(dados)) {
          setTickets(dados)
        }
      } catch (error) {
        console.error("Erro ao carregar a Dashboard:", error)
      } finally {
        setCarregando(false)
      }
    }
    carregarTickets()
  }, [])

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden font-sans">
      <Toaster theme="dark" position="top-right" richColors closeButton />

      <Sidebar 
        tickets={tickets} 
        carregando={carregando} 
        filtroStatus={filtroStatus} 
        setFiltroStatus={setFiltroStatus} 
      />

      <PainelEstatisticas tickets={tickets} />
    </div>
  )
}