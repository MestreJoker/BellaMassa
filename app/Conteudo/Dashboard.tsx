import ConteudoCardsDashboard from "../Widgets/ConteudoCardsDashboard";
import GraficoMovimentoPedidos from "../Components/GraficoMovimentoPedidos";
import GraficoPedidosPorTipo from "../Components/GraficoPedidosPorTipo";
import CardReceitaDia from "../Components/CardReceitaDia";
import TabelaPedidosRecentes from "../Components/TabelaPedidosRecentes";

export default function Dashboard() {
    return (
        <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
            <div className="relative h-40 w-full overflow-hidden rounded-xl bg-[#12161c] shadow-lg sm:h-44">
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
                <div className="relative z-10 flex h-full max-w-xl flex-col justify-center px-4 text-white sm:px-8">
                    <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Bem-vindo, Gabriel!</h1>
                    <p className="w-full text-xs text-gray-300 sm:w-3/5 sm:text-sm">
                        Aqui você acompanha o movimento da pizzaria e gerencia os pedidos do dia.
                    </p>
                </div>
            </div>
            
            <ConteudoCardsDashboard pagina="dashboard" valor1={12}/>

            {/* Seção dos gráficos e receita do dia */}
            <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-5">
                <div className="flex min-w-0 flex-col lg:col-span-2">
                    <GraficoMovimentoPedidos />
                </div>
                <div className="flex flex-col gap-5">
                    <GraficoPedidosPorTipo />
                    <CardReceitaDia />
                </div>
            </div>

            {/* Tabela de pedidos recentes na parte inferior */}
            <div className="w-full">
                <TabelaPedidosRecentes />
            </div>
        </div>
    )
}