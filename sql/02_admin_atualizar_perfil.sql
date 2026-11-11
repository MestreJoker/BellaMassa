-- Migracao incremental para editar nome, papel e status da equipe.
-- Nao apaga tabelas nem dados existentes.

BEGIN;

CREATE OR REPLACE FUNCTION public.admin_atualizar_perfil(
    p_auth_user_id UUID,
    p_nome TEXT,
    p_is_admin BOOLEAN,
    p_ativo BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_atual public.perfis%ROWTYPE;
BEGIN
    LOCK TABLE public.perfis IN EXCLUSIVE MODE;
    SELECT * INTO v_atual
    FROM public.perfis
    WHERE auth_user_id = p_auth_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuario interno nao encontrado.';
    END IF;
    IF NULLIF(btrim(p_nome), '') IS NULL THEN
        RAISE EXCEPTION 'O nome do usuario e obrigatorio.';
    END IF;
    IF v_atual.is_admin AND v_atual.ativo AND NOT (p_is_admin AND p_ativo)
       AND NOT EXISTS (
           SELECT 1
           FROM public.perfis
           WHERE is_admin AND ativo AND auth_user_id <> p_auth_user_id
       ) THEN
        RAISE EXCEPTION 'Nao e permitido desativar ou rebaixar o ultimo administrador ativo.';
    END IF;

    UPDATE public.perfis
    SET nome = btrim(p_nome),
        is_admin = p_is_admin,
        ativo = p_ativo
    WHERE auth_user_id = p_auth_user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_atualizar_perfil(UUID, TEXT, BOOLEAN, BOOLEAN)
    FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_atualizar_perfil(UUID, TEXT, BOOLEAN, BOOLEAN)
    TO service_role;

NOTIFY pgrst, 'reload schema';

COMMIT;
