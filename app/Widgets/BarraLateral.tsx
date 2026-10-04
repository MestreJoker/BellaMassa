import { faChartBar, faClipboard, faHouse, faTruck, faUserGroup, faUtensils, faWallet } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ItemBarraLateral from "../Components/ItemBarraLateral"
import Image from "next/image"
import { useState } from "react"

interface BarraLateralProps {
    paginaAtual: number
    informarPaginaAtual: (pagina: number) => void
}

export default function BarraLateral(props: BarraLateralProps){
    
    const itens = [
        {
            icone: <FontAwesomeIcon icon={faHouse}
            className={`text-white text-2xl`}/>,
            texto: "Dashboard"
        },
        {
            icone: <FontAwesomeIcon icon={faClipboard}
            className={`text-white text-2xl`}/>,
            texto: "Pedidos"
        },
        {
            icone: <FontAwesomeIcon icon={faUserGroup}
            className={`text-white text-2xl`}/>,
            texto: "Clientes"
        },
        {
            icone: <FontAwesomeIcon icon={faUtensils}
            className={`text-white text-2xl`}/>,
            texto: "Cardápio"
        },
        {
            icone: <FontAwesomeIcon icon={faTruck}
            className={`text-white text-2xl`}/>,
            texto: "Entregas"
        },
        {
            icone: <FontAwesomeIcon icon={faWallet}
            className={`text-white text-2xl`}/>,
            texto: "Pagamentos"
        },
        {
            icone: <FontAwesomeIcon icon={faChartBar}
            className={`text-white text-2xl`}/>,
            texto: "Relatórios"
        },
    ]
    function informarPaginaAtual(valor: number){
        props.informarPaginaAtual(valor)
    }

    return(
        <aside className="h-full w-70 bg-[#0b0f16] p-5">
            <Image alt="logoBellaMassa" src={'/images/logoBellaMassa.jpg'} width={220} height={220}/>
            <div id="conteudoLinks" className="flex flex-col gap-3 mt-5">
                {itens.map((item, index) => {
                    return(
                        <ItemBarraLateral
                        key={`item${index + 1}`}
                        paginaAtual={props.paginaAtual}
                        paginaItem={index}
                        icone={item.icone}
                        texto={item.texto}
                        indicarClique={informarPaginaAtual}/>
                    )
                })}
            </div>
        </aside>
    )
}