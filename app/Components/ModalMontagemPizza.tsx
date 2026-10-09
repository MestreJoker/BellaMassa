import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import Axios from "axios"

interface TamanhoProps {
    idTamanho: number
    nome: string
    cm: number
    precoBase: number
}

interface ItemCardapioProps {
    idItem: number
    idCategoria: number
    nome: string
    descricao: string
    preco: number
}

interface ModalMontagemPizzaProps {
    onAdicionarPizzaPersonalizada: (dados: {
        tamanho: TamanhoProps
        sabores: string[]
        borda: string
        adicionais: string[]
        precoTotal: number
    }) => void
}

export default function ModalMontagemPizza({ onAdicionarPizzaPersonalizada }: ModalMontagemPizzaProps) {
    const [tamanhos, setTamanhos] = useState<TamanhoProps[]>([])
    const [tamanhoSelecionado, setTamanhoSelecionado] = useState<TamanhoProps | null>(null)
    const [saboresCardapio, setSaboresCardapio] = useState<ItemCardapioProps[]>([])
    const [saboresSelecionados, setSaboresSelecionados] = useState<string[]>(["Calabresa"])
    const [bordaSelecionada, setBordaSelecionada] = useState("Catupiry (+ R$ 8,00)")
    const [adicionaisSelecionados, setAdicionaisSelecionados] = useState<string[]>(["Bacon"])
    const [termoBuscaSabor, setTermoBuscaSabor] = useState("")

    useEffect(() => {
        async function carregarDados() {
            try {
                const [resTamanhos, resCardapio] = await Promise.all([
                    Axios.get<TamanhoProps[]>("/json/tamanhos.json"),
                    Axios.get<ItemCardapioProps[]>("/json/cardapio.json")
                ])
                setTamanhos(resTamanhos.data)
                if (resTamanhos.data.length > 1) {
                    setTamanhoSelecionado(resTamanhos.data[1]) // Média por padrão
                }
                // Filtrar apenas pizzas (idCategoria === 1)
                const pizzas = resCardapio.data.filter(item => item.idCategoria === 1)
                setSaboresCardapio(pizzas)
            } catch (erro) {
                console.log(erro)
            }
        }
        carregarDados()
    }, [])

    function alternarSabor(nomeSabor: string) {
        if (saboresSelecionados.includes(nomeSabor)) {
            if (saboresSelecionados.length > 1) {
                setSaboresSelecionados(saboresSelecionados.filter(s => s !== nomeSabor))
            }
        } else {
            if (saboresSelecionados.length < 2) {
                setSaboresSelecionados([...saboresSelecionados, nomeSabor])
            }
        }
    }

    function alternarAdicional(nomeAdicional: string) {
        if (adicionaisSelecionados.includes(nomeAdicional)) {
            setAdicionaisSelecionados(adicionaisSelecionados.filter(a => a !== nomeAdicional))
        } else {
            setAdicionaisSelecionados([...adicionaisSelecionados, nomeAdicional])
        }
    }

    const saboresFiltrados = saboresCardapio.filter(s => 
        s.nome.toLowerCase().includes(termoBuscaSabor.toLowerCase())
    )

    return (
        <div className="flex w-full min-w-0 flex-col gap-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm font-sans sm:gap-6 sm:p-6">
            <div>
                <h3 className="text-base font-bold text-slate-800 mb-1">Montagem da Pizza</h3>
                <p className="text-xs text-slate-400">Personalize os tamanhos, sabores e adicionais.</p>
            </div>

            {/* Seleção de Tamanho */}
            <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Tamanho</span>
                <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                    {tamanhos.map((tam) => {
                        const selecionado = tamanhoSelecionado?.idTamanho === tam.idTamanho
                        return (
                            <button
                                key={tam.idTamanho}
                                type="button"
                                onClick={() => setTamanhoSelecionado(tam)}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                                    selecionado
                                        ? "border-rose-600 bg-rose-50/20 text-rose-700 shadow-sm"
                                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                }`}
                            >
                                <span className="text-xs font-bold">{tam.nome}</span>
                                <span className="text-[10px] text-slate-400 mt-0.5">({tam.cm}cm)</span>
                                <span className="text-xs font-semibold mt-2">R$ {tam.precoBase.toFixed(2).replace(".", ",")}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Seleção de Sabores (até 2) */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Sabores (até 2)</span>
                    <span className="text-[11px] text-slate-400">{saboresSelecionados.length}/2 selecionados</span>
                </div>

                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="Buscar sabor..."
                        value={termoBuscaSabor}
                        onChange={(e) => setTermoBuscaSabor(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs text-slate-700 outline-none focus:border-slate-400 focus:bg-white mb-2"
                    />
                </div>

                <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl p-2">
                    {saboresFiltrados.map((sabor) => {
                        const marcado = saboresSelecionados.includes(sabor.nome)
                        return (
                            <div
                                key={sabor.idItem}
                                onClick={() => alternarSabor(sabor.nome)}
                                className="flex flex-wrap items-center justify-between gap-2 rounded-lg p-2.5 text-xs transition-colors hover:bg-slate-50"
                            >
                                <div className="flex items-center gap-2.5">
                                    <input
                                        type="checkbox"
                                        checked={marcado}
                                        onChange={() => {}}
                                        className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 h-4 w-4"
                                    />
                                    <span className={`font-medium ${marcado ? "text-slate-900 font-bold" : "text-slate-700"}`}>
                                        {sabor.nome}
                                    </span>
                                </div>
                                <span className="min-w-0 wrap-break-word text-[11px] text-slate-400">{sabor.descricao}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Borda */}
            <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Borda</span>
                <select
                    value={bordaSelecionada}
                    onChange={(e) => setBordaSelecionada(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-700 outline-none focus:border-slate-400"
                >
                    <option value="Catupiry (+ R$ 8,00)">Catupiry (+ R$ 8,00)</option>
                    <option value="Cheddar (+ R$ 8,00)">Cheddar (+ R$ 8,00)</option>
                    <option value="Chocolate (+ R$ 10,00)">Chocolate (+ R$ 10,00)</option>
                    <option value="Sem borda">Sem borda</option>
                </select>
            </div>

            {/* Adicionais */}
            <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Adicionais</span>
                <div className="flex flex-col gap-2">
                    {["Bacon (+ R$ 5,00)", "Cebola (+ R$ 2,00)", "Milho (+ R$ 2,00)"].map((adicional) => {
                        const marcado = adicionaisSelecionados.includes(adicional.split(" ")[0])
                        return (
                            <label key={adicional} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={marcado}
                                    onChange={() => alternarAdicional(adicional.split(" ")[0])}
                                    className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 h-4 w-4"
                                />
                                <span>{adicional}</span>
                            </label>
                        )
                    })}
                </div>
            </div>

            {/* Botão de Adicionar ao Pedido */}
            <button
                type="button"
                onClick={() => {
                    if (tamanhoSelecionado) {
                        onAdicionarPizzaPersonalizada({
                            tamanho: tamanhoSelecionado,
                            sabores: saboresSelecionados,
                            borda: bordaSelecionada,
                            adicionais: adicionaisSelecionados,
                            precoTotal: tamanhoSelecionado.precoBase + (bordaSelecionada.includes("R$") ? 8 : 0)
                        })
                    }
                }}
                className="w-full rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 text-xs flex items-center justify-center gap-2 transition-colors"
            >
                <FontAwesomeIcon icon={faPlus} className="text-xs" />
                Adicionar mais itens
            </button>
        </div>
    )
}