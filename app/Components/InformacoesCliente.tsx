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

export default function InfomacoesCliente(props: InfomacoesClienteProps) {
    const [clienteSelecionado, setClienteSelecionado] = useState<ClienteProps>()
    useEffect(() => {
        async function resgatarDados() {
            try {
                const response = await Axios.get(`/json/clientes.json`)
                const dados: ClienteProps[] = response.data
                const clienteSelecionado = dados.filter(item => item.idCliente == props.idCliente)
                setClienteSelecionado(clienteSelecionado[0])
            }
            catch (erro) {
                console.log(erro)
            }
        }
        resgatarDados()
    }, [props.idCliente])

    return (
        <div className="flex-1 bg-red-500 rounded-xl h-full p-3">
            {clienteSelecionado?.nome}
        </div>
    )
}
