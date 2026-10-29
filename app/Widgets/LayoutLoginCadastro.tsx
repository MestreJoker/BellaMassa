interface LayoutLoginCadastroProps{
    children: React.ReactNode
}

export default function LayoutLoginCadastro(
    props: LayoutLoginCadastroProps
){
    return(
        <div className="h-screen w-screen flex">
            <div className="w-[45%] h-full
            bg-[url('/images/backgroundLoginCadastro.png')] bg-no-repeat bg-cover bg-right">
            </div>

            <div className="flex-1 p-10">
                {props.children}
            </div>
        </div>
    )
}