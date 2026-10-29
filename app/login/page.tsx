import Image from "next/image";
import LayoutLoginCadastro from "../Widgets/LayoutLoginCadastro";

export default function Login(){
    return(
        <LayoutLoginCadastro>
            <div  className="bg-white rounded-xl shadow-md m-auto border border-gray-200 p-5 w-[75%]">
                <Image alt="logo" src={'/images/logoBellaMassaPreta.png'} width={300} height={100} className="mx-auto"/>

                <h2 className="font-extrabold text-2xl mt-4">Acesse sua conta</h2>
                <p className="text-gray-600">Faça login para continuar no sistema</p>

                <button className="p-2 rounded-xl flex justify-center items-center gap-3 text-white
                bg-(--colorMain) w-full">
                    <p>Entrar</p>
                </button>
            </div>
        </LayoutLoginCadastro>
    )
}