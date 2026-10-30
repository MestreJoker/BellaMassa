"use client"

import Image from "next/image";
import LayoutLoginCadastro from "./Widgets/LayoutLoginCadastro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket, faCircleExclamation, faLock, faShieldHalved, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { obterUsuarioSessao, salvarUsuarioSessao } from "./lib/sessao";

interface UsuarioJson {
    id: number
    nome: string
    email: string
    senha: string
}

export default function Login(){
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [erro, setErro] = useState("")
    const [carregando, setCarregando] = useState(false)

    useEffect(() => {
        if (obterUsuarioSessao()) router.replace("/home")
    }, [router])

    async function entrar(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault()
        setErro("")
        setCarregando(true)

        try {
            const resposta = await Axios.get<UsuarioJson[]>("/json/usuarios.json")
            const usuario = resposta.data.find((item) =>
                item.email.toLowerCase() === email.trim().toLowerCase() && item.senha === senha
            )

            if (!usuario) {
                setErro("E-mail ou senha inválidos.")
                return
            }

            salvarUsuarioSessao({ id: usuario.id, nome: usuario.nome, email: usuario.email })
            router.push("/home")
        } catch {
            setErro("Não foi possível carregar os usuários. Tente novamente.")
        } finally {
            setCarregando(false)
        }
    }

    return(
        <LayoutLoginCadastro>
            <div className="m-auto w-full rounded-xl border border-gray-200 bg-white p-4 shadow-md sm:p-6 md:p-7">
                <Image alt="logo" src={'/images/logoBellaMassaPreta.png'} width={300} height={100} className="mx-auto h-auto w-full max-w-75"/>

                <h2 className="mt-4 text-xl font-extrabold sm:text-2xl">Acesse sua conta</h2>
                <p className="text-sm text-gray-600 sm:text-base">Faça login para continuar no sistema</p>

                <form onSubmit={entrar}>
                    <label htmlFor="login-email" className="mt-4 block text-base font-bold sm:text-lg">E-mail</label>
                    <div className="mt-1 flex w-full items-center gap-3 rounded-xl border border-gray-300 p-3 focus-within:border-[#ca1921]">
                        <FontAwesomeIcon icon={faEnvelope} className="w-5 shrink-0 text-gray-300" />
                        <input
                            id="login-email"
                            type="email"
                            autoComplete="username"
                            placeholder="Digite seu e-mail"
                            value={email}
                            onChange={(evento) => setEmail(evento.target.value)}
                            className="h-full w-full min-w-0 outline-none"
                            required
                        />
                    </div>

                    <label htmlFor="login-senha" className="mt-4 block text-base font-bold sm:text-lg">Senha</label>
                    <div className="mt-1 flex w-full items-center gap-3 rounded-xl border border-gray-300 p-3 focus-within:border-[#ca1921]">
                        <FontAwesomeIcon icon={faLock} className="w-4 shrink-0 text-gray-300" />
                        <input
                            id="login-senha"
                            type="password"
                            autoComplete="current-password"
                            placeholder="Digite sua senha"
                            value={senha}
                            onChange={(evento) => setSenha(evento.target.value)}
                            className="h-full w-full min-w-0 outline-none"
                            required
                        />
                    </div>

                    <p className="mt-1 text-sm text-(--colorMain)">Esqueceu sua senha?</p>
                    {erro && (
                        <div role="alert" aria-live="assertive" className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-red-900 shadow-sm sm:px-4">
                            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700">
                                <FontAwesomeIcon icon={faCircleExclamation} aria-hidden="true" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-sm font-bold">{erro}</p>
                                <p className="mt-0.5 text-xs leading-relaxed text-red-800">
                                    {erro === "E-mail ou senha inválidos."
                                        ? "Confira seus dados de acesso e tente novamente."
                                        : "Verifique sua conexão e tente novamente."}
                                </p>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={carregando}
                        className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-(--colorMain) p-2.5 text-base font-bold text-white transition-colors hover:bg-red-800 disabled:cursor-wait disabled:opacity-70 sm:text-lg"
                    >
                        <FontAwesomeIcon icon={faArrowRightToBracket} className="w-5" />
                        <span>{carregando ? "Validando..." : "Entrar"}</span>
                    </button>
                </form>

                <p className="mt-3 text-center text-sm text-gray-600">
                    Não possui conta? <Link href="/cadastro" className="font-semibold text-(--colorMain) hover:underline">Cadastre-se</Link>
                </p>

                <hr className="mt-8 text-gray-300 sm:mt-12"/>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-400 sm:text-base">
                    <FontAwesomeIcon icon={faShieldHalved} className="w-6"/>
                    <p>Sistema seguro e protegido</p>
                </div>

            </div>
        </LayoutLoginCadastro>
    )
}