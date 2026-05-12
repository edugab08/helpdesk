"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { API_URL, Ticket, Mensagem } from "../../lib/api"
import ChatHeader from "../../components/ui/ChatHeader"
import ChatMessages from "../../components/ui/ChatMessages"
import ChatInput from "../../components/ui/ChatInput"

export default function PaginaChat() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [novaMensagem, setNovaMensagem] = useState("")
  const [salvando, setSalvando] = useState(false)
  const [mensagens, setMensagens] = useState<Mensagem[]>([])

  useEffect(() => {
    async function carregarDados() {
      try {
        const res = await fetch(`${API_URL}/${id}`)
        if (!res.ok) throw new Error()
        const dados: Ticket = await res.json()
        
        setTicket(dados)
        setMensagens([
          { 
            id: "0", 
            texto: dados.mensagem, 
            remetente: "usuario", 
            hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
          },
          { 
            id: "1", 
            texto: "Olá! Sou do suporte. Como posso te ajudar com este problema?", 
            remetente: "suporte", 
            hora: "Agora" 
          }
        ])
      } catch (e) {
        toast.error("Não conseguimos encontrar esse chamado.")
        router.push("/")
      }
    }
    if (id) carregarDados()
  }, [id, router])

  async function resolver() {
    setSalvando(true)
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "fechado" })
      })
      toast.success("Chamado finalizado com sucesso!")
      router.push("/")
    } catch (e) {
      toast.error("Erro ao fechar chamado.")
      setSalvando(false)
    }
  }

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (!novaMensagem.trim()) return

    const msg: Mensagem = {
      id: Date.now().toString(),
      texto: novaMensagem,
      remetente: "suporte",
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMensagens((prev) => [...prev, msg])
    setNovaMensagem("")
  }
  if (!ticket) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500 animate-pulse">
        Carregando atendimento...
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center p-4 md:p-8 font-sans text-slate-200">
      <div className="w-full max-w-4xl flex flex-col h-[90vh] bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden">
        <ChatHeader 
          ticket={ticket} 
          onResolver={resolver} 
          salvando={salvando} />

        <ChatMessages 
          mensagens={mensagens} />

        <ChatInput 
          novaMensagem={novaMensagem} 
          setNovaMensagem={setNovaMensagem} 
          onEnviar={enviar} 
          status={ticket.status}/>
      </div>
    </div>
  )
}