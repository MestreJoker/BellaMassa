import { faBell, faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface HeaderProps {
    alternarMenuMobile: () => void
}

export default function Header({ alternarMenuMobile }: HeaderProps){
    return(
        <header className="flex w-full shrink-0 items-center justify-between bg-[#151c24] p-3 md:justify-end">
            <button
                type="button"
                aria-label="Abrir menu de navegação"
                onClick={alternarMenuMobile}
                className="inline-flex size-10 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:hidden"
            >
                <FontAwesomeIcon icon={faBars} className="text-xl" />
            </button>
            <FontAwesomeIcon icon={faBell} className="text-white text-2xl"/>
        </header>
    )
}