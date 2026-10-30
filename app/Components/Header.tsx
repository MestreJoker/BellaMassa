"use client"

import { useState } from "react";
import { faArrowRightFromBracket, faBell, faBars, faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface HeaderProps {
    alternarMenuMobile: () => void
    onSair: () => void
}

export default function Header({ alternarMenuMobile, onSair }: HeaderProps){
    const [perfilAberto, setPerfilAberto] = useState(false)

    return(
        <header className="relative z-30 flex w-full shrink-0 items-center justify-between bg-[#151c24] p-3 md:justify-end">
            <button
                type="button"
                aria-label="Abrir menu de navegação"
                onClick={alternarMenuMobile}
                className="inline-flex size-10 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:hidden"
            >
                <FontAwesomeIcon icon={faBars} className="text-xl" />
            </button>
            <div className="ml-auto flex items-center gap-4">
                <FontAwesomeIcon icon={faBell} className="text-2xl text-white" />
                <button
                    type="button"
                    aria-label="Abrir menu do usuário"
                    aria-expanded={perfilAberto}
                    onClick={() => setPerfilAberto((aberto) => !aberto)}
                    className="inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                    <FontAwesomeIcon icon={faUser} />
                </button>
            </div>

            {perfilAberto && (
                <>
                    <button
                        type="button"
                        aria-label="Fechar menu do usuário"
                        onClick={() => setPerfilAberto(false)}
                        className="fixed inset-0 z-40 cursor-default bg-black/30"
                    />
                    <aside
                        role="dialog"
                        aria-label="Menu do usuário"
                        className="fixed inset-y-0 right-0 z-50 flex w-72 max-w-[85vw] flex-col border-l border-slate-200 bg-white p-5 text-slate-800 shadow-2xl"
                    >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <h2 className="text-lg font-bold">Minha conta</h2>
                            <button
                                type="button"
                                aria-label="Fechar menu do usuário"
                                onClick={() => setPerfilAberto(false)}
                                className="inline-flex size-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={onSair}
                            className="mt-auto inline-flex items-center gap-3 rounded-lg px-3 py-3 text-left font-semibold text-red-700 transition-colors hover:bg-red-50"
                        >
                            <FontAwesomeIcon icon={faArrowRightFromBracket} />
                            Sair da conta
                        </button>
                    </aside>
                </>
            )}
        </header>
    )
}