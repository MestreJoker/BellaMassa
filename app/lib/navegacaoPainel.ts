const STORAGE_KEY = "bella-massa:navegacao-painel"
const ESTADO_INICIAL = "0:false"
const listeners = new Set<() => void>()
let estadoMemoria = ESTADO_INICIAL

function normalizarEstado(estado: string): string {
    const [pagina, criandoPedido] = estado.split(":")
    const indicePagina = Number(pagina)
    if (!Number.isInteger(indicePagina) || indicePagina < 0 || indicePagina > 7) return ESTADO_INICIAL
    return `${indicePagina}:${indicePagina === 1 && criandoPedido === "true"}`
}

export function obterEstadoNavegacaoPainel(): string {
    try {
        return normalizarEstado(window.localStorage.getItem(STORAGE_KEY) ?? estadoMemoria)
    } catch (erro) {
        console.error("Não foi possível restaurar a seção selecionada.", erro)
        return estadoMemoria
    }
}

export function obterEstadoNavegacaoPainelServidor(): string {
    return ESTADO_INICIAL
}

export function assinarNavegacaoPainel(notificar: () => void): () => void {
    listeners.add(notificar)
    const aoAlterarEmOutraAba = () => notificar()
    window.addEventListener("storage", aoAlterarEmOutraAba)
    return () => {
        listeners.delete(notificar)
        window.removeEventListener("storage", aoAlterarEmOutraAba)
    }
}

export function salvarNavegacaoPainel(pagina: number, criandoPedido: boolean): void {
    const estado = normalizarEstado(`${pagina}:${criandoPedido}`)
    estadoMemoria = estado
    try {
        window.localStorage.setItem(STORAGE_KEY, estado)
    } catch (erro) {
        console.error("Não foi possível salvar a seção selecionada.", erro)
    }
    listeners.forEach((notificar) => notificar())
}
