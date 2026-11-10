import { supabase } from "../../lib/supabase"
import {
    formaPagamentoParaBanco,
    traduzirFormaPagamento,
    traduzirStatusPagamento,
    traduzirStatusPedido,
    traduzirTipoEntrega,
    tipoEntregaParaBanco,
    type StatusPedidoLocal,
} from "./database"

export interface ItemPedidoLocal {
    idProduto?: number
    nome?: string
    quantidade?: number
    precoUnitario?: number
    precoTotalItem?: number
    detalhes?: string
}

export interface PedidoLocal {
    idPedido: number
    idCliente: number
    nomeCliente?: string
    dataPedido: string
    itens: ItemPedidoLocal[]
    subtotal: number
    taxaEntrega: number
    total: number
    formaPagamento: string
    statusPagamento: string
    tipoEntrega: string
    status: StatusPedidoLocal
}

interface PedidoBanco {
    id_pedido: number
    id_cliente: number
    data_pedido: string
    subtotal: number
    taxa_entrega: number
    total: number
    forma_pagamento: string
    status_pagamento: string
    tipo_entrega: string
    status: string
    clientes: { nome: string } | null
    pedido_itens: Array<{
        id_produto: number | null
        nome_produto: string
        detalhes: string
        quantidade: number
        preco_unitario: number
        total: number
    }>
}

function lancarErroBanco(operacao: string, error: { message: string; code?: string } | null): void {
    if (error) {
        console.error(`Erro ao ${operacao} no Supabase (${error.code ?? "sem código"}):`, error.message)
        throw new Error(`Não foi possível ${operacao}. Verifique sua conexão e as permissões no banco.`)
    }
}

export async function obterPedidos(): Promise<PedidoLocal[]> {
    const { data, error } = await supabase
        .from("pedidos")
        .select(`
            id_pedido, id_cliente, data_pedido, subtotal, taxa_entrega, total,
            forma_pagamento, status_pagamento, tipo_entrega, status,
            clientes (nome),
            pedido_itens (
                id_produto, nome_produto, detalhes, quantidade, preco_unitario, total
            )
        `)
        .order("data_pedido", { ascending: false })

    lancarErroBanco("carregar pedidos", error)

    return ((data ?? []) as unknown as PedidoBanco[]).map((pedido) => ({
        idPedido: Number(pedido.id_pedido),
        idCliente: Number(pedido.id_cliente),
        nomeCliente: pedido.clientes?.nome,
        dataPedido: pedido.data_pedido,
        itens: (pedido.pedido_itens ?? []).map((item) => ({
            idProduto: item.id_produto ? Number(item.id_produto) : undefined,
            nome: item.nome_produto,
            quantidade: item.quantidade,
            precoUnitario: Number(item.preco_unitario),
            precoTotalItem: Number(item.total),
            detalhes: item.detalhes,
        })),
        subtotal: Number(pedido.subtotal),
        taxaEntrega: Number(pedido.taxa_entrega),
        total: Number(pedido.total),
        formaPagamento: traduzirFormaPagamento(pedido.forma_pagamento),
        statusPagamento: traduzirStatusPagamento(pedido.status_pagamento),
        tipoEntrega: traduzirTipoEntrega(pedido.tipo_entrega),
        status: traduzirStatusPedido(pedido.status),
    }))
}

export async function criarPedido(dados: {
    idCliente: number
    tipoEntrega: string
    formaPagamento: string
    taxaEntrega: number
    observacoes?: string
    itens: Array<{
        idProduto: number
        quantidade: number
        detalhes?: string
    }>
}): Promise<number> {
    const { data, error } = await supabase.rpc("criar_pedido", {
        p_cliente: dados.idCliente,
        p_tipo_entrega: tipoEntregaParaBanco(dados.tipoEntrega),
        p_forma_pagamento: formaPagamentoParaBanco(dados.formaPagamento),
        p_taxa_entrega: dados.taxaEntrega,
        p_observacoes: dados.observacoes?.trim() || null,
        p_itens: dados.itens.map((item) => ({
            id_produto: item.idProduto,
            quantidade: item.quantidade,
            detalhes: item.detalhes ?? "",
        })),
    })

    lancarErroBanco("criar pedido", error)
    return Number(data)
}
