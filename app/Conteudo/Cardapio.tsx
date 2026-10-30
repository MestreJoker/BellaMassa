"use client";

import { useEffect, useMemo, useState } from "react";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBolt,
    faBoxesPacking,
    faCheck,
    faChevronRight,
    faCircleDot,
    faEdit,
    faGlassWater,
    faIceCream,
    faPizzaSlice,
    faPlus,
    faPowerOff,
    faSearch,
    faStar,
    faStore,
    faTruck,
} from "@fortawesome/free-solid-svg-icons";

interface ItemCardapioJson {
    idItem: number;
    idCategoria: number;
    nome: string;
    descricao: string;
    preco: number;
    imagem: string;
    ativo?: boolean;
}

const categorias: Array<{ id: number | "Todos"; nome: string; icone?: typeof faPizzaSlice }> = [
    { id: "Todos", nome: "Todos" },
    { id: 1, nome: "Pizzas", icone: faPizzaSlice },
    { id: 2, nome: "Bebidas", icone: faGlassWater },
    { id: 3, nome: "Sobremesas", icone: faIceCream },
    { id: 4, nome: "Bordas", icone: faCircleDot },
    { id: 5, nome: "Adicionais", icone: faPlus },
];

const nomeCategorias: Record<number, string> = {
    1: "Pizzas",
    2: "Bebidas",
    3: "Sobremesas",
    4: "Bordas",
    5: "Adicionais",
};

function obterNomeCategoria(idCategoria: number, categoriasExtras: string[]) {
    return nomeCategorias[idCategoria] ?? categoriasExtras[idCategoria - 6] ?? "Outros";
}

