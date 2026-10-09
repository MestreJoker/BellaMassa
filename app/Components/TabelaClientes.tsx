"use client"

import { faChevronLeft, faChevronRight, faEllipsisH, faPencil, faSearch, faUsers } from "@fortawesome/free-solid-svg-icons"
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Axios from "axios"
import { useEffect, useState } from "react"

interface ClienteProps {
    idCliente: number
    nome: string
    telefone: string
    endereco: string
    idBairro: number
    status: string
}

interface BairroProps {
    idBairro: number
    nome: string
}

interface TabelaClientesProps {
    informarClique: (idCliente: number) => void
}

function obterIniciais(nome: string) {
    const partes = nome.trim().split(" ")
    if (partes.length === 0) return "C"
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase()
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
}

const coresAvatares = [
    "bg-blue-600 text-white",
    "bg-pink-600 text-white",
    "bg-indigo-600 text-white",
    "bg-amber-600 text-white",
    "bg-emerald-600 text-white",
    "bg-purple-600 text-white",
    "bg-rose-600 text-white",
]

function obterCorAvatar(id: number) {
    return coresAvatares[id % coresAvatares.length]
}

export default function TabelaClientes(props: TabelaClientesProps) {
    const [clientes, setClientes] = useState<ClienteProps[]>([])
    const [bairros, setBairros] = useState<BairroProps[]>([])
    const [carregando, setCarregando] = useState(true)
    const [termoBusca, setTermoBusca] = useState("")
    const [filtroStatus, setFiltroStatus] = useState("Todos") // "Todos", "Ativo", "Inativo"
    const [clienteSelecionado, setClienteSelecionado] = useState(0)
    const [paginaAtual, setPaginaAtual] = useState(1)
    const [itensPorPagina, setItensPorPagina] = useState(10)

    useEffect(() => {
        async function resgatarDados() {
            try {
                const [responseClientes, responseBairros] = await Promise.all([
                    Axios.get<ClienteProps[]>("/json/clientes.json"),
                    Axios.get<BairroProps[]>("/json/bairros.json")
                ])
                setClientes(responseClientes.data)
                setBairros(responseBairros.data)
            } finally {
                setCarregando(false)
            }
        }
        resgatarDados()
    }, [])

    // Função para buscar o nome do bairro pelo idBairro
    function obterNomeBairro(idBairro: number) {
        const bairroEncontrado = bairros.find((b) => b.idBairro === idBairro)
        return bairroEncontrado ? bairroEncontrado.nome : ""
    }

    // Lógica de filtragem considerando o nome real do bairro resolvido
    const clientesFiltrados = clientes.filter((item) => {
        const termo = termoBusca.toLowerCase()
        const nomeBairro = obterNomeBairro(item.idBairro).toLowerCase()

        const correspondeBusca =
            String(item.nome || "").toLowerCase().includes(termo) ||
            String(item.telefone || "").toLowerCase().includes(termo) ||
            String(item.endereco || "").toLowerCase().includes(termo) ||
            nomeBairro.includes(termo) ||
            String(item.status || "").toLowerCase().includes(termo)

        if (filtroStatus === "Todos") return correspondeBusca
        return correspondeBusca && String(item.status || "").toLowerCase() === filtroStatus.toLowerCase()
    })

    const totalPaginas = Math.max(1, Math.ceil(clientesFiltrados.length / itensPorPagina))
    const indiceInicial = (paginaAtual - 1) * itensPorPagina
    const clientesVisiveis = clientesFiltrados.slice(indiceInicial, indiceInicial + itensPorPagina)
    const paginasVisiveis = Array.from({ length: totalPaginas }, (_, index) => index + 1).filter((pagina) =>
        totalPaginas <= 5 || pagina === 1 || pagina === totalPaginas || Math.abs(pagina - paginaAtual) <= 1
    )

    function selecionarLinha(idCliente: number){
        if (idCliente != clienteSelecionado){
            setClienteSelecionado(idCliente)
            props.informarClique(idCliente)
        }
        else{
            props.informarClique(0)
            setClienteSelecionado(0)
        }
    }

    return (
        <section className="flex h-[min(70dvh,560px)] min-h-80 w-full min-w-0 flex-col overflow-hidden rounded-lg border border-[#dce7f4] bg-white font-sans shadow-[0_2px_10px_rgba(27,55,90,0.08)] xl:h-full xl:flex-3">
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[#e8eef6] px-4 py-3 sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#eaf1fb] text-[#18345b]">
                        <FontAwesomeIcon icon={faUsers} className="text-sm" />
                    </span>
                    <h2 className="text-base font-bold text-[#102447] sm:text-lg">Lista de Clientes</h2>
                </div>
                <span className="text-xs font-medium text-[#4f6b95] sm:text-sm">
                    {clientesFiltrados.length} {clientesFiltrados.length === 1 ? "cliente encontrado" : "clientes encontrados"}
                </span>
            </div>

            <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[#e8eef6] px-4 py-3 sm:px-5">
                <div className="flex items-center gap-1.5">
                    {["Todos", "Ativo", "Inativo"].map((status) => (
                        <button
                            key={status}
                            type="button"
                            onClick={() => {
                                setFiltroStatus(status)
                                setPaginaAtual(1)
                            }}
                            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                                filtroStatus === status
                                    ? "bg-[#18345b] text-white"
                                    : "bg-[#f0f4fa] text-[#4f6382] hover:bg-[#e5edf7]"
                            }`}
                        >
                            {status === "Inativo" ? "Não ativo" : status}
                        </button>
                    ))}
                </div>

                {/* Lado Direito: Barra de Pesquisa */}
                <div className="relative w-full sm:w-64">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <FontAwesomeIcon icon={faSearch} className="text-xs" />
                    </span>
                    <input
                        type="text"
                        placeholder="Pesquisar cliente..."
                        value={termoBusca}
                        onChange={(e) => {
                            setTermoBusca(e.target.value)
                            setPaginaAtual(1)
                        }}
                        className="w-full rounded-md border border-[#dce7f4] bg-white py-2 pl-9 pr-3 text-xs text-[#18345b] outline-none transition-colors placeholder:text-[#8192ac] focus:border-[#5476a5]"
                    />
                </div>
            </div>

            {/* Container da Tabela com rolagem interna */}
            <div className="min-w-0 flex-1 overflow-auto">
                <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                    <thead className="sticky top-0 z-10 border-b border-[#e7edf5] bg-[#f2f6fb] text-xs font-semibold text-[#18345b]">
                        <tr>
                            <th className="bg-[#f2f6fb] px-4 py-3 text-left sm:px-5">Nome</th>
                            <th className="bg-[#f2f6fb] px-4 py-3 text-left sm:px-5">Telefone</th>
                            <th className="bg-[#f2f6fb] px-4 py-3 text-left sm:px-5">Endereço</th>
                            <th className="bg-[#f2f6fb] px-4 py-3 text-left sm:px-5">Bairro</th>
                            <th className="bg-[#f2f6fb] px-4 py-3 text-left sm:px-5">Status</th>
                            <th className="bg-[#f2f6fb] px-4 py-3 text-center sm:px-5">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {carregando ? (
                            <tr>
                                <td colSpan={6} className="px-5 py-12 text-center text-[#657a99]">Carregando clientes...</td>
                            </tr>
                        ) : clientesFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-5 py-12 text-center text-[#657a99]">Nenhum cliente encontrado.</td>
                            </tr>
                        ) : (
                            clientesVisiveis.map((item) => (
                                <tr key={item.idCliente} className={`cursor-pointer border-b border-[#edf1f6] transition-colors ${item.idCliente === clienteSelecionado ? "bg-[#edf4ff] text-[#18345b]" : "text-[#25436e] hover:bg-[#f8faff]"}`}
                                onClick={() => selecionarLinha(item.idCliente)}>
                                    <td className="whitespace-nowrap px-4 py-2.5 sm:px-5 sm:py-3">
                                        <div className="flex items-center gap-3">
                                            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${obterCorAvatar(item.idCliente)}
                                            border border-white`}>
                                                {obterIniciais(item.nome)}
                                            </span>
                                            <span className="font-medium">{item.nome}</span>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2.5 sm:px-5 sm:py-3">
                                        <div className="inline-flex items-center gap-2">
                                            <FontAwesomeIcon icon={faWhatsapp} className="text-base text-[#159447]" />
                                            <span>{item.telefone}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2.5 sm:px-5 sm:py-3">{item.endereco}</td>
                                    {/* Exibindo o nome do bairro resolvido pelo ID */}
                                    <td className="px-4 py-2.5 sm:px-5 sm:py-3">{obterNomeBairro(item.idBairro)}</td>
                                    <td className="whitespace-nowrap px-4 py-2.5 sm:px-5 sm:py-3">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                                            item.status === "Ativo"
                                                ? "bg-[#d2f5e2] text-[#167144]"
                                                : "bg-[#dce8fa] text-[#355682]"
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2.5 text-center sm:px-5 sm:py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                type="button"
                                                aria-label={`Editar ${item.nome}`}
                                                className="inline-flex size-9 items-center justify-center rounded-md border border-[#dce7f4] text-[#18345b] transition-colors hover:bg-[#edf4ff]"
                                            >
                                                <FontAwesomeIcon icon={faPencil} className="text-xs" />
                                            </button>
                                            <button
                                                type="button"
                                                aria-label="Mais opções"
                                                className="inline-flex size-9 items-center justify-center rounded-md border border-[#dce7f4] text-[#18345b] transition-colors hover:bg-[#edf4ff]"
                                            >
                                                <FontAwesomeIcon icon={faEllipsisH} className="text-xs" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <footer className="flex shrink-0 flex-col gap-3 border-t border-[#e8eef6] px-4 py-3 text-sm text-[#4f6b95] sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div className="flex items-center gap-2 text-xs">
                    <label htmlFor="clientes-por-pagina">Mostrar</label>
                    <select
                        id="clientes-por-pagina"
                        value={itensPorPagina}
                        onChange={(evento) => {
                            setItensPorPagina(Number(evento.target.value))
                            setPaginaAtual(1)
                        }}
                        className="h-8 rounded-md border border-[#dce7f4] bg-white px-2 text-[#18345b] outline-none focus:border-[#5476a5]"
                    >
                        {[5, 10, 25].map((quantidade) => (
                            <option key={quantidade} value={quantidade}>{quantidade}</option>
                        ))}
                    </select>
                    <span>por página</span>
                </div>

                <nav aria-label="Paginação de clientes" className="flex max-w-full items-center gap-1 overflow-x-auto">
                    <button
                        type="button"
                        aria-label="Página anterior"
                        disabled={paginaAtual === 1}
                        onClick={() => setPaginaAtual((pagina) => Math.max(1, pagina - 1))}
                        className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-[#dce7f4] text-[#355682] transition-colors hover:bg-[#edf4ff] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    {paginasVisiveis.map((pagina, index) => (
                        <span key={pagina} className="contents">
                            {index > 0 && pagina - paginasVisiveis[index - 1] > 1 && (
                                <span className="hidden px-1 text-[#8092ad] sm:inline">...</span>
                            )}
                            <button
                                type="button"
                                aria-label={`Página ${pagina}`}
                                aria-current={paginaAtual === pagina ? "page" : undefined}
                                onClick={() => setPaginaAtual(pagina)}
                                className={`inline-flex size-9 shrink-0 items-center justify-center rounded-md border text-sm font-medium transition-colors ${
                                    paginaAtual === pagina
                                        ? "border-[#c61f2a] bg-[#c61f2a] text-white shadow-sm"
                                        : "hidden border-[#dce7f4] text-[#355682] hover:bg-[#edf4ff] sm:inline-flex"
                                }`}
                            >
                                {pagina}
                            </button>
                        </span>
                    ))}
                    <button
                        type="button"
                        aria-label="Próxima página"
                        disabled={paginaAtual === totalPaginas}
                        onClick={() => setPaginaAtual((pagina) => Math.min(totalPaginas, pagina + 1))}
                        className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-[#dce7f4] text-[#355682] transition-colors hover:bg-[#edf4ff] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </nav>
            </footer>
        </section>
    )
}