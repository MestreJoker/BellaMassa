import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClipboardList, faChevronRight, faTruck, faStore } from "@fortawesome/free-solid-svg-icons"

interface PedidoRecenteJson {
    idPedido: number
    idCliente: number
    dataPedido: string
    total: number
    status: string
    tipoEntrega?: string
}

interface ClienteJson {
    idCliente: number
    nome: string
}

interface PedidoRecenteProps {
    onVerTodos?: () => void
    pedidos?: PedidoRecenteJson[]
    clientes?: ClienteJson[]
}

export default function TabelaPedidosRecentes({ onVerTodos, pedidos = [], clientes = [] }: PedidoRecenteProps) {
    const clientesMap = new Map(clientes.map((cliente) => [cliente.idCliente, cliente.nome]))

    const pedidosFormatados = pedidos.slice(0, 6).map((pedido) => {
        const horario = new Date(pedido.dataPedido).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", hour12: false })
        const nomeCliente = clientesMap.get(pedido.idCliente) ?? `Cliente ${pedido.idCliente}`

        return {
            id: `#${pedido.idPedido}`,
            cliente: nomeCliente,
            tipo: pedido.tipoEntrega === "Retirada" ? "Retirada" : "Entrega",
            iconeTipo: pedido.tipoEntrega === "Retirada" ? faStore : faTruck,
            valor: new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(pedido.total),
            status: pedido.status,
            tipoStatus: /preparo|andamento/i.test(pedido.status) ? "warning" : /pronto|pago/i.test(pedido.status) ? "success" : /entrega/i.test(pedido.status) ? "info" : "danger",
            horario,
        }
    })

    function renderizarBadgeStatus(status: string, tipo: string) {
        let classes = "bg-slate-100 text-slate-600"
        if (tipo === "warning") classes = "bg-amber-100 text-amber-700 font-medium"
        if (tipo === "success") classes = "bg-emerald-100 text-emerald-700 font-medium"
        if (tipo === "info") classes = "bg-blue-100 text-blue-700 font-medium"
        if (tipo === "danger") classes = "bg-rose-100 text-rose-700 font-medium"

        return (
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${classes}`}>
                {status}
            </span>
        )
    }

    return (
        <section className="w-full min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white font-sans shadow-sm">
            {/* Cabeçalho da Tabela */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                        <FontAwesomeIcon icon={faClipboardList} className="text-sm" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">Pedidos recentes</h3>
                </div>
                <button
                    type="button"
                    onClick={onVerTodos}
                    disabled={!onVerTodos}
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
                >
                    Ver todos <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
                </button>
            </div>

            {/* Conteúdo da Tabela */}
            <div className="w-full min-w-0 overflow-x-auto">
                <table className="w-full min-w-190 border-collapse text-left text-sm">
                    <thead className="border-b border-slate-100 bg-slate-50/70 text-xs font-semibold uppercase text-slate-500">
                        <tr>
                            <th className="px-6 py-3.5">Nº Pedido</th>
                            <th className="px-6 py-3.5">Cliente</th>
                            <th className="px-6 py-3.5">Tipo</th>
                            <th className="px-6 py-3.5">Valor</th>
                            <th className="px-6 py-3.5">Status</th>
                            <th className="px-6 py-3.5">Horário</th>
                            <th className="px-6 py-3.5 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                        {pedidosFormatados.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-5 py-8 text-center text-slate-500">Nenhum pedido registrado.</td>
                            </tr>
                        ) : pedidosFormatados.map((pedido) => (
                            <tr key={pedido.id} className="transition-colors hover:bg-slate-50/60">
                                <td className="whitespace-nowrap px-6 py-4 font-bold text-slate-800">{pedido.id}</td>
                                <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-800">{pedido.cliente}</td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="inline-flex items-center gap-2">
                                        <FontAwesomeIcon icon={pedido.iconeTipo} className="text-xs text-slate-400" />
                                        <span>{pedido.tipo}</span>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-800">{pedido.valor}</td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    {renderizarBadgeStatus(pedido.status, pedido.tipoStatus)}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-slate-500">{pedido.horario}</td>
                                <td className="whitespace-nowrap px-6 py-4 text-right">
                                    <button
                                        type="button"
                                        onClick={onVerTodos}
                                        aria-label={`Abrir pedido ${pedido.id}`}
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                                    >
                                        <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}