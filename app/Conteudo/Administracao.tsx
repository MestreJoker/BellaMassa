"use client"

import { useCallback, useEffect, useState, type FormEvent } from "react"

interface MembroEquipe {
    auth_user_id: string
    nome: string
    email: string
    is_admin: boolean
    ativo: boolean
    criado_em: string
}

async function lerResposta<T>(response: Response): Promise<T> {
    const body: unknown = await response.json()
    if (!response.ok) {
        const message = typeof body === "object" && body !== null && "error" in body
            ? String(body.error)
            : "Não foi possível concluir a operação."
        throw new Error(message)
    }
    return body as T
}

export default function Administracao({ userId }: { userId: string }) {
    const [equipe, setEquipe] = useState<MembroEquipe[]>([])
    const [taxaEntrega, setTaxaEntrega] = useState("")
    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [novoAdmin, setNovoAdmin] = useState(false)
    const [erro, setErro] = useState("")
    const [mensagem, setMensagem] = useState("")
    const [carregando, setCarregando] = useState(true)
    const [salvando, setSalvando] = useState(false)

    const obterDados = useCallback(async () => {
        const [teamResponse, settingsResponse] = await Promise.all([
            fetch("/api/admin/equipe", { cache: "no-store" }),
            fetch("/api/admin/configuracoes", { cache: "no-store" }),
        ])
        const [teamBody, settingsBody] = await Promise.all([
            lerResposta<{ users: MembroEquipe[] }>(teamResponse),
            lerResposta<{ settings: { taxa_entrega: number } }>(settingsResponse),
        ])
        return { users: teamBody.users, taxaEntrega: settingsBody.settings.taxa_entrega }
    }, [])

    const carregar = useCallback(async () => {
        try {
            const dados = await obterDados()
            setErro("")
            setEquipe(dados.users)
            setTaxaEntrega(String(dados.taxaEntrega))
        } catch (erroCarregamento) {
            console.error("Não foi possível carregar a administração.", erroCarregamento)
            setErro(erroCarregamento instanceof Error ? erroCarregamento.message : "Não foi possível carregar a administração.")
        } finally {
            setCarregando(false)
        }
    }, [obterDados])

    useEffect(() => {
        let ativo = true
        async function carregarInicial() {
            try {
                const dados = await obterDados()
                if (!ativo) return
                setErro("")
                setEquipe(dados.users)
                setTaxaEntrega(String(dados.taxaEntrega))
            } catch (erroCarregamento) {
                if (!ativo) return
                console.error("Não foi possível carregar a administração.", erroCarregamento)
                setErro(erroCarregamento instanceof Error ? erroCarregamento.message : "Não foi possível carregar a administração.")
            } finally {
                if (ativo) setCarregando(false)
            }
        }
        void carregarInicial()
        return () => {
            ativo = false
        }
    }, [obterDados])

    async function salvarTaxa(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault()
        setErro("")
        setMensagem("")
        const taxa = Number(taxaEntrega.trim().replace(",", "."))
        if (!Number.isFinite(taxa) || taxa < 0) {
            setErro("Informe uma taxa válida e não negativa.")
            return
        }
        setSalvando(true)
        try {
            const response = await fetch("/api/admin/configuracoes", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ taxa_entrega: taxa }),
            })
            const body = await lerResposta<{ settings: { taxa_entrega: number } }>(response)
            setTaxaEntrega(String(body.settings.taxa_entrega))
            setMensagem("Taxa de entrega atualizada.")
        } catch (erroSalvamento) {
            console.error("Não foi possível salvar a taxa de entrega.", erroSalvamento)
            setErro(erroSalvamento instanceof Error ? erroSalvamento.message : "Não foi possível salvar a taxa.")
        } finally {
            setSalvando(false)
        }
    }

    async function criarUsuario(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault()
        setErro("")
        setMensagem("")
        setSalvando(true)
        try {
            const response = await fetch("/api/admin/equipe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome, email, password: senha, is_admin: novoAdmin }),
            })
            await lerResposta<{ user: MembroEquipe }>(response)
            setNome("")
            setEmail("")
            setSenha("")
            setNovoAdmin(false)
            setMensagem("Usuário criado e habilitado para acessar o sistema.")
            await carregar()
        } catch (erroCriacao) {
            console.error("Não foi possível criar o usuário da equipe.", erroCriacao)
            setErro(erroCriacao instanceof Error ? erroCriacao.message : "Não foi possível criar o usuário.")
        } finally {
            setSalvando(false)
        }
    }

    async function atualizarMembro(membro: MembroEquipe, alteracoes: Partial<Pick<MembroEquipe, "nome" | "is_admin" | "ativo">>) {
        setErro("")
        setMensagem("")
        const body = { nome: membro.nome, is_admin: membro.is_admin, ativo: membro.ativo, ...alteracoes }
        try {
            const response = await fetch(`/api/admin/equipe/${membro.auth_user_id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })
            const result = await lerResposta<{ user: MembroEquipe }>(response)
            setEquipe((atual) => atual.map((usuario) => usuario.auth_user_id === membro.auth_user_id ? result.user : usuario))
            setMensagem("Permissões do usuário atualizadas.")
        } catch (erroAtualizacao) {
            console.error("Não foi possível atualizar as permissões do usuário.", erroAtualizacao)
            setErro(erroAtualizacao instanceof Error ? erroAtualizacao.message : "Não foi possível atualizar o usuário.")
        }
    }

    function editarNome(membro: MembroEquipe) {
        const novoNome = window.prompt("Nome do usuário", membro.nome)?.trim()
        if (!novoNome || novoNome === membro.nome) return
        void atualizarMembro(membro, { nome: novoNome })
    }

    return (
        <div className="flex min-w-0 flex-col gap-5">
            <header>
                <h1 className="text-3xl font-black text-slate-900">Administração</h1>
                <p className="mt-1 text-sm text-slate-600">Gerencie o acesso da equipe e as configurações da loja.</p>
            </header>

            {erro && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{erro}</p>}
            {mensagem && <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{mensagem}</p>}

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <h2 className="text-xl font-bold text-slate-900">Configurações da loja</h2>
                <p className="mt-1 text-sm text-slate-500">A taxa salva será aplicada aos próximos pedidos de entrega.</p>
                <form onSubmit={salvarTaxa} className="mt-4 flex flex-col gap-3 sm:max-w-lg sm:flex-row sm:items-end">
                    <label className="flex flex-1 flex-col gap-1 text-sm font-semibold text-slate-700">
                        Taxa de entrega (R$)
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            required
                            value={taxaEntrega}
                            onChange={(evento) => setTaxaEntrega(evento.target.value)}
                            className="rounded-lg border border-slate-300 px-3 py-2.5 font-normal"
                        />
                    </label>
                    <button type="submit" disabled={salvando || carregando} className="rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">
                        Salvar taxa
                    </button>
                </form>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <h2 className="text-xl font-bold text-slate-900">Usuários da equipe</h2>
                <p className="mt-1 text-sm text-slate-500">Contas criadas aqui são gerenciadas pelo Supabase Auth; senhas não ficam na tabela de perfis.</p>

                <form onSubmit={criarUsuario} className="mt-5 grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
                    <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
                        Nome
                        <input required maxLength={120} value={nome} onChange={(evento) => setNome(evento.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal" />
                    </label>
                    <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
                        E-mail
                        <input type="email" required value={email} onChange={(evento) => setEmail(evento.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal" />
                    </label>
                    <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
                        Senha inicial
                        <input type="password" autoComplete="new-password" minLength={8} required value={senha} onChange={(evento) => setSenha(evento.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-normal" />
                    </label>
                    <div className="flex flex-col justify-end gap-2">
                        <label className="flex items-center gap-2 text-sm text-slate-700">
                            <input type="checkbox" checked={novoAdmin} onChange={(evento) => setNovoAdmin(evento.target.checked)} />
                            Administrador
                        </label>
                        <button type="submit" disabled={salvando} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
                            Criar usuário
                        </button>
                    </div>
                </form>

                <div className="mt-5 overflow-x-auto">
                    <table className="w-full min-w-[680px] text-left text-sm">
                        <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                            <tr>
                                <th className="px-3 py-3">Nome / e-mail</th>
                                <th className="px-3 py-3">Acesso</th>
                                <th className="px-3 py-3">Status</th>
                                <th className="px-3 py-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {carregando ? (
                                <tr><td colSpan={4} className="px-3 py-6 text-center text-slate-500">Carregando equipe...</td></tr>
                            ) : equipe.length === 0 ? (
                                <tr><td colSpan={4} className="px-3 py-6 text-center text-slate-500">Nenhum perfil da equipe encontrado.</td></tr>
                            ) : equipe.map((membro) => (
                                <tr key={membro.auth_user_id}>
                                    <td className="px-3 py-3">
                                        <p className="font-semibold text-slate-800">{membro.nome}{membro.auth_user_id === userId ? " (você)" : ""}</p>
                                        <p className="text-xs text-slate-500">{membro.email}</p>
                                    </td>
                                    <td className="px-3 py-3">{membro.is_admin ? "Administrador" : "Operador"}</td>
                                    <td className="px-3 py-3">{membro.ativo ? "Ativo" : "Desativado"}</td>
                                    <td className="px-3 py-3">
                                        <div className="flex justify-end gap-2">
                                            <button type="button" onClick={() => editarNome(membro)} className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold hover:bg-slate-50">Renomear</button>
                                            <button
                                                type="button"
                                                disabled={membro.auth_user_id === userId}
                                                onClick={() => { void atualizarMembro(membro, { is_admin: !membro.is_admin }) }}
                                                className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold hover:bg-slate-50 disabled:opacity-40"
                                            >
                                                {membro.is_admin ? "Tornar operador" : "Tornar admin"}
                                            </button>
                                            <button
                                                type="button"
                                                disabled={membro.auth_user_id === userId}
                                                onClick={() => { void atualizarMembro(membro, { ativo: !membro.ativo }) }}
                                                className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold hover:bg-slate-50 disabled:opacity-40"
                                            >
                                                {membro.ativo ? "Desativar" : "Reativar"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}
