"use client"

import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPizzaSlice, faWineGlass, faIceCream, faCircleDot, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons"
import { obterCategorias, obterProdutos, type CategoriaLocal, type ProdutoLocal } from "../lib/database"

interface CatalogoProdutosProps {
    onAdicionarItem: (item: ProdutoLocal) => void
}

const iconesCategoria = [faPizzaSlice, faWineGlass, faIceCream, faCircleDot, faPlus]

export default function CatalogoProdutos({ onAdicionarItem }: CatalogoProdutosProps) {
    const [itens, setItens] = useState<ProdutoLocal[]>([])
    const [categorias, setCategorias] = useState<CategoriaLocal[]>([])
    const [categoriaAtiva, setCategoriaAtiva] = useState<number | null>(null)
    const [termoBusca, setTermoBusca] = useState("")
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState("")

    useEffect(() => {
        async function carregarCardapio() {
            try {
                const [categoriasBanco, produtosBanco] = await Promise.all([obterCategorias(), obterProdutos(false)])
                setCategorias(categoriasBanco)
                setItens(produtosBanco.filter((produto) => produto.ativo))
                setCategoriaAtiva(categoriasBanco[0]?.idCategoria ?? null)
            } catch (erroCarregamento) {
                console.error("Não foi possível carregar o catálogo do pedido.", erroCarregamento)
                setErro("Não foi possível carregar os produtos.")
            } finally {
                setCarregando(false)
            }
        }
        carregarCardapio()
    }, [])

    const itensFiltrados = itens.filter((item) => {
        const correspondeCategoria = item.idCategoria === categoriaAtiva
        const correspondeBusca = item.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
            item.descricao.toLowerCase().includes(termoBusca.toLowerCase())
        return correspondeCategoria && correspondeBusca
    })

    return (
        <div className="mt-4 flex w-full min-w-0 flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm font-sans sm:gap-5 sm:p-6">
            <div className="flex items-center gap-3 overflow-x-auto border-b border-slate-100 pb-1">
                {categorias.map((categoria, index) => (
                    <button
                        key={categoria.idCategoria}
                        type="button"
                        onClick={() => setCategoriaAtiva(categoria.idCategoria)}
                        className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-colors ${
                            categoriaAtiva === categoria.idCategoria
                                ? "bg-rose-600 text-white shadow-sm"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                    >
                        <FontAwesomeIcon icon={iconesCategoria[index] ?? faCircleDot} className="text-xs" />
                        {categoria.nome}
                    </button>
                ))}
            </div>

            <div className="relative w-full sm:w-64">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <FontAwesomeIcon icon={faSearch} className="text-xs" />
                </span>
                <input
                    type="text"
                    placeholder="Buscar produto..."
                    value={termoBusca}
                    onChange={(evento) => setTermoBusca(evento.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-700 outline-none focus:border-slate-400 focus:bg-white"
                />
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                {carregando ? (
                    <p className="col-span-full py-8 text-center text-xs text-slate-400">Carregando produtos...</p>
                ) : erro ? (
                    <p role="alert" className="col-span-full py-8 text-center text-xs text-red-700">{erro}</p>
                ) : itensFiltrados.length === 0 ? (
                    <div className="col-span-full py-8 text-center text-xs text-slate-400">Nenhum item encontrado nesta categoria.</div>
                ) : (
                    itensFiltrados.map((item) => (
                        <div key={item.idItem} className="flex min-w-0 flex-col justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:p-4">
                            <div>
                                <div className="mb-3 flex h-32 w-full items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                                    <span className="text-xs font-bold uppercase text-slate-400">{item.nome}</span>
                                </div>
                                <h4 className="mb-1 text-sm font-bold text-slate-800">{item.nome}</h4>
                                <p className="mb-4 line-clamp-2 text-xs text-slate-500">{item.descricao}</p>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                                <span className="text-sm font-extrabold text-slate-900">
                                    R$ {item.preco.toFixed(2).replace(".", ",")}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => onAdicionarItem(item)}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-rose-700"
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
