// Clientes.tsx
import { useEffect, useState } from "react";
import ConteudoCardsDashboard from "../Widgets/ConteudoCardsDashboard";
import Axios from "axios";
import TabelaClientes from "../Components/TabelaClientes";
import InfomacoesCliente from "../Components/InformacoesCliente";

export default function Clientes(){
    const [clientes, setClientes] = useState([])
    const [idClienteSelecionado, setIdClienteSelecionado] = useState(0)

    useEffect(() => {
        async function resgatarDados() {
            try{
                const response = await Axios.get("/json/clientes.json")
                const dados = response.data
                setClientes(dados)
            }
            catch(erro){
                console.log(erro)
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
                <ConteudoCardsDashboard pagina="clientes" valor1={clientes.length} />
            </div>

            <div className="mt-3 flex min-w-0 flex-col gap-3 xl:min-h-0 xl:flex-1 xl:flex-row">
                <TabelaClientes informarClique={passarIdCliente}/>
                
                <InfomacoesCliente idCliente={idClienteSelecionado}/>
            </div>
        </div>
    )
}