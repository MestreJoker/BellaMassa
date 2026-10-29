"use client"

import { useEffect, useMemo, useState } from "react";
import Axios from "axios";
import ConteudoCardsDashboard from "../Widgets/ConteudoCardsDashboard";
import GraficoMovimentoPedidos from "../Components/GraficoMovimentoPedidos";
import GraficoPedidosPorTipo from "../Components/GraficoPedidosPorTipo";
import CardReceitaDia from "../Components/CardReceitaDia";
import TabelaPedidosRecentes from "../Components/TabelaPedidosRecentes";

interface ClienteJson {
    idCliente: number
    nome: string
    status: string
}

interface PedidoJson {
    idPedido: number
    idCliente: number
    dataPedido: string
    total: number
    status: string
    formaPagamento?: string
    tipoEntrega?: string
}

interface CardapioJson {
    idItem: number
    idCategoria: number
    nome: string
    preco: number
}

export default function Dashboard() {
    const [clientes, setClientes] = useState<ClienteJson[]>([])
    const [pedidos, setPedidos] = useState<PedidoJson[]>([])
    const [cardapio, setCardapio] = useState<CardapioJson[]>([])
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        async function carregarDados() {
            try {
                const [clientesResponse, pedidosResponse, cardapioResponse] = await Promise.all([
                    Axios.get<ClienteJson[]>("/json/clientes.json"),
                    Axios.get<PedidoJson[]>("/json/pedidos.json"),
                    Axios.get<CardapioJson[]>("/json/cardapio.json"),
                ])

                setClientes(clientesResponse.data)
                setPedidos(pedidosResponse.data)
                setCardapio(cardapioResponse.data)
            } catch (erro) {
                console.log(erro)
            } finally {
                setCarregando(false)
            }
        }

        carregarDados()
    }, [])

    const dashboardStats = useMemo(() => {
        const clientesAtivos = clientes.filter((cliente) => cliente.status === "Ativo").length
        const faturamentoTotal = pedidos.reduce((total, pedido) => total + Number(pedido.total || 0), 0)
        const pedidosHoje = pedidos.length
        const emPreparo = pedidos.filter((pedido) => /preparo|andamento|processo/i.test(pedido.status)).length
        const prontos = pedidos.filter((pedido) => /pronto/i.test(pedido.status)).length
        const emEntrega = pedidos.filter((pedido) => /entrega/i.test(pedido.status)).length

        return {
            clientesAtivos,
            faturamentoTotal,
            pedidosHoje,
            emPreparo,
            prontos,
            emEntrega,
        }
    }, [clientes, pedidos])

    const receitaComparativa = pedidos.length > 0 ? 12 : 0

    return (
        <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
            <div className="relative h-40 w-full overflow-hidden rounded-xl bg-[#12161c] shadow-lg sm:h-44">
                <div
                    className="absolute inset-0 bg-[url('/images/pizzaBackground.jpg')] bg-right bg-cover bg-no-repeat"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, #12161c 0%, #12161c 30%, rgba(18, 22, 28, 0.8) 50%, rgba(18, 22, 28, 0) 80%),
                            url('/images/pizzaBackground.jpg')
                        `,
                    }}
                />

                <div className="relative z-10 flex h-full max-w-xl flex-col justify-center px-4 text-white sm:px-8">
                    <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Bem-vindo, Gabriel!</h1>
                    <p className="w-full text-xs text-gray-300 sm:w-3/5 sm:text-sm">
                        Aqui você acompanha o movimento da pizzaria e gerencia os pedidos do dia.
                    </p>
                </div>
            </div>

            <ConteudoCardsDashboard
                pagina="dashboard"
                valor1={dashboardStats.clientesAtivos}
                dashboardStats={dashboardStats}
            />

            <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
                <div className="flex min-w-0 flex-col lg:col-span-2">
                    <GraficoMovimentoPedidos />
                </div>
                <div className="flex flex-col gap-5">
                    <GraficoPedidosPorTipo />
                    <CardReceitaDia valor={dashboardStats.faturamentoTotal} percentual={receitaComparativa} />
                </div>
            </div>

            <div className="w-full">
                <TabelaPedidosRecentes pedidos={pedidos} clientes={clientes} />
            </div>

            {!carregando && pedidos.length === 0 && (
                <p className="text-sm text-slate-500">Nenhum pedido encontrado para exibir no dashboard.</p>
            )}
        </div>
    )
}