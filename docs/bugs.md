# Defeitos encontrados

Defeitos identificados pela suíte: BUG-01 a 03 na interface (usuário `problem_user`) e BUG-04 nos dados da API (validação com SQL). Cada um é registrado como Issue no GitHub e permanece coberto por um teste marcado com `test.fail()` em [`tests/e2e/known-bugs.spec.ts`](../tests/e2e/known-bugs.spec.ts).

## BUG-01 – Todas as imagens de produto são iguais
| | |
|---|---|
| **Severidade / Prioridade** | Média / Alta |
| **Ambiente** | Sauce Demo – Chrome, Firefox e Safari – usuário `problem_user` |
| **Passos** | 1. Fazer login com `problem_user`<br>2. Observar o catálogo |
| **Esperado** | Cada produto exibe sua própria imagem |
| **Obtido** | Todos os produtos exibem a mesma imagem |
| **Impacto** | O cliente não consegue identificar o produto visualmente |

## BUG-02 – Ordenação do catálogo não funciona
| | |
|---|---|
| **Severidade / Prioridade** | Média / Média |
| **Passos** | 1. Login com `problem_user`<br>2. Selecionar "Name (Z to A)" |
| **Esperado** | Lista reordenada de Z a A |
| **Obtido** | A lista não muda de ordem |

## BUG-03 – Campo "Last Name" não aceita digitação no checkout
| | |
|---|---|
| **Severidade / Prioridade** | **Crítica** / Alta |
| **Passos** | 1. Login com `problem_user`<br>2. Adicionar produto e ir ao checkout<br>3. Digitar no campo "Last Name" |
| **Esperado** | O texto aparece no campo "Last Name" |
| **Obtido** | O campo continua vazio e a compra não pode ser concluída |
| **Impacto** | **Bloqueia a finalização da compra** |

## BUG-04 – Carrinhos com o mesmo produto em mais de uma linha (API)
| | |
|---|---|
| **Severidade / Prioridade** | Média / Média |
| **Ambiente** | API DummyJSON – `GET /carts?limit=0` |
| **Como foi encontrado** | Validação com SQL: dados dos carrinhos carregados em SQLite e consulta `itens_duplicados` (`sql/validations.sql`) |
| **Passos** | 1. Chamar `GET /carts?limit=0`<br>2. Agrupar os itens por carrinho e produto<br>3. Verificar produtos com mais de uma ocorrência |
| **Esperado** | Cada produto aparece uma única vez por carrinho, com a quantidade somada |
| **Obtido** | Há carrinhos com o mesmo `product_id` em linhas diferentes (ex.: produto 190) |
| **Impacto** | Risco de contagem incorreta de itens, relatórios divergentes e erros em integrações que usam (carrinho, produto) como chave |
| **Teste relacionado** | `tests/sql/cart-data.spec.ts` – consulta `itens_duplicados`, marcada como falha esperada |
