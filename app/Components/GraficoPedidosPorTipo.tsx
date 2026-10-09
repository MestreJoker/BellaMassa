export default function GraficoPedidosPorTipo() {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <h3 className="text-base font-bold text-slate-800 mb-4">Pedidos por tipo</h3>

            <div className="flex items-center justify-between my-2">
                {/* Gráfico circular simulado (Donut Chart) */}
                <div className="relative flex items-center justify-center">
                    <div className="h-28 w-28 rounded-full border-[10px] border-slate-100 flex items-center justify-center relative overflow-hidden">
                        {/* Simulação visual dos percentuais com conic-gradient */}
                        <div 
                            className="absolute inset-0 rounded-full"
                            style={{
                                background: `conic-gradient(#3b82f6 0% 17%, #eab308 17% 42%, #f43f5e 42% 100%)`
                            }}
                        />
                        {/* Círculo interno para criar o efeito donut */}
                        <div className="absolute inset-[8px] bg-white rounded-full flex flex-col items-center justify-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
                            <span className="text-lg font-extrabold text-slate-800">12</span>
                        </div>
                    </div>
                </div>

                {/* Legendas detalhadas */}
                <div className="flex flex-col gap-2.5 text-xs">
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span>
                            <span className="text-slate-600 font-medium">Entrega</span>
                        </div>
                        <span className="font-semibold text-slate-800">58% <span className="text-slate-400 font-normal">(7)</span></span>
                    </div>

                    <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                            <span className="text-slate-600 font-medium">Retirada</span>
                        </div>
                        <span className="font-semibold text-slate-800">25% <span className="text-slate-400 font-normal">(3)</span></span>
                    </div>

                    <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span>
                            <span className="text-slate-600 font-medium">Balcão</span>
                        </div>
                        <span className="font-semibold text-slate-800">17% <span className="text-slate-400 font-normal">(2)</span></span>
                    </div>
                </div>
            </div>
        </div>
    )
}