'use client'
import BarraLateral from "./../Widgets/BarraLateral";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "./../Components/Header";
import Dashboard from "./../Conteudo/Dashboard";
import Pedidos from "./../Conteudo/Pedidos";
import Pedido from "./../Conteudo/Pedido";
import Clientes from "./../Conteudo/Clientes";
import Cardapio from "./../Conteudo/Cardapio";
import Entregas from "./../Conteudo/Entregas";
import Pagamentos from "./../Conteudo/Pagamentos";
import Relatorios from "./../Conteudo/Relatorios";
import { encerrarSessao, obterUsuarioSessao } from "./../lib/sessao";
import { supabase } from "../../lib/supabase";

export default function Home() {
  const router = useRouter()
  const [paginaAtual, setPaginaAual] = useState(0)
  const [criandoPedido, setCriandoPedido] = useState(false)
  const [menuMobileAberto, setMenuMobileAberto] = useState(false)
  const [verificandoAcesso, setVerificandoAcesso] = useState(true)

  useEffect(() => {
    let ativo = true
    obterUsuarioSessao()
      .then(async (usuario) => {
        if (!ativo) return
        if (!usuario) {
          const { error } = await supabase.auth.signOut()
          if (error) throw error
          router.replace("/")
          return
        }
        setVerificandoAcesso(false)
      })
      .catch((erro: unknown) => {
        console.error("Não foi possível validar o acesso ao painel.", erro)
        if (ativo) router.replace("/")
      })
    return () => { ativo = false }
  }, [router])

  async function sair() {
    try {
      await encerrarSessao()
      router.replace("/")
    } catch (erro) {
      console.error("Não foi possível encerrar a sessão.", erro)
    }
  }

  function receberPaginaAtual(pagina: number){
      setPaginaAual(pagina)
      if (pagina === 1) setCriandoPedido(false)
  }

  if (verificandoAcesso) {
    return <main className="flex min-h-dvh items-center justify-center text-sm text-slate-600">Verificando acesso...</main>
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
        <Header alternarMenuMobile={() => setMenuMobileAberto((aberto) => !aberto)} onSair={() => { void sair() }} />
        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain bg-[#ebf0f6] p-3 sm:p-4 md:p-5 lg:p-6">
            {paginaAtual == 0 && <Dashboard onVerTodosPedidos={() => receberPaginaAtual(1)} />}
            {paginaAtual == 1 && (criandoPedido
              ? <Pedido onVoltarPedidos={() => setCriandoPedido(false)} />
              : <Pedidos onNovoPedido={() => setCriandoPedido(true)} />)}
            {paginaAtual == 2 && <Clientes />}
            {paginaAtual == 3 && <Cardapio />}
            {paginaAtual == 4 && <Entregas />}
            {paginaAtual == 5 && <Pagamentos />}
            {paginaAtual == 6 && <Relatorios onVerTodosPedidos={() => receberPaginaAtual(1)} onVerProdutos={() => receberPaginaAtual(3)} />}
        </main>
      </div>
    </div>
  );
}
