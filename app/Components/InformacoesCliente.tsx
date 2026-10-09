import { faUser, faPhone, faLocationDot, faPencil, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Axios from "axios"
import { useEffect, useState } from "react"

interface InfomacoesClienteProps {
    idCliente: number
}

interface ClienteProps {
    idCliente: number
    nome: string
    telefone: string
    endereco: string
    bairro: string
    status: string
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
    "bg-rose-600 text-white",
]

function obterCorAvatar(id: number) {
    return coresAvatares[id % coresAvatares.length]
}

export default function InfomacoesCliente(props: InfomacoesClienteProps) {
    const [clienteSelecionado, setClienteSelecionado] = useState<ClienteProps>()

    useEffect(() => {
        async function resgatarDados() {
            try {
                const response = await Axios.get(`/json/clientes.json`)
                const dados: ClienteProps[] = response.data
                const cliente = dados.find(item => item.idCliente === props.idCliente)
                setClienteSelecionado(cliente)
            }
            catch (erro) {
                console.log(erro)
            }
        }
        if (props.idCliente !== 0) {
            resgatarDados()
        }
    }, [props.idCliente])

    return (
        <div className="flex-1 rounded-xl h-full p-6 bg-white border border-slate-200 shadow-sm flex flex-col font-sans overflow-y-auto">
            {props.idCliente !== 0 && clienteSelecionado ? (
                <div className="flex flex-col h-full justify-between gap-6">
                    <div>
                        {/* Título do Card */}
                        <h2 className="text-lg font-bold text-slate-800 mb-6">Detalhes do Cliente</h2>

                        {/* Perfil (Avatar + Nome + Status) */}
                        <div className="flex items-center gap-4 mb-6">
                            <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-base font-bold shadow-sm ${obterCorAvatar(clienteSelecionado.idCliente)}`}>
                                {obterIniciais(clienteSelecionado.nome)}
                            </span>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-bold text-slate-900">{clienteSelecionado.nome}</h3>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                        clienteSelecionado.status === "Ativo"
                                            ? "bg-emerald-50 text-emerald-600"
                                            : "bg-slate-100 text-slate-600"
                                    }`}>
                                        {clienteSelecionado.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Informações de Contato e Endereço */}
                        <div className="space-y-4 mb-8 text-sm text-slate-600 border-b border-slate-100 pb-6">
                            <div className="flex items-center gap-3">
                                <FontAwesomeIcon icon={faPhone} className="text-slate-400 text-sm w-4" />
                                <span className="font-medium text-slate-700">{clienteSelecionado.telefone}</span>
                                <FontAwesomeIcon icon={faWhatsapp} className="text-emerald-600 text-base ml-1" />
                            </div>
                            <div className="flex items-start gap-3">
                                <FontAwesomeIcon icon={faLocationDot} className="text-slate-400 text-sm w-4 mt-0.5" />
                                <div className="flex flex-col">
                                    <span className="font-medium text-slate-700">{clienteSelecionado.endereco}</span>
                                    <span className="text-xs text-slate-400">{clienteSelecionado.bairro}</span>
                                </div>
                            </div>
                        </div>

                        {/* Seção Últimos Pedidos */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-bold text-slate-800">Últimos pedidos</h4>
                                <button type="button" className="text-xs font-semibold text-indigo-600 hover:underline">
                                    Ver todos
                                </button>
                            </div>

                            {/* Lista simulada de pedidos recentes */}
                            <div className="space-y-3">
                                {[
                                    { id: "#1024", data: "15/09/2026", status: "Entregue" },
                                    { id: "#1018", data: "08/09/2026", status: "Entregue" },
                                    { id: "#1003", data: "22/08/2026", status: "Entregue" },
                                ].map((pedido, index) => (
                                    <div key={index} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-3 text-xs">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-bold text-slate-800">{pedido.id}</span>
                                            <span className="text-slate-400">{pedido.data}</span>
                                        </div>
                                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-600">
                                            {pedido.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Botões de Ação Inferiores */}
                    <div className="flex flex-col gap-3 pt-4 pb-5 border-t border-slate-100">
                        <button
                            type="button"
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                        >
                            <FontAwesomeIcon icon={faPencil} className="text-xs text-slate-500" />
                            Editar cliente
                        </button>
                        <button
                            type="button"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700 shadow-sm"
                        >
                            <FontAwesomeIcon icon={faTrashCan} className="text-xs text-white" />
                            Desativar cliente
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex-1 p-6 h-full text-slate-400 flex flex-col items-center justify-center gap-2">
                    <FontAwesomeIcon icon={faUser} className="text-2xl text-slate-300" />
                    <p className="text-sm font-medium text-slate-400">Nenhum cliente selecionado</p>
                </div>
            )}
        </div>
    )
}