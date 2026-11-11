import { NextResponse } from "next/server"
import { isAdminContextResult, lerJson, obterContextoAdmin } from "../../../../lib/admin-server"

export async function GET() {
    const contexto = await obterContextoAdmin()
    if (isAdminContextResult(contexto)) return contexto.response

    const { data, error } = await contexto.supabaseAdmin
        .from("perfis")
        .select("auth_user_id, nome, email, is_admin, ativo, criado_em")
        .order("nome")

    if (error) {
        console.error("Não foi possível listar a equipe.", error)
        return NextResponse.json({ error: "Não foi possível carregar os usuários da equipe." }, { status: 500 })
    }
    return NextResponse.json({ users: data ?? [] })
}

export async function POST(request: Request) {
    const contexto = await obterContextoAdmin()
    if (isAdminContextResult(contexto)) return contexto.response

    const body = await lerJson(request)
    if (!body) return NextResponse.json({ error: "Dados inválidos." }, { status: 400 })

    const nome = typeof body.nome === "string" ? body.nome.trim() : ""
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : ""
    const password = typeof body.password === "string" ? body.password : ""
    const isAdmin = body.is_admin === true
    if (!nome || nome.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) {
        return NextResponse.json({ error: "Informe nome, e-mail válido e senha com pelo menos 8 caracteres." }, { status: 400 })
    }
    if (body.is_admin !== undefined && typeof body.is_admin !== "boolean") {
        return NextResponse.json({ error: "Nível de acesso inválido." }, { status: 400 })
    }

    const { data: userData, error: erroCriacao } = await contexto.supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { nome },
    })
    if (erroCriacao || !userData.user) {
        console.error("Não foi possível criar o usuário da equipe.", erroCriacao)
        const status = erroCriacao?.code === "email_exists" ? 409 : 400
        return NextResponse.json({
            error: status === 409 ? "Já existe uma conta com este e-mail." : "Não foi possível criar a conta no Supabase Auth.",
        }, { status })
    }

    const { error: erroPerfil } = await contexto.supabaseAdmin
        .from("perfis")
        .insert({ auth_user_id: userData.user.id, nome, email, is_admin: isAdmin, ativo: true })
    if (erroPerfil) {
        const { error: erroRollback } = await contexto.supabaseAdmin.auth.admin.deleteUser(userData.user.id)
        console.error("Não foi possível criar o perfil do usuário da equipe.", erroPerfil)
        if (erroRollback) console.error("Não foi possível remover a conta Auth após falha do perfil.", erroRollback)
        return NextResponse.json({ error: "A conta foi criada, mas o perfil interno falhou. Tente novamente ou confira a equipe no Supabase." }, { status: 500 })
    }

    return NextResponse.json({
        user: {
            auth_user_id: userData.user.id,
            nome,
            email,
            is_admin: isAdmin,
            ativo: true,
            criado_em: userData.user.created_at,
        },
    }, { status: 201 })
}
