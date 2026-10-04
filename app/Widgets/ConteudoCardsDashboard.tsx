import { faCar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import CardDashboard from "../Components/CardDahsboard"

export default function ConteudoCardsDashboard(){
    const cards = [
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
    return(
        <div className="flex gap-3 mt-3">
            {cards.map((item, index) => {
                return(
                    <CardDashboard id={index + 1} key={`card${index + 1}`} icone={item.icone} texto={item.texto}
                    valor={item.valor}/>
                )
            })}
        </div>
    )
}