// Clientes.tsx
import { useEffect, useState } from "react";
import ConteudoCardsDashboard from "../Widgets/ConteudoCardsDashboard";
import Axios from "axios";
import TabelaClientes from "../Components/TabelaClientes";

export default function Clientes(){
    const [clientes, setClientes] = useState([])

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

    return(
        /* h-full flex flex-col faz o componente preencher todo o espaço do main */
        <div className="h-full flex flex-col">
            <div className="shrink-0">
                <ConteudoCardsDashboard pagina="clientes" valor1={clientes.length} />
            </div>

            {/* flex-1 min-h-0 obriga a tabela e a div vermelha a respeitarem o espaço restante sem estourar */}
            <div className="flex gap-3 mt-3 flex-1 min-h-0">
                <TabelaClientes />
                
                <div className="flex-1 bg-red-500 rounded-xl h-full"></div>
            </div>
        </div>
    )
}