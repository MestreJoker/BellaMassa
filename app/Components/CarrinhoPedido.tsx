import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faShoppingCart, faTrash, faPlus, faMinus, faTag } from "@fortawesome/free-solid-svg-icons"

interface ItemCarrinho {
    id: number | string
    nome: string
    detalhes?: string
    quantidade: number
    precoUnitario: number
}

interface CarrinhoProps {
    itens: ItemCarrinho[]
    onAlterarQuantidade: (id: number | string, delta: number) => void
    onRemoverItem: (id: number | string) => void
    onLimparCarrinho: () => void
    subtotal: number
    taxaEntrega: number
    desconto: number
}

export default function CarrinhoPedido({
    itens,
    onAlterarQuantidade,
    onRemoverItem,
    onLimparCarrinho,
    subtotal,
    taxaEntrega,
    desconto
}: CarrinhoProps) {
    const [codigoCupom, setCodigoCupom] = useState("")
    const totalFinal = subtotal + taxaEntrega - desconto

    return (
        <div className="flex w-full min-w-0 flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm font-sans sm:gap-5 sm:p-6">
            {/* Cabeçalho */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faShoppingCart} className="text-slate-700 text-sm" />
                    <h3 className="text-base font-bold text-slate-800">Seu Pedido</h3>
                </div>
                {itens.length > 0 && (
                    <button
                        type="button"
                        onClick={onLimparCarrinho}
                        className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
                    >
                        <FontAwesomeIcon icon={faTrash} className="text-[10px]" />
                        Limpar
                    </button>
                )}
            </div>

            {/* Lista de Itens no Carrinho */}
            <div className="flex flex-col gap-4 max-h-72 overflow-y-auto">
                {itens.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                        O carrinho está vazio. Adicione itens ao lado.
                    </div>
                ) : (
                    itens.map((item) => (
                        <div key={item.id} className="flex min-w-0 items-start justify-between gap-3 border-b border-slate-100 pb-3 text-xs">
                            <div className="flex min-w-0 flex-col gap-1 pr-2">
                                <span className="font-bold text-slate-800">{item.nome}</span>
                                {item.detalhes && (
                                    <span className="wrap-break-word text-[11px] leading-tight text-slate-400">{item.detalhes}</span>
                                )}
                                <div className="flex items-center gap-3 mt-1.5">
                                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                                        <button
                                            type="button"
                                            onClick={() => onAlterarQuantidade(item.id, -1)}
                                            className="px-2 py-1 text-slate-500 hover:bg-slate-200 transition-colors"
                                        >
                                            <FontAwesomeIcon icon={faMinus} className="text-[9px]" />
                                        </button>
                                        <span className="px-2.5 font-semibold text-slate-700">{item.quantidade}</span>
                                        <button
                                            type="button"
                                            onClick={() => onAlterarQuantidade(item.id, 1)}
                                            className="px-2 py-1 text-slate-500 hover:bg-slate-200 transition-colors"
                                        >
                                            <FontAwesomeIcon icon={faPlus} className="text-[9px]" />
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => onRemoverItem(item.id)}
                                        className="text-slate-400 hover:text-rose-600 transition-colors"
                                    >
                                        <FontAwesomeIcon icon={faTrash} className="text-xs" />
                                    </button>
                                </div>
                            </div>
                            <span className="shrink-0 text-right font-bold text-slate-900">
                                R$ {(item.precoUnitario * item.quantidade).toFixed(2).replace(".", ",")}
                            </span>
                        </div>
                    ))
                )}
            </div>

            {/* Input de Código de Desconto */}
            <div className="flex min-w-0 items-center gap-2 pt-2">
                <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <FontAwesomeIcon icon={faTag} className="text-xs" />
                    </span>
                    <input
                        type="text"
                        placeholder="Código de desconto"
                        value={codigoCupom}
                        onChange={(e) => setCodigoCupom(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-700 outline-none focus:border-slate-400"
                    />
                </div>
                <button
                    type="button"
                    className="rounded-lg bg-blue-50 text-blue-600 font-semibold px-4 py-2 text-xs hover:bg-blue-100 transition-colors"
                >
                    Aplicar
                </button>
            </div>

            {/* Resumo de Valores */}
            <div className="flex flex-col gap-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-800">R$ {subtotal.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between">
                    <span>Taxa de entrega</span>
                    <span className="font-semibold text-slate-800">R$ {taxaEntrega.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between text-rose-600">
                    <span>Desconto</span>
                    <span className="font-semibold">- R$ {desconto.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-sm font-black text-slate-900">
                    <span>Total</span>
                    <span className="text-lg text-rose-600">R$ {totalFinal.toFixed(2).replace(".", ",")}</span>
                </div>
            </div>
        </div>
    )
}