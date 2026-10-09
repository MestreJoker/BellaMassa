import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCoins, faArrowUp } from "@fortawesome/free-solid-svg-icons"

export default function CardReceitaDia() {
    return (
        <div className="flex min-w-0 flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            {/* Cabeçalho */}
            <div className="flex items-center gap-3 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <FontAwesomeIcon icon={faCoins} className="text-sm" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Receita do dia</h3>
            </div>

            {/* Valor e Estatística */}
            <div className="flex items-end justify-between">
                <div>
                    <span className="text-xl font-black text-slate-900 sm:text-2xl">R$ 682,40</span>
                    <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-emerald-600">
                        <FontAwesomeIcon icon={faArrowUp} className="text-[10px]" />
                        <span>15% <span className="font-normal text-slate-500">em relação a ontem</span></span>
                    </div>
                </div>

                {/* Ícone decorativo de moedas à direita */}
                <div className="text-slate-200 opacity-60">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </div>
        </div>
    )
}