// Clientes.tsx
import { useEffect, useState } from "react";
import ConteudoCardsDashboard from "../Widgets/ConteudoCardsDashboard";
import TabelaClientes from "../Components/TabelaClientes";
import InfomacoesCliente from "../Components/InformacoesCliente";
import { obterClientes } from "../lib/database";
import ModalNovoCliente from "../Components/ModalNovoCliente";

export default function Clientes(){
    const [totalClientes, setTotalClientes] = useState(0)
    const [idClienteSelecionado, setIdClienteSelecionado] = useState(0)
    const [modalNovoClienteAberto, setModalNovoClienteAberto] = useState(false)
    const [atualizacaoClientes, setAtualizacaoClientes] = useState(0)

    useEffect(() => {
        async function resgatarDados() {
            try{
                const dados = await obterClientes()
                setTotalClientes(dados.length)
            }
            catch(erro: unknown){
                console.error("Não foi possível carregar os clientes.", erro)
            }
        }
        resgatarDados()
    }, [])

    function passarIdCliente(idCliente: number){
        setIdClienteSelecionado(idCliente)
    }

    return(
        <div className="min-w-0 xl:flex xl:h-full xl:flex-col">
            <div className="shrink-0">
                <ConteudoCardsDashboard pagina="clientes" valor1={totalClientes} />
            </div>

            <div className="mt-3 flex justify-end">
                <button type="button" onClick={() => setModalNovoClienteAberto(true)} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-bold text-white">
                    Novo cliente
                </button>
            </div>
            <div className="mt-3 flex min-w-0 flex-col gap-3 xl:min-h-0 xl:flex-1 xl:flex-row">
                <TabelaClientes informarClique={passarIdCliente} atualizarLista={atualizacaoClientes}/>
                
                <InfomacoesCliente idCliente={idClienteSelecionado}/>
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