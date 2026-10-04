interface ItemBarraLateral {
    paginaAtual: number
    paginaItem: number
    icone: React.ReactNode
    texto: string
    indicarClique: (valor: number) => void
}

export default function ItemBarraLateral(props: ItemBarraLateral){
    let estilo
    if(props.paginaAtual == props.paginaItem){
        estilo = `bg-[#ca1921]`
    }
    return(
        <div className={`rounded-lg p-2 flex items-center gap-3 
        hover:bg-[#ca1921] cursor-pointer ${estilo}`}
        onClick={() => props.indicarClique(props.paginaItem)}>
            {props.icone}
            <p className="text-white text-lg">
                {props.texto}
            </p>
        </div>
    )
}