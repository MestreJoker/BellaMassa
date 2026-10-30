import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTruck, faStore, faQrcode, faCreditCard, faMoneyBillWave, faCheck } from "@fortawesome/free-solid-svg-icons"

interface CheckoutProps {
    onConfirmarPedido: (dados: { tipoEntrega: string; formaPagamento: string }) => void
    onTipoEntregaChange?: (tipoEntrega: string) => void
}

export default function CheckoutPedido({ onConfirmarPedido, onTipoEntregaChange }: CheckoutProps) {
    const [tipoEntrega, setTipoEntrega] = useState("")
    const [formaPagamento, setFormaPagamento] = useState("")

    return (
        <div className="mt-4 flex w-full min-w-0 flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm font-sans sm:gap-5 sm:p-6">
            {/* Seção de Entrega ou Retirada */}
            <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Entrega ou Retirada</span>
                <div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            setTipoEntrega("Entrega")
                            onTipoEntregaChange?.("Entrega")
                        }}
                        className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-semibold transition-all ${
                            tipoEntrega === "Entrega"
                                ? "border-rose-600 bg-rose-50/20 text-rose-700 shadow-sm"
                                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                    >
                        <FontAwesomeIcon icon={faTruck} className="text-sm" />
                        Entrega
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setTipoEntrega("Retirada")
                            onTipoEntregaChange?.("Retirada")
                        }}
                        className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-semibold transition-all ${
                            tipoEntrega === "Retirada"
                                ? "border-rose-600 bg-rose-50/20 text-rose-700 shadow-sm"
                                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                    >
                        <FontAwesomeIcon icon={faStore} className="text-sm" />
                        Retirada
                    </button>
                </div>
            </div>

            {/* Seção de Pagamento */}
            <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Pagamento</span>
                <div className="grid min-w-0 grid-cols-3 gap-2 sm:gap-3">
                    {[
                        { nome: "Pix", icone: faQrcode },
                        { nome: "Cartão", icone: faCreditCard },
                        { nome: "Dinheiro", icone: faMoneyBillWave },
                    ].map((pag) => {
                        const selecionado = formaPagamento === pag.nome
                        return (
                            <button
                                key={pag.nome}
                                type="button"
                                onClick={() => setFormaPagamento(pag.nome)}
                                className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-semibold transition-all ${
                                    selecionado
                                        ? "border-rose-600 bg-rose-50/20 text-rose-700 shadow-sm"
                                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                }`}
                            >
                                <FontAwesomeIcon icon={pag.icone} className="text-base" />
                                <span>{pag.nome}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Botão de Confirmação do Pedido */}
            <button
                type="button"
                onClick={() => onConfirmarPedido({ tipoEntrega, formaPagamento })}
                disabled={!tipoEntrega || !formaPagamento}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 py-3.5 text-xs font-bold text-white shadow-md transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-45"
            >
                <FontAwesomeIcon icon={faCheck} className="text-sm" />
                Confirmar Pedido
            </button>
        </div>
    )
}