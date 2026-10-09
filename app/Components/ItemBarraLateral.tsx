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
        className={`flex min-w-10 flex-1 flex-col items-center justify-center gap-1 rounded-lg p-1.5 text-white transition-colors hover:bg-[#ca1921] md:flex-none md:flex-row md:justify-start md:gap-3 md:p-2 ${estilo ?? ""}`}
        onClick={() => props.indicarClique(props.paginaItem)}>
            {props.icone}
            <p className="hidden text-sm text-white md:block lg:text-base">
                {props.texto}
            </p>
        </button>
    )
}