"use client"

import { useEffect, useMemo, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChartLine } from "@fortawesome/free-solid-svg-icons"
import { obterPedidos, type PedidoLocal } from "../lib/pedidos"

export default function GraficoMovimentoPedidos() {
    const [periodo, setPeriodo] = useState("Pedidos")
    const [pedidos, setPedidos] = useState<PedidoLocal[]>([])

    useEffect(() => {
        async function carregarDados() {
            try {
                setPedidos(await obterPedidos())
            } catch (erro) {
                console.log(erro)
            }
        }

        carregarDados()
    }, [])

    const dadosGrafico = useMemo(() => {
        const ultimos7Dias = Array.from({ length: 7 }, (_, index) => {
            const data = new Date()
            data.setDate(data.getDate() - (6 - index))
            return {
                label: data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
                valor: 0,
            }
        })

        pedidos.forEach((pedido) => {
            const dataPedido = new Date(pedido.dataPedido)
            const hoje = new Date()
            const diferencaDias = Math.floor((hoje.getTime() - dataPedido.getTime()) / (1000 * 60 * 60 * 24))

            if (diferencaDias >= 0 && diferencaDias <= 6) {
                const indice = 6 - diferencaDias
                const valorAtual = ultimos7Dias[indice]?.valor ?? 0
                ultimos7Dias[indice].valor = valorAtual + (periodo === "Faturamento" ? Number(pedido.total || 0) : 1)
            }
        })

        return ultimos7Dias
    }, [pedidos, periodo])

    const maiorValor = Math.max(...dadosGrafico.map((item) => item.valor), 1)

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
                    <div className="border-b border-slate-200 w-full text-[10px] text-slate-400 text-right pr-2">{Math.round(maiorValor)}</div>
                    <div className="border-b border-slate-200 w-full text-[10px] text-slate-400 text-right pr-2">{Math.round(maiorValor * 0.75)}</div>
                    <div className="border-b border-slate-200 w-full text-[10px] text-slate-400 text-right pr-2">{Math.round(maiorValor * 0.5)}</div>
                    <div className="border-b border-slate-200 w-full text-[10px] text-slate-400 text-right pr-2">{Math.round(maiorValor * 0.25)}</div>
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
                            d={dadosGrafico
                                .map((item, index) => {
                                    const x = (index / (dadosGrafico.length - 1)) * 600
                                    const y = 150 - (item.valor / maiorValor) * 120 - 15
                                    return `${index === 0 ? "M" : "L"} ${x} ${y}`
                                })
                                .join(" ") + " L 600 150 L 0 150 Z"}
                            fill="url(#gradGrafico)"
                        />

                        {/* Linha principal vermelha */}
                        <path
                            d={dadosGrafico
                                .map((item, index) => {
                                    const x = (index / (dadosGrafico.length - 1)) * 600
                                    const y = 150 - (item.valor / maiorValor) * 120 - 15
                                    return `${index === 0 ? "M" : "L"} ${x} ${y}`
                                })
                                .join(" ")}
                            fill="none"
                            stroke="#e11d48"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        />

                        {/* Pontos de marcação nos vértices */}
                        {dadosGrafico.map((item, index) => {
                            const x = (index / (dadosGrafico.length - 1)) * 600
                            const y = 150 - (item.valor / maiorValor) * 120 - 15
                            return <circle key={item.label} cx={x} cy={y} r="4" fill="#e11d48" className="stroke-white stroke-2" />
                        })}
                    </svg>
                </div>
            </div>

            {/* Legenda do eixo X (Datas) */}
            <div className="mt-3 flex justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-400">
                {dadosGrafico.map((item) => (
                    <span key={item.label}>{item.label}</span>
                ))}
            </div>
        </div>
    )
}