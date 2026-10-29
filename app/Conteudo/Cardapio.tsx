"use client";

import { useState } from "react";
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
    faStar,
    faStore,
    faTruck,
} from "@fortawesome/free-solid-svg-icons";

const categorias = [
    { nome: "Pizzas", icone: faPizzaSlice },
    { nome: "Bebidas", icone: faGlassWater },
    { nome: "Sobremesas", icone: faIceCream },
    { nome: "Bordas", icone: faCircleDot },
    { nome: "Adicionais", icone: faPlus },
];

const products = [
    {
        id: 1,
        nome: "Calabresa",
        categoria: "Pizzas",
        descricao: "Molho de tomate, mussarela, calabresa e orégano.",
        preco: "R$ 39,90",
        status: "Ativo",
        estoque: 18,
        destaque: true,
        cor: "bg-red-500",
    },
    {
        id: 2,
        nome: "Frango com Catupiry",
        categoria: "Pizzas",
        descricao: "Molho de tomate, frango desfiado, catupiry e orégano.",
        preco: "R$ 44,90",
        status: "Ativo",
        estoque: 12,
        destaque: true,
        cor: "bg-orange-500",
    },
    {
        id: 3,
        nome: "Portuguesa",
        categoria: "Pizzas",
        descricao: "Molho de tomate, mussarela, presunto, ovo, cebola, tomate e orégano.",
        preco: "R$ 42,90",
        status: "Ativo",
        estoque: 15,
        destaque: false,
        cor: "bg-yellow-500",
    },
    {
        id: 4,
        nome: "4 Queijos",
        categoria: "Pizzas",
        descricao: "Molho de tomate, mussarela, provolone, parmesão e orégano.",
        preco: "R$ 46,90",
        status: "Ativo",
        estoque: 10,
        destaque: true,
        cor: "bg-purple-500",
    },
    {
        id: 5,
        nome: "Vegetariana",
        categoria: "Pizzas",
        descricao: "Molho de tomate, mussarela, palmito, milho, ervilha e orégano.",
        preco: "R$ 41,90",
        status: "Ativo",
        estoque: 9,
        destaque: false,
        cor: "bg-emerald-500",
    },
    {
        id: 6,
        nome: "Coca-Cola 2L",
        categoria: "Bebidas",
        descricao: "Refrigerante em garrafa pet e 2 litros.",
        preco: "R$ 12,00",
        status: "Ativo",
        estoque: 21,
        destaque: false,
        cor: "bg-blue-500",
    },
    {
        id: 7,
        nome: "Borda Catupiry",
        categoria: "Bordas",
        descricao: "Borda recheada com catupiry original.",
        preco: "R$ 8,00",
        status: "Ativo",
        estoque: 14,
        destaque: false,
        cor: "bg-violet-500",
    },
    {
        id: 8,
        nome: "Bacon Adicional",
        categoria: "Adicionais",
        descricao: "Porção extra de bacon crocante.",
        preco: "R$ 5,00",
        status: "Sem estoque",
        estoque: 0,
        destaque: false,
        cor: "bg-amber-500",
    },
];

