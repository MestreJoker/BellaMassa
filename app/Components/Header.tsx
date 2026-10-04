import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Header(){
    return(
        <header className="w-full p-3 bg-[#151c24] flex justify-end">
            <FontAwesomeIcon icon={faBell} className="text-white text-2xl"/>
        </header>
    )
}