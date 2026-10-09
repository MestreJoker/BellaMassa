import { faChartBar, faClipboard, faHouse, faTruck, faUserGroup, faUtensils, faWallet } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ItemBarraLateral from "../Components/ItemBarraLateral"
import Image from "next/image"

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
        <aside className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#0b0f16] px-1 py-1 pb-[max(0.25rem,env(safe-area-inset-bottom))] md:static md:h-dvh md:w-64 md:shrink-0 md:overflow-y-auto md:border-0 md:p-5">
            <Image alt="Bella Massa" src={'/images/logoBellaMassa.jpg'} width={220} height={220} className="hidden h-auto w-full max-w-55 md:block"/>
            <nav id="conteudoLinks" aria-label="Navegação principal" className="flex gap-0 md:mt-5 md:flex-col md:gap-3">
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
            </nav>
        </aside>
    )
}