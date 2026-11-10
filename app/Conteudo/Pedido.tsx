"use client"

import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faCalendarAlt, faClock } from "@fortawesome/free-solid-svg-icons"
import BuscaClientePedido from "../Components/BuscaClientePedido"
import CarrinhoPedido from "../Components/CarrinhoPedido"
import CheckoutPedido from "../Components/CheckoutPedido"
import CatalogoProdutos from "../Components/CatalogoProdutos"
import ModalNovoCliente from "../Components/ModalNovoCliente"
import { criarPedido } from "../lib/pedidos"
import { type ClienteLocal, type ProdutoLocal } from "../lib/database"

interface ItemCarrinho {
    id: number | string
    nome: string
    detalhes?: string
    quantidade: number
    precoUnitario: number
    idProduto: number
}

interface PedidoProps {
    onVoltarPedidos: () => void
}

export default function Pedido({ onVoltarPedidos }: PedidoProps) {
    const [clienteId, setClienteId] = useState<number>(0)
    const [clienteEndereco, setClienteEndereco] = useState("")
    const [itensCarrinho, setItensCarrinho] = useState<ItemCarrinho[]>([])
    const [taxaEntrega] = useState(7)
    const [tipoEntrega, setTipoEntrega] = useState("")
    const [mensagemPedido, setMensagemPedido] = useState("")
    const [modalNovoClienteAberto, setModalNovoClienteAberto] = useState(false)
    const [clientesAtualizacao, setClientesAtualizacao] = useState(0)

    function adicionarItemGenerico(item: ProdutoLocal) {
        const itemExistente = itensCarrinho.find((carrinho) => carrinho.id === item.idItem && carrinho.idProduto === item.idItem)
        if (itemExistente) {
            setItensCarrinho(itensCarrinho.map((carrinho) =>
                carrinho.id === item.idItem ? { ...carrinho, quantidade: carrinho.quantidade + 1 } : carrinho,
            ))
        } else {
            setItensCarrinho([
                ...itensCarrinho,
                {
                    id: item.idItem,
                    idProduto: item.idItem,
                    nome: item.nome,
                    detalhes: item.descricao,
                    quantidade: 1,
                    precoUnitario: item.preco,
                },
            ])
        }
    }

    function alterarQuantidade(id: number | string, delta: number) {
        setItensCarrinho((atuais) => atuais
            .map((item) => {
                if (item.id !== id) return item
                const novaQuantidade = item.quantidade + delta
                return novaQuantidade > 0 ? { ...item, quantidade: novaQuantidade } : null
            })
            .filter((item): item is ItemCarrinho => item !== null))
    }

    function removerItem(id: number | string) {
        setItensCarrinho((atuais) => atuais.filter((item) => item.id !== id))
    }

    function limparCarrinho() {
        setItensCarrinho([])
    }

    const subtotal = itensCarrinho.reduce((total, item) => total + item.precoUnitario * item.quantidade, 0)

    async function confirmarPedido(dadosCheckout: { tipoEntrega: string; formaPagamento: string }) {
        setMensagemPedido("")
        if (itensCarrinho.length === 0) {
            setMensagemPedido("Adicione pelo menos um item antes de confirmar o pedido.")
            return
        }
        if (clienteId === 0) {
            setMensagemPedido("Selecione um cliente antes de confirmar o pedido.")
            return
        }
        if (!dadosCheckout.tipoEntrega || !dadosCheckout.formaPagamento) {
            setMensagemPedido("Escolha entrega ou retirada e uma forma de pagamento.")
            return
        }
        if (dadosCheckout.tipoEntrega === "Entrega" && !clienteEndereco.trim()) {
            setMensagemPedido("Selecione um cliente com endereço de entrega cadastrado.")
            return
        }

        try {
            const idPedido = await criarPedido({
                idCliente: clienteId,
                tipoEntrega: dadosCheckout.tipoEntrega,
                formaPagamento: dadosCheckout.formaPagamento,
                taxaEntrega: dadosCheckout.tipoEntrega === "Entrega" ? taxaEntrega : 0,
                itens: itensCarrinho.map((item) => ({
                    idProduto: item.idProduto,
                    quantidade: item.quantidade,
                    detalhes: item.detalhes,
                })),
            })
            setItensCarrinho([])
            setMensagemPedido(`Pedido #${idPedido} confirmado e salvo.`)
        } catch (erro) {
            console.error("Não foi possível registrar o pedido.", erro)
            setMensagemPedido(erro instanceof Error ? erro.message : "Não foi possível salvar o pedido. Tente novamente.")
        }
    }

    return (
        <div className="flex w-full min-w-0 flex-col gap-4 pb-24 font-sans sm:gap-6 sm:pb-10">
            <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <button
                        type="button"
                        onClick={onVoltarPedidos}
                        aria-label="Voltar para pedidos"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50"
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
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-xs text-slate-400" />
                        <span className="font-medium">{new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date())}</span>
                    </div>
                    <div className="h-4 w-px bg-slate-200" />
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faClock} className="text-xs text-slate-400" />
                        <span className="font-medium">{new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date())}</span>
                    </div>
                </div>
            </div>

            <div className="grid min-w-0 grid-cols-1 items-start gap-4 sm:gap-6 lg:grid-cols-12">
                <div className="flex min-w-0 flex-col gap-4 sm:gap-6 lg:col-span-8">
                    <BuscaClientePedido
                        clienteSelecionadoId={clienteId}
                        atualizarLista={clientesAtualizacao}
                        onSelecionarCliente={(cliente: ClienteLocal) => {
                            setClienteId(cliente.idCliente)
                            setClienteEndereco(cliente.endereco)
                        }}
                        onNovoCliente={() => setModalNovoClienteAberto(true)}
                    />
                    <CatalogoProdutos onAdicionarItem={adicionarItemGenerico} />
                </div>

                <div className="flex min-w-0 flex-col gap-4 sm:gap-6 lg:sticky lg:top-4 lg:col-span-4">
                    <CarrinhoPedido
                        itens={itensCarrinho}
                        onAlterarQuantidade={alterarQuantidade}
                        onRemoverItem={removerItem}
                        onLimparCarrinho={limparCarrinho}
                        subtotal={subtotal}
                        taxaEntrega={tipoEntrega === "Entrega" && itensCarrinho.length > 0 ? taxaEntrega : 0}
                    />
                    <CheckoutPedido onConfirmarPedido={confirmarPedido} onTipoEntregaChange={setTipoEntrega} />
                    {mensagemPedido && (
                        <p role="status" className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
                            {mensagemPedido}
                        </p>
                    )}
                </div>
            </div>

            <ModalNovoCliente
                aberto={modalNovoClienteAberto}
                onFechar={() => setModalNovoClienteAberto(false)}
                onCriado={(idNovoCliente, novoEndereco) => {
                    setClienteId(idNovoCliente)
                    setClienteEndereco(novoEndereco)
                    setClientesAtualizacao((atualizacao) => atualizacao + 1)
                    setModalNovoClienteAberto(false)
                }}
            />
        </div>
    )
}
