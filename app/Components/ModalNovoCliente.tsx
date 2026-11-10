"use client"

import { useState, type FormEvent } from "react"
import { criarCliente } from "../lib/database"

interface ModalNovoClienteProps {
    aberto: boolean
    onFechar: () => void
    onCriado: (idCliente: number, endereco: string) => void
}

export default function ModalNovoCliente({ aberto, onFechar, onCriado }: ModalNovoClienteProps) {
    const [nome, setNome] = useState("")
    const [telefone, setTelefone] = useState("")
    const [email, setEmail] = useState("")
    const [endereco, setEndereco] = useState("")
    const [bairro, setBairro] = useState("")
    const [erro, setErro] = useState("")
    const [carregando, setCarregando] = useState(false)

    if (!aberto) return null

    async function salvar(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault()
        setErro("")
        setCarregando(true)
        try {
            const dadosEndereco = endereco.trim()
            const idCliente = await criarCliente({ nome, telefone, email, endereco: dadosEndereco, bairro })
            onCriado(idCliente, dadosEndereco)
            setNome("")
            setTelefone("")
            setEmail("")
            setEndereco("")
            setBairro("")
        } catch (erroCadastro) {
            console.error("Não foi possível cadastrar o cliente.", erroCadastro)
            setErro("Não foi possível salvar o cliente. Verifique os dados e tente novamente.")
        } finally {
            setCarregando(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) onFechar()
        }}>
            <section role="dialog" aria-modal="true" aria-labelledby="modal-novo-cliente-titulo" className="max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
                <h2 id="modal-novo-cliente-titulo" className="text-xl font-bold text-slate-900">Novo cliente</h2>
                <p className="mt-1 text-sm text-slate-500">Cadastre os dados do cliente no banco.</p>

                <form onSubmit={salvar} className="mt-5 grid gap-4 sm:grid-cols-2">
                    <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700 sm:col-span-2">
                        Nome
                        <input value={nome} onChange={(evento) => setNome(evento.target.value)} required maxLength={120} className="rounded-lg border border-slate-200 px-3 py-2.5 font-normal" />
                    </label>
                    <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
                        Telefone
                        <input value={telefone} onChange={(evento) => setTelefone(evento.target.value)} required maxLength={20} className="rounded-lg border border-slate-200 px-3 py-2.5 font-normal" />
                    </label>
                    <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
                        E-mail (opcional)
                        <input type="email" value={email} onChange={(evento) => setEmail(evento.target.value)} className="rounded-lg border border-slate-200 px-3 py-2.5 font-normal" />
                    </label>
                    <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700 sm:col-span-2">
                        Endereço
                        <input value={endereco} onChange={(evento) => setEndereco(evento.target.value)} maxLength={250} className="rounded-lg border border-slate-200 px-3 py-2.5 font-normal" />
                    </label>
                    <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700 sm:col-span-2">
                        Bairro
                        <input value={bairro} onChange={(evento) => setBairro(evento.target.value)} maxLength={120} className="rounded-lg border border-slate-200 px-3 py-2.5 font-normal" />
                    </label>

                    {erro && <p role="alert" className="text-sm text-red-700 sm:col-span-2">{erro}</p>}

                    <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:col-span-2 sm:flex-row sm:justify-end">
                        <button type="button" onClick={onFechar} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold">Cancelar</button>
                        <button type="submit" disabled={carregando} className="rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">
                            {carregando ? "Salvando..." : "Salvar cliente"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    )
}
