import { faChartBar, faClipboard, faHouse, faTruck, faUserGroup, faUtensils, faWallet } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ItemBarraLateral from "../Components/ItemBarraLateral"
import Image from "next/image"
import { useEffect } from "react"

interface BarraLateralProps {
    paginaAtual: number
    informarPaginaAtual: (pagina: number) => void
    menuMobileAberto: boolean
    fecharMenuMobile: () => void
}

export default function BarraLateral(props: BarraLateralProps){
    const { menuMobileAberto, fecharMenuMobile } = props

    useEffect(() => {
        if (!menuMobileAberto) return

        function fecharComEsc(evento: KeyboardEvent) {
            if (evento.key === "Escape") fecharMenuMobile()
        }

        window.addEventListener("keydown", fecharComEsc)
        return () => window.removeEventListener("keydown", fecharComEsc)
    }, [menuMobileAberto, fecharMenuMobile])
    
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
        props.fecharMenuMobile()
    }

    return(
        <>
            {props.menuMobileAberto && (
                <button
                    type="button"
                    aria-label="Fechar menu de navegação"
                    onClick={props.fecharMenuMobile}
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                />
            )}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] overflow-y-auto bg-[#0b0f16] p-5 shadow-2xl transition-transform duration-200 md:static md:h-dvh md:w-64 md:max-w-none md:shrink-0 md:translate-x-0 md:overflow-y-auto md:shadow-none ${props.menuMobileAberto ? "translate-x-0" : "-translate-x-full"}`}>
            <Image alt="Bella Massa" src={'/images/logoBellaMassaBranca.png'} width={220} height={220} className="h-auto w-full max-w-55"/>
            <nav id="conteudoLinks" aria-label="Navegação principal" className="mt-5 flex flex-col gap-3">
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
        </>
    )
}