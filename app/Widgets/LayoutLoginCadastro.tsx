interface LayoutLoginCadastroProps{
    children: React.ReactNode
}

export default function LayoutLoginCadastro(
    props: LayoutLoginCadastroProps
){
    return(
        <div className="login-cadastro-layout">
            <div className="login-cadastro-imagem bg-[url('/images/backgroundLoginCadastro.png')] bg-no-repeat bg-cover bg-right">
            </div>

            <div className="login-cadastro-conteudo">
                {props.children}
            </div>
        </div>
    )
}