"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
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
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
    atualizarProduto as atualizarProdutoBanco,
    atualizarCategoria as atualizarCategoriaBanco,
    criarCategoria,
    criarProduto,
    obterCategorias,
    obterProdutos,
    type CategoriaLocal,
    type ProdutoLocal,
} from "../lib/database";

export default function Cardapio({ isAdmin }: { isAdmin: boolean }) {
    const [itens, setItens] = useState<ProdutoLocal[]>([]);
    const [categoriasBanco, setCategoriasBanco] = useState<CategoriaLocal[]>([]);
    const [categoriaAtiva, setCategoriaAtiva] = useState<number | "Todos">("Todos");
    const [busca, setBusca] = useState("");
    const [produtoSelecionadoId, setProdutoSelecionadoId] = useState<number | null>(null);
    const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
    const [modalNovoAberto, setModalNovoAberto] = useState(false);
    const [novoNome, setNovoNome] = useState("");
    const [novaDescricao, setNovaDescricao] = useState("");
    const [novoPreco, setNovoPreco] = useState("");
    const [novoTipo, setNovoTipo] = useState<ProdutoLocal["tipo"]>("pizza");
    const [novaCategoriaId, setNovaCategoriaId] = useState(0);
    const [nomeEditado, setNomeEditado] = useState("");
    const [categoriaEditada, setCategoriaEditada] = useState(0);
    const [tipoEditado, setTipoEditado] = useState<ProdutoLocal["tipo"]>("outro");
    const [precoEditado, setPrecoEditado] = useState("");
    const [descricaoEditada, setDescricaoEditada] = useState("");
    const [destaqueEditado, setDestaqueEditado] = useState(false);
    const [erroEdicao, setErroEdicao] = useState("");
    const [erroBanco, setErroBanco] = useState("");
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const iconesPorCategoria: Record<string, typeof faPizzaSlice> = {
        pizzas: faPizzaSlice,
        bebidas: faGlassWater,
        sobremesas: faIceCream,
        bordas: faCircleDot,
        adicionais: faPlus,
    }
    const categoriasExibidas = [
        { id: "Todos" as const, nome: "Todos" },
        ...categoriasBanco.map((categoria) => ({
            id: categoria.idCategoria,
            nome: categoria.nome,
            icone: iconesPorCategoria[categoria.nome.toLowerCase()] ?? faCircleDot,
        })),
    ]

    useEffect(() => {
        async function carregarCardapio() {
            try {
                const [itensCarregados, categoriasCarregadas] = await Promise.all([obterProdutos(isAdmin), obterCategorias(isAdmin)]);
                setItens(itensCarregados);
                setCategoriasBanco(categoriasCarregadas);
                setProdutoSelecionadoId(itensCarregados[0]?.idItem ?? null);
                setNovaCategoriaId(categoriasCarregadas[0]?.idCategoria ?? 0);
            } catch (erro) {
                console.error("Não foi possível carregar o catálogo.", erro);
                setErroBanco("Não foi possível carregar os dados do catálogo.");
            } finally {
                setCarregando(false);
            }
        }

        carregarCardapio();
    }, [isAdmin]);

    async function editarCategoria(categoria: CategoriaLocal) {
        const nome = window.prompt("Nome da categoria", categoria.nome)?.trim();
        if (!nome || nome === categoria.nome) return;
        try {
            await atualizarCategoriaBanco(categoria.idCategoria, { ...categoria, nome });
            setCategoriasBanco(await obterCategorias(isAdmin));
        } catch (erro) {
            console.error("Não foi possível renomear a categoria.", erro);
            setErroBanco("Não foi possível renomear a categoria. Confira se já existe uma categoria com esse nome.");
        }
    }

    async function alternarCategoria(categoria: CategoriaLocal) {
        try {
            await atualizarCategoriaBanco(categoria.idCategoria, { ...categoria, ativo: !categoria.ativo });
            setCategoriasBanco(await obterCategorias(isAdmin));
            setItens(await obterProdutos(isAdmin));
        } catch (erro) {
            console.error("Não foi possível alterar a categoria.", erro);
            setErroBanco("Não foi possível alterar a categoria. Tente novamente.");
        }
    }

    const itensFiltrados = useMemo(() => {
        const termo = busca.trim().toLowerCase();

        return itens.filter((item) => {
            const correspondeCategoria = categoriaAtiva === "Todos" || item.idCategoria === categoriaAtiva;
            const correspondeBusca =
                !termo ||
                item.nome.toLowerCase().includes(termo) ||
                item.descricao.toLowerCase().includes(termo) ||
                item.categoria.toLowerCase().includes(termo);

            return correspondeCategoria && correspondeBusca;
        });
    }, [itens, categoriaAtiva, busca]);

    const produtoSelecionado = itensFiltrados.find((item) => item.idItem === produtoSelecionadoId) ?? itensFiltrados[0] ?? null;

    async function atualizarProduto(idItem: number, alteracoes: Partial<ProdutoLocal>) {
        setErroBanco("");
        try {
            await atualizarProdutoBanco(idItem, alteracoes);
            setItens(await obterProdutos(isAdmin));
        } catch (erro) {
            console.error("Não foi possível salvar as alterações do produto.", erro);
            setErroBanco("Não foi possível salvar as alterações. Tente novamente.");
            throw erro;
        }
    }

    function abrirModalEdicao() {
        if (!produtoSelecionado) return;
        setPrecoEditado(produtoSelecionado.preco.toFixed(2).replace(".", ","));
        setNomeEditado(produtoSelecionado.nome);
        setCategoriaEditada(produtoSelecionado.idCategoria);
        setTipoEditado(produtoSelecionado.tipo);
        setDescricaoEditada(produtoSelecionado.descricao);
        setDestaqueEditado(produtoSelecionado.destaque ?? produtoSelecionado.tipo === "pizza");
        setErroEdicao("");
        setModalEdicaoAberto(true);
    }

    async function salvarEdicao(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        if (!produtoSelecionado) return;

        const novoPreco = Number(precoEditado.trim().replace(",", "."));
        if (!Number.isFinite(novoPreco) || novoPreco <= 0) {
            setErroEdicao("Informe um preço maior que zero.");
            return;
        }

        setSalvando(true);
        try {
            await atualizarProduto(produtoSelecionado.idItem, {
                nome: nomeEditado.trim(),
                idCategoria: categoriaEditada,
                tipo: tipoEditado,
                preco: novoPreco,
                descricao: descricaoEditada.trim(),
                destaque: destaqueEditado,
            });
            setModalEdicaoAberto(false);
        } catch {
            setErroEdicao("Não foi possível salvar as alterações.");
        } finally {
            setSalvando(false);
        }
    }

    async function alternarDisponibilidade() {
        if (!produtoSelecionado) return
        setSalvando(true)
        try {
            await atualizarProduto(produtoSelecionado.idItem, { ativo: !produtoSelecionado.ativo })
        } catch (erro) {
            console.error("Não foi possível alterar a disponibilidade do produto.", erro)
        } finally {
            setSalvando(false)
        }
    }

    async function adicionarCategoria() {
        const nome = window.prompt("Nome da nova categoria")?.trim();
        if (!nome) return;
        if (categoriasBanco.some((categoria) => categoria.nome.toLowerCase() === nome.toLowerCase())) {
            setErroBanco("Já existe uma categoria com esse nome.");
            return;
        }

        try {
            const categoria = await criarCategoria(nome);
            setCategoriasBanco((atuais) => [...atuais, categoria]);
            setNovaCategoriaId(categoria.idCategoria);
            setErroBanco("");
        } catch (erro) {
            console.error("Não foi possível criar a categoria.", erro);
            setErroBanco("Não foi possível criar a categoria.");
        }
    }

    async function salvarNovoProduto(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        const preco = Number(novoPreco.trim().replace(",", "."));
        if (!novaCategoriaId || !novoNome.trim() || !Number.isFinite(preco) || preco < 0) {
            setErroBanco("Informe nome, categoria e um preço válido para o produto.");
            return;
        }

        setSalvando(true);
        setErroBanco("");
        try {
            await criarProduto({
                idCategoria: novaCategoriaId,
                nome: novoNome,
                descricao: novaDescricao,
                tipo: novoTipo,
                preco,
            });
            const produtosAtualizados = await obterProdutos(isAdmin);
            setItens(produtosAtualizados);
            setProdutoSelecionadoId(
                produtosAtualizados.find((produto) =>
                    produto.idCategoria === novaCategoriaId && produto.nome === novoNome.trim(),
                )?.idItem ?? null,
            );
            setNovoNome("");
            setNovaDescricao("");
            setNovoPreco("");
            setModalNovoAberto(false);
        } catch (erro) {
            console.error("Não foi possível cadastrar o produto.", erro);
            setErroBanco("Não foi possível cadastrar o produto. Verifique se já existe outro com esse nome.");
        } finally {
            setSalvando(false);
        }
    }

    const produtosAtivos = itens.filter((item) => item.ativo !== false).length;
    const destaques = itens.filter((item) => item.destaque ?? item.tipo === "pizza").length;
    const totalEstoque = itens.length;

    return (
        <div className="flex min-w-0 flex-col gap-4 xl:flex-row">
            {erroBanco && <p role="alert" className="basis-full rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{erroBanco}</p>}
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

                {isAdmin && (
                    <button
                        type="button"
                        onClick={() => setModalNovoAberto(true)}
                        className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#d92626] px-4 py-2.5 text-sm font-bold text-white"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        Novo produto
                    </button>
                )}

                <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
                    {carregando ? (
                        <p className="col-span-full p-8 text-center text-sm text-slate-500">Carregando catálogo...</p>
                    ) : itensFiltrados.map((produto) => (
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
                                {(produto.destaque ?? produto.tipo === "pizza") && (
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
                    {isAdmin && (
                        <button type="button" onClick={abrirModalEdicao} aria-label="Editar produto" className="rounded-lg p-2 text-[#475569] transition-colors hover:bg-white/80">
                            <FontAwesomeIcon icon={faEdit} className="text-base" />
                        </button>
                    )}
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
                                    <span className="font-bold text-slate-800">{produtoSelecionado.categoria}</span>
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
                                    <span className="font-bold text-slate-800">{produtoSelecionado.destaque ? "Sim" : "Não"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 rounded-[18px] bg-white p-3 shadow-sm">
                            <p className="text-sm font-bold text-[#1d2733]">Descrição</p>
                            <p className="mt-2 text-sm leading-relaxed text-slate-600">{produtoSelecionado.descricao}</p>
                        </div>

                        {isAdmin && <div className="mt-4 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={abrirModalEdicao}
                                disabled={salvando}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d92626] px-3 py-3 text-sm font-bold text-white shadow-[0_10px_18px_rgba(217,38,38,0.25)]"
                            >
                                <FontAwesomeIcon icon={faEdit} className="text-sm" />
                                Editar
                            </button>
                            <button
                                type="button"
                                onClick={alternarDisponibilidade}
                                disabled={salvando}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dbe2eb] bg-white px-3 py-3 text-sm font-bold text-[#1d2733] disabled:opacity-60"
                            >
                                <FontAwesomeIcon icon={faPowerOff} className="text-sm" />
                                {produtoSelecionado.ativo ? "Inativar" : "Ativar"}
                            </button>
                        </div>}
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
                                <span className="font-bold">Produtos cadastrados</span>
                            </div>
                            <p className="mt-2 text-2xl font-black text-[#101820]">{totalEstoque}</p>
                        </div>
                        <div className="rounded-xl bg-[#f6eaf8] p-3">
                            <div className="flex items-center gap-2 text-violet-700">
                                <FontAwesomeIcon icon={faTruck} className="text-xs" />
                                <span className="font-bold">Categorias</span>
                            </div>
                            <p className="mt-2 text-2xl font-black text-[#101820]">{categoriasBanco.length}</p>
                        </div>
                    </div>
                </div>

                {isAdmin && <div className="mt-4 rounded-[18px] bg-white p-3 shadow-sm">
                    <h3 className="text-sm font-bold text-[#1d2733]">Gerenciar categorias</h3>
                    <div className="mt-3 space-y-2">
                        {categoriasBanco.map((categoria) => (
                            <div key={categoria.idCategoria} className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 p-2">
                                <span className={`min-w-0 truncate text-sm ${categoria.ativo ? "text-slate-700" : "text-slate-400"}`}>
                                    {categoria.nome}{categoria.ativo ? "" : " (inativa)"}
                                </span>
                                <div className="flex shrink-0 gap-1">
                                    <button type="button" onClick={() => { void editarCategoria(categoria) }} className="rounded px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50">Renomear</button>
                                    <button type="button" onClick={() => { void alternarCategoria(categoria) }} className="rounded px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100">
                                        {categoria.ativo ? "Desativar" : "Ativar"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>}

                {isAdmin && <button
                    type="button"
                    onClick={adicionarCategoria}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#dfe6ef] bg-[#e5e7eb] px-3 py-3 text-sm font-bold text-[#6b7280]"
                >
                    <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
                    Nova categoria
                </button>}
            </aside>

            {modalNovoAberto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
                    <section role="dialog" aria-modal="true" aria-labelledby="titulo-modal-novo-produto" className="max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
                        <div className="mb-5 flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                            <h2 id="titulo-modal-novo-produto" className="text-xl font-bold text-slate-900">Novo produto</h2>
                            <button type="button" onClick={() => setModalNovoAberto(false)} aria-label="Fechar" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                        <form onSubmit={salvarNovoProduto} className="grid gap-4 sm:grid-cols-2">
                            <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700 sm:col-span-2">
                                Nome
                                <input value={novoNome} onChange={(evento) => setNovoNome(evento.target.value)} required maxLength={120} className="rounded-lg border border-slate-200 px-3 py-2.5 font-normal" />
                            </label>
                            <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
                                Categoria
                                <select value={novaCategoriaId} onChange={(evento) => setNovaCategoriaId(Number(evento.target.value))} required className="rounded-lg border border-slate-200 px-3 py-2.5 font-normal">
                                    {categoriasBanco.filter((categoria) => categoria.ativo).map((categoria) => <option key={categoria.idCategoria} value={categoria.idCategoria}>{categoria.nome}</option>)}
                                </select>
                            </label>
                            <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
                                Tipo
                                <select value={novoTipo} onChange={(evento) => setNovoTipo(evento.target.value as ProdutoLocal["tipo"])} className="rounded-lg border border-slate-200 px-3 py-2.5 font-normal">
                                    <option value="pizza">Pizza</option>
                                    <option value="bebida">Bebida</option>
                                    <option value="sobremesa">Sobremesa</option>
                                    <option value="borda">Borda</option>
                                    <option value="adicional">Adicional</option>
                                    <option value="outro">Outro</option>
                                </select>
                            </label>
                            <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700 sm:col-span-2">
                                Preço (R$)
                                <input value={novoPreco} onChange={(evento) => setNovoPreco(evento.target.value)} inputMode="decimal" required className="rounded-lg border border-slate-200 px-3 py-2.5 font-normal" />
                            </label>
                            <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700 sm:col-span-2">
                                Descrição
                                <textarea value={novaDescricao} onChange={(evento) => setNovaDescricao(evento.target.value)} rows={3} className="rounded-lg border border-slate-200 px-3 py-2.5 font-normal" />
                            </label>
                            {categoriasBanco.length === 0 && <p role="alert" className="text-sm text-red-700 sm:col-span-2">Cadastre uma categoria antes de criar produtos.</p>}
                            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:col-span-2 sm:flex-row sm:justify-end">
                                <button type="button" onClick={() => setModalNovoAberto(false)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold">Cancelar</button>
                                <button type="submit" disabled={salvando || categoriasBanco.length === 0} className="rounded-lg bg-[#d92626] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">
                                    {salvando ? "Salvando..." : "Cadastrar produto"}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}

            {modalEdicaoAberto && produtoSelecionado && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
                    onMouseDown={(evento) => {
                        if (evento.target === evento.currentTarget) setModalEdicaoAberto(false);
                    }}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="titulo-modal-editar-produto"
                        className="max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"
                    >
                        <div className="mb-5 flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                            <div>
                                <h2 id="titulo-modal-editar-produto" className="text-xl font-bold text-slate-900">Editar produto</h2>
                                <p className="mt-1 text-sm text-slate-500">{produtoSelecionado.nome}</p>
                            </div>
                            <button
                                type="button"
                                aria-label="Fechar edição"
                                onClick={() => setModalEdicaoAberto(false)}
                                className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100"
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>

                        <form onSubmit={salvarEdicao} className="flex flex-col gap-4">
                            <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
                                Nome
                                <input value={nomeEditado} onChange={(evento) => setNomeEditado(evento.target.value)} required maxLength={120} className="rounded-lg border border-slate-200 px-3 py-2.5 font-normal" />
                            </label>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
                                    Categoria
                                    <select value={categoriaEditada} onChange={(evento) => setCategoriaEditada(Number(evento.target.value))} className="rounded-lg border border-slate-200 px-3 py-2.5 font-normal">
                                        {categoriasBanco.filter((categoria) => categoria.ativo || categoria.idCategoria === produtoSelecionado.idCategoria).map((categoria) => (
                                            <option key={categoria.idCategoria} value={categoria.idCategoria}>{categoria.nome}</option>
                                        ))}
                                    </select>
                                </label>
                                <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
                                    Tipo
                                    <select value={tipoEditado} onChange={(evento) => setTipoEditado(evento.target.value as ProdutoLocal["tipo"])} className="rounded-lg border border-slate-200 px-3 py-2.5 font-normal">
                                        <option value="pizza">Pizza</option>
                                        <option value="bebida">Bebida</option>
                                        <option value="sobremesa">Sobremesa</option>
                                        <option value="borda">Borda</option>
                                        <option value="adicional">Adicional</option>
                                        <option value="outro">Outro</option>
                                    </select>
                                </label>
                            </div>
                            <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
                                Preço
                                <div className="flex items-center rounded-lg border border-slate-200 px-3 focus-within:border-slate-400">
                                    <span className="text-sm text-slate-400">R$</span>
                                    <input
                                        type="text"
                                        inputMode="decimal"
                                        value={precoEditado}
                                        onChange={(evento) => setPrecoEditado(evento.target.value)}
                                        className="min-w-0 flex-1 bg-transparent px-2 py-2.5 font-normal text-slate-900 outline-none"
                                        required
                                    />
                                </div>
                            </label>

                            <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
                                Descrição
                                <textarea
                                    value={descricaoEditada}
                                    onChange={(evento) => setDescricaoEditada(evento.target.value)}
                                    rows={4}
                                    className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 font-normal text-slate-900 outline-none focus:border-slate-400"
                                    required
                                />
                            </label>

                            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm text-slate-700">
                                <input
                                    type="checkbox"
                                    checked={destaqueEditado}
                                    onChange={(evento) => setDestaqueEditado(evento.target.checked)}
                                    className="size-4 accent-amber-500"
                                />
                                <span>
                                    <span className="block font-semibold">Produto em destaque</span>
                                    <span className="mt-0.5 block text-xs text-slate-500">Exibir o selo de destaque no catálogo.</span>
                                </span>
                            </label>

                            {erroEdicao && <p role="alert" className="text-sm font-medium text-red-700">{erroEdicao}</p>}

                            <div className="mt-2 flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() => setModalEdicaoAberto(false)}
                                    className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={salvando}
                                    className="rounded-lg bg-[#d92626] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#b81f26]"
                                >
                                    {salvando ? "Salvando..." : "Salvar alterações"}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </div>
    );
}