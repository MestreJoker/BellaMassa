import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowUp,
    faCalendarDays,
    faChevronDown,
    faCreditCard,
    faDollarSign,
    faEllipsis,
    faFileExport,
    faFilter,
    faMagnifyingGlass,
    faMoneyBillWave,
    faReceipt,
    faWallet,
} from "@fortawesome/free-solid-svg-icons";

const cardsResumo = [
    {
        titulo: "Total recebido",
        valor: "R$ 2.847,32",
        percentual: "+12%",
        detalhe: "em relação ao período anterior",
        icone: faMoneyBillWave,
        cor: "bg-emerald-100 text-emerald-700",
        texto: "text-emerald-600",
    },
    {
        titulo: "Pagamentos por Pix",
        valor: "48%",
        detalhe: "12 de 25 pagamentos",
        icone: faWallet,
        cor: "bg-blue-100 text-blue-700",
        texto: "text-blue-600",
    },
    {
        titulo: "Pagamentos por cartão",
        valor: "36%",
        detalhe: "9 de 25 pagamentos",
        icone: faCreditCard,
        cor: "bg-violet-100 text-violet-700",
        texto: "text-violet-600",
    },
    {
        titulo: "Pagamentos em dinheiro",
        valor: "16%",
        detalhe: "4 de 25 pagamentos",
        icone: faDollarSign,
        cor: "bg-amber-100 text-amber-700",
        texto: "text-amber-600",
    },
];

const pagamentos = [
    {
        id: "#1024",
        cliente: "João Silva",
        valor: "R$ 72,90",
        forma: "Pix",
        formaIcone: faWallet,
        status: "Pago",
        statusTipo: "success",
        data: "15/09/2026",
        horario: "14:32",
    },
    {
        id: "#1023",
        cliente: "Maria Souza",
        valor: "R$ 54,00",
        forma: "Cartão de crédito",
        formaIcone: faCreditCard,
        status: "Pago",
        statusTipo: "success",
        data: "15/09/2026",
        horario: "14:15",
    },
    {
        id: "#1022",
        cliente: "Pedro Santos",
        valor: "R$ 89,90",
        forma: "Dinheiro",
        formaIcone: faDollarSign,
        status: "Pago",
        statusTipo: "success",
        data: "15/09/2026",
        horario: "13:47",
    },
    {
        id: "#1021",
        cliente: "Ana Lima",
        valor: "R$ 46,50",
        forma: "Pix",
        formaIcone: faWallet,
        status: "Pago",
        statusTipo: "success",
        data: "15/09/2026",
        horario: "12:58",
    },
    {
        id: "#1020",
        cliente: "Carlos Oliveira",
        valor: "R$ 67,80",
        forma: "Cartão de crédito",
        formaIcone: faCreditCard,
        status: "Pago",
        statusTipo: "success",
        data: "15/09/2026",
        horario: "12:41",
    },
    {
        id: "#1019",
        cliente: "Fernanda Costa",
        valor: "R$ 38,90",
        forma: "Dinheiro",
        formaIcone: faDollarSign,
        status: "Pago",
        statusTipo: "success",
        data: "15/09/2026",
        horario: "12:20",
    },
    {
        id: "#1018",
        cliente: "Ricardo Alves",
        valor: "R$ 76,50",
        forma: "Pix",
        formaIcone: faWallet,
        status: "Pago",
        statusTipo: "success",
        data: "15/09/2026",
        horario: "11:56",
    },
    {
        id: "#1017",
        cliente: "Juliana Pereira",
        valor: "R$ 59,90",
        forma: "Cartão de crédito",
        formaIcone: faCreditCard,
        status: "Pendente",
        statusTipo: "warning",
        data: "15/09/2026",
        horario: "11:33",
    },
    {
        id: "#1016",
        cliente: "Lucas Ferreira",
        valor: "R$ 42,00",
        forma: "Dinheiro",
        formaIcone: faDollarSign,
        status: "Pago",
        statusTipo: "success",
        data: "15/09/2026",
        horario: "11:12",
    },
    {
        id: "#1015",
        cliente: "Carla Mendes",
        valor: "R$ 68,40",
        forma: "Pix",
        formaIcone: faWallet,
        status: "Pago",
        statusTipo: "success",
        data: "15/09/2026",
        horario: "10:47",
    },
];

function obterClassesStatus(tipo: string) {
    if (tipo === "success") {
        return "bg-emerald-100 text-emerald-700";
    }
    if (tipo === "warning") {
        return "bg-amber-100 text-amber-700";
    }
    return "bg-slate-100 text-slate-700";
}

function ResumoCard({
    titulo,
    valor,
    percentual,
    detalhe,
    icone,
    cor,
    texto,
}: {
    titulo: string;
    valor: string;
    percentual?: string;
    detalhe: string;
    icone: any;
    cor: string;
    texto: string;
}) {
    return (
        <div className="rounded-[18px] border border-[#e7ecf3] bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
            <div className="flex items-start justify-between gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${cor}`}>
                    <FontAwesomeIcon icon={icone} className="text-lg" />
                </div>
                <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">
                    <FontAwesomeIcon icon={faArrowUp} className="text-[10px]" />
                    <span>{percentual || "0%"}</span>
                </div>
            </div>

            <div className="mt-4">
                <p className="text-sm font-medium text-slate-500">{titulo}</p>
                <p className={`mt-2 text-2xl font-black ${texto}`}>{valor}</p>
                <p className="mt-1 text-xs text-slate-500">{detalhe}</p>
            </div>
        </div>
    );
}

