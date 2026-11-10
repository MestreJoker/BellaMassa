// Clientes.tsx
import { useEffect, useState } from "react";
import ConteudoCardsDashboard from "../Widgets/ConteudoCardsDashboard";
import TabelaClientes from "../Components/TabelaClientes";
import InfomacoesCliente from "../Components/InformacoesCliente";
import { obterClientes } from "../lib/database";
import ModalNovoCliente from "../Components/ModalNovoCliente";

export default function Clientes(){
    const [totalClientes, setTotalClientes] = useState(0)
    const [clientesAtuais, setClientesAtuais] = useState<Awaited<ReturnType<typeof obterClientes>>>([])
    const [idClienteSelecionado, setIdClienteSelecionado] = useState(0)
    const [modalNovoClienteAberto, setModalNovoClienteAberto] = useState(false)
    const [atualizacaoClientes, setAtualizacaoClientes] = useState(0)
    const [erroCarga, setErroCarga] = useState("")

    useEffect(() => {
        async function resgatarDados() {
            try{
                const dados = await obterClientes()
                setClientesAtuais(dados)
                setTotalClientes(dados.length)
                setErroCarga("")
            }
            catch(erro: unknown){
                console.error("Não foi possível carregar os clientes.", erro)
                setErroCarga("Não foi possível carregar os clientes. Atualize a página e tente novamente.")
            }
        }
        resgatarDados()
    }, [atualizacaoClientes])

    function passarIdCliente(idCliente: number){
        setIdClienteSelecionado(idCliente)
    }

    const agora = new Date()
    const clientesStats = {
        ativos: clientesAtuais.filter((cliente) => cliente.status === "Ativo").length,
        novosNoMes: clientesAtuais.filter((cliente) => {
            const criadoEm = new Date(cliente.criadoEm)
            return criadoEm.getFullYear() === agora.getFullYear() && criadoEm.getMonth() === agora.getMonth()
        }).length,
        bairrosAtendidos: new Set(clientesAtuais.map((cliente) => cliente.bairro.trim()).filter(Boolean)).size,
    }

    return(
        <div className="min-w-0 xl:flex xl:h-full xl:flex-col">
            {erroCarga && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{erroCarga}</p>}
            <div className="shrink-0">
                <ConteudoCardsDashboard pagina="clientes" valor1={totalClientes} clientesStats={clientesStats} />
            </div>

            <div className="mt-3 flex justify-end">
                <button type="button" onClick={() => setModalNovoClienteAberto(true)} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-bold text-white">
                    Novo cliente
                </button>
            </div>
            <div className="mt-3 flex min-w-0 flex-col gap-3 xl:min-h-0 xl:flex-1 xl:flex-row">
                <TabelaClientes informarClique={passarIdCliente} atualizarLista={atualizacaoClientes}/>
                
                <InfomacoesCliente
                    idCliente={idClienteSelecionado}
                    atualizarLista={atualizacaoClientes}
                    onAtualizado={() => setAtualizacaoClientes((valor) => valor + 1)}
                />
            </div>
            <ModalNovoCliente
                aberto={modalNovoClienteAberto}
                onFechar={() => setModalNovoClienteAberto(false)}
                onCriado={() => {
                    setModalNovoClienteAberto(false)
                    setAtualizacaoClientes((valor) => valor + 1)
                    setTotalClientes((total) => total + 1)
                }}
            />
        </div>
    )
}