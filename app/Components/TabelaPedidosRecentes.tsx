import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClipboardList, faChevronRight, faTruck, faStore, faBox } from "@fortawesome/free-solid-svg-icons"

interface PedidoRecenteProps {
    onVerTodos?: () => void
}

export default function TabelaPedidosRecentes({ onVerTodos }: PedidoRecenteProps) {
    const pedidos = [
        {
            id: "#1024",
            cliente: "João Silva",
            tipo: "Entrega",
            iconeTipo: faTruck,
            valor: "R$ 72,90",
            status: "Em preparo",
            tipoStatus: "warning",
            horario: "14:20"
        },
        {
            id: "#1023",
            cliente: "Maria Souza",
            tipo: "Retirada",
            iconeTipo: faStore,
            valor: "R$ 54,00",
            status: "Pronto",
            tipoStatus: "success",
            horario: "13:47"
        },
        {
            id: "#1022",
            cliente: "Pedro Santos",
            tipo: "Entrega",
            iconeTipo: faTruck,
            valor: "R$ 89,90",
            status: "Em entrega",
            tipoStatus: "info",
            horario: "13:32"
        },
        {
            id: "#1021",
            cliente: "Ana Lima",
            tipo: "Balcão",
            iconeTipo: faBox,
            valor: "R$ 46,50",
            status: "Finalizado",
            tipoStatus: "danger",
            horario: "12:58"
        },
        {
            id: "#1020",
            cliente: "Carlos Oliveira",
            tipo: "Entrega",
            iconeTipo: faTruck,
            valor: "R$ 67,80",
            status: "Pronto",
            tipoStatus: "success",
            horario: "12:41"
        },
    ]

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
        <section className="w-full rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden font-sans">
            {/* Cabeçalho da Tabela */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                        <FontAwesomeIcon icon={faClipboardList} className="text-sm" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">Pedidos recentes</h3>
                </div>
                <button
                    type="button"
                    onClick={onVerTodos}
                    className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                >
                    Ver todos <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
                </button>
            </div>

            {/* Conteúdo da Tabela */}
            <div className="w-full overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-slate-50/70 text-xs font-semibold uppercase text-slate-500 border-b border-slate-100">
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
                        {pedidos.map((pedido) => (
                            <tr key={pedido.id} className="transition-colors hover:bg-slate-50/60">
                                <td className="px-6 py-4 font-bold text-slate-800 whitespace-nowrap">{pedido.id}</td>
                                <td className="px-6 py-4 font-medium text-slate-800 whitespace-nowrap">{pedido.cliente}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="inline-flex items-center gap-2">
                                        <FontAwesomeIcon icon={pedido.iconeTipo} className="text-slate-400 text-xs" />
                                        <span>{pedido.tipo}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-semibold text-slate-800 whitespace-nowrap">{pedido.valor}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {renderizarBadgeStatus(pedido.status, pedido.tipoStatus)}
                                </td>
                                <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{pedido.horario}</td>
                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                    <button
                                        type="button"
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
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