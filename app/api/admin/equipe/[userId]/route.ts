import { NextResponse } from "next/server"
import { isAdminContextResult, lerJson, obterContextoAdmin } from "../../../../../lib/admin-server"

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function PATCH(request: Request, { params }: RouteContext<"/api/admin/equipe/[userId]">) {
    const contexto = await obterContextoAdmin()
    if (isAdminContextResult(contexto)) return contexto.response

    const { userId } = await params
    if (!uuidPattern.test(userId)) return NextResponse.json({ error: "Identificador de usuário inválido." }, { status: 400 })
    const body = await lerJson(request)
    if (!body) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 })

    const { data: perfil, error: erroPerfil } = await contexto.supabaseAdmin
        .from("perfis")
        .select("auth_user_id, nome, is_admin, ativo")
        .eq("auth_user_id", userId)
        .maybeSingle()
    if (erroPerfil) {
        console.error("Não foi possível localizar o perfil para atualização.", erroPerfil)
        return NextResponse.json({ error: "Não foi possível carregar o perfil." }, { status: 500 })
    }
    if (!perfil) return NextResponse.json({ error: "Usuário da equipe não encontrado." }, { status: 404 })

    const nome = body.nome === undefined ? perfil.nome : typeof body.nome === "string" ? body.nome.trim() : ""
    const isAdmin = body.is_admin === undefined ? perfil.is_admin : body.is_admin
    const ativo = body.ativo === undefined ? perfil.ativo : body.ativo
    if (!nome || nome.length > 120 || typeof isAdmin !== "boolean" || typeof ativo !== "boolean") {
        return NextResponse.json({ error: "Nome ou nível de acesso inválido." }, { status: 400 })
    }
    if (userId === contexto.actorId && (!ativo || !isAdmin)) {
        return NextResponse.json({ error: "Não é permitido remover ou desativar o próprio acesso administrativo." }, { status: 400 })
    }

    const { error } = await contexto.supabaseAdmin.rpc("admin_atualizar_perfil", {
        p_auth_user_id: userId,
        p_nome: nome,
        p_is_admin: isAdmin,
        p_ativo: ativo,
    })
    if (error) {
        console.error("Não foi possível atualizar o perfil da equipe.", error)
        if (error.code === "PGRST202") {
            return NextResponse.json({
                error: "A função administrativa não existe no Supabase. Execute sql/02_admin_atualizar_perfil.sql no SQL Editor.",
            }, { status: 503 })
        }
        const ultimoAdmin = error.message.toLowerCase().includes("ultimo administrador")
        return NextResponse.json({
            error: ultimoAdmin
                ? "O sistema precisa manter pelo menos um administrador ativo."
                : "Não foi possível atualizar o usuário da equipe.",
        }, { status: ultimoAdmin ? 409 : 500 })
    }

    return NextResponse.json({ user: { ...perfil, nome, is_admin: isAdmin, ativo } })
}
