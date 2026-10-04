interface CardDahsboardProps {
    id: number
    icone: React.ReactNode
    texto: string
    valor: number
}

export default function CardDashboard(props: CardDahsboardProps){
    let corFundo: string  = "bg-blue-400"

    if(props.id == 1){
        corFundo = "bg-red-500"
    }
    else if(props.id == 2){
        corFundo = "bg-yellow-500"
    }
    else if(props.id == 3){
        corFundo = "bg-green-500"
    }


    return(
        <div className={`bg-white rounded-lg border border-gray-200 shadow-md px-4 pt-4 pb-7 flex-1 flex gap-4`}>
            <div className={`w-12 h-12 rounded-full flex justify-center items-center text-white ${corFundo}`}>
                {props.icone}
            </div>
            <div>
                <p className="font-bold">{props.texto}</p>
                <p className="font-bold text-3xl">{props.valor}</p>
            </div>
        </div>
    )
}