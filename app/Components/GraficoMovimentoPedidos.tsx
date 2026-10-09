import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChartLine } from "@fortawesome/free-solid-svg-icons"

export default function GraficoMovimentoPedidos() {
    const [periodo, setPeriodo] = useState("Pedidos")

    return (
        <div className="flex min-w-0 flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:flex-2">
            {/* Cabeçalho do Card */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                        <FontAwesomeIcon icon={faChartLine} className="text-sm" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-slate-800">Movimento de pedidos</h3>
                        <p className="text-xs text-slate-400">Últimos 7 dias</p>
                    </div>
                </div>

                {/* Seletor de período/tipo */}
                <select
                    value={periodo}
                    onChange={(e) => setPeriodo(e.target.value)}
                    className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:border-slate-400"
                >
                    <option value="Pedidos">Pedidos</option>
                    <option value="Faturamento">Faturamento</option>
                </select>
            </div>

            {/* Simulação visual do gráfico de linha com gradiente */}
            <div className="relative flex h-40 w-full min-w-0 items-end pt-4 sm:h-48">
                {/* Linhas de grade horizontais de fundo */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30">
                    <div className="border-b border-slate-200 w-full text-[10px] text-slate-400 text-right pr-2">20</div>
                    <div className="border-b border-slate-200 w-full text-[10px] text-slate-400 text-right pr-2">15</div>
                    <div className="border-b border-slate-200 w-full text-[10px] text-slate-400 text-right pr-2">10</div>
                    <div className="border-b border-slate-200 w-full text-[10px] text-slate-400 text-right pr-2">5</div>
                    <div className="border-b border-slate-200 w-full text-[10px] text-slate-400 text-right pr-2">0</div>
                </div>

                {/* Curva SVG simulando o gráfico da imagem */}
                <div className="relative w-full h-full">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 600 150" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="gradGrafico" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#e11d48" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="#e11d48" stopOpacity="0.0" />
                            </linearGradient>
                        </defs>

                        {/* Área preenchida sob a linha */}
                        <path
                            d="M 0 120 Q 100 100, 200 95 T 400 60 T 500 80 T 600 50 L 600 150 L 0 150 Z"
                            fill="url(#gradGrafico)"
                        />

                        {/* Linha principal vermelha */}
                        <path
                            d="M 0 120 Q 100 100, 200 95 T 400 60 T 500 80 T 600 50"
                            fill="none"
                            stroke="#e11d48"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        />

                        {/* Pontos de marcação nos vértices */}
                        <circle cx="0" cy="120" r="4" fill="#e11d48" className="stroke-white stroke-2" />
                        <circle cx="100" cy="107" r="4" fill="#e11d48" className="stroke-white stroke-2" />
                        <circle cx="200" cy="95" r="4" fill="#e11d48" className="stroke-white stroke-2" />
                        <circle cx="300" cy="97" r="4" fill="#e11d48" className="stroke-white stroke-2" />
                        <circle cx="400" cy="60" r="4" fill="#e11d48" className="stroke-white stroke-2" />
                        <circle cx="500" cy="80" r="4" fill="#e11d48" className="stroke-white stroke-2" />
                        <circle cx="600" cy="50" r="4" fill="#e11d48" className="stroke-white stroke-2" />
                    </svg>
                </div>
            </div>

            {/* Legenda do eixo X (Datas) */}
            <div className="flex justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
                <span>09/09</span>
                <span>10/09</span>
                <span>11/09</span>
                <span>12/09</span>
                <span>13/09</span>
                <span>14/09</span>
                <span>15/09</span>
            </div>
        </div>
    )
}