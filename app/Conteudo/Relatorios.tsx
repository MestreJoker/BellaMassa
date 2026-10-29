import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTrendUp,
  faCalendarDays,
  faChevronDown,
  faClipboardList,
  faFileExport,
  faFilter,
  faPizzaSlice,
  faReceipt,
  faTruck,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";

const cardsResumo = [
  {
    titulo: "Faturamento total",
    valor: "R$ 3.482,90",
    percentual: "+18%",
    detalhe: "em relação ao período anterior",
    icone: faWallet,
    cor: "bg-emerald-100 text-emerald-700",
    valorCor: "text-emerald-700",
  },
  {
    titulo: "Total de pedidos",
    valor: "54",
    percentual: "+12%",
    detalhe: "em relação ao período anterior",
    icone: faClipboardList,
    cor: "bg-blue-100 text-blue-700",
    valorCor: "text-blue-700",
  },
  {
    titulo: "Ticket médio",
    valor: "R$ 64,50",
    percentual: "+5%",
    detalhe: "em relação ao período anterior",
    icone: faReceipt,
    cor: "bg-violet-100 text-violet-700",
    valorCor: "text-violet-700",
  },
  {
    titulo: "Produtos vendidos",
    valor: "89",
    percentual: "+14%",
    detalhe: "em relação ao período anterior",
    icone: faPizzaSlice,
    cor: "bg-amber-100 text-amber-700",
    valorCor: "text-amber-700",
  },
];

const produtosMaisVendidos = [
  { nome: "Pizza Calabresa", qtd: 18, valor: "R$ 756,00", porcentagem: "20%" },
  { nome: "Pizza Frango com Catupiry", qtd: 14, valor: "R$ 658,00", porcentagem: "17%" },
  { nome: "Pizza Portuguesa", qtd: 10, valor: "R$ 472,00", porcentagem: "12%" },
  { nome: "Coca-Cola 2L", qtd: 8, valor: "R$ 96,00", porcentagem: "9%" },
  { nome: "Pizza 4 Queijos", qtd: 7, valor: "R$ 343,00", porcentagem: "9%" },
];

const vendasPorCategoria = [
  { nome: "Pizzas", valor: "R$ 2.846,50", porcentagem: "65%", cor: "bg-blue-500" },
  { nome: "Bebidas", valor: "R$ 639,00", porcentagem: "16%", cor: "bg-emerald-500" },
  { nome: "Sobremesas", valor: "R$ 312,00", porcentagem: "9%", cor: "bg-violet-500" },
  { nome: "Bordas", valor: "R$ 243,00", porcentagem: "6%", cor: "bg-amber-500" },
  { nome: "Adicionais", valor: "R$ 167,40", porcentagem: "4%", cor: "bg-pink-500" },
];

const pedidosPorStatus = [
  { nome: "Entregue", valor: 44, percentual: "81%", cor: "bg-pink-500" },
  { nome: "Em preparo", valor: 6, percentual: "11%", cor: "bg-cyan-500" },
  { nome: "Pronto", valor: 3, percentual: "6%", cor: "bg-green-500" },
  { nome: "Em entrega", valor: 1, percentual: "2%", cor: "bg-amber-500" },
];

const ultimosPedidos = [
  { id: "#1024", cliente: "João Silva", valor: "R$ 72,90", status: "Entrega", statusColor: "bg-emerald-100 text-emerald-700", data: "15/09/14:32" },
  { id: "#1023", cliente: "Maria Souza", valor: "R$ 54,00", status: "Em preparo", statusColor: "bg-amber-100 text-amber-700", data: "15/09/14:15" },
  { id: "#1022", cliente: "Pedro Santos", valor: "R$ 89,90", status: "Pago", statusColor: "bg-blue-100 text-blue-700", data: "15/09/13:47" },
  { id: "#1021", cliente: "Ana Lima", valor: "R$ 46,50", status: "Entrega", statusColor: "bg-emerald-100 text-emerald-700", data: "15/09/12:58" },
  { id: "#1020", cliente: "Carlos Oliveira", valor: "R$ 67,80", status: "Recebido", statusColor: "bg-violet-100 text-violet-700", data: "15/09/12:41" },
];

function CardResumo({
  titulo,
  valor,
  percentual,
  detalhe,
  icone,
  cor,
  valorCor,
}: {
  titulo: string;
  valor: string;
  percentual: string;
  detalhe: string;
  icone: any;
  cor: string;
  valorCor: string;
}) {
  return (
    <div className="rounded-[18px] border border-[#e7ecf3] bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${cor}`}>
          <FontAwesomeIcon icon={icone} className="text-lg" />
        </div>
        <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">
          <FontAwesomeIcon icon={faArrowTrendUp} className="text-[10px]" />
          <span>{percentual}</span>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-slate-500">{titulo}</p>
        <p className={`mt-2 text-3xl font-black ${valorCor}`}>{valor}</p>
        <p className="mt-1 text-xs text-slate-500">{detalhe}</p>
      </div>
    </div>
  );
}

