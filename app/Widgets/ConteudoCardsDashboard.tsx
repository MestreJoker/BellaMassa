import { faCar, faClock, faLocationDot, faPhone, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import CardDashboard from "../Components/CardDahsboard"

interface ConteudoCardsDashboardProps {
    pagina: string
    valor1: number
}

export default function ConteudoCardsDashboard(props: ConteudoCardsDashboardProps) {
    const cardsDashboard = [
        {
            icone: <FontAwesomeIcon icon={faCar} />,
            texto: "Pedidos hoje",
            valor: 12
        },
        {
            icone: <FontAwesomeIcon icon={faCar} />,
            texto: "Em preparo",
            valor: 5
        },
        {
            icone: <FontAwesomeIcon icon={faCar} />,
            texto: "Prontos",
            valor: 3
        },
        {
            icone: <FontAwesomeIcon icon={faCar} />,
            texto: "Em entrega",
            valor: 4
        },
    ]

    const cardsClientes = [
        {
            icone: <FontAwesomeIcon icon={faUser} />,
            texto: "Total de clientes",
            valor: props.valor1
        },
        {
            icone: <FontAwesomeIcon icon={faPhone} />,
            texto: "Clientes ativos",
            valor: 5
        },
        {
            icone: <FontAwesomeIcon icon={faClock} />,
            texto: "Novos este mês",
            valor: 3
        },
        {
            icone: <FontAwesomeIcon icon={faLocationDot} />,
            texto: "Bairros atendidos",
            valor: 4
        },
    ]
    return (
        <div className="mt-3 grid min-w-0 grid-cols-1 gap-3 min-[420px]:grid-cols-2 xl:grid-cols-4">
            {props.pagina == "dashboard" ? (
                <>
                    {cardsDashboard.map((item, index) => {
                        return (
                            <CardDashboard id={index + 1} key={`card${index + 1}`} icone={item.icone} texto={item.texto}
                                valor={item.valor}
                                pagina={props.pagina}
                            />
                        )
                    })}
                </>
            ) :
                (
                    <>
                        {cardsClientes.map((item, index) => {
                            return (
                                <CardDashboard id={index + 1} key={`card${index + 1}`} icone={item.icone} texto={item.texto}
                                    valor={item.valor}
                                    pagina={props.pagina}

                                />
                            )
                        })}
                    </>
                )
            }

        </div>
    )
}