import Image from "next/image";
import LayoutLoginCadastro from "../Widgets/LayoutLoginCadastro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket, faEnvelope, faLock, faShieldHalved, faUser } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Cadastro(){
    return(
        <LayoutLoginCadastro>
            <div  className="bg-white rounded-xl shadow-md m-auto border border-gray-200 p-7 w-[60%]">
                <Image alt="logo" src={'/images/logoBellaMassaPreta.png'} width={300} height={100} className="mx-auto"/>

                <h2 className="font-extrabold text-2xl mt-4">Crie uma conta</h2>
                <p className="text-gray-600">Preencha as informações para se cadastrar no sistema</p>

                <p className="text-lg font-bold mt-4">Nome</p>
                <div className={`w-full rounded-xl border border-gray-300 flex gap-3 p-3 items-center`}>
                    <FontAwesomeIcon icon={faUser} className="w-5 text-gray-300"/>
                    <input type="text" placeholder="Digite seu nome" className="h-full outline-none w-full"/>
                </div>

                <p className="text-lg font-bold mt-4">E-mail</p>
                <div className={`w-full rounded-xl border border-gray-300 flex gap-3 p-3 items-center`}>
                    <FontAwesomeIcon icon={faEnvelope} className="w-5 text-gray-300"/>
                    <input type="email" placeholder="Digite seu email" className="h-full outline-none w-full"/>
                </div>

                <p className="text-lg font-bold mt-4">Senha</p>
                <div className={`w-full rounded-xl border border-gray-300 flex gap-3 p-3 items-center`}>
                    <FontAwesomeIcon icon={faLock} className="w-4 text-gray-300"/>
                    <input type="password" placeholder="Crie uma senha" className="h-full outline-none w-full"/>
                </div>

                <p className="text-lg font-bold mt-4">Confirmar Senha</p>
                <div className={`w-full rounded-xl border border-gray-300 flex gap-3 p-3 items-center`}>
                    <FontAwesomeIcon icon={faLock} className="w-4 text-gray-300"/>
                    <input type="password" placeholder="Digite a senha novamente" className="h-full outline-none w-full"/>
                </div>

                <button className="p-2.5 text-lg font-bold rounded-xl flex justify-center items-center gap-3 text-white
                bg-(--colorMain) w-full mt-6">
                    <FontAwesomeIcon icon={faArrowRightToBracket} className="w-5"/>
                    <p>Concluir cadastro</p>
                </button>

                <p className="text-center mt-2">Já possui conta? <Link href={'/login'} className="text-(--colorMain) hover:underline cursor-pointer">Entre aqui</Link></p>

                <hr className="text-gray-300 mt-12"/>

                <div className="flex justify-center gap-2 items-center mt-3 text-gray-400">
                    <FontAwesomeIcon icon={faShieldHalved} className="w-6"/>
                    <p>Sistema seguro e protegido</p>
                </div>

            </div>
        </LayoutLoginCadastro>
    )
}