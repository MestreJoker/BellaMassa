import { useState, useEffect, useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faUserPlus, faUser, faLocationDot, faChevronDown, faCheck } from "@fortawesome/free-solid-svg-icons"
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons"
import Axios from "axios"

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

interface BuscaClienteProps {
    clienteSelecionadoId: number
    onSelecionarCliente: (idCliente: number) => void
    onNovoCliente?: () => void
}

function obterIniciais(nome: string) {
    if (!nome) return "C"
    const partes = nome.trim().split(" ")
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase()
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
}

const coresAvatares = [
    "bg-indigo-600 text-white",
    "bg-pink-600 text-white",
    "bg-blue-600 text-white",
    "bg-amber-600 text-white",
    "bg-emerald-600 text-white",
    "bg-purple-600 text-white",
]

function obterCorAvatar(id: number) {
    return coresAvatares[id % coresAvatares.length]
}

export default function BuscaClientePedido({ clienteSelecionadoId, onSelecionarCliente, onNovoCliente }: BuscaClienteProps) {
    const [clientes, setClientes] = useState<ClienteProps[]>([])
    const [bairros, setBairros] = useState<BairroProps[]>([])
    const [termoBusca, setTermoBusca] = useState("")
    const [aberto, setAberto] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        async function carregarDados() {
            try {
                const [resClientes, resBairros] = await Promise.all([
                    Axios.get<ClienteProps[]>("/json/clientes.json"),
                    Axios.get<BairroProps[]>("/json/bairros.json")
                ])
                setClientes(resClientes.data)
                setBairros(resBairros.data)
            } catch (erro) {
                console.log(erro)
            }
        }
        carregarDados()

        // Fechar dropdown ao clicar fora
        function handleClickFora(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setAberto(false)
            }
        }
        document.addEventListener("mousedown", handleClickFora)
        return () => document.removeEventListener("mousedown", handleClickFora)
    }, [])

    const clienteAtual = clientes.find(c => c.idCliente === clienteSelecionadoId)

    function obterNomeBairro(idBairro: number) {
        const b = bairros.find(item => item.idBairro === idBairro)
        return b ? b.nome : ""
    }

    const clientesFiltrados = clientes.filter(c => {
        const termo = termoBusca.toLowerCase()
        return c.nome.toLowerCase().includes(termo) || c.telefone.toLowerCase().includes(termo)
    })

    return (
        <div ref={containerRef} className="relative w-full min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm font-sans sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faUser} className="text-slate-700 text-sm" />
                    <h3 className="text-base font-bold text-slate-800">Cliente</h3>
                </div>
                {onNovoCliente && (
                    <button
                        type="button"
                        onClick={onNovoCliente}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                    >
                        <FontAwesomeIcon icon={faUserPlus} className="text-xs text-slate-500" />
                        Novo cliente
                    </button>
                )}
            </div>

            {/* Barra de Pesquisa / Dropdown para selecionar o cliente */}
            <div className="relative">
                <div
                    onClick={() => setAberto(!aberto)}
                    className="flex items-center justify-between w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs text-slate-700 cursor-pointer transition-colors hover:bg-slate-50"
                >
                    <div className="flex min-w-0 flex-1 items-center gap-2.5">
                        <FontAwesomeIcon icon={faSearch} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou telefone..."
                            value={termoBusca}
                            onChange={(e) => {
                                setTermoBusca(e.target.value)
                                setAberto(true)
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full min-w-0 bg-transparent text-xs text-slate-700 outline-none"
                        />
                    </div>
                    <FontAwesomeIcon icon={faChevronDown} className="text-slate-400 text-xs" />
                </div>

                {/* Lista suspensa de resultados da busca */}
                {aberto && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl border border-slate-200 shadow-lg z-20 max-h-60 overflow-y-auto divide-y divide-slate-100">
                        {clientesFiltrados.length === 0 ? (
                            <div className="p-4 text-center text-xs text-slate-400">Nenhum cliente encontrado</div>
                        ) : (
                            clientesFiltrados.map((cliente) => (
                                <div
                                    key={cliente.idCliente}
                                    onClick={() => {
                                        onSelecionarCliente(cliente.idCliente)
                                        setAberto(false)
                                        setTermoBusca("")
                                    }}
                                    className="flex items-center justify-between p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${obterCorAvatar(cliente.idCliente)}`}>
                                            {obterIniciais(cliente.nome)}
                                        </span>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800">{cliente.nome}</p>
                                            <p className="text-[11px] text-slate-400">{cliente.telefone}</p>
                                        </div>
                                    </div>
                                    {cliente.idCliente === clienteSelecionadoId && (
                                        <FontAwesomeIcon icon={faCheck} className="text-rose-600 text-xs" />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Exibição detalhada do cliente selecionado */}
            {clienteAtual && (
                <div className="mt-4 flex flex-col gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3.5">
                        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${obterCorAvatar(clienteAtual.idCliente)}`}>
                            {obterIniciais(clienteAtual.nome)}
                        </span>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-bold text-slate-900">{clienteAtual.nome}</span>
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                <FontAwesomeIcon icon={faWhatsapp} className="text-emerald-600 text-sm" />
                                <span>{clienteAtual.telefone}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex min-w-0 items-start gap-2.5 text-xs text-slate-600">
                        <FontAwesomeIcon icon={faLocationDot} className="text-slate-400 mt-0.5" />
                        <div className="flex min-w-0 flex-col">
                            <span className="font-medium text-slate-800">{clienteAtual.endereco}</span>
                            <span className="text-slate-400">{obterNomeBairro(clienteAtual.idBairro)} - SP</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}