import { faCar, faClock, faLocationDot, faPhone, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import CardDashboard from "../Components/CardDahsboard"

interface ConteudoCardsDashboardProps {
    pagina: string
    valor1: number
    clientesStats?: {
        ativos: number
        novosNoMes: number
        bairrosAtendidos: number
    }
    dashboardStats?: {
        pedidosHoje?: number
        emPreparo?: number
        prontos?: number
        emEntrega?: number
    }
}

export default function ConteudoCardsDashboard(props: ConteudoCardsDashboardProps) {
    const dashboardCards = [
        {
            icone: <FontAwesomeIcon icon={faCar} />,
            texto: "Pedidos hoje",
            valor: props.dashboardStats?.pedidosHoje ?? 12,
        },
        {
            icone: <FontAwesomeIcon icon={faCar} />,
            texto: "Em preparo",
            valor: props.dashboardStats?.emPreparo ?? 5,
        },
        {
            icone: <FontAwesomeIcon icon={faCar} />,
            texto: "Prontos",
            valor: props.dashboardStats?.prontos ?? 3,
        },
        {
            icone: <FontAwesomeIcon icon={faCar} />,
            texto: "Em entrega",
            valor: props.dashboardStats?.emEntrega ?? 4,
        },
    ]

    const cardsClientes = [
        {
            icone: <FontAwesomeIcon icon={faUser} />,
            texto: "Total de clientes",
            valor: props.valor1,
        },
        {
            icone: <FontAwesomeIcon icon={faPhone} />,
            texto: "Clientes ativos",
            valor: props.clientesStats?.ativos ?? 0,
        },
        {
            icone: <FontAwesomeIcon icon={faClock} />,
            texto: "Novos este mês",
            valor: props.clientesStats?.novosNoMes ?? 0,
        },
        {
            icone: <FontAwesomeIcon icon={faLocationDot} />,
            texto: "Bairros atendidos",
            valor: props.clientesStats?.bairrosAtendidos ?? 0,
        },
    ]

    return (
        <div className="mt-3 grid min-w-0 grid-cols-1 gap-3 min-[420px]:grid-cols-2 xl:grid-cols-4">
            {props.pagina === "dashboard" ? (
                <>
                    {dashboardCards.map((item, index) => {
                        return (
                            <CardDashboard
                                id={index + 1}
                                key={`card${index + 1}`}
                                icone={item.icone}
                                texto={item.texto}
                                valor={item.valor}
                                pagina={props.pagina}
                            />
                        )
                    })}
                </>
            ) : (
                <>
                    {cardsClientes.map((item, index) => {
                        return (
                            <CardDashboard
                                id={index + 1}
                                key={`card${index + 1}`}
                                icone={item.icone}
                                texto={item.texto}
                                valor={item.valor}
                                pagina={props.pagina}
                            />
                        )
                    })}
                </>
            )}
        </div>
    )
}