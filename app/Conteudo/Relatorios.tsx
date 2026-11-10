"use client";

import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTrendDown,
  faArrowTrendUp,
  faClipboardList,
  faFileExport,
  faFilter,
  faPizzaSlice,
  faReceipt,
  faTruck,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { obterPedidos, type PedidoLocal } from "../lib/pedidos";
import { exportarCsv } from "../lib/exportarCsv";
import { obterClientes, obterProdutos, type ClienteLocal, type ProdutoLocal } from "../lib/database";

interface RelatoriosProps {
  onVerTodosPedidos: () => void
  onVerProdutos: () => void
}

const formatCurrency = (valor: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);

export default function Relatorios({ onVerTodosPedidos, onVerProdutos }: RelatoriosProps) {
  const [pedidos, setPedidos] = useState<PedidoLocal[]>([]);
  const [clientes, setClientes] = useState<ClienteLocal[]>([]);
  const [cardapio, setCardapio] = useState<ProdutoLocal[]>([]);
  const [periodoFiltro, setPeriodoFiltro] = useState("todos");
  const [erroCarga, setErroCarga] = useState("");

  useEffect(() => {
    async function carregarDados() {
      try {
        const [pedidosResponse, clientesResponse, cardapioResponse] = await Promise.all([
          obterPedidos(),
          obterClientes(),
          obterProdutos(),
        ]);

        setPedidos(pedidosResponse);
        setClientes(clientesResponse);
        setCardapio(cardapioResponse);
      } catch (erro) {
        console.error("Não foi possível carregar os relatórios.", erro);
        setErroCarga("Não foi possível carregar os relatórios. Atualize a página e tente novamente.");
      }
    }

    carregarDados();
  }, []);

  const pedidosFiltradosPorPeriodo = useMemo(() => {
    if (periodoFiltro === "todos") return pedidos;

    const hoje = new Date();
    const dias = Number(periodoFiltro.replace("d", ""));
    const inicio = hoje.getTime() - dias * 24 * 60 * 60 * 1000;

    return pedidos.filter((pedido) => {
      const instante = new Date(pedido.dataPedido).getTime();
      return instante >= inicio && instante <= hoje.getTime();
    });
  }, [pedidos, periodoFiltro]);

  const pedidosPagos = useMemo(
    () => pedidosFiltradosPorPeriodo.filter((pedido) => pedido.statusPagamento === "Pago"),
    [pedidosFiltradosPorPeriodo],
  );
  const pedidosAnteriores = useMemo(() => {
    if (periodoFiltro === "todos") return [];
    const agora = new Date().getTime();
    const dias = Number(periodoFiltro.replace("d", ""));
    const inicioAtual = agora - dias * 24 * 60 * 60 * 1000;
    const inicioAnterior = inicioAtual - dias * 24 * 60 * 60 * 1000;
    return pedidos.filter((pedido) => {
      const instante = new Date(pedido.dataPedido).getTime();
      return instante >= inicioAnterior && instante < inicioAtual;
    });
  }, [pedidos, periodoFiltro]);

  const financeiro = useMemo(() => {
    const total = pedidosPagos.reduce((sum, pedido) => sum + pedido.total, 0);
    const ticketMedio = pedidosPagos.length ? total / pedidosPagos.length : 0;
    const produtosVendidos = pedidosPagos.reduce(
      (sum, pedido) => sum + pedido.itens.reduce((acc, item) => acc + Number(item.quantidade ?? 0), 0),
      0,
    );

    return { total, ticketMedio, produtosVendidos };
  }, [pedidosPagos]);

  const financeiroAnterior = useMemo(() => {
    const pagos = pedidosAnteriores.filter((pedido) => pedido.statusPagamento === "Pago");
    const total = pagos.reduce((sum, pedido) => sum + pedido.total, 0);
    return {
      total,
      quantidade: pedidosAnteriores.length,
      ticketMedio: pagos.length ? total / pagos.length : 0,
      produtosVendidos: pagos.reduce(
        (sum, pedido) => sum + pedido.itens.reduce((acc, item) => acc + Number(item.quantidade ?? 0), 0),
        0,
      ),
    };
  }, [pedidosAnteriores]);

  function variacao(atual: number, anterior: number): string {
    if (periodoFiltro === "todos") return "—";
    if (anterior === 0) return atual === 0 ? "0%" : "Novo";
    const percentual = Math.round(((atual - anterior) / anterior) * 100);
    return `${percentual > 0 ? "+" : ""}${percentual}%`;
  }

  const cardsResumo = [
    {
      titulo: "Faturamento recebido",
      valor: formatCurrency(financeiro.total),
      percentual: variacao(financeiro.total, financeiroAnterior.total),
      detalhe: periodoFiltro === "todos" ? "somente pedidos pagos" : "comparado ao período anterior",
      icone: faWallet,
      cor: "bg-emerald-100 text-emerald-700",
      valorCor: "text-emerald-700",
    },
    {
      titulo: "Total de pedidos",
      valor: String(pedidosFiltradosPorPeriodo.length),
      percentual: variacao(pedidosFiltradosPorPeriodo.length, financeiroAnterior.quantidade),
      detalhe: periodoFiltro === "todos" ? "no período selecionado" : "comparado ao período anterior",
      icone: faClipboardList,
      cor: "bg-blue-100 text-blue-700",
      valorCor: "text-blue-700",
    },
    {
      titulo: "Ticket médio",
      valor: formatCurrency(financeiro.ticketMedio),
      percentual: variacao(financeiro.ticketMedio, financeiroAnterior.ticketMedio),
      detalhe: periodoFiltro === "todos" ? "média dos pedidos pagos" : "comparado ao período anterior",
      icone: faReceipt,
      cor: "bg-violet-100 text-violet-700",
      valorCor: "text-violet-700",
    },
    {
      titulo: "Produtos vendidos",
      valor: String(financeiro.produtosVendidos),
      percentual: variacao(financeiro.produtosVendidos, financeiroAnterior.produtosVendidos),
      detalhe: periodoFiltro === "todos" ? "em pedidos pagos" : "comparado ao período anterior",
      icone: faPizzaSlice,
      cor: "bg-amber-100 text-amber-700",
      valorCor: "text-amber-700",
    },
  ];

  const vendasPorCategoria = useMemo(() => {
    const cores = ["bg-blue-500", "bg-emerald-500", "bg-violet-500", "bg-amber-500", "bg-pink-500", "bg-cyan-500"];
    const totais = new Map<string, number>();
    for (const pedido of pedidosPagos) {
      for (const item of pedido.itens) {
        const produto = cardapio.find((catalogo) => catalogo.idItem === item.idProduto);
        const categoria = produto?.categoria ?? "Categoria indisponível";
        const totalItem = item.precoTotalItem ?? Number(item.precoUnitario ?? 0) * Number(item.quantidade ?? 0);
        totais.set(categoria, (totais.get(categoria) ?? 0) + totalItem);
      }
    }
    const total = [...totais.values()].reduce((sum, valor) => sum + valor, 0);
    return [...totais.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([nome, valor], index) => ({
        nome,
        valor: formatCurrency(valor),
        porcentagem: total ? `${Math.round((valor / total) * 100)}%` : "0%",
        cor: cores[index % cores.length],
      }));
  }, [cardapio, pedidosPagos]);

  const produtosMaisVendidos = useMemo(() => {
    const totais = new Map<string, { nome: string; quantidade: number; total: number }>();
    for (const pedido of pedidosPagos) {
      for (const item of pedido.itens) {
        const produto = cardapio.find((catalogo) => catalogo.idItem === item.idProduto);
        const nome = item.nome ?? produto?.nome ?? "Produto removido";
        const registro = totais.get(nome) ?? { nome, quantidade: 0, total: 0 };
        registro.quantidade += Number(item.quantidade ?? 0);
        registro.total += item.precoTotalItem ?? Number(item.precoUnitario ?? 0) * Number(item.quantidade ?? 0);
        totais.set(nome, registro);
      }
    }
    return [...totais.values()].sort((a, b) => b.quantidade - a.quantidade).slice(0, 5);
  }, [cardapio, pedidosPagos]);

  const pagamentosPorForma = useMemo(() => {
    const formas = ["Pix", "Cartão de crédito", "Cartão de débito", "Dinheiro", "Outro"];
    const cores = ["#3b82f6", "#a855f7", "#8b5cf6", "#34d399", "#f59e0b"];
    return formas.map((nome, index) => {
      const pedidosDaForma = pedidosPagos.filter((pedido) => pedido.formaPagamento === nome);
      return {
        nome,
        quantidade: pedidosDaForma.length,
        total: pedidosDaForma.reduce((sum, pedido) => sum + pedido.total, 0),
        cor: cores[index],
      };
    }).filter((forma) => forma.quantidade > 0);
  }, [pedidosPagos]);

  const gradientePagamentos = useMemo(() => {
    if (!financeiro.total) return "conic-gradient(#e2e8f0 0 100%)";
    let inicio = 0;
    const fatias = pagamentosPorForma.map((forma) => {
      const fim = inicio + (forma.total / financeiro.total) * 100;
      const fatia = `${forma.cor} ${inicio}% ${fim}%`;
      inicio = fim;
      return fatia;
    });
    return `conic-gradient(${fatias.join(", ")})`;
  }, [financeiro.total, pagamentosPorForma]);

  const faturamentoDiario = useMemo(() => {
    const hoje = new Date();
    return Array.from({ length: 7 }, (_, index) => {
      const data = new Date(hoje);
      data.setDate(hoje.getDate() - (6 - index));
      const inicioDia = new Date(data.getFullYear(), data.getMonth(), data.getDate()).getTime();
      const fimDia = inicioDia + 24 * 60 * 60 * 1000;
      const valor = pedidosPagos
        .filter((pedido) => {
          const instante = new Date(pedido.dataPedido).getTime();
          return instante >= inicioDia && instante < fimDia;
        })
        .reduce((sum, pedido) => sum + pedido.total, 0);
      return { data, valor };
    });
  }, [pedidosPagos]);

  const pontosFaturamento = useMemo(() => {
    const maximo = Math.max(...faturamentoDiario.map((item) => item.valor), 1);
    return faturamentoDiario.map((item, index) => ({
      x: (index / (faturamentoDiario.length - 1)) * 500,
      y: 190 - (item.valor / maximo) * 150,
    }));
  }, [faturamentoDiario]);
  const caminhoFaturamento = pontosFaturamento.map((ponto) => `${ponto.x},${ponto.y}`).join(" ");
  const areaFaturamento = `0,210 ${caminhoFaturamento} 500,210`;

  const ultimosPedidos = useMemo(() => {
    return pedidosFiltradosPorPeriodo.slice(0, 5).map((pedido) => {
      const cliente = clientes.find((item) => item.idCliente === pedido.idCliente)?.nome ?? `Cliente ${pedido.idCliente}`;
      return {
        id: `#${pedido.idPedido}`,
        cliente,
        valor: formatCurrency(pedido.total),
        status: pedido.statusPagamento,
        statusColor: pedido.statusPagamento === "Pago" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700",
        data: new Date(pedido.dataPedido).toLocaleDateString("pt-BR"),
        hora: new Date(pedido.dataPedido).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", hour12: false }),
      };
    });
  }, [clientes, pedidosFiltradosPorPeriodo]);

  const pedidosPorStatus = useMemo(() => {
    const status = ["Em andamento", "Em preparo", "Pronto", "Em entrega", "Entregue", "Retirado", "Cancelado"];
    const cores = ["bg-slate-400", "bg-cyan-500", "bg-green-500", "bg-amber-500", "bg-emerald-500", "bg-blue-500", "bg-rose-500"];
    const total = pedidosFiltradosPorPeriodo.length;
    return status.map((nome, index) => {
      const valor = pedidosFiltradosPorPeriodo.filter((pedido) => pedido.status === nome).length;
      return {
        nome,
        valor,
        percentual: total ? `${Math.round((valor / total) * 100)}%` : "0%",
        cor: cores[index],
      };
    });
  }, [pedidosFiltradosPorPeriodo]);

  const statusEntrega = pedidosFiltradosPorPeriodo.filter((pedido) => ["Entregue", "Retirado"].includes(pedido.status)).length;
  const statusCancelados = pedidosFiltradosPorPeriodo.filter((pedido) => pedido.status === "Cancelado").length;
  const pedidosAbertos = pedidosFiltradosPorPeriodo.filter((pedido) => !["Entregue", "Retirado", "Cancelado"].includes(pedido.status)).length;
  const pedidosNaoPagos = pedidosFiltradosPorPeriodo.filter((pedido) => pedido.statusPagamento !== "Pago" && pedido.status !== "Cancelado");
  const valorNaoRecebido = pedidosNaoPagos.reduce((sum, pedido) => sum + pedido.total, 0);
  const pedidosEntrega = pedidosFiltradosPorPeriodo.filter((pedido) => pedido.tipoEntrega === "Entrega");
  const taxaMediaEntrega = pedidosEntrega.length
    ? pedidosEntrega.reduce((sum, pedido) => sum + pedido.taxaEntrega, 0) / pedidosEntrega.length
    : 0;

  const gradienteStatus = useMemo(() => {
    const total = pedidosPorStatus.reduce((sum, status) => sum + status.valor, 0);
    if (!total) return "conic-gradient(#e2e8f0 0 100%)";
    const cores = ["#94a3b8", "#06b6d4", "#22c55e", "#f59e0b", "#10b981", "#3b82f6", "#f43f5e"];
    let inicio = 0;
    const fatias = pedidosPorStatus.map((status, index) => {
      const fim = inicio + (status.valor / total) * 100;
      const fatia = `${cores[index]} ${inicio}% ${fim}%`;
      inicio = fim;
      return fatia;
    });
    return `conic-gradient(${fatias.join(", ")})`;
  }, [pedidosPorStatus]);

  return (
    <div className="flex min-w-0 flex-col gap-4">
      {erroCarga && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{erroCarga}</p>}
      <header className="flex flex-col gap-3 rounded-[18px] border border-[#e7ecf3] bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)] xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f2f5fb] text-[#1a2231]">
            <FontAwesomeIcon icon={faFilter} className="text-xl" />
          </div>
          <div>
            <h1 className="text-[2rem] font-black tracking-tight text-[#101820]">Relatórios</h1>
            <p className="mt-1 text-sm text-slate-500">
              Acompanhe o desempenho da sua pizzaria com dados completos e atualizados.
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
            onClick={() => exportarCsv(
              "relatorio-pedidos.csv",
              ["Pedido", "Cliente", "Data", "Status", "Tipo", "Pagamento", "Total"],
              pedidosFiltradosPorPeriodo.map((pedido) => [
                pedido.idPedido,
                clientes.find((cliente) => cliente.idCliente === pedido.idCliente)?.nome ?? `Cliente ${pedido.idCliente}`,
                new Date(pedido.dataPedido).toLocaleString("pt-BR"),
                pedido.status,
                pedido.tipoEntrega,
                pedido.formaPagamento,
                formatCurrency(pedido.total),
              ]),
            )}
            className="inline-flex items-center gap-2 rounded-xl border border-[#dfe6ef] bg-white px-3 py-2 text-sm font-semibold text-[#1f2937]"
          >
            <FontAwesomeIcon icon={faFileExport} className="text-xs" />
            Exportar relatório
          </button>
        </div>
      </header>

      <section className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {cardsResumo.map((card) => (
          <div key={card.titulo} className="rounded-[18px] border border-[#e7ecf3] bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
            <div className="flex items-start justify-between gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.cor}`}>
                <FontAwesomeIcon icon={card.icone} className="text-lg" />
              </div>
              <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${
                card.percentual.startsWith("-") ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
              }`}>
                <FontAwesomeIcon icon={card.percentual.startsWith("-") ? faArrowTrendDown : faArrowTrendUp} className="text-[10px]" />
                <span>{card.percentual}</span>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">{card.titulo}</p>
              <p className={`mt-2 text-3xl font-black ${card.valorCor}`}>{card.valor}</p>
              <p className="mt-1 text-xs text-slate-500">{card.detalhe}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[1.7fr_1fr_1fr]">
        <div className="rounded-[18px] border border-[#e7ecf3] bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef4ff] text-[#2c66d8]">
              <FontAwesomeIcon icon={faArrowTrendUp} className="text-lg" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#101820]">Evolução do faturamento recebido</h2>
              <p className="text-xs text-slate-500">Últimos 7 dias</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-[#edf1f6] bg-[#f9fbff] p-3">
            <svg viewBox="0 0 500 210" className="h-52 w-full" preserveAspectRatio="none" aria-label="Gráfico de faturamento">
              <defs>
                <linearGradient id="linhasRelatorio" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#5b8def" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#5b8def" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {[0, 1, 2, 3, 4].map((linha) => (
                <line key={linha} x1="0" y1={30 + linha * 40} x2="500" y2={30 + linha * 40} stroke="#dfe7f3" strokeDasharray="4 8" />
              ))}

              <polygon points={areaFaturamento} fill="url(#linhasRelatorio)" />
              <polyline points={caminhoFaturamento} fill="none" stroke="#3f6fe5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

              {pontosFaturamento.map(({ x, y }, index) => (
                <circle key={index} cx={x} cy={y} r="4" fill="#3f6fe5" />
              ))}
            </svg>

            <div className="mt-2 flex justify-between px-2 text-xs font-medium text-slate-500">
              {faturamentoDiario.map((item) => (
                <span key={item.data.toISOString()}>{item.data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[18px] border border-[#e7ecf3] bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef4ff] text-[#2c66d8]">
              <FontAwesomeIcon icon={faWallet} className="text-lg" />
            </div>
            <h2 className="text-2xl font-black text-[#101820]">Formas de pagamento</h2>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative flex h-40 w-40 items-center justify-center rounded-full" style={{ background: gradientePagamentos }}>
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-center">
                <div>
                  <p className="text-2xl font-black text-[#101820]">{formatCurrency(financeiro.total)}</p>
                  <p className="mt-1 text-xs text-slate-500">Recebido</p>
                </div>
              </div>
            </div>

            <div className="w-full space-y-3">
              {pagamentosPorForma.map((forma) => (
                <div key={forma.nome} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: forma.cor }} />
                    <span className="text-sm text-slate-600">{forma.nome}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <span>{forma.quantidade}</span>
                    <span className="text-slate-400">{formatCurrency(forma.total)}</span>
                  </div>
                </div>
              ))}
              {pagamentosPorForma.length === 0 && <p className="text-sm text-slate-500">Sem pagamentos recebidos neste período.</p>}
            </div>
          </div>
        </div>

        <div className="rounded-[18px] border border-[#e7ecf3] bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef4ff] text-[#2c66d8]">
              <FontAwesomeIcon icon={faReceipt} className="text-lg" />
            </div>
            <h2 className="text-2xl font-black text-[#101820]">Resumo do período</h2>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3 rounded-xl bg-[#f8fafc] px-3 py-2">
              <div className="flex items-center gap-2 text-slate-600">
                <span className="inline-flex h-3 w-3 rounded-full bg-emerald-500" />
                <span>Pedidos concluídos</span>
              </div>
              <span className="font-bold text-slate-800">{statusEntrega}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-[#f8fafc] px-3 py-2">
              <div className="flex items-center gap-2 text-slate-600">
                <span className="inline-flex h-3 w-3 rounded-full bg-red-500" />
                <span>Pedidos cancelados</span>
              </div>
              <span className="font-bold text-slate-800">{statusCancelados}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-[#f8fafc] px-3 py-2">
              <div className="flex items-center gap-2 text-slate-600">
                <span className="inline-flex h-3 w-3 rounded-full bg-amber-500" />
                <span>Pedidos em andamento</span>
              </div>
              <span className="font-bold text-slate-800">{pedidosAbertos}</span>
            </div>

            <div className="mt-4 space-y-2 border-t border-[#edf1f6] pt-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Taxa de entrega média</span>
                <span className="font-bold text-slate-800">{formatCurrency(taxaMediaEntrega)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid min-w-0 grid-cols-1 gap-4 2xl:grid-cols-[1.5fr_1fr_1.2fr]">
        <div className="rounded-[18px] border border-[#e7ecf3] bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f2f5fb] text-[#1a2231]">
                <FontAwesomeIcon icon={faPizzaSlice} className="text-lg" />
              </div>
              <h2 className="text-2xl font-black text-[#101820]">Produtos mais vendidos</h2>
            </div>
            <button type="button" onClick={onVerProdutos} className="text-sm font-semibold text-[#2c66d8]">
              Ver todos →
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#edf1f6]">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-[#f8fafc] text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
                <tr>
                  <th className="px-4 py-3">Produto</th>
                  <th className="px-4 py-3">Qtd. vendida</th>
                  <th className="px-4 py-3">Valor total</th>
                  <th className="px-4 py-3">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf1f6] text-slate-700">
                {produtosMaisVendidos.map((produto, index) => (
                  <tr key={produto.nome} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#f3f5f8] text-xs font-bold text-slate-500">
                          {index + 1}
                        </div>
                        <span className="font-medium text-[#1f2937]">{produto.nome}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{produto.quantidade}</td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(produto.total)}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">
                        {financeiro.total ? `${Math.round((produto.total / financeiro.total) * 100)}%` : "0%"}
                      </span>
                    </td>
                  </tr>
                ))}
                {produtosMaisVendidos.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-6 text-center text-sm text-slate-500">Nenhuma venda paga neste período.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-[18px] border border-[#e7ecf3] bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef4ff] text-[#2c66d8]">
              <FontAwesomeIcon icon={faFilter} className="text-lg" />
            </div>
            <h2 className="text-2xl font-black text-[#101820]">Vendas por categoria</h2>
          </div>

          <div className="space-y-4">
            {vendasPorCategoria.map((categoria) => (
              <div key={categoria.nome}>
                <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-slate-600">{categoria.nome}</span>
                  <span className="font-bold text-slate-800">{categoria.valor}</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#edf1f6]">
                  <div className={`h-full rounded-full ${categoria.cor}`} style={{ width: categoria.porcentagem }} />
                </div>
              </div>
            ))}
            {vendasPorCategoria.length === 0 && <p className="text-sm text-slate-500">Nenhuma venda paga neste período.</p>}
          </div>
        </div>

        <div className="rounded-[18px] border border-[#e7ecf3] bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef4ff] text-[#2c66d8]">
                <FontAwesomeIcon icon={faTruck} className="text-lg" />
              </div>
              <h2 className="text-2xl font-black text-[#101820]">Últimos pedidos</h2>
            </div>
            <button type="button" onClick={onVerTodosPedidos} className="text-sm font-semibold text-[#2c66d8]">
              Ver todos →
            </button>
          </div>

          <div className="space-y-3">
            {ultimosPedidos.map((pedido) => (
              <div key={pedido.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl border border-[#edf1f6] bg-[#f8fafc] px-3 py-2.5">
                <span className="text-sm font-bold text-slate-800">{pedido.id}</span>
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-medium text-slate-700">{pedido.cliente}</span>
                    <span className="text-sm font-semibold text-slate-800">{pedido.valor}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-3 text-xs text-slate-500">
                    <span className={`rounded-full px-2 py-1 font-bold ${pedido.statusColor}`}>{pedido.status}</span>
                    <span>{pedido.data}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[1.2fr_1fr]">
        <div className="rounded-[18px] border border-[#e7ecf3] bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef4ff] text-[#2c66d8]">
              <FontAwesomeIcon icon={faClipboardList} className="text-lg" />
            </div>
            <h2 className="text-2xl font-black text-[#101820]">Pedidos por status</h2>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex h-36 w-36 items-center justify-center rounded-full" style={{ background: gradienteStatus }}>
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-center">
                <div>
                  <p className="text-2xl font-black text-[#101820]">{pedidosFiltradosPorPeriodo.length}</p>
                  <p className="text-xs text-slate-500">pedidos</p>
                </div>
              </div>
            </div>

            <div className="w-full space-y-3 sm:max-w-65">
              {pedidosPorStatus.map((status) => (
                <div key={status.nome} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${status.cor}`} />
                    <span className="text-sm text-slate-600">{status.nome}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <span>{status.valor}</span>
                    <span className="text-slate-400">{status.percentual}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[18px] border border-[#e7ecf3] bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef4ff] text-[#2c66d8]">
              <FontAwesomeIcon icon={faReceipt} className="text-lg" />
            </div>
            <h2 className="text-2xl font-black text-[#101820]">Resumo geral</h2>
          </div>

          <div className="space-y-4 text-sm text-slate-700">
            <div className="flex items-center justify-between gap-3 rounded-xl bg-[#f8fafc] px-3 py-2.5">
              <span>Faturamento recebido</span>
              <span className="font-bold text-slate-800">{formatCurrency(financeiro.total)}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-[#f8fafc] px-3 py-2.5">
              <span>Valor não recebido</span>
              <span className="font-bold text-amber-700">{formatCurrency(valorNaoRecebido)}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-[#f8fafc] px-3 py-2.5">
              <span>Pedidos registrados</span>
              <span className="font-bold text-slate-800">{pedidosFiltradosPorPeriodo.length}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-[#f8fafc] px-3 py-2.5">
              <span>Ticket médio</span>
              <span className="font-bold text-slate-800">{formatCurrency(financeiro.ticketMedio)}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}