import { supabase } from "../../lib/supabase"

export interface ClienteLocal {
    idCliente: number
    nome: string
    telefone: string
    email?: string | null
    endereco: string
    bairro: string
    status: "Ativo" | "Inativo"
}

export interface CategoriaLocal {
    idCategoria: number
    nome: string
    ordem: number
}

export interface ProdutoLocal {
    idItem: number
    idCategoria: number
    categoria: string
    nome: string
    descricao: string
    preco: number
    imagem: string
    tipo: "pizza" | "bebida" | "sobremesa" | "borda" | "adicional" | "outro"
    ativo: boolean
    destaque: boolean
}

export type StatusPedidoLocal =
    | "Em andamento"
    | "Em preparo"
    | "Pronto"
    | "Em entrega"
    | "Entregue"
    | "Retirado"
    | "Cancelado"

const statusPedidoParaBanco: Record<StatusPedidoLocal, string> = {
    "Em andamento": "em_andamento",
    "Em preparo": "em_preparo",
    "Pronto": "pronto",
    "Em entrega": "em_entrega",
    "Entregue": "entregue",
    "Retirado": "retirado",
    "Cancelado": "cancelado",
}

const statusPedidoDoBanco = Object.fromEntries(
    Object.entries(statusPedidoParaBanco).map(([label, valor]) => [valor, label]),
) as Record<string, StatusPedidoLocal>

const statusPagamentoDoBanco: Record<string, string> = {
    pendente: "Pendente",
    pago: "Pago",
}

const formasPagamentoParaBanco: Record<string, string> = {
    Pix: "pix",
    Cartão: "cartao_credito",
    "Cartão de crédito": "cartao_credito",
    "Cartão de débito": "cartao_debito",
    Dinheiro: "dinheiro",
    Outro: "outro",
}

const formasPagamentoDoBanco: Record<string, string> = {
    pix: "Pix",
    cartao_credito: "Cartão de crédito",
    cartao_debito: "Cartão de débito",
    dinheiro: "Dinheiro",
    outro: "Outro",
}

const tiposEntregaParaBanco: Record<string, string> = {
    Entrega: "entrega",
    Retirada: "retirada",
    Balcão: "balcao",
}

const tiposEntregaDoBanco: Record<string, string> = {
    entrega: "Entrega",
    retirada: "Retirada",
    balcao: "Balcão",
}

function lancarErroBanco(operacao: string, error: { message: string; code?: string } | null): void {
    if (error) {
        console.error(`Erro ao ${operacao} no Supabase (${error.code ?? "sem código"}):`, error.message)
        throw new Error(`Não foi possível ${operacao}. Verifique sua conexão e as permissões no banco.`)
    }
}

export async function obterClientes(): Promise<ClienteLocal[]> {
    const { data, error } = await supabase
        .from("clientes")
        .select("id_cliente, nome, telefone, email, endereco, bairro, ativo")
        .order("nome")

    lancarErroBanco("carregar clientes", error)

    return (data ?? []).map((cliente) => ({
        idCliente: Number(cliente.id_cliente),
        nome: cliente.nome,
        telefone: cliente.telefone,
        email: cliente.email,
        endereco: cliente.endereco,
        bairro: cliente.bairro,
        status: cliente.ativo ? "Ativo" : "Inativo",
    }))
}

export async function obterCliente(idCliente: number): Promise<ClienteLocal | null> {
    const clientes = await obterClientes()
    return clientes.find((cliente) => cliente.idCliente === idCliente) ?? null
}

export async function criarCliente(dados: {
    nome: string
    telefone: string
    email?: string
    endereco: string
    bairro?: string
}): Promise<number> {
    const { data, error } = await supabase
        .from("clientes")
        .insert({
            nome: dados.nome.trim(),
            telefone: dados.telefone.trim(),
            email: dados.email?.trim() || null,
            endereco: dados.endereco.trim(),
            bairro: dados.bairro?.trim() || "",
        })
        .select("id_cliente")
        .single()

    lancarErroBanco("cadastrar cliente", error)
    if (!data) throw new Error("O Supabase não retornou o cliente criado.")
    return Number(data.id_cliente)
}

