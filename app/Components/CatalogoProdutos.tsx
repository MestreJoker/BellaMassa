import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPizzaSlice, faWineGlass, faIceCream, faCircleDot, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons"
import Axios from "axios"

interface ItemCardapioProps {
    idItem: number
    idCategoria: number
    nome: string
    descricao: string
    preco: number
    imagem: string
}

interface CatalogoProdutosProps {
    onAdicionarItem: (item: ItemCardapioProps) => void
}

export default function CatalogoProdutos({ onAdicionarItem }: CatalogoProdutosProps) {
    const [itens, setItens] = useState<ItemCardapioProps[]>([])
    const [categoriaAtiva, setCategoriaAtiva] = useState(1) // 1: Pizzas, 2: Bebidas, etc.
    const [filtroTamanho, setFiltroTamanho] = useState("Todos")
    const [termoBusca, setTermoBusca] = useState("")

    useEffect(() => {
        async function carregarCardapio() {
            try {
                const response = await Axios.get<ItemCardapioProps[]>("/json/cardapio.json")
                setItens(response.data)
            } catch (erro) {
                console.log(erro)
            }
        }
        carregarCardapio()
    }, [])

    const categorias = [
        { id: 1, nome: "Pizzas", icone: faPizzaSlice },
        { id: 2, nome: "Bebidas", icone: faWineGlass },
        { id: 3, nome: "Sobremesas", icone: faIceCream },
        { id: 4, nome: "Adicionais", icone: faCircleDot },
    ]

    const tamanhosPizza = ["Todos", "Pequena", "Média", "Grande", "Gigante"]

    const itensFiltrados = itens.filter(item => {
        const correspondeCategoria = item.idCategoria === categoriaAtiva
        const correspondeBusca = item.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
            item.descricao.toLowerCase().includes(termoBusca.toLowerCase())
        return correspondeCategoria && correspondeBusca
    })

    return (
        <div className="mt-4 flex w-full min-w-0 flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm font-sans sm:gap-5 sm:p-6">
            {/* Abas de Categorias */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1 border-b border-slate-100">
                {categorias.map((cat) => (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategoriaAtiva(cat.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                            categoriaAtiva === cat.id
                                ? "bg-rose-600 text-white shadow-sm"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                    >
                        <FontAwesomeIcon icon={cat.icone} className="text-xs" />
                        {cat.nome}
                    </button>
                ))}
            </div>

            {/* Sub-filtros (Apenas para Pizzas: Todos, Pequena, Média, etc.) */}
            {categoriaAtiva === 1 && (
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-2 overflow-x-auto">
                        {tamanhosPizza.map((tam) => (
                            <button
                                key={tam}
                                type="button"
                                onClick={() => setFiltroTamanho(tam)}
                                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                                    filtroTamanho === tam
                                        ? "bg-slate-900 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                                {tam}
                            </button>
                        ))}
                    </div>

                    {/* Barra de pesquisa interna de sabores/produtos */}
                    <div className="relative w-full sm:w-64">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                            <FontAwesomeIcon icon={faSearch} className="text-xs" />
                        </span>
                        <input
                            type="text"
                            placeholder="Buscar sabor..."
                            value={termoBusca}
                            onChange={(e) => setTermoBusca(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-1.5 pl-9 pr-3 text-xs text-slate-700 outline-none focus:border-slate-400 focus:bg-white"
                        />
                    </div>
                </div>
            )}

            {/* Grid de Produtos */}
            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                {itensFiltrados.length === 0 ? (
                    <div className="col-span-full py-8 text-center text-xs text-slate-400">
                        Nenhum item encontrado nesta categoria.
                    </div>
                ) : (
                    itensFiltrados.map((item) => (
                        <div
                            key={item.idItem}
                            className="flex min-w-0 flex-col justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:p-4"
                        >
                            <div>
                                {/* Simulação da imagem do produto */}
                                <div className="h-32 w-full rounded-lg bg-slate-100 flex items-center justify-center mb-3 overflow-hidden">
                                    <span className="text-xs font-bold text-slate-400 uppercase">{item.nome}</span>
                                </div>
                                <h4 className="text-sm font-bold text-slate-800 mb-1">{item.nome}</h4>
                                <p className="text-xs text-slate-500 line-clamp-2 mb-4">{item.descricao}</p>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                <span className="text-sm font-extrabold text-slate-900">
                                    R$ {item.preco.toFixed(2).replace(".", ",")}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => onAdicionarItem(item)}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-rose-700 shadow-sm"
                                >
                                    <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
                                    Adicionar
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}