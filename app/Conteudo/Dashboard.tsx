"use client"

import { useEffect, useMemo, useState } from "react";
import Axios from "axios";
import ConteudoCardsDashboard from "../Widgets/ConteudoCardsDashboard";
import GraficoMovimentoPedidos from "../Components/GraficoMovimentoPedidos";
import GraficoPedidosPorTipo from "../Components/GraficoPedidosPorTipo";
import CardReceitaDia from "../Components/CardReceitaDia";
import TabelaPedidosRecentes from "../Components/TabelaPedidosRecentes";
import { obterPedidos, type PedidoLocal } from "../lib/pedidos";
import { obterUsuarioSessao } from "../lib/sessao";

interface ClienteJson {
    idCliente: number
    nome: string
    status: string
}

interface DashboardProps {
    onVerTodosPedidos: () => void
}

export default function Dashboard({ onVerTodosPedidos }: DashboardProps) {
    const [clientes, setClientes] = useState<ClienteJson[]>([])
    const [pedidos, setPedidos] = useState<PedidoLocal[]>([])
    const [carregando, setCarregando] = useState(true)
    const [nomeUsuario, setNomeUsuario] = useState("")

    useEffect(() => {
        async function carregarDados() {
            try {
                const [clientesResponse, pedidosResponse] = await Promise.all([
                    Axios.get<ClienteJson[]>("/json/clientes.json"),
                    obterPedidos(),
                ])

                const usuario = obterUsuarioSessao()
                setClientes(clientesResponse.data)
                setPedidos(pedidosResponse)
                setNomeUsuario(usuario?.nome.split(" ")[0] ?? "")
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
        const hoje = new Date()
        const pedidosDeHoje = pedidos.filter((pedido) => {
            const data = new Date(pedido.dataPedido)
            return data.getFullYear() === hoje.getFullYear() && data.getMonth() === hoje.getMonth() && data.getDate() === hoje.getDate()
        })
        const pedidosHoje = pedidosDeHoje.length
        const faturamentoHoje = pedidosDeHoje.reduce((total, pedido) => total + Number(pedido.total || 0), 0)
        const emPreparo = pedidosDeHoje.filter((pedido) => /preparo|andamento|processo/i.test(pedido.status)).length
        const prontos = pedidosDeHoje.filter((pedido) => /pronto/i.test(pedido.status)).length
        const emEntrega = pedidosDeHoje.filter((pedido) => /entrega/i.test(pedido.status)).length

        return {
            clientesAtivos,
            faturamentoHoje,
            pedidosHoje,
            emPreparo,
            prontos,
            emEntrega,
        }
    }, [clientes, pedidos])

    const pedidosPorTipo = useMemo(() => ({
        entregas: pedidos.filter((pedido) => pedido.tipoEntrega === "Entrega").length,
        retiradas: pedidos.filter((pedido) => pedido.tipoEntrega === "Retirada").length,
        balcao: pedidos.filter((pedido) => pedido.tipoEntrega === "Balcão").length,
    }), [pedidos])

    const receitaComparativa = 0

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
                    <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
                        Bem-vindo{nomeUsuario ? `, ${nomeUsuario}` : " à Bella Massa"}!
                    </h1>
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
                    <GraficoPedidosPorTipo {...pedidosPorTipo} />
                    <CardReceitaDia valor={dashboardStats.faturamentoHoje} percentual={receitaComparativa} />
                </div>
            </div>

            <div className="w-full">
                <TabelaPedidosRecentes pedidos={pedidos} clientes={clientes} onVerTodos={onVerTodosPedidos} />
            </div>

            {!carregando && pedidos.length === 0 && (
                <p className="text-sm text-slate-500">Nenhum pedido encontrado para exibir no dashboard.</p>
            )}
        </div>
    )
}