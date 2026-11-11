'use client'
import BarraLateral from "./../Widgets/BarraLateral";
import { useEffect, useState, useSyncExternalStore } from "react";
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
import Administracao from "./../Conteudo/Administracao";
import { encerrarSessao, obterUsuarioSessao } from "./../lib/sessao";
import {
  assinarNavegacaoPainel,
  obterEstadoNavegacaoPainel,
  obterEstadoNavegacaoPainelServidor,
  salvarNavegacaoPainel,
} from "./../lib/navegacaoPainel";
import { supabase } from "../../lib/supabase";

export default function Home() {
  const router = useRouter()
  const estadoNavegacao = useSyncExternalStore(
    assinarNavegacaoPainel,
    obterEstadoNavegacaoPainel,
    obterEstadoNavegacaoPainelServidor,
  )
  const [paginaSalva, pedidoNovoSalvo] = estadoNavegacao.split(":")
  const paginaAtual = Number(paginaSalva)
  const criandoPedido = pedidoNovoSalvo === "true"
  const [menuMobileAberto, setMenuMobileAberto] = useState(false)
  const [verificandoAcesso, setVerificandoAcesso] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userId, setUserId] = useState("")

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
        setUserId(usuario.id)
        setIsAdmin(usuario.isAdmin)
        const paginaSalva = Number(obterEstadoNavegacaoPainel().split(":")[0])
        if (!usuario.isAdmin && paginaSalva >= 6) salvarNavegacaoPainel(0, false)
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
      salvarNavegacaoPainel(pagina, false)
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
        isAdmin={isAdmin}
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Header alternarMenuMobile={() => setMenuMobileAberto((aberto) => !aberto)} onSair={() => { void sair() }} />
        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain bg-[#ebf0f6] p-3 sm:p-4 md:p-5 lg:p-6">
            {paginaAtual == 0 && <Dashboard onVerTodosPedidos={() => receberPaginaAtual(1)} />}
            {paginaAtual == 1 && (criandoPedido
              ? <Pedido onVoltarPedidos={() => salvarNavegacaoPainel(1, false)} />
              : <Pedidos onNovoPedido={() => salvarNavegacaoPainel(1, true)} />)}
            {paginaAtual == 2 && <Clientes />}
            {paginaAtual == 3 && <Cardapio isAdmin={isAdmin} />}
            {paginaAtual == 4 && <Entregas />}
            {paginaAtual == 5 && <Pagamentos />}
            {paginaAtual == 6 && isAdmin && <Relatorios onVerTodosPedidos={() => receberPaginaAtual(1)} onVerProdutos={() => receberPaginaAtual(3)} />}
            {paginaAtual == 7 && isAdmin && <Administracao userId={userId} />}
        </main>
      </div>
    </div>
  );
}
