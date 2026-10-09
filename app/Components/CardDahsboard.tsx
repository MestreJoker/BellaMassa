interface CardDahsboardProps {
    id: number
    icone: React.ReactNode
    texto: string
    valor: number
    pagina: string
}

export default function CardDashboard(props: CardDahsboardProps) {
    let corFundo: string = ""
    if (props.pagina == "dashboard") {
        if (props.id == 1) {
            corFundo = "bg-red-500"
        }
        else if (props.id == 2) {
            corFundo = "bg-yellow-500"
        }
        else if (props.id == 3) {
            corFundo = "bg-green-500"
        }
        else {
            corFundo = "bg-blue-400"
        }
    }
    else if (props.pagina == "clientes"){
        if (props.id == 1) {
            corFundo = "bg-blue-500"
        }
        else if (props.id == 2) {
            corFundo = "bg-green-500"
        }
        else if (props.id == 3) {
            corFundo = "bg-yellow-500"
        }
        else {
            corFundo = "bg-purple-400"
        }
    }




    return (
        <div className="flex min-w-0 items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-4 shadow-sm transition-shadow duration-300 hover:shadow-md sm:gap-4 sm:px-4">
            <div className={`flex size-10 shrink-0 items-center justify-center rounded-full text-white sm:size-12 ${corFundo}`}>
                {props.icone}
            </div>
            <div className="min-w-0">
                <p className="wrap-break-word text-sm font-bold sm:text-base">{props.texto}</p>
                <p className="text-2xl font-bold sm:text-3xl">{props.valor}</p>
            </div>
        </div>
    )
}