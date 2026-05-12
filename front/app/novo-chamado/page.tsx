"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { TicketPlus, ArrowLeft, Send } from "lucide-react"
import { API_URL } from ".././lib/api"
import { ticketSchema } from ".././lib/schemas"

export default function NovoChamado() {
  const [nome, setNome] = useState("")
  const [titulo, setTitulo] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [erro, setErro] = useState("")
  const [salvando, setSalvando] = useState(false)
  const router = useRouter()

  async function criarTicket() {
    const validacao = ticketSchema.safeParse({ nome, titulo, mensagem })
    if (!validacao.success) {
      setErro(validacao.error.issues[0]?.message || "Erro na validação")
      return
    }
    setErro("")
    setSalvando(true) 

    const novo = {
      nome,
      titulo,
      mensagem,
      status: "aberto"
    }

    try {
      const resposta = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novo)
      })

      if (!resposta.ok) throw new Error()
      router.push("/")
      toast.success("Chamado aberto com sucesso! Nossa equipe já foi notificada.")
      
    } catch (error) {
      console.error("Erro ao salvar:", error)
      setErro("Falha ao comunicar com o banco de dados. Tente novamente.")
      setSalvando(false) 
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative font-sans">
      <Link 
        href="/" 
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-slate-400 hover:text-white font-medium transition-colors bg-slate-900 px-4 py-2 rounded-lg shadow-sm border border-slate-800 hover:bg-slate-800">
        <ArrowLeft size={18} />
        Voltar para Dashboard
      </Link>
      <div className="w-full max-w-2xl bg-slate-900 rounded-3xl shadow-2xl overflow-hidden mt-20 md:mt-0 border border-slate-800">
        <div className="bg-slate-900 border-b border-slate-800 p-8 flex items-center gap-6">
          <div className="bg-blue-600/20 p-4 rounded-2xl border border-blue-500/30">
            <TicketPlus size={36} className="text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Abrir novo chamado</h2>
            <p className="text-slate-400 text-sm mt-1"> Preencha os dados abaixo para relatar o seu problema. </p>
          </div>
        </div>
        <div className="p-8">
          {erro && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-xl mb-6 text-sm font-medium border border-red-500/20 flex items-center gap-3">
              {erro}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Seu Nome</label>
              <input
                className="w-full border border-slate-800 p-4 rounded-xl text-white bg-slate-950 focus:bg-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-600"
                placeholder="Ex: João da Silva"
                value={nome}
                onChange={(e) => { setNome(e.target.value); setErro("") }}
                disabled={salvando}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Assunto do problema</label>
              <input
                className="w-full border border-slate-800 p-4 rounded-xl text-white bg-slate-950 focus:bg-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-600"
                placeholder="Ex: Sistema lento ao gerar relatórios"
                value={titulo}
                onChange={(e) => { setTitulo(e.target.value); setErro("") }}
                disabled={salvando}/>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Descrição detalhada</label>
              <textarea
                className="w-full border border-slate-800 p-4 rounded-xl text-white bg-slate-950 focus:bg-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all h-40 resize-none placeholder-slate-600 custom-scrollbar"
                placeholder="Descreva o que está acontecendo com o máximo de detalhes..."
                value={mensagem}
                onChange={(e) => { setMensagem(e.target.value); setErro("") }}
                disabled={salvando}/>
            </div>
          </div>
          <div className="pt-8 mt-8 border-t border-slate-800">
            <button
              onClick={criarTicket}
              disabled={salvando}
              className="w-full bg-blue-600 text-white p-5 rounded-xl hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 transition-all shadow-lg font-bold text-lg flex items-center justify-center gap-3 border border-blue-500/50">
              <Send size={20} />
              {salvando ? "Enviando para o suporte..." : "Confirmar e Abrir Chamado"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}