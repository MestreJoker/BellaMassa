import { supabase } from "../../lib/supabase"

export interface UsuarioSessao {
    id: string
    nome: string
    email: string
    isAdmin: boolean
}

export async function obterUsuarioSessao(): Promise<UsuarioSessao | null> {
    const { data: sessaoData, error: erroSessao } = await supabase.auth.getSession()
    if (erroSessao) throw erroSessao
    if (!sessaoData.session) return null

    const { data: usuarioData, error: erroUsuario } = await supabase.auth.getUser()
    if (erroUsuario) throw erroUsuario
    if (!usuarioData.user) return null

    const { data: perfil, error } = await supabase
        .from("perfis")
        .select("nome, is_admin, ativo")
        .eq("auth_user_id", usuarioData.user.id)
        .maybeSingle()

    if (error) throw error
    if (!perfil?.ativo) return null

    return {
        id: usuarioData.user.id,
        nome: perfil.nome,
        email: usuarioData.user.email ?? "",
        isAdmin: perfil.is_admin,
    }
}

export async function encerrarSessao(): Promise<void> {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
}
