import { type NextRequest } from "next/server"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "../../../lib/supabase-server"

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code")

    if (!code) {
        redirect("/redefinir-senha?erro=link")
    }

    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
        console.error("Não foi possível validar o link de recuperação.", error)
        redirect("/redefinir-senha?erro=link")
    }

    redirect("/redefinir-senha")
}
