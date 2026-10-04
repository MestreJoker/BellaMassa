'use client'
import Image from "next/image";
import BarraLateral from "./Widgets/BarraLateral";
import { useEffect, useState } from "react";
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
    <div className="flex w-screen h-screen">
      <BarraLateral paginaAtual={paginaAtual} informarPaginaAtual={receberPaginaAtual}/>
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-3 bg-[#ebf0f6] flex-1">
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
