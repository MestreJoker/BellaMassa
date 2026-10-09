import { faPencil, faEllipsisH, faSearch } from "@fortawesome/free-solid-svg-icons"
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Axios from "axios"
import { useEffect, useState } from "react"

interface ClienteProps {
    idCliente: number
    nome: string
    telefone: string
    endereco: string
    bairro: string
    status: string
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
    const [carregando, setCarregando] = useState(true)
    const [termoBusca, setTermoBusca] = useState("")
    const [filtroStatus, setFiltroStatus] = useState("Todos") // "Todos", "Ativo", "Não Ativo"
    const [clienteSelecionado, setClienteSelecionado] = useState(0)

    useEffect(() => {
        async function resgatarDados() {
            try {
                const response = await Axios.get<ClienteProps[]>("/json/clientes.json")
                setClientes(response.data)
            } finally {
                setCarregando(false)
            }
        }
        resgatarDados()
    }, [])

    // Lógica de filtragem por busca e por status
    const clientesFiltrados = clientes.filter((item) => {
        const termo = termoBusca.toLowerCase()
        const correspondeBusca =
            item.nome.toLowerCase().includes(termo) ||
            item.telefone.toLowerCase().includes(termo) ||
            item.endereco.toLowerCase().includes(termo) ||
            item.bairro.toLowerCase().includes(termo) ||
            item.status.toLowerCase().includes(termo)

        if (filtroStatus === "Todos") return correspondeBusca
        return correspondeBusca && item.status.toLowerCase() === filtroStatus.toLowerCase()
    })

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
        <section className="min-w-0 flex-3 h-full flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden font-sans">
            {/* Cabeçalho da Seção com Filtro de Status (Esquerda) e Barra de Pesquisa (Direita) */}
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
                {/* Lado Esquerdo: Filtros de Status */}
                <div className="flex items-center gap-2">
                    {["Todos", "Ativo", "Inativo"].map((status) => (
                        <button
                            key={status}
                            type="button"
                            onClick={() => setFiltroStatus(status)}
                            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                                filtroStatus === status
                                    ? "bg-rose-600 text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                            {status === "Inativo" ? "Não ativo" : status}
                        </button>
                    ))}
                </div>

                {/* Lado Direito: Barra de Pesquisa */}
                <div className="relative w-72">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <FontAwesomeIcon icon={faSearch} className="text-xs" />
                    </span>
                    <input
                        type="text"
                        placeholder="Pesquisar cliente..."
                        value={termoBusca}
                        onChange={(e) => setTermoBusca(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs text-slate-700 outline-none transition-colors focus:border-slate-400 focus:bg-white"
                    />
                </div>
            </div>

            {/* Container da Tabela com rolagem interna */}
            <div className="w-full flex-1 overflow-y-auto overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-slate-50/70 text-xs font-semibold uppercase text-slate-500 border-b border-slate-100 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-4 bg-slate-50">Nome</th>
                            <th className="px-6 py-4 bg-slate-50">Telefone</th>
                            <th className="px-6 py-4 bg-slate-50">Endereço</th>
                            <th className="px-6 py-4 bg-slate-50">Bairro</th>
                            <th className="px-6 py-4 bg-slate-50">Status</th>
                            <th className="px-6 py-4 bg-slate-50 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {carregando ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">Carregando clientes...</td>
                            </tr>
                        ) : clientesFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">Nenhum cliente encontrado.</td>
                            </tr>
                        ) : (
                            clientesFiltrados.map((item) => (
                                <tr key={item.idCliente} className={`transition-colors cursor-pointer ${item.idCliente == clienteSelecionado ? (`bg-[#ca1921] text-white`) : (`hover:bg-slate-50/60 text-slate-600`)}`}
                                onClick={() => selecionarLinha(item.idCliente)}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${obterCorAvatar(item.idCliente)}
                                            border border-white`}>
                                                {obterIniciais(item.nome)}
                                            </span>
                                            <span className="font-medium">{item.nome}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap ">
                                        <div className="inline-flex items-center gap-2">
                                            <FontAwesomeIcon icon={faWhatsapp} className={` text-base ${clienteSelecionado == item.idCliente ? (`text-white`) : ('text-emerald-600')}`} />
                                            <span>{item.telefone}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{item.endereco}</td>
                                    <td className="px-6 py-4">{item.bairro}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                            item.status === "Ativo"
                                                ? "bg-emerald-50 text-emerald-600"
                                                : "bg-slate-100 text-slate-600"
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                type="button"
                                                aria-label={`Editar ${item.nome}`}
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
                                            >
                                                <FontAwesomeIcon icon={faPencil} className="text-xs" />
                                            </button>
                                            <button
                                                type="button"
                                                aria-label="Mais opções"
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
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
        </section>
    )
}