export default function Cardapio() {
    const [itens, setItens] = useState<ItemCardapioJson[]>([]);
    const [categoriaAtiva, setCategoriaAtiva] = useState<number | "Todos">("Todos");
    const [busca, setBusca] = useState("");
    const [produtoSelecionadoId, setProdutoSelecionadoId] = useState<number | null>(null);
    const [categoriasExtras, setCategoriasExtras] = useState<string[]>([]);
    const categoriasExibidas: typeof categorias = [
        ...categorias,
        ...categoriasExtras.map((nome, index) => ({ id: index + 6, nome })),
    ];

    useEffect(() => {
        async function carregarCardapio() {
            try {
                const response = await Axios.get<ItemCardapioJson[]>("/json/cardapio.json");
                const itensSalvos = localStorage.getItem("bella-massa-cardapio");
                const categoriasSalvas = localStorage.getItem("bella-massa-categorias");
                let itensCarregados = response.data;

                if (itensSalvos) {
                    try {
                        itensCarregados = JSON.parse(itensSalvos) as ItemCardapioJson[];
                    } catch {
                        localStorage.removeItem("bella-massa-cardapio");
                    }
                }

                if (categoriasSalvas) {
                    try {
                        setCategoriasExtras(JSON.parse(categoriasSalvas) as string[]);
                    } catch {
                        localStorage.removeItem("bella-massa-categorias");
                    }
                }

                setItens(itensCarregados);
                setProdutoSelecionadoId(itensCarregados[0]?.idItem ?? null);
            } catch (erro) {
                console.log(erro);
            }
        }

        carregarCardapio();
    }, []);

    const itensFiltrados = useMemo(() => {
        const termo = busca.trim().toLowerCase();

        return itens.filter((item) => {
            const correspondeCategoria = categoriaAtiva === "Todos" || item.idCategoria === categoriaAtiva;
            const correspondeBusca =
                !termo ||
                item.nome.toLowerCase().includes(termo) ||
                item.descricao.toLowerCase().includes(termo) ||
                obterNomeCategoria(item.idCategoria, categoriasExtras).toLowerCase().includes(termo);

            return correspondeCategoria && correspondeBusca;
        });
    }, [itens, categoriaAtiva, busca, categoriasExtras]);

    const produtoSelecionado = itensFiltrados.find((item) => item.idItem === produtoSelecionadoId) ?? itensFiltrados[0] ?? null;

    function atualizarProduto(idItem: number, alteracoes: Partial<ItemCardapioJson>) {
        const itensAtualizados = itens.map((item) => item.idItem === idItem ? { ...item, ...alteracoes } : item);
        setItens(itensAtualizados);
        localStorage.setItem("bella-massa-cardapio", JSON.stringify(itensAtualizados));
    }

    function editarPreco() {
        if (!produtoSelecionado) return;
        const resposta = window.prompt("Novo preço do produto", produtoSelecionado.preco.toFixed(2).replace(".", ","));
        if (resposta === null) return;

        const novoPreco = Number(resposta.trim().replace(",", "."));
        if (!Number.isFinite(novoPreco) || novoPreco <= 0) {
            window.alert("Digite um preço maior que zero.");
            return;
        }

        atualizarProduto(produtoSelecionado.idItem, { preco: novoPreco });
    }

    function alternarDisponibilidade() {
        if (produtoSelecionado) atualizarProduto(produtoSelecionado.idItem, { ativo: produtoSelecionado.ativo === false });
    }

    function adicionarCategoria() {
        const nome = window.prompt("Nome da nova categoria")?.trim();
        if (!nome || categoriasExtras.some((categoria) => categoria.toLowerCase() === nome.toLowerCase())) return;

        const categoriasAtualizadas = [...categoriasExtras, nome];
        setCategoriasExtras(categoriasAtualizadas);
        localStorage.setItem("bella-massa-categorias", JSON.stringify(categoriasAtualizadas));
    }

    const produtosAtivos = itens.filter((item) => item.ativo !== false).length;
    const destaques = itens.filter((item) => item.idCategoria === 1).length;
    const totalEstoque = itens.length;

    return (
        <div className="flex min-w-0 flex-col gap-4 xl:flex-row">
            <section className="min-w-0 flex-1">
                <div className="relative h-40 w-full overflow-hidden rounded-[18px] bg-[#12161c] shadow-[0_12px_30px_rgba(15,23,42,0.18)] sm:h-44">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: `
                                linear-gradient(to right, rgba(14,17,22,0.97) 0%, rgba(14,17,22,0.9) 26%, rgba(14,17,22,0.74) 42%, rgba(14,17,22,0.18) 70%, rgba(14,17,22,0) 100%),
                                url('/images/pizzaBackground.jpg')
                            `,
                        }}
                    />

                    <div className="relative z-10 flex h-full flex-col justify-center px-4 text-white sm:px-7">
                        <h1 className="mb-2 text-2xl font-black tracking-tight sm:text-[2.2rem]">Catálogo</h1>
                        <p className="max-w-lg text-sm leading-relaxed text-slate-200 sm:text-base">
                            Gerencie itens do cardápio, preços, disponibilidade e destaques da pizzaria.
                        </p>
                    </div>
                </div>

                <div className="mt-4 rounded-[18px] border border-[#e9edf2] bg-white p-3 shadow-[0_8px_25px_rgba(15,23,42,0.05)] sm:p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2">
                            {categoriasExibidas.map((categoria) => {
                                const categoriaAtual: number | "Todos" = categoria.id;
                                const selecionada = categoriaAtiva === categoriaAtual;

                                return (
                                    <button
                                        key={String(categoria.id)}
                                        type="button"
                                        onClick={() => setCategoriaAtiva(categoriaAtual)}
                                        className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                                            selecionada
                                                ? "border-[#d92626] bg-[#d92626] text-white shadow-sm"
                                                : "border-[#e8edf3] bg-[#f7f9fc] text-[#1d2733] hover:bg-[#eef2f7]"
                                        }`}
                                    >
                                        {categoria.id !== "Todos" && (
                                            <FontAwesomeIcon
                                                icon={("icone" in categoria ? categoria.icone : undefined) ?? faPizzaSlice}
                                                className="text-base"
                                            />
                                        )}
                                        {categoria.nome}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="relative w-full lg:max-w-80">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                <FontAwesomeIcon icon={faSearch} className="text-xs" />
                            </span>
                            <input
                                type="text"
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                placeholder="Buscar produto..."
                                className="w-full rounded-xl border border-[#dfe6ef] bg-[#f8fafc] py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-[#c9d5e7]"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
                    {itensFiltrados.map((produto) => (
                        <button
                            type="button"
                            key={produto.idItem}
                            onClick={() => setProdutoSelecionadoId(produto.idItem)}
                            className={`overflow-hidden rounded-[18px] border bg-white text-left shadow-[0_8px_22px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)] ${
                                produtoSelecionado?.idItem === produto.idItem
                                    ? "border-[#d92626] ring-2 ring-[#ffd7d7]"
                                    : "border-[#edf1f7]"
                            }`}
                        >
                            <div
                                className="relative h-36 overflow-hidden bg-slate-100"
                                style={{
                                    backgroundImage: `
                                        linear-gradient(to bottom, rgba(9, 12, 18, 0.06), rgba(9, 12, 18, 0.22)),
                                        url('/images/pizzaBackground.jpg')
                                    `,
                                    backgroundPosition: "center",
                                    backgroundSize: "cover",
                                }}
                            >
                                {produto.idCategoria === 1 && (
                                    <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-[#fff7d6] px-2 py-1 text-[10px] font-bold text-[#8a5a00]">
                                        <FontAwesomeIcon icon={faStar} className="text-[10px]" />
                                        Destaque
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col gap-3 p-3 sm:p-4">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h2 className="text-lg font-bold text-[#111827]">{produto.nome}</h2>
                                        <p className="mt-1 text-xs text-slate-500">{obterNomeCategoria(produto.idCategoria, categoriasExtras)}</p>
                                    </div>
                                    <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold ${produto.ativo === false ? "bg-slate-100 text-slate-600" : "bg-emerald-100 text-emerald-700"}`}>
                                        {produto.ativo === false ? "Inativo" : "Ativo"}
                                    </span>
                                </div>

                                <p className="text-xs leading-relaxed text-[#64748b]">{produto.descricao}</p>

                                <div className="flex items-center justify-between gap-3 pt-2">
                                    <span className="text-lg font-black text-[#101820]">
                                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(produto.preco)}
                                    </span>
                                    <span className="text-xs font-semibold text-slate-500">Código: {produto.idItem}</span>
                                </div>
                            </div>
                        </button>
                    ))}

                    {itensFiltrados.length === 0 && (
                        <div className="col-span-full rounded-[18px] border border-dashed border-[#dfe6ef] bg-white p-8 text-center text-sm text-slate-500">
                            Nenhum item encontrado para essa busca.
                        </div>
                    )}
                </div>
            </section>

            <aside className="w-full rounded-[18px] border border-[#e9edf2] bg-[#f4f6fa] p-3 shadow-[0_8px_25px_rgba(15,23,42,0.05)] xl:w-85 xl:shrink-0">
                <div className="flex items-center justify-between gap-3 border-b border-[#dfe6ef] pb-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0f4f9] text-[#1d2733]">
                            <FontAwesomeIcon icon={faStore} className="text-lg" />
                        </div>
                        <div>
                            <p className="text-xl font-black text-[#111827]">Detalhes do item</p>
                        </div>
                    </div>
                    <button type="button" onClick={editarPreco} aria-label="Editar preço do produto" className="rounded-lg p-2 text-[#475569] transition-colors hover:bg-white/80">
                        <FontAwesomeIcon icon={faEdit} className="text-base" />
                    </button>
                </div>

                {produtoSelecionado && (
                    <>
                        <div className="mt-4 rounded-[18px] bg-white p-3 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm text-slate-500">Produto selecionado</p>
                                    <h3 className="mt-1 text-2xl font-black text-[#101820]">{produtoSelecionado.nome}</h3>
                                </div>
                                <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold ${produtoSelecionado.ativo === false ? "bg-slate-100 text-slate-600" : "bg-emerald-100 text-emerald-700"}`}>
                                    {produtoSelecionado.ativo === false ? "Inativo" : "Ativo"}
                                </span>
                            </div>

                            <div className="mt-4 h-28 rounded-2xl bg-slate-100" style={{ backgroundImage: `linear-gradient(to bottom, rgba(9, 12, 18, 0.06), rgba(9, 12, 18, 0.22)), url('/images/pizzaBackground.jpg')`, backgroundPosition: "center", backgroundSize: "cover" }} />

                            <div className="mt-4 space-y-2 text-sm text-slate-600">
                                <div className="flex items-center justify-between">
                                    <span>Categoria</span>
                                    <span className="font-bold text-slate-800">{obterNomeCategoria(produtoSelecionado.idCategoria, categoriasExtras)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Preço</span>
                                    <span className="font-bold text-slate-800">
                                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(produtoSelecionado.preco)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Código</span>
                                    <span className="font-bold text-slate-800">{produtoSelecionado.idItem}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Destaque</span>
                                    <span className="font-bold text-slate-800">{produtoSelecionado.idCategoria === 1 ? "Sim" : "Não"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 rounded-[18px] bg-white p-3 shadow-sm">
                            <p className="text-sm font-bold text-[#1d2733]">Descrição</p>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600">{produtoSelecionado.descricao}</p>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={editarPreco}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d92626] px-3 py-3 text-sm font-bold text-white shadow-[0_10px_18px_rgba(217,38,38,0.25)]"
                            >
                                <FontAwesomeIcon icon={faEdit} className="text-sm" />
                                Editar
                            </button>
                            <button
                                type="button"
                                onClick={alternarDisponibilidade}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dbe2eb] bg-white px-3 py-3 text-sm font-bold text-[#1d2733]"
                            >
                                <FontAwesomeIcon icon={faPowerOff} className="text-sm" />
                                {produtoSelecionado.ativo === false ? "Ativar" : "Inativar"}
                            </button>
                        </div>
                    </>
                )}

                <div className="mt-4 space-y-3 rounded-[18px] bg-white p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#1d2733]">Resumo do catálogo</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-xl bg-[#ebf9f0] p-3">
                            <div className="flex items-center gap-2 text-emerald-700">
                                <FontAwesomeIcon icon={faCheck} className="text-xs" />
                                <span className="font-bold">Ativos</span>
                            </div>
                            <p className="mt-2 text-2xl font-black text-[#101820]">{produtosAtivos}</p>
                        </div>
                        <div className="rounded-xl bg-[#fff7d6] p-3">
                            <div className="flex items-center gap-2 text-amber-700">
                                <FontAwesomeIcon icon={faBolt} className="text-xs" />
                                <span className="font-bold">Destaques</span>
                            </div>
                            <p className="mt-2 text-2xl font-black text-[#101820]">{destaques}</p>
                        </div>
                        <div className="rounded-xl bg-[#eaf3ff] p-3">
                            <div className="flex items-center gap-2 text-blue-700">
                                <FontAwesomeIcon icon={faBoxesPacking} className="text-xs" />
                                <span className="font-bold">Estoque</span>
                            </div>
                            <p className="mt-2 text-2xl font-black text-[#101820]">{totalEstoque}</p>
                        </div>
                        <div className="rounded-xl bg-[#f6eaf8] p-3">
                            <div className="flex items-center gap-2 text-violet-700">
                                <FontAwesomeIcon icon={faTruck} className="text-xs" />
                                <span className="font-bold">Entrega</span>
                            </div>
                            <p className="mt-2 text-2xl font-black text-[#101820]">24 min</p>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={adicionarCategoria}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#dfe6ef] bg-[#e5e7eb] px-3 py-3 text-sm font-bold text-[#6b7280]"
                >
                    <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
                    Nova categoria
                </button>
            </aside>
        </div>
    );
}