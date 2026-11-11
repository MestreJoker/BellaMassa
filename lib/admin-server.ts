import "server-only"

import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "./supabase-server"

interface AdminContext {
    actorId: string
    supabaseAdmin: SupabaseClient
}

type AdminContextResult = AdminContext | { response: NextResponse }

export async function obterContextoAdmin(): Promise<AdminContextResult> {
    const supabase = await createSupabaseServerClient()
    const { data: { user }, error: erroUsuario } = await supabase.auth.getUser()
    if (erroUsuario) {
        console.error("Não foi possível validar a sessão administrativa.", erroUsuario)
        return { response: NextResponse.json({ error: "Não foi possível validar a sessão." }, { status: 401 }) }
    }
    if (!user) {
        return { response: NextResponse.json({ error: "Autenticação necessária." }, { status: 401 }) }
    }

    const { data: perfil, error: erroPerfil } = await supabase
        .from("perfis")
        .select("is_admin, ativo")
        .eq("auth_user_id", user.id)
        .maybeSingle()
    if (erroPerfil) {
        console.error("Não foi possível validar o perfil administrativo.", erroPerfil)
        return { response: NextResponse.json({ error: "Não foi possível validar as permissões." }, { status: 500 }) }
    }
    if (!perfil?.ativo || !perfil.is_admin) {
        return { response: NextResponse.json({ error: "Acesso restrito a administradores ativos." }, { status: 403 }) }
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceRoleKey) {
        console.error("SUPABASE_SERVICE_ROLE_KEY não está configurada no ambiente do servidor.")
        return { response: NextResponse.json({ error: "O gerenciamento administrativo não está configurado no servidor." }, { status: 503 }) }
    }

    return {
        actorId: user.id,
        supabaseAdmin: createClient(supabaseUrl, serviceRoleKey, {
            auth: { autoRefreshToken: false, persistSession: false },
        }),
    }
}

export function isAdminContextResult(result: AdminContextResult): result is { response: NextResponse } {
    return "response" in result
}

export async function lerJson(request: Request): Promise<Record<string, unknown> | null> {
    try {
        const body: unknown = await request.json()
        if (typeof body !== "object" || body === null || Array.isArray(body)) return null
        return body as Record<string, unknown>
    } catch {
        return null
    }
}
