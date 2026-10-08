import ConteudoCardsDashboard from "../Widgets/ConteudoCardsDashboard";

export default function Dashboard() {
    return (
        <div>
            <div className="relative w-full h-40 rounded-xl overflow-hidden shadow-lg bg-[#12161c]">
                {/* Container da imagem com o gradiente de transição para o lado esquerdo */}
                <div
                    className="absolute inset-0 bg-[url('/caminho/para/sua/imagem.jpg')] bg-right bg-cover bg-no-repeat"
                    style={{
                        // Este gradiente cria a cobertura sólida/translúcida à esquerda e vai revelando a imagem à direita
                        backgroundImage: `
            linear-gradient(to right, #12161c 0%, #12161c 30%, rgba(18, 22, 28, 0.8) 50%, rgba(18, 22, 28, 0) 80%),
            url('/images/pizzaBackground.jpg')
          `
                    }}
                />

                {/* Conteúdo do seu card de boas-vindas */}
                <div className="relative z-10 flex flex-col justify-center h-full px-8 text-white max-w-xl">
                    <h1 className="text-3xl font-bold mb-2">Bem-vindo, Gabriel!</h1>
                    <p className="text-gray-300 text-sm w-[60%]">
                        Aqui você acompanha o movimento da pizzaria e gerencia os pedidos do dia.
                    </p>
                </div>
            </div>
            <ConteudoCardsDashboard pagina="dashboard" valor1={12}/>
        </div>
    )
}