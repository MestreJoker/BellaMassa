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
        <button
        type="button"
        aria-current={props.paginaAtual === props.paginaItem ? "page" : undefined}
        aria-label={props.texto}
        className={`flex w-full flex-row items-center justify-start gap-3 rounded-lg p-2 text-white transition-colors hover:bg-[#ca1921] cursor-pointer md:flex-none ${estilo ?? ""}`}
        onClick={() => props.indicarClique(props.paginaItem)}>
            {props.icone}
            <p className="text-sm text-white lg:text-base">
                {props.texto}
            </p>
        </button>
    )
}