export default function Relatorios() {
  return (
    <div className="flex min-w-0 flex-col gap-4">
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
          <CardResumo key={card.titulo} {...card} />
        ))}
      </section>

      <section className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[1.7fr_1fr_1fr]">
        <div className="rounded-[18px] border border-[#e7ecf3] bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef4ff] text-[#2c66d8]">
              <FontAwesomeIcon icon={faArrowTrendUp} className="text-lg" />
            </div>
            <h2 className="text-2xl font-black text-[#101820]">Evolução do faturamento</h2>
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
                <line
                  key={linha}
                  x1="0"
                  y1={30 + linha * 40}
                  x2="500"
                  y2={30 + linha * 40}
                  stroke="#dfe7f3"
                  strokeDasharray="4 8"
                />
              ))}

              <path
                d="M0,160 L70,120 L145,95 L210,88 L290,74 L360,98 L430,64 L500,50 L500,210 L0,210 Z"
                fill="url(#linhasRelatorio)"
              />

              <path
                d="M0,160 L70,120 L145,95 L210,88 L290,74 L360,98 L430,64 L500,50"
                fill="none"
                stroke="#3f6fe5"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {[
                [0, 160],
                [70, 120],
                [145, 95],
                [210, 88],
                [290, 74],
                [360, 98],
                [430, 64],
                [500, 50],
              ].map(([x, y], index) => (
                <circle key={index} cx={x} cy={y} r="4" fill="#3f6fe5" />
              ))}
            </svg>

            <div className="mt-2 flex justify-between px-2 text-xs font-medium text-slate-500">
              <span>15/09</span>
              <span>16/09</span>
              <span>17/09</span>
              <span>18/09</span>
              <span>19/09</span>
              <span>20/09</span>
              <span>21/09</span>
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
            <div
              className="relative flex h-40 w-40 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(#3b82f6 0 48%, #a855f7 48% 84%, #34d399 84% 100%)`,
              }}
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-center">
                <div>
                  <p className="text-2xl font-black text-[#101820]">R$ 3.482,90</p>
                  <p className="mt-1 text-xs text-slate-500">Total</p>
                </div>
              </div>
            </div>

            <div className="w-full space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-sm text-slate-600">Pix</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <span>48%</span>
                  <span className="text-slate-400">R$ 1.672,00</span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-violet-500" />
                  <span className="text-sm text-slate-600">Cartão</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <span>32%</span>
                  <span className="text-slate-400">R$ 1.113,40</span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="text-sm text-slate-600">Dinheiro</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <span>20%</span>
                  <span className="text-slate-400">R$ 696,37</span>
                </div>
              </div>
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
              <span className="font-bold text-slate-800">50</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-[#f8fafc] px-3 py-2">
              <div className="flex items-center gap-2 text-slate-600">
                <span className="inline-flex h-3 w-3 rounded-full bg-red-500" />
                <span>Pedidos cancelados</span>
              </div>
              <span className="font-bold text-slate-800">2</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-[#f8fafc] px-3 py-2">
              <div className="flex items-center gap-2 text-slate-600">
                <span className="inline-flex h-3 w-3 rounded-full bg-amber-500" />
                <span>Pedidos pendentes</span>
              </div>
              <span className="font-bold text-slate-800">2</span>
            </div>

            <div className="mt-4 space-y-2 border-t border-[#edf1f6] pt-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Taxa de entrega média</span>
                <span className="font-bold text-slate-800">R$ 7,00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Desconto médio</span>
                <span className="font-bold text-red-600">R$ 5,30</span>
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
            <button type="button" className="text-sm font-semibold text-[#2c66d8]">
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
                    <td className="px-4 py-3 font-medium">{produto.qtd}</td>
                    <td className="px-4 py-3 font-medium">{produto.valor}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">{produto.porcentagem}</span>
                    </td>
                  </tr>
                ))}
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
            <button type="button" className="text-sm font-semibold text-[#2c66d8]">
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
            <div
              className="relative flex h-36 w-36 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(#ec4899 0 81%, #06b6d4 81% 92%, #22c55e 92% 98%, #f59e0b 98% 100%)`,
              }}
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-center">
                <div>
                  <p className="text-2xl font-black text-[#101820]">54</p>
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
              <span>Receita bruta</span>
              <span className="font-bold text-slate-800">R$ 5.420,00</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-[#f8fafc] px-3 py-2.5">
              <span>Receita líquida</span>
              <span className="font-bold text-slate-800">R$ 4.980,00</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-[#f8fafc] px-3 py-2.5">
              <span>Lucro estimado</span>
              <span className="font-bold text-emerald-700">R$ 1.240,00</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl bg-[#f8fafc] px-3 py-2.5">
              <span>Ticket médio</span>
              <span className="font-bold text-slate-800">R$ 64,50</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}