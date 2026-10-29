'use client'
import BarraLateral from "./Widgets/BarraLateral";
import { useState } from "react";
import Header from "./Components/Header";
import Dashboard from "./Conteudo/Dashboard";
import Pedido from "./Conteudo/Pedido";
import Clientes from "./Conteudo/Clientes";
import Cardapio from "./Conteudo/Cardapio";
import Entregas from "./Conteudo/Entregas";
import Pagamentos from "./Conteudo/Pagamentos";
import Relatorios from "./Conteudo/Relatorios";

export default function Home() {
  const [paginaAtual, setPaginaAual] = useState(0)
  const [menuMobileAberto, setMenuMobileAberto] = useState(false)

  function receberPaginaAtual(pagina: number){
      setPaginaAual(pagina)
  }

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden md:flex-row">
      <BarraLateral
        paginaAtual={paginaAtual}
        informarPaginaAtual={receberPaginaAtual}
        menuMobileAberto={menuMobileAberto}
        fecharMenuMobile={() => setMenuMobileAberto(false)}
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Header alternarMenuMobile={() => setMenuMobileAberto((aberto) => !aberto)} />
        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain bg-[#ebf0f6] p-3 sm:p-4 md:p-5 lg:p-6">
            {paginaAtual == 0 && <Dashboard />}
            {paginaAtual == 1 && <Pedido />}
            {paginaAtual == 2 && <Clientes />}
            {paginaAtual == 3 && <Cardapio />}
            {paginaAtual == 4 && <Entregas />}
            {paginaAtual == 5 && <Pagamentos />}
            {paginaAtual == 6 && <Relatorios />}
        </main>
      </div>
    </div>
  );
}
