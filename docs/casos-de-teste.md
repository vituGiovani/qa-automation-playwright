# Casos de Teste

| ID | Funcionalidade | Cenário | Técnica | Resultado esperado | Prioridade | Automação |
|---|---|---|---|---|---|---|
| CT-01 | Login | Credenciais válidas | Partição (válida) | Acessa o catálogo | Alta | `e2e/login.spec.ts` |
| CT-02 | Login | Usuário vazio | Partição (inválida) | "Username is required" | Média | `e2e/login.spec.ts` |
| CT-03 | Login | Senha vazia | Partição (inválida) | "Password is required" | Média | `e2e/login.spec.ts` |
| CT-04 | Login | Senha incorreta | Partição (inválida) | Mensagem de credenciais inválidas | Alta | `e2e/login.spec.ts` |
| CT-05 | Login | Usuário inexistente | Partição (inválida) | Mensagem de credenciais inválidas | Média | `e2e/login.spec.ts` |
| CT-06 | Login | Usuário bloqueado | Partição (inválida) | "user has been locked out" | Alta | `e2e/login.spec.ts` |
| CT-07 | Sessão | Logout e acesso direto sem sessão | Baseado em risco (segurança) | Volta ao login e bloqueia página interna | Alta | `e2e/login.spec.ts` |
| CT-08 | Carrinho | Adicionar produtos | – | Contador do carrinho incrementa | Alta | `e2e/cart.spec.ts` |
| CT-09 | Carrinho | Remover produtos | – | Contador decrementa / some | Média | `e2e/cart.spec.ts` |
| CT-10 | Carrinho | Itens exibidos no carrinho | – | Exatamente os itens adicionados | Alta | `e2e/cart.spec.ts` |
| CT-11 | Carrinho | Recarregar página | – | Itens permanecem | Média | `e2e/cart.spec.ts` |
| CT-12 | Catálogo | Ordenar Z → A | – | Lista em ordem decrescente | Baixa | `e2e/cart.spec.ts` |
| CT-13 | Catálogo | Ordenar preço crescente | – | Preços em ordem crescente | Baixa | `e2e/cart.spec.ts` |
| CT-14 | Catálogo | Ordenar preço decrescente | – | Preços em ordem decrescente | Baixa | `e2e/cart.spec.ts` |
| CT-15 | Checkout | Compra completa | Fluxo principal | "Thank you for your order!" | Alta | `e2e/checkout.spec.ts` |
| CT-16 | Checkout | Cálculo de subtotal, taxa e total | Baseado em risco | Valores corretos (taxa 8%) | Alta | `e2e/checkout.spec.ts` |
| CT-17 | Checkout | Nome vazio | Tabela de decisão | "First Name is required" | Média | `e2e/checkout.spec.ts` |
| CT-18 | Checkout | Sobrenome vazio | Tabela de decisão | "Last Name is required" | Média | `e2e/checkout.spec.ts` |
| CT-19 | Checkout | CEP vazio | Tabela de decisão | "Postal Code is required" | Média | `e2e/checkout.spec.ts` |
| CT-20 | Acessibilidade | Tela de login | WCAG 2.1 AA | Sem violações críticas | Média | `a11y/accessibility.spec.ts` |
| CT-21 | Acessibilidade | Catálogo | WCAG 2.1 AA | Sem violações críticas | Média | `a11y/accessibility.spec.ts` |
| API-01 | Produtos | Listagem com paginação | Contrato | 200, schema válido, 10 itens | Alta | `api/products.spec.ts` |
| API-02 | Produtos | Buscar por ID | Contrato | 200, schema válido | Alta | `api/products.spec.ts` |
| API-03 | Produtos | ID inexistente | Partição (inválida) | 404 com mensagem | Média | `api/products.spec.ts` |
| API-04 | Produtos | Pesquisa por termo | – | Só itens relacionados | Média | `api/products.spec.ts` |
| API-05 | Produtos | Paginação limit = 1 e 30 | Valor limite | Quantidade exata | Média | `api/products.spec.ts` |
| API-06 | Produtos | Regras de preço e desconto | Valor limite | Preço > 0; 0% ≤ desconto ≤ 100% | Alta | `api/products.spec.ts` |
| API-07 | Produtos | CRUD | – | 201 / 200 / isDeleted | Alta | `api/products.spec.ts` |
| API-08 | Auth | Login válido | Contrato | 200 + tokens | Alta | `api/auth.spec.ts` |
| API-09 | Auth | Senha inválida | Partição (inválida) | 400 "Invalid credentials" | Alta | `api/auth.spec.ts` |
| API-10 | Auth | Rota protegida com token | Segurança | 200 | Alta | `api/auth.spec.ts` |
| API-11 | Auth | Rota protegida sem token | Segurança | 401 | Alta | `api/auth.spec.ts` |
| API-12 | Auth | Token adulterado | Segurança | Acesso negado | Alta | `api/auth.spec.ts` |
| SQL-01..06 | Dados | Consistência dos carrinhos | Validação com SQL | Zero inconsistências | Alta | `sql/cart-data.spec.ts` |
