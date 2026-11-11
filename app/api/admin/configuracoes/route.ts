import { NextResponse } from "next/server"
import { isAdminContextResult, lerJson, obterContextoAdmin } from "../../../../lib/admin-server"

export async function GET() {
    const contexto = await obterContextoAdmin()
    if (isAdminContextResult(contexto)) return contexto.response

    const { data, error } = await contexto.supabaseAdmin
        .from("configuracoes")
        .select("taxa_entrega, atualizado_em")
        .eq("chave", "geral")
        .single()
    if (error || !data) {
        console.error("Não foi possível carregar as configurações.", error)
        if (error?.code === "PGRST205" || error?.code === "42P01") {
            return NextResponse.json({
                error: "A tabela de configurações não existe no Supabase. Execute sql/01_configuracoes_admin.sql no SQL Editor.",
            }, { status: 503 })
        }
        if (error?.code === "PGRST116") {
            return NextResponse.json({
                error: "A configuração inicial da loja não existe. Execute sql/01_configuracoes_admin.sql no SQL Editor.",
            }, { status: 503 })
        }
        return NextResponse.json({ error: "Não foi possível carregar as configurações da loja." }, { status: 500 })
    }
    return NextResponse.json({ settings: data })
}

export async function PATCH(request: Request) {
    const contexto = await obterContextoAdmin()
    if (isAdminContextResult(contexto)) return contexto.response

    const body = await lerJson(request)
    const taxaEntrega = body?.taxa_entrega
    if (typeof taxaEntrega !== "number" || !Number.isFinite(taxaEntrega) || taxaEntrega < 0 || taxaEntrega > 99999999.99) {
        return NextResponse.json({ error: "Informe uma taxa de entrega válida e não negativa." }, { status: 400 })
    }

    const { data, error } = await contexto.supabaseAdmin
        .from("configuracoes")
        .update({ taxa_entrega: taxaEntrega, atualizado_em: new Date().toISOString() })
        .eq("chave", "geral")
        .select("taxa_entrega, atualizado_em")
        .single()
    if (error || !data) {
        console.error("Não foi possível salvar as configurações.", error)
        return NextResponse.json({ error: "Não foi possível salvar a taxa de entrega." }, { status: 500 })
    }
    return NextResponse.json({ settings: data })
}
