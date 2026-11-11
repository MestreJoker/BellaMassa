-- Migracao incremental para habilitar a taxa de entrega configuravel.
-- Nao apaga tabelas nem dados existentes.

BEGIN;

CREATE TABLE IF NOT EXISTS public.configuracoes (
    chave TEXT PRIMARY KEY CHECK (chave = 'geral'),
    taxa_entrega NUMERIC(10, 2) NOT NULL DEFAULT 7 CHECK (taxa_entrega >= 0),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.configuracoes (chave, taxa_entrega)
VALUES ('geral', 7.00)
ON CONFLICT (chave) DO NOTHING;

ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS configuracoes_leitura_equipe ON public.configuracoes;
CREATE POLICY configuracoes_leitura_equipe
    ON public.configuracoes FOR SELECT TO authenticated
    USING ((SELECT public.usuario_equipe()));

DROP POLICY IF EXISTS configuracoes_admin ON public.configuracoes;
CREATE POLICY configuracoes_admin
    ON public.configuracoes FOR UPDATE TO authenticated
    USING ((SELECT public.usuario_admin()))
    WITH CHECK ((SELECT public.usuario_admin()));

REVOKE ALL ON public.configuracoes FROM anon, authenticated;
GRANT SELECT, UPDATE ON public.configuracoes TO authenticated;
GRANT ALL ON public.configuracoes TO service_role;

NOTIFY pgrst, 'reload schema';

COMMIT;
