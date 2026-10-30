export interface UsuarioSessao {
    id: number
    nome: string
    email: string
}

const CHAVE_SESSAO = "bella-massa-usuario"

export function obterUsuarioSessao(): UsuarioSessao | null {
    const usuarioSalvo = sessionStorage.getItem(CHAVE_SESSAO)
    if (!usuarioSalvo) return null

    try {
        return JSON.parse(usuarioSalvo) as UsuarioSessao
    } catch {
        sessionStorage.removeItem(CHAVE_SESSAO)
        return null
    }
}

export function salvarUsuarioSessao(usuario: UsuarioSessao) {
    sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify(usuario))
}

export function encerrarSessao() {
    sessionStorage.removeItem(CHAVE_SESSAO)
}