export default function Cardapio() {
    const [categoriaAtiva, setCategoriaAtiva] = useState("Pizzas");
    const [produtoSelecionado, setProdutoSelecionado] = useState(products[0]);

    const produtosFiltrados = products.filter((produto) => {
        if (categoriaAtiva === "Todos") return true;
        return produto.categoria === categoriaAtiva;
    });

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
                    <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2">
                        {["Todos", ...categorias.map((categoria) => categoria.nome)].map((categoria) => {
                            const categoriaAtual = categoria === "Todos" ? "Todos" : categoria;
                            const categoriaAtivaAtual = categoriaAtiva === categoriaAtual;

                            return (
                                <button
                                    key={categoria}
                                    type="button"
                                    onClick={() => setCategoriaAtiva(categoriaAtual)}
                                    className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                                        categoriaAtivaAtual
                                            ? "border-[#d92626] bg-[#d92626] text-white shadow-sm"
                                            : "border-[#e8edf3] bg-[#f7f9fc] text-[#1d2733] hover:bg-[#eef2f7]"
                                    }`}
                                >
                                    {categoria !== "Todos" && (
                                        <FontAwesomeIcon
                                            icon={
                                                categorias.find((item) => item.nome === categoria)?.icone ?? faPizzaSlice
                                            }
                                            className="text-base"
                                        />
                                    )}
                                    {categoria}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
                    {produtosFiltrados.map((produto) => (
                        <button
                            type="button"
                            key={produto.id}
                            onClick={() => setProdutoSelecionado(produto)}
                            className={`overflow-hidden rounded-[18px] border bg-white text-left shadow-[0_8px_22px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)] ${
                                produtoSelecionado.id === produto.id
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
                                {produto.destaque && (
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
                                        <p className="mt-1 text-xs text-slate-500">{produto.categoria}</p>
                                    </div>
                                    <span
                                        className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold ${
                                            produto.status === "Ativo"
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {produto.status}
                                    </span>
                                </div>

                                <p className="text-xs leading-relaxed text-[#64748b]">{produto.descricao}</p>

                                <div className="flex items-center justify-between gap-3 pt-2">
                                    <span className="text-lg font-black text-[#101820]">{produto.preco}</span>
                                    <span className="text-xs font-semibold text-slate-500">
                                        Estoque: {produto.estoque}
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}
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
                    <button type="button" className="rounded-lg p-2 text-[#475569] transition-colors hover:bg-white/80">
                        <FontAwesomeIcon icon={faEdit} className="text-base" />
                    </button>
                </div>

                <div className="mt-4 rounded-[18px] bg-white p-3 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-sm text-slate-500">Produto selecionado</p>
                            <h3 className="mt-1 text-2xl font-black text-[#101820]">{produtoSelecionado.nome}</h3>
                        </div>
                        <span
                            className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold ${
                                produtoSelecionado.status === "Ativo"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {produtoSelecionado.status}
                        </span>
                    </div>

                    <div className="mt-4 h-28 rounded-2xl bg-slate-100" style={{ backgroundImage: `linear-gradient(to bottom, rgba(9, 12, 18, 0.06), rgba(9, 12, 18, 0.22)), url('/images/pizzaBackground.jpg')`, backgroundPosition: "center", backgroundSize: "cover" }} />

                    <div className="mt-4 space-y-2 text-sm text-slate-600">
                        <div className="flex items-center justify-between">
                            <span>Categoria</span>
                            <span className="font-bold text-slate-800">{produtoSelecionado.categoria}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Preço</span>
                            <span className="font-bold text-slate-800">{produtoSelecionado.preco}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Estoque</span>
                            <span className="font-bold text-slate-800">{produtoSelecionado.estoque} unidades</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Destaque</span>
                            <span className="font-bold text-slate-800">{produtoSelecionado.destaque ? "Sim" : "Não"}</span>
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
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d92626] px-3 py-3 text-sm font-bold text-white shadow-[0_10px_18px_rgba(217,38,38,0.25)]"
                    >
                        <FontAwesomeIcon icon={faEdit} className="text-sm" />
                        Editar
                    </button>
                    <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dbe2eb] bg-white px-3 py-3 text-sm font-bold text-[#1d2733]"
                    >
                        <FontAwesomeIcon icon={faPowerOff} className="text-sm" />
                        Inativar
                    </button>
                </div>

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
                            <p className="mt-2 text-2xl font-black text-[#101820]">{products.filter((p) => p.status === "Ativo").length}</p>
                        </div>
                        <div className="rounded-xl bg-[#fff7d6] p-3">
                            <div className="flex items-center gap-2 text-amber-700">
                                <FontAwesomeIcon icon={faBolt} className="text-xs" />
                                <span className="font-bold">Destaques</span>
                            </div>
                            <p className="mt-2 text-2xl font-black text-[#101820]">{products.filter((p) => p.destaque).length}</p>
                        </div>
                        <div className="rounded-xl bg-[#eaf3ff] p-3">
                            <div className="flex items-center gap-2 text-blue-700">
                                <FontAwesomeIcon icon={faBoxesPacking} className="text-xs" />
                                <span className="font-bold">Estoque</span>
                            </div>
                            <p className="mt-2 text-2xl font-black text-[#101820]">{products.reduce((total, item) => total + item.estoque, 0)}</p>
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
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#dfe6ef] bg-[#e5e7eb] px-3 py-3 text-sm font-bold text-[#6b7280]"
                >
                    <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
                    Nova categoria
                </button>
            </aside>
        </div>
    );
}