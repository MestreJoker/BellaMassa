import { faUser, faPhone, faLocationDot, faPencil, faPowerOff } from "@fortawesome/free-solid-svg-icons"
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState, type FormEvent } from "react"
import { atualizarCliente, atualizarStatusCliente, obterCliente, type ClienteLocal } from "../lib/database"
import { obterPedidos, type PedidoLocal } from "../lib/pedidos"

interface InfomacoesClienteProps {
    idCliente: number
    atualizarLista: number
    onAtualizado: () => void
}

function obterIniciais(nome: string) {
    if (!nome) return "C"
    const partes = nome.trim().split(" ")
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase()
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
}

const coresAvatares = [
    "bg-indigo-600 text-white",
    "bg-pink-600 text-white",
    "bg-blue-600 text-white",
    "bg-amber-600 text-white",
    "bg-emerald-600 text-white",
    "bg-purple-600 text-white",
    "bg-rose-600 text-white",
]

function obterCorAvatar(id: number) {
    return coresAvatares[id % coresAvatares.length]
}

export default function InfomacoesCliente(props: InfomacoesClienteProps) {
    const [clienteSelecionado, setClienteSelecionado] = useState<ClienteLocal | null>(null)
    const [pedidosRecentes, setPedidosRecentes] = useState<PedidoLocal[]>([])
    const [clienteCarregadoId, setClienteCarregadoId] = useState(0)
    const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false)
    const [nome, setNome] = useState("")
    const [telefone, setTelefone] = useState("")
    const [email, setEmail] = useState("")
    const [endereco, setEndereco] = useState("")
    const [bairro, setBairro] = useState("")
    const [erro, setErro] = useState("")
    const [salvando, setSalvando] = useState(false)

    useEffect(() => {
        async function resgatarDados() {
            try {
                const [cliente, pedidos] = await Promise.all([
                    obterCliente(props.idCliente),
                    obterPedidos(),
                ])
                setErro("")
                setClienteSelecionado(cliente)
                setPedidosRecentes(pedidos.filter((pedido) => pedido.idCliente === props.idCliente).slice(0, 3))
                setClienteCarregadoId(props.idCliente)
            }
            catch (erro: unknown) {
                console.error("Não foi possível carregar os detalhes do cliente.", erro)
                setErro("Não foi possível carregar os detalhes do cliente.")
            }
        }
        if (props.idCliente !== 0) {
            resgatarDados()
        }
    }, [props.idCliente, props.atualizarLista])

    const clienteVisivel = clienteCarregadoId === props.idCliente ? clienteSelecionado : null

    function abrirEdicao() {
        if (!clienteVisivel) return
        setNome(clienteVisivel.nome)
        setTelefone(clienteVisivel.telefone)
        setEmail(clienteVisivel.email ?? "")
        setEndereco(clienteVisivel.endereco)
        setBairro(clienteVisivel.bairro)
        setErro("")
        setModalEdicaoAberto(true)
    }

    async function salvarEdicao(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault()
        if (!clienteVisivel) return
        setSalvando(true)
        setErro("")
        try {
            await atualizarCliente(clienteVisivel.idCliente, { nome, telefone, email, endereco, bairro })
            setModalEdicaoAberto(false)
            props.onAtualizado()
        } catch (erroAtualizacao) {
            console.error("Não foi possível atualizar o cliente.", erroAtualizacao)
            setErro("Não foi possível atualizar o cliente. Confira os dados e tente novamente.")
        } finally {
            setSalvando(false)
        }
    }

    async function alternarStatus() {
        if (!clienteVisivel) return
        const ativar = clienteVisivel.status === "Inativo"
        if (!ativar && !window.confirm(`Deseja desativar o cadastro de ${clienteVisivel.nome}?`)) return
        setSalvando(true)
        setErro("")
        try {
            await atualizarStatusCliente(clienteVisivel.idCliente, ativar)
            props.onAtualizado()
        } catch (erroAtualizacao) {
            console.error("Não foi possível alterar o status do cliente.", erroAtualizacao)
            setErro("Não foi possível alterar o status do cliente. Tente novamente.")
        } finally {
            setSalvando(false)
        }
    }

    return (
        <div className="w-full min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col font-sans sm:p-6 xl:h-full xl:flex-1 xl:overflow-y-auto">
            {props.idCliente !== 0 && clienteVisivel ? (
                <div className="flex min-w-0 flex-col justify-between gap-6 xl:h-full">
                    <div>
                        {/* Título do Card */}
                        <h2 className="text-lg font-bold text-slate-800 mb-6">Detalhes do Cliente</h2>

                        {/* Perfil (Avatar + Nome + Status) */}
                        <div className="mb-6 flex flex-wrap items-center gap-3 sm:gap-4">
                            <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-base font-bold shadow-sm ${obterCorAvatar(clienteVisivel.idCliente)}`}>
                                {obterIniciais(clienteVisivel.nome)}
                            </span>
                            <div className="flex flex-col gap-1">
                                <div className="flex min-w-0 flex-wrap items-center gap-2">
                                    <h3 className="text-lg font-bold text-slate-900">{clienteVisivel.nome}</h3>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                        clienteVisivel.status === "Ativo"
                                            ? "bg-emerald-50 text-emerald-600"
                                            : "bg-slate-100 text-slate-600"
                                    }`}>
                                        {clienteVisivel.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Informações de Contato e Endereço */}
                        <div className="space-y-4 mb-8 text-sm text-slate-600 border-b border-slate-100 pb-6">
                            <div className="flex flex-wrap items-center gap-3">
                                <FontAwesomeIcon icon={faPhone} className="text-slate-400 text-sm w-4" />
                                <span className="font-medium text-slate-700">{clienteVisivel.telefone}</span>
                                <FontAwesomeIcon icon={faWhatsapp} className="text-emerald-600 text-base ml-1" />
                            </div>
                            <div className="flex items-start gap-3">
                                <FontAwesomeIcon icon={faLocationDot} className="text-slate-400 text-sm w-4 mt-0.5" />
                                <div className="flex flex-col">
                                    <span className="font-medium text-slate-700">{clienteVisivel.endereco}</span>
                                    <span className="text-xs text-slate-400">{clienteVisivel.bairro}</span>
                                </div>
                            </div>
                        </div>

                        {/* Seção Últimos Pedidos */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-bold text-slate-800">Últimos pedidos</h4>
                            </div>

                            <div className="space-y-3">
                                {pedidosRecentes.length === 0 ? (
                                    <p className="text-xs text-slate-400">Este cliente ainda não tem pedidos.</p>
                                ) : pedidosRecentes.map((pedido) => (
                                    <div key={pedido.idPedido} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-3 text-xs">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-bold text-slate-800">#{pedido.idPedido}</span>
                                            <span className="text-slate-400">{new Date(pedido.dataPedido).toLocaleDateString("pt-BR")}</span>
                                        </div>
                                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-600">
                                            {pedido.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Botões de Ação Inferiores */}
                    {erro && <p role="alert" className="text-sm text-red-700">{erro}</p>}
                    <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 pb-5">
                        <button
                            type="button"
                            onClick={abrirEdicao}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                        >
                            <FontAwesomeIcon icon={faPencil} className="text-xs text-slate-500" />
                            Editar cliente
                        </button>
                        <button
                            type="button"
                            onClick={() => { void alternarStatus() }}
                            disabled={salvando}
                            className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-60 ${
                                clienteVisivel.status === "Ativo" ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"
                            }`}
                        >
                            <FontAwesomeIcon icon={faPowerOff} className="text-xs text-white" />
                            {clienteVisivel.status === "Ativo" ? "Desativar cliente" : "Reativar cliente"}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex min-h-48 flex-col items-center justify-center gap-2 p-6 text-slate-400 xl:min-h-0 xl:flex-1">
                    <FontAwesomeIcon icon={faUser} className="text-2xl text-slate-300" />
                    <p className="text-sm font-medium text-slate-400">
                        {props.idCliente !== 0 && erro ? erro : "Nenhum cliente selecionado"}
                    </p>
                </div>
            )}
            {modalEdicaoAberto && clienteVisivel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
                    <section role="dialog" aria-modal="true" aria-labelledby="titulo-editar-cliente" className="max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
                        <h2 id="titulo-editar-cliente" className="text-xl font-bold text-slate-900">Editar cliente</h2>
                        <form onSubmit={salvarEdicao} className="mt-5 grid gap-4 sm:grid-cols-2">
                            <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700 sm:col-span-2">
                                Nome
                                <input value={nome} onChange={(evento) => setNome(evento.target.value)} required maxLength={120} className="rounded-lg border border-slate-200 px-3 py-2.5 font-normal" />
                            </label>
                            <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
                                Telefone
                                <input value={telefone} onChange={(evento) => setTelefone(evento.target.value)} required maxLength={20} className="rounded-lg border border-slate-200 px-3 py-2.5 font-normal" />
                            </label>
                            <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
                                E-mail
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
                                <button type="button" onClick={() => setModalEdicaoAberto(false)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold">Cancelar</button>
                                <button type="submit" disabled={salvando} className="rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">
                                    {salvando ? "Salvando..." : "Salvar cliente"}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </div>
    )
}