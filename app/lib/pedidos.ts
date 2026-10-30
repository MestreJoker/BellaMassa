import Axios from "axios"

export interface ItemPedidoLocal {
    tipo?: string
    nome?: string
    quantidade?: number
    precoTotalItem?: number
    detalhes?: string
}

export interface PedidoLocal {
    idPedido: number
    idCliente: number
    dataPedido: string
    itens: ItemPedidoLocal[]
    subtotal: number
    taxaEntrega: number
    desconto: number
    total: number
    formaPagamento: string
    statusPagamento?: string
    tipoEntrega: string
    status: string
}

const CHAVE_PEDIDOS = "bella-massa-pedidos"

export async function obterPedidos(): Promise<PedidoLocal[]> {
    const pedidosSalvos = localStorage.getItem(CHAVE_PEDIDOS)

    if (pedidosSalvos) {
        try {
            return JSON.parse(pedidosSalvos) as PedidoLocal[]
        } catch {
            localStorage.removeItem(CHAVE_PEDIDOS)
        }
    }

    const resposta = await Axios.get<PedidoLocal[]>("/json/pedidos.json")
    return resposta.data
}

export function salvarPedidos(pedidos: PedidoLocal[]) {
    localStorage.setItem(CHAVE_PEDIDOS, JSON.stringify(pedidos))
}
