This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Banco de dados Supabase

O esquema simples esta em `sql/00_banco_completo.sql`. Ele cria perfis da
equipe, categorias, produtos, clientes, pedidos e itens do pedido. Os precos
ficam diretamente em `produtos`; enderecos ficam em `clientes`.
O script cria categorias iniciais, mas nao inventa produtos. Administradores
podem cadastrar categorias e produtos na tela **Cardapio**; operadores podem
consultar o catalogo, cadastrar clientes e operar pedidos. O banco tambem
restringe essas permissoes com RLS. Cadastre sabores/tamanhos como produtos
separados. A taxa de entrega e validada pelo banco e fixa em R$ 7,00.

### Instalar ou reiniciar o esquema

1. No Supabase, abra **SQL Editor > New query**.
2. Cole o conteudo inteiro de `sql/00_banco_completo.sql` e execute.

**Este script apaga as tabelas conhecidas da BellaMassa e seus dados antes de
recria-las. Tabelas publicas de outros sistemas nao sao removidas. As contas
do Supabase Auth em `auth.users` nao sao apagadas, mas os perfis de acesso
precisam ser recriados. Confirme o projeto e salve os dados que quiser manter
antes de executar. Se uma tabela fora da lista depender dessas tabelas, o
script interrompe a execucao em vez de remove-la em cascata.**

### Criar o primeiro usuario interno

1. Em **Authentication > Settings**, desative novos cadastros (sign-ups).
2. Crie o usuario em **Authentication > Users > Add user**, definindo e
   confirmando o e-mail e a senha.
3. No SQL Editor, crie o perfil e conceda acesso de administrador. Troque o
   e-mail pelo usuario criado:

   ```sql
   INSERT INTO public.perfis (auth_user_id, nome, email, is_admin)
   SELECT
       u.id,
       COALESCE(
           NULLIF(btrim(u.raw_user_meta_data ->> 'nome'), ''),
           split_part(u.email, '@', 1)
       ),
       u.email,
       TRUE
   FROM auth.users AS u
   WHERE lower(u.email) = lower('seu-email@exemplo.com')
     AND u.email IS NOT NULL
   ON CONFLICT (auth_user_id)
   DO UPDATE SET is_admin = EXCLUDED.is_admin;
   ```

Para criar um operador, repita o procedimento com `FALSE` no lugar de `TRUE`.
O perfil precisa existir para que o login tenha acesso ao sistema. Nunca grave
senhas em `public.perfis` nem as insira por SQL: o Supabase Auth gerencia as
credenciais. O banco guarda somente o nome, e-mail e indicador de administrador.

### Recuperar senha

Adicione `http://localhost:3000/auth/callback` em
**Authentication > URL Configuration > Redirect URLs** no Supabase. Em
producao, adicione tambem a URL correspondente ao dominio publicado. Na tela
de login, informe o e-mail e use **Esqueceu sua senha?**; o link recebido abre
a tela para definir uma nova senha.

### Ligar o aplicativo ao Supabase

Configure `.env.local` na raiz do projeto com a URL e a chave publica
(anon/publishable) do Supabase:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica
   ```

Instale as dependencias e inicie o aplicativo:

   ```bash
   npm install
   npm run dev
   ```

Entre em `/` com o e-mail e a senha cadastrados no Supabase Auth.

Nunca coloque a chave `service_role` em variavel `NEXT_PUBLIC_*`, no navegador
ou no repositorio: ela ignora as politicas RLS. As senhas devem ser geridas pelo
Supabase Auth.
