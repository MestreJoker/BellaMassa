interface GraficoPedidosPorTipoProps {
    entregas: number
    retiradas: number
    balcao: number
}

export default function GraficoPedidosPorTipo({ entregas, retiradas, balcao }: GraficoPedidosPorTipoProps) {
    const total = entregas + retiradas + balcao
    const percentualEntrega = total ? (entregas / total) * 100 : 0
    const percentualRetirada = total ? (retiradas / total) * 100 : 0
    const fimRetirada = percentualEntrega + percentualRetirada
    const grafico = total
        ? `conic-gradient(#f43f5e 0% ${percentualEntrega}%, #eab308 ${percentualEntrega}% ${fimRetirada}%, #3b82f6 ${fimRetirada}% 100%)`
        : "#e2e8f0"

    return (
        <div className="flex min-w-0 flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h3 className="text-base font-bold text-slate-800 mb-4">Pedidos por tipo</h3>

            <div className="my-2 flex min-w-0 flex-wrap items-center justify-center gap-4">
                {/* Gráfico circular simulado (Donut Chart) */}
                <div className="relative flex items-center justify-center">
                    <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-10 border-slate-100 sm:size-28">
                        {/* Simulação visual dos percentuais com conic-gradient */}
                        <div 
                            className="absolute inset-0 rounded-full"
                            style={{
                                background: grafico
                            }}
                        />
                        {/* Círculo interno para criar o efeito donut */}
                        <div className="absolute inset-2 flex flex-col items-center justify-center rounded-full bg-white">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
                            <span className="text-lg font-extrabold text-slate-800">{total}</span>
                        </div>
                    </div>
                </div>

                {/* Legendas detalhadas */}
                <div className="flex min-w-35 flex-1 flex-col gap-2.5 text-xs">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span>
                            <span className="text-slate-600 font-medium">Entrega</span>
                        </div>
                        <span className="font-semibold text-slate-800">{total ? Math.round((entregas / total) * 100) : 0}% <span className="text-slate-400 font-normal">({entregas})</span></span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                            <span className="text-slate-600 font-medium">Retirada</span>
                        </div>
                        <span className="font-semibold text-slate-800">{total ? Math.round((retiradas / total) * 100) : 0}% <span className="text-slate-400 font-normal">({retiradas})</span></span>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span>
                            <span className="text-slate-600 font-medium">Balcão</span>
                        </div>
                        <span className="font-semibold text-slate-800">{total ? Math.round((balcao / total) * 100) : 0}% <span className="text-slate-400 font-normal">({balcao})</span></span>
                    </div>
                </div>
            </div>
        </div>
    )
}