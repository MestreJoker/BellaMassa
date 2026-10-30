"use client"

import { useEffect, useMemo, useState } from "react"
import Axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons"
import { obterPedidos, type PedidoLocal } from "../lib/pedidos"

interface ClienteJson {
    idCliente: number
    nome: string
}

interface PedidosProps {
    onNovoPedido: () => void
}

const formatarMoeda = (valor: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor)

export default function Pedidos({ onNovoPedido }: PedidosProps) {
    const [pedidos, setPedidos] = useState<PedidoLocal[]>([])
    const [clientes, setClientes] = useState<ClienteJson[]>([])
    const [busca, setBusca] = useState("")
    const [statusFiltro, setStatusFiltro] = useState("Todos")
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        async function carregarDados() {
            try {
                const [pedidosCarregados, respostaClientes] = await Promise.all([
                    obterPedidos(),
                    Axios.get<ClienteJson[]>("/json/clientes.json"),
                ])
                setPedidos(pedidosCarregados)
                setClientes(respostaClientes.data)
            } catch (erro) {
                console.error("Não foi possível carregar os pedidos.", erro)
            } finally {
                setCarregando(false)
            }
        }

        carregarDados()
    }, [])

    const clientesMap = useMemo(() => new Map(clientes.map((cliente) => [cliente.idCliente, cliente.nome])), [clientes])
    const pedidosFiltrados = pedidos.filter((pedido) => {
        const termo = busca.trim().toLowerCase()
        const nomeCliente = clientesMap.get(pedido.idCliente) ?? `Cliente ${pedido.idCliente}`
        const atendeBusca = !termo || String(pedido.idPedido).includes(termo) || nomeCliente.toLowerCase().includes(termo)
        const atendeStatus = statusFiltro === "Todos" || pedido.status === statusFiltro
        return atendeBusca && atendeStatus
    })

    return (
        <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <header className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Pedidos</h1>
                    <p className="mt-1 text-sm text-slate-500">Consulte o histórico e inicie um novo pedido.</p>
                </div>
                <button
                    type="button"
                    onClick={onNovoPedido}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#c91f2c] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#a91924]"
                >
                    <FontAwesomeIcon icon={faPlus} />
                    Novo pedido
                </button>
            </header>

            <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <label className="relative min-w-0 sm:w-80">
                    <span className="sr-only">Buscar pedido ou cliente</span>
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
                    <input
                        value={busca}
                        onChange={(evento) => setBusca(evento.target.value)}
                        placeholder="Buscar por número ou cliente"
                        className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-slate-400"
                    />
                </label>
                <select
                    aria-label="Filtrar pedidos por status"
                    value={statusFiltro}
                    onChange={(evento) => setStatusFiltro(evento.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700"
                >
                    <option>Todos</option>
                    {[...new Set(pedidos.map((pedido) => pedido.status))].map((status) => <option key={status}>{status}</option>)}
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-180 border-collapse text-left text-sm">
                    <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                        <tr>
                            <th className="px-4 py-3.5 sm:px-5">Pedido</th>
                            <th className="px-4 py-3.5 sm:px-5">Cliente</th>
                            <th className="px-4 py-3.5 sm:px-5">Data</th>
                            <th className="px-4 py-3.5 sm:px-5">Tipo</th>
                            <th className="px-4 py-3.5 sm:px-5">Status</th>
                            <th className="px-4 py-3.5 sm:px-5">Pagamento</th>
                            <th className="px-4 py-3.5 text-right sm:px-5">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                        {carregando ? (
                            <tr><td colSpan={7} className="px-5 py-10 text-center text-slate-500">Carregando pedidos...</td></tr>
                        ) : pedidosFiltrados.length === 0 ? (
                            <tr><td colSpan={7} className="px-5 py-10 text-center text-slate-500">Nenhum pedido encontrado.</td></tr>
                        ) : pedidosFiltrados.map((pedido) => (
                            <tr key={pedido.idPedido} className="hover:bg-slate-50/70">
                                <td className="whitespace-nowrap px-4 py-4 font-bold text-slate-900 sm:px-5">#{pedido.idPedido}</td>
                                <td className="whitespace-nowrap px-4 py-4 sm:px-5">{clientesMap.get(pedido.idCliente) ?? `Cliente ${pedido.idCliente}`}</td>
                                <td className="whitespace-nowrap px-4 py-4 text-slate-500 sm:px-5">{new Date(pedido.dataPedido).toLocaleString("pt-BR")}</td>
                                <td className="whitespace-nowrap px-4 py-4 sm:px-5">{pedido.tipoEntrega}</td>
                                <td className="whitespace-nowrap px-4 py-4 sm:px-5">
                                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{pedido.status}</span>
                                </td>
                                <td className="whitespace-nowrap px-4 py-4 text-slate-600 sm:px-5">{pedido.statusPagamento ?? "Pendente"} · {pedido.formaPagamento}</td>
                                <td className="whitespace-nowrap px-4 py-4 text-right font-semibold text-slate-900 sm:px-5">{formatarMoeda(pedido.total)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
