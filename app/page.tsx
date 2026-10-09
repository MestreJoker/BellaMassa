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

  function receberPaginaAtual(pagina: number){
      setPaginaAual(pagina)
  }

  return (
    <div className="flex min-h-dvh w-full flex-col overflow-x-hidden md:h-dvh md:flex-row md:overflow-hidden">
      <BarraLateral paginaAtual={paginaAtual} informarPaginaAtual={receberPaginaAtual}/>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Header />
        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden bg-[#ebf0f6] p-3 pb-20 sm:p-4 sm:pb-20 md:overflow-y-auto md:p-5 md:pb-5 lg:p-6">
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
