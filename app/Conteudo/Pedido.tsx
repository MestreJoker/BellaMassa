import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faCalendarAlt, faClock } from "@fortawesome/free-solid-svg-icons"
import BuscaClientePedido from "../Components/BuscaClientePedido"
import ModalMontagemPizza from "../Components/ModalMontagemPizza"
import CarrinhoPedido from "../Components/CarrinhoPedido"
import CheckoutPedido from "../Components/CheckoutPedido"
import CatalogoProdutos from "../Components/CatalogoProdutos"

interface ItemCarrinho {
    id: number | string
    nome: string
    detalhes?: string
    quantidade: number
    precoUnitario: number
}

    interface ProdutoCardapioPedido {
        idItem: number
        idCategoria: number
        nome: string
        descricao: string
        preco: number
        imagem: string
    }

    interface TamanhoPizzaPedido {
        idTamanho: number
        nome: string
        cm: number
        precoBase: number
    }

export default function Pedido() {
    // Estados principais da página
    const [clienteId, setClienteId] = useState<number>(1) // João Silva por padrão
    const [itensCarrinho, setItensCarrinho] = useState<ItemCarrinho[]>([
        {
            id: 1,
            nome: "Pizza Média",
            detalhes: "Calabresa + Frango\nBorda Catupiry\nAdicionais: Bacon",
            quantidade: 1,
            precoUnitario: 58.90
        },
        {
            id: 9,
            nome: "Coca-Cola 2L",
            detalhes: "Quantidade: 1",
            quantidade: 1,
            precoUnitario: 12.00
        }
    ])
    const [desconto] = useState(5.00)
    const [taxaEntrega] = useState(7.00)

    // Funções do Carrinho
        function adicionarItemGenerico(item: ProdutoCardapioPedido) {
        const itemExistente = itensCarrinho.find(i => i.id === item.idItem)
        if (itemExistente) {
            setItensCarrinho(itensCarrinho.map(i => 
                i.id === item.idItem ? { ...i, quantidade: i.quantidade + 1 } : i
            ))
        } else {
            setItensCarrinho([
                ...itensCarrinho,
                {
                    id: item.idItem,
                    nome: item.nome,
                    detalhes: item.descricao,
                    quantidade: 1,
                    precoUnitario: item.preco
                }
            ])
        }
    }

    function adicionarPizzaPersonalizada(dados: { tamanho: TamanhoPizzaPedido; sabores: string[]; borda: string; adicionais: string[]; precoTotal: number }) {
            const novoItem: ItemCarrinho = {
            id: Date.now(),
            nome: `Pizza ${dados.tamanho.nome}`,
            detalhes: `${dados.sabores.join(" + ")}\nBorda: ${dados.borda}\nAdicionais: ${dados.adicionais.join(", ") || "Nenhum"}`,
            quantidade: 1,
            precoUnitario: dados.precoTotal
        }
        setItensCarrinho([...itensCarrinho, novoItem])
    }

    function alterarQuantidade(id: number | string, delta: number) {
        setItensCarrinho(itensCarrinho.map(item => {
            if (item.id === id) {
                const novaQtd = item.quantidade + delta
                return novaQtd > 0 ? { ...item, quantidade: novaQtd } : null
            }
            return item
        }).filter(Boolean) as ItemCarrinho[])
    }

    function removerItem(id: number | string) {
        setItensCarrinho(itensCarrinho.filter(item => item.id !== id))
    }

    function limparCarrinho() {
        setItensCarrinho([])
    }

    const subtotal = itensCarrinho.reduce((acc, item) => acc + (item.precoUnitario * item.quantidade), 0)

    function confirmarPedido(dadosCheckout: { tipoEntrega: string; formaPagamento: string }) {
        alert(`Pedido confirmado com sucesso!\nTipo: ${dadosCheckout.tipoEntrega}\nPagamento: ${dadosCheckout.formaPagamento}`)
    }

    return (
        <div className="flex w-full min-w-0 flex-col gap-4 pb-24 font-sans sm:gap-6 sm:pb-10">
            {/* Cabeçalho da Página com Data e Hora */}
            <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <button
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Novo Pedido</h1>
                        <p className="text-xs text-slate-400">Monte o pedido do seu cliente de forma rápida e prática.</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 self-start rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-600 sm:gap-6 sm:px-4 md:self-auto">
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-slate-400 text-xs" />
                        <span className="font-medium">15 de Setembro de 2026</span>
                    </div>
                    <div className="h-4 w-[1px] bg-slate-200"></div>
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faClock} className="text-slate-400 text-xs" />
                        <span className="font-medium">14:32</span>
                    </div>
                </div>
            </div>

            {/* Layout em 2 Colunas Principais (Esquerda: Cliente + Catálogo/Montagem | Direita: Carrinho + Checkout) */}
            <div className="grid min-w-0 grid-cols-1 items-start gap-4 sm:gap-6 lg:grid-cols-12">
                
                {/* Coluna Esquerda (Span 8) */}
                <div className="flex min-w-0 flex-col gap-4 sm:gap-6 lg:col-span-8">
                    <BuscaClientePedido
                        clienteSelecionadoId={clienteId}
                        onSelecionarCliente={(id) => setClienteId(id)}
                        onNovoCliente={() => alert("Abrir modal de novo cliente")}
                    />

                    <CatalogoProdutos
                        onAdicionarItem={adicionarItemGenerico}
                    />

                    <ModalMontagemPizza
                        onAdicionarPizzaPersonalizada={adicionarPizzaPersonalizada}
                    />
                </div>

                {/* Coluna Direita (Span 4) */}
                <div className="flex min-w-0 flex-col gap-4 sm:gap-6 lg:sticky lg:top-4 lg:col-span-4">
                    <CarrinhoPedido
                        itens={itensCarrinho}
                        onAlterarQuantidade={alterarQuantidade}
                        onRemoverItem={removerItem}
                        onLimparCarrinho={limparCarrinho}
                        subtotal={subtotal}
                        taxaEntrega={taxaEntrega}
                        desconto={desconto}
                    />

                    <CheckoutPedido
                        onConfirmarPedido={confirmarPedido}
                    />
                </div>

            </div>
        </div>
    )
}