export async function obterCategorias(): Promise<CategoriaLocal[]> {
    const { data, error } = await supabase
        .from("categorias")
        .select("id_categoria, nome, ordem")
        .eq("ativo", true)
        .order("ordem")
        .order("nome")

    lancarErroBanco("carregar categorias", error)
    return (data ?? []).map((categoria) => ({
        idCategoria: Number(categoria.id_categoria),
        nome: categoria.nome,
        ordem: categoria.ordem,
    }))
}

export async function criarCategoria(nome: string): Promise<CategoriaLocal> {
    const categorias = await obterCategorias()
    const { data, error } = await supabase
        .from("categorias")
        .insert({ nome: nome.trim(), ordem: categorias.length + 1 })
        .select("id_categoria, nome, ordem")
        .single()

    lancarErroBanco("criar categoria", error)
    if (!data) throw new Error("O Supabase não retornou a categoria criada.")
    return { idCategoria: Number(data.id_categoria), nome: data.nome, ordem: data.ordem }
}

export async function obterProdutos(): Promise<ProdutoLocal[]> {
    const { data, error } = await supabase
        .from("produtos")
        .select("id_produto, id_categoria, nome, descricao, imagem_url, tipo, preco, destaque, ativo, categorias(nome)")
        .order("nome")

    lancarErroBanco("carregar catálogo", error)
    return (data ?? []).map((produto) => {
        const categoria = produto.categorias as { nome?: string } | null
        return {
            idItem: Number(produto.id_produto),
            idCategoria: Number(produto.id_categoria),
            categoria: categoria?.nome ?? "Outros",
            nome: produto.nome,
            descricao: produto.descricao,
            preco: Number(produto.preco),
            imagem: produto.imagem_url,
            tipo: produto.tipo,
            ativo: produto.ativo,
            destaque: produto.destaque,
        }
    })
}

export async function atualizarProduto(
    idProduto: number,
    alteracoes: Partial<Pick<ProdutoLocal, "descricao" | "destaque" | "ativo" | "preco">>,
): Promise<void> {
    const atualizacao: Record<string, unknown> = {}
    if (alteracoes.descricao !== undefined) atualizacao.descricao = alteracoes.descricao
    if (alteracoes.destaque !== undefined) atualizacao.destaque = alteracoes.destaque
    if (alteracoes.ativo !== undefined) atualizacao.ativo = alteracoes.ativo
    if (alteracoes.preco !== undefined) atualizacao.preco = alteracoes.preco

    if (!Object.keys(atualizacao).length) return

    const { error } = await supabase.from("produtos").update(atualizacao).eq("id_produto", idProduto)
    lancarErroBanco("atualizar produto", error)
}

export async function atualizarStatusPedido(idPedido: number, status: StatusPedidoLocal): Promise<void> {
    const { error } = await supabase
        .from("pedidos")
        .update({ status: statusPedidoParaBanco[status] })
        .eq("id_pedido", idPedido)
    lancarErroBanco("atualizar status do pedido", error)
}

export async function marcarPedidoPago(idPedido: number): Promise<void> {
    const { error } = await supabase.rpc("marcar_pedido_pago", { p_id_pedido: idPedido })
    lancarErroBanco("registrar pagamento", error)
}

export function traduzirStatusPedido(status: string): StatusPedidoLocal {
    return statusPedidoDoBanco[status] ?? "Em andamento"
}

export function traduzirStatusPagamento(status: string | null | undefined): string {
    return statusPagamentoDoBanco[status ?? "pendente"] ?? "Pendente"
}

export function traduzirFormaPagamento(forma: string | null | undefined): string {
    return formasPagamentoDoBanco[forma ?? ""] ?? "Outro"
}

export function formaPagamentoParaBanco(forma: string): string {
    return formasPagamentoParaBanco[forma] ?? "outro"
}

export function tipoEntregaParaBanco(tipo: string): string {
    return tiposEntregaParaBanco[tipo] ?? "retirada"
}

export function traduzirTipoEntrega(tipo: string): string {
    return tiposEntregaDoBanco[tipo] ?? "Retirada"
}

export function statusPedidoParaBancoValor(status: StatusPedidoLocal): string {
    return statusPedidoParaBanco[status]
}