export default function Pagamentos() {
    return (
        <div className="flex min-w-0 flex-col gap-4">
            <header className="flex flex-col gap-3 rounded-[18px] border border-[#e7ecf3] bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)] xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3f6fb] text-[#1f2937]">
                        <FontAwesomeIcon icon={faReceipt} className="text-xl" />
                    </div>
                    <div>
                        <h1 className="text-[2rem] font-black tracking-tight text-[#101820]">Pagamentos</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Gerencie os pagamentos dos pedidos e acompanhe o status de cada transação.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl border border-[#dfe6ef] bg-white px-3 py-2 text-sm font-semibold text-[#1f2937]"
                    >
                        <FontAwesomeIcon icon={faCalendarDays} className="text-xs" />
                        15/09/2026 - 15/09/2026
                        <FontAwesomeIcon icon={faChevronDown} className="text-[10px]" />
                    </button>

                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl border border-[#dfe6ef] bg-white px-3 py-2 text-sm font-semibold text-[#1f2937]"
                    >
                        <FontAwesomeIcon icon={faFileExport} className="text-xs" />
                        Exportar relatório
                    </button>
                </div>
            </header>

            <section className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
                {cardsResumo.map((card) => (
                    <ResumoCard key={card.titulo} {...card} />
                ))}
            </section>

            <section className="overflow-hidden rounded-[18px] border border-[#e7ecf3] bg-white shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
                <div className="flex flex-col gap-3 border-b border-[#edf1f6] px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0f5ff] text-[#3257d9]">
                            <FontAwesomeIcon icon={faReceipt} className="text-lg" />
                        </div>
                        <h2 className="text-2xl font-black text-[#101820]">Lista de pagamentos</h2>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                <FontAwesomeIcon icon={faMagnifyingGlass} className="text-xs" />
                            </span>
                            <input
                                type="text"
                                placeholder="Buscar por nº do pedido, cliente ou forma de pagamento..."
                                className="w-full rounded-xl border border-[#dfe6ef] bg-[#f8fafc] py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-[#c9d5e7] sm:w-105"
                            />
                        </div>

                        <button
                            type="button"
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dfe6ef] bg-white px-3 py-2.5 text-sm font-semibold text-[#1f2937]"
                        >
                            <FontAwesomeIcon icon={faFilter} className="text-xs" />
                            Filtros
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-215 border-collapse text-left text-sm">
                        <thead className="bg-[#f8fafc] text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                            <tr>
                                <th className="px-5 py-4">Nº do pedido</th>
                                <th className="px-5 py-4">Cliente</th>
                                <th className="px-5 py-4">Valor</th>
                                <th className="px-5 py-4">Forma de pagamento</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4">Data e hora</th>
                                <th className="px-5 py-4 text-right">Ações</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#edf1f6] text-slate-700">
                            {pagamentos.map((pagamento) => (
                                <tr key={pagamento.id} className="transition-colors hover:bg-slate-50/80">
                                    <td className="px-5 py-4 font-bold text-[#101820]">{pagamento.id}</td>
                                    <td className="px-5 py-4 font-medium text-[#1f2937]">{pagamento.cliente}</td>
                                    <td className="px-5 py-4 font-semibold text-[#101820]">{pagamento.valor}</td>
                                    <td className="px-5 py-4">
                                        <div className="inline-flex items-center gap-2 rounded-lg border border-[#edf1f6] bg-[#f8fafc] px-2.5 py-1.5 text-[#1f2937]">
                                            <FontAwesomeIcon icon={pagamento.formaIcone} className="text-sm text-slate-500" />
                                            <span>{pagamento.forma}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold ${obterClassesStatus(
                                                pagamento.statusTipo,
                                            )}`}
                                        >
                                            {pagamento.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-slate-500">
                                        <div className="flex flex-col">
                                            <span>{pagamento.data}</span>
                                            <span className="text-xs text-slate-400">{pagamento.horario}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <button
                                            type="button"
                                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#e5e7eb] bg-white text-slate-500 transition-colors hover:bg-slate-100"
                                        >
                                            <FontAwesomeIcon icon={faEllipsis} className="text-sm" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-col gap-3 border-t border-[#edf1f6] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-500">10 por página</p>

                    <div className="flex items-center gap-2">
                        <button type="button" className="rounded-lg border border-[#dfe6ef] bg-white px-3 py-2 text-sm font-semibold text-slate-500">
                            ‹
                        </button>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((numero) => (
                                <button
                                    key={numero}
                                    type="button"
                                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold ${
                                        numero === 1
                                            ? "bg-[#d92626] text-white"
                                            : "bg-[#f3f6fb] text-slate-600 hover:bg-[#eaf0f7]"
                                    }`}
                                >
                                    {numero}
                                </button>
                            ))}
                        </div>
                        <button type="button" className="rounded-lg border border-[#dfe6ef] bg-white px-3 py-2 text-sm font-semibold text-slate-500">
                            ›
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}