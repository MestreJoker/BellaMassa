"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../lib/supabase"
import LayoutLoginCadastro from "../Widgets/LayoutLoginCadastro"

export default function RedefinirSenha() {
    const router = useRouter()
    const [senha, setSenha] = useState("")
    const [confirmacao, setConfirmacao] = useState("")
    const [erro, setErro] = useState("")
    const [sucesso, setSucesso] = useState(false)
    const [salvando, setSalvando] = useState(false)
    async function salvar(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault()
        setErro("")
        if (new URLSearchParams(window.location.search).get("erro") === "link") {
            setErro("Este link de recuperação é inválido ou expirou. Solicite outro pela tela de login.")
            return
        }
        if (senha !== confirmacao) {
            setErro("As senhas informadas não coincidem.")
            return
        }

        setSalvando(true)
        try {
            const { error } = await supabase.auth.updateUser({ password: senha })
            if (error) throw error
            setSucesso(true)
        } catch (erroAtualizacao) {
            console.error("Não foi possível redefinir a senha.", erroAtualizacao)
            setErro("Não foi possível redefinir a senha. Solicite um novo link e tente novamente.")
        } finally {
            setSalvando(false)
        }
    }

    return (
        <LayoutLoginCadastro>
            <section className="m-auto w-full max-w-xl rounded-xl border border-gray-200 bg-white p-5 shadow-md sm:p-7">
                <h1 className="text-2xl font-extrabold text-slate-900">Redefinir senha</h1>
                {sucesso ? (
                    <>
                        <p role="status" className="mt-4 text-sm text-emerald-700">Senha atualizada com sucesso.</p>
                        <button type="button" onClick={() => router.replace("/home")} className="mt-6 w-full rounded-xl bg-(--colorMain) p-3 font-bold text-white">
                            Entrar no sistema
                        </button>
                    </>
                ) : (
                    <>
                        <p className="mt-2 text-sm text-slate-600">Defina uma nova senha para sua conta interna.</p>
                        <form onSubmit={salvar} className="mt-5 space-y-4">
                            <label className="flex flex-col gap-1 text-sm font-bold text-slate-800">
                                Nova senha
                                <input type="password" autoComplete="new-password" minLength={8} required value={senha} onChange={(evento) => setSenha(evento.target.value)} className="rounded-lg border border-slate-300 px-3 py-2.5 font-normal" />
                            </label>
                            <label className="flex flex-col gap-1 text-sm font-bold text-slate-800">
                                Confirmar senha
                                <input type="password" autoComplete="new-password" minLength={8} required value={confirmacao} onChange={(evento) => setConfirmacao(evento.target.value)} className="rounded-lg border border-slate-300 px-3 py-2.5 font-normal" />
                            </label>
                            {erro && <p role="alert" className="text-sm text-red-700">{erro}</p>}
                            <button type="submit" disabled={salvando} className="w-full rounded-xl bg-(--colorMain) p-3 font-bold text-white disabled:opacity-60">
                                {salvando ? "Salvando..." : "Atualizar senha"}
                            </button>
                        </form>
                    </>
                )}
            </section>
        </LayoutLoginCadastro>
    )
}
