# Guia de Evidências - Fase 03 EntregaTudo

Use este roteiro para capturar os prints obrigatórios indicados pelo avaliador. Antes de tirar os prints, rode o projeto com `npm run dev` e confirme se o link do GitHub está público.

## Evidência 1 - Sistema em execução
- Abrir a página inicial do sistema.
- Mostrar a barra de navegação com os links principais.
- Objetivo: comprovar que o frontend está executável.

## Evidência 2 - Listagem de produtos
- Abrir `/products`.
- Mostrar os cards de produtos carregados.
- Objetivo: comprovar consulta de dados e renderização da listagem.

## Evidência 3 - Filtro por categoria
- Na tela `/products`, selecionar uma categoria, por exemplo `Ferramentas`.
- Mostrar que a lista retornou apenas produtos daquela categoria.
- Objetivo: comprovar integração funcional e regra RN03.

## Evidência 4 - Cadastro de produto
- Entrar em `/add-product`.
- Se o sistema pedir login, realizar login/cadastro primeiro.
- Preencher nome, descrição, preço e categoria.
- Cadastrar o produto.
- Objetivo: comprovar validação e persistência de produto.

## Evidência 5 - Produto cadastrado na listagem
- Voltar para `/products`.
- Mostrar o produto recém-cadastrado aparecendo na lista.
- Objetivo: comprovar fluxo ponta a ponta: frontend -> backend/Supabase -> banco -> frontend.

## Evidência 6 - Detalhe de produto
- Clicar em `Ver Detalhes` em um produto.
- Mostrar a página `/products/:id` com nome, preço, categoria e descrição.
- Objetivo: comprovar consulta individual por ID.

## Evidência 7 - Login/cadastro de usuário
- Abrir `/login`.
- Mostrar a aba de cadastro ou login.
- Realizar login ou demonstrar conta autenticada.
- Objetivo: comprovar evolução de RF07/RF08 para em desenvolvimento funcional.

## Evidência 8 - Sessão autenticada
- Abrir `/profile` depois do login.
- Mostrar o e-mail autenticado.
- Objetivo: comprovar sessão ativa no Supabase Auth.
