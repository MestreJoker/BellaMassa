"use client"

import { useEffect, useMemo, useState } from "react"
import Axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faStore, faTruck } from "@fortawesome/free-solid-svg-icons"
import { obterPedidos, salvarPedidos, type PedidoLocal } from "../lib/pedidos"

interface ClienteJson {
    idCliente: number
    nome: string
}

const statusDisponiveis = ["Em andamento", "Em preparo", "Pronto", "Em entrega", "Entregue", "Cancelado"]

export default function Entregas() {
    const [pedidos, setPedidos] = useState<PedidoLocal[]>([])
    const [clientes, setClientes] = useState<ClienteJson[]>([])
    const [busca, setBusca] = useState("")
    const [tipoFiltro, setTipoFiltro] = useState("Todos")
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
            } finally {
                setCarregando(false)
            }
        }

        carregarDados()
    }, [])

    const clientesMap = useMemo(() => new Map(clientes.map((cliente) => [cliente.idCliente, cliente.nome])), [clientes])
    const pedidosFiltrados = pedidos.filter((pedido) => {
        const termo = busca.trim().toLowerCase()
        const nomeCliente = clientesMap.get(pedido.idCliente) ?? ""
        const atendeBusca = !termo || String(pedido.idPedido).includes(termo) || nomeCliente.toLowerCase().includes(termo)
        const atendeTipo = tipoFiltro === "Todos" || pedido.tipoEntrega === tipoFiltro
        return atendeBusca && atendeTipo
    })

    function atualizarStatus(idPedido: number, status: string) {
        const pedidosAtualizados = pedidos.map((pedido) => pedido.idPedido === idPedido ? { ...pedido, status } : pedido)
        setPedidos(pedidosAtualizados)
        salvarPedidos(pedidosAtualizados)
    }

    const formatarMoeda = (valor: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor)

    return (
        <div className="flex min-w-0 flex-col gap-4">
            <header className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between sm:p-5">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Entregas e pedidos</h1>
                    <p className="mt-1 text-sm text-slate-500">Acompanhe e atualize o andamento dos pedidos.</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative min-w-0 sm:w-64">
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400" />
                        <input
                            value={busca}
                            onChange={(evento) => setBusca(evento.target.value)}
                            placeholder="Buscar pedido ou cliente"
                            className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-400"
                        />
                    </div>
                    <select value={tipoFiltro} onChange={(evento) => setTipoFiltro(evento.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                        <option>Todos</option>
                        <option>Entrega</option>
                        <option>Retirada</option>
                    </select>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                    { nome: "Em andamento", total: pedidos.filter((pedido) => /andamento|preparo/i.test(pedido.status)).length },
                    { nome: "Prontos", total: pedidos.filter((pedido) => /pronto/i.test(pedido.status)).length },
                    { nome: "Concluídos", total: pedidos.filter((pedido) => /entregue|retirado/i.test(pedido.status)).length },
                ].map((card) => (
                    <div key={card.nome} className="rounded-xl border border-slate-200 bg-white p-4">
                        <p className="text-sm text-slate-500">{card.nome}</p>
                        <p className="mt-1 text-2xl font-bold text-slate-900">{card.total}</p>
                    </div>
                ))}
            </div>

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
                    <h2 className="font-bold text-slate-800">Fila de pedidos <span className="font-normal text-slate-500">({pedidosFiltrados.length})</span></h2>
                </div>
                {carregando ? (
                    <p className="p-8 text-center text-sm text-slate-500">Carregando pedidos...</p>
                ) : pedidosFiltrados.length === 0 ? (
                    <p className="p-8 text-center text-sm text-slate-500">Nenhum pedido encontrado.</p>
                ) : (
                    <ul className="divide-y divide-slate-100">
                        {pedidosFiltrados.map((pedido) => (
                            <li key={pedido.idPedido} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                                <div className="flex min-w-0 items-start gap-3">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                                        <FontAwesomeIcon icon={pedido.tipoEntrega === "Retirada" ? faStore : faTruck} />
                                    </span>
                                    <div className="min-w-0">
                                        <p className="font-bold text-slate-900">Pedido #{pedido.idPedido} · {clientesMap.get(pedido.idCliente) ?? `Cliente ${pedido.idCliente}`}</p>
                                        <p className="mt-1 text-xs text-slate-500">{pedido.tipoEntrega} · {new Date(pedido.dataPedido).toLocaleString("pt-BR")} · {formatarMoeda(pedido.total)}</p>
                                        <p className="mt-1 truncate text-xs text-slate-500">{pedido.itens.map((item) => `${item.quantidade ?? 1}x ${item.nome ?? item.tipo ?? "Item"}`).join(", ")}</p>
                                    </div>
                                </div>
                                <label className="flex items-center gap-2 text-sm text-slate-600">
                                    <span>Status</span>
                                    <select value={pedido.status} onChange={(evento) => atualizarStatus(pedido.idPedido, evento.target.value)} className="min-w-36 rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-800">
                                        {!statusDisponiveis.includes(pedido.status) && <option>{pedido.status}</option>}
                                        {statusDisponiveis.map((status) => <option key={status}>{status}</option>)}
                                    </select>
                                </label>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    )
}