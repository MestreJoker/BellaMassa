"use client";

import { useEffect, useMemo, useState } from "react";
import Axios from "axios";
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

interface ClienteJson {
    idCliente: number;
    nome: string;
}

interface PedidoJson {
    idPedido: number;
    idCliente: number;
    total: number;
    formaPagamento: string;
    status: string;
    tipoEntrega: string;
    dataPedido: string;
}

const formatCurrency = (valor: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);

export default function Pagamentos() {
    const [pedidos, setPedidos] = useState<PedidoJson[]>([]);
    const [clientes, setClientes] = useState<ClienteJson[]>([]);
    const [pesquisa, setPesquisa] = useState("");
    const [statusFiltro, setStatusFiltro] = useState("Todos");
    const [periodoFiltro, setPeriodoFiltro] = useState("30d");

    const pedidosFiltradosPorPeriodo = useMemo(() => {
        if (periodoFiltro === "todos") return pedidos;

        const hoje = new Date();
        const dias = Number(periodoFiltro.replace("d", ""));

        return pedidos.filter((pedido) => {
            const dataPedido = new Date(pedido.dataPedido);
            const diff = (hoje.getTime() - dataPedido.getTime()) / (1000 * 60 * 60 * 24);
            return diff >= 0 && diff <= dias;
        });
    }, [pedidos, periodoFiltro]);

    const clientesMap = useMemo(
        () => new Map(clientes.map((cliente) => [cliente.idCliente, cliente.nome])),
        [clientes],
    );

    const pedidosFormatados = useMemo(() => {
        return pedidosFiltradosPorPeriodo.map((pedido) => {
            const clienteNome = clientesMap.get(pedido.idCliente) ?? `Cliente ${pedido.idCliente}`;
            const statusNormalizado = /pendente/i.test(pedido.status) ? "Pendente" : "Pago";

            return {
                id: `#${pedido.idPedido}`,
                cliente: clienteNome,
                valor: formatCurrency(pedido.total),
                forma: pedido.formaPagamento ?? "Pix",
                formaIcone:
                    pedido.formaPagamento === "Cartão de crédito"
                        ? faCreditCard
                        : pedido.formaPagamento === "Dinheiro"
                        ? faDollarSign
                        : faWallet,
                status: statusNormalizado,
                statusTipo: statusNormalizado === "Pago" ? "success" : "warning",
                data: new Date(pedido.dataPedido).toLocaleDateString("pt-BR"),
                horario: new Date(pedido.dataPedido).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                }),
            };
        });
    }, [clientesMap, pedidosFiltradosPorPeriodo]);

    const pedidosFiltrados = useMemo(() => {
        return pedidosFormatados.filter((pedido) => {
            const termo = pesquisa.toLowerCase();
            const atendePesquisa =
                !termo ||
                pedido.id.toLowerCase().includes(termo) ||
                pedido.cliente.toLowerCase().includes(termo) ||
                pedido.forma.toLowerCase().includes(termo);

            const atendeStatus = statusFiltro === "Todos" || pedido.status === statusFiltro;
            return atendePesquisa && atendeStatus;
        });
    }, [pesquisa, pedidosFormatados, statusFiltro]);

    const totalRecebido = pedidosFiltradosPorPeriodo.reduce((total, pedido) => total + Number(pedido.total || 0), 0);
    const totalPedidos = pedidosFiltradosPorPeriodo.length;
    const pagamentosPix = pedidosFiltradosPorPeriodo.filter((pedido) => pedido.formaPagamento === "Pix").length;
    const pagamentosCartao = pedidosFiltradosPorPeriodo.filter((pedido) => pedido.formaPagamento === "Cartão de crédito").length;
    const pagamentosDinheiro = pedidosFiltradosPorPeriodo.filter((pedido) => pedido.formaPagamento === "Dinheiro").length;

    const cardsResumo = [
        {
            titulo: "Total recebido",
            valor: formatCurrency(totalRecebido),
            percentual: "+12%",
            detalhe: "em relação ao período anterior",
            icone: faMoneyBillWave,
            cor: "bg-emerald-100 text-emerald-700",
            texto: "text-emerald-700",
        },
        {
            titulo: "Pagamentos por Pix",
            valor: `${Math.round((pagamentosPix / Math.max(totalPedidos, 1)) * 100) || 0}%`,
            detalhe: `${pagamentosPix} de ${totalPedidos || 0} pagamentos`,
            icone: faWallet,
            cor: "bg-blue-100 text-blue-700",
            texto: "text-blue-700",
        },
        {
            titulo: "Pagamentos por cartão",
            valor: `${Math.round((pagamentosCartao / Math.max(totalPedidos, 1)) * 100) || 0}%`,
            detalhe: `${pagamentosCartao} de ${totalPedidos || 0} pagamentos`,
            icone: faCreditCard,
            cor: "bg-violet-100 text-violet-700",
            texto: "text-violet-700",
        },
        {
            titulo: "Pagamentos em dinheiro",
            valor: `${Math.round((pagamentosDinheiro / Math.max(totalPedidos, 1)) * 100) || 0}%`,
            detalhe: `${pagamentosDinheiro} de ${totalPedidos || 0} pagamentos`,
            icone: faDollarSign,
            cor: "bg-amber-100 text-amber-700",
            texto: "text-amber-700",
        },
    ];

    function obterClassesStatus(tipo: string) {
        if (tipo === "success") return "bg-emerald-100 text-emerald-700";
        if (tipo === "warning") return "bg-amber-100 text-amber-700";
        return "bg-slate-100 text-slate-700";
    }

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
                    <select
                        value={periodoFiltro}
                        onChange={(evento) => setPeriodoFiltro(evento.target.value)}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#dfe6ef] bg-white px-3 py-2 text-sm font-semibold text-[#1f2937] outline-none"
                    >
                        <option value="7d">Últimos 7 dias</option>
                        <option value="30d">Últimos 30 dias</option>
                        <option value="90d">Últimos 90 dias</option>
                        <option value="todos">Todo o período</option>
                    </select>

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
                    <div
                        key={card.titulo}
                        className="rounded-[18px] border border-[#e7ecf3] bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)]"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.cor}`}>
                                <FontAwesomeIcon icon={card.icone} className="text-lg" />
                            </div>
                            <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">
                                <FontAwesomeIcon icon={faArrowUp} className="text-[10px]" />
                                <span>{card.percentual}</span>
                            </div>
                        </div>

                        <div className="mt-4">
                            <p className="text-sm font-medium text-slate-500">{card.titulo}</p>
                            <p className={`mt-2 text-2xl font-black ${card.texto}`}>{card.valor}</p>
                            <p className="mt-1 text-xs text-slate-500">{card.detalhe}</p>
                        </div>
                    </div>
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
                                value={pesquisa}
                                onChange={(evento) => setPesquisa(evento.target.value)}
                                placeholder="Buscar por nº do pedido, cliente ou forma de pagamento..."
                                className="w-full rounded-xl border border-[#dfe6ef] bg-[#f8fafc] py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-[#c9d5e7] sm:w-105"
                            />
                        </div>

                        <div className="flex items-center gap-2 rounded-xl border border-[#dfe6ef] bg-white px-3 py-2.5 text-sm font-semibold text-[#1f2937]">
                            <FontAwesomeIcon icon={faFilter} className="text-xs" />
                            <select
                                value={statusFiltro}
                                onChange={(evento) => setStatusFiltro(evento.target.value)}
                                className="bg-transparent text-sm font-semibold outline-none"
                            >
                                <option value="Todos">Todos</option>
                                <option value="Pago">Pago</option>
                                <option value="Pendente">Pendente</option>
                            </select>
                        </div>
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
                            {pedidosFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                                        Nenhum pagamento encontrado para os filtros selecionados.
                                    </td>
                                </tr>
                            ) : (
                                pedidosFiltrados.map((pagamento) => (
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}