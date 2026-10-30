# Plano de Testes – Sauce Demo (E-commerce) e DummyJSON (API)

## 1. Objetivo
Validar os fluxos críticos de compra do e-commerce **Sauce Demo** e os serviços REST da **DummyJSON**, garantindo funcionamento, integridade de dados, segurança básica de autenticação e acessibilidade, com execução automatizada a cada alteração (CI).

## 2. Escopo

| Em escopo | Fora de escopo |
|---|---|
| Login e logout | Pagamento real / gateway |
| Catálogo, ordenação e carrinho | Testes de carga e estresse |
| Checkout completo e cálculo de valores | Testes em dispositivos móveis reais |
| API: autenticação, produtos (CRUD), carrinhos | Pentest aprofundado |
| Integridade de dados de carrinhos via SQL | |
| Acessibilidade (WCAG 2.1 AA) das telas principais | |

## 3. Estratégia e níveis de teste

| Tipo | Ferramenta | O que cobre |
|---|---|---|
| E2E / funcional | Playwright + Page Object Model | Fluxos do usuário na interface |
| Regressão | Playwright (tag `@regression`) + execução diária agendada no CI | Garantir que o que funcionava continua funcionando |
| Smoke | Playwright (tag `@smoke`) | Verificação rápida dos fluxos mais críticos |
| API | Playwright `request` + Postman/Newman | Status HTTP, contrato (JSON Schema), regras de negócio, segurança |
| Dados | SQL (SQLite) | Consistência dos totais e quantidades dos carrinhos |
| Acessibilidade | axe-core | Violações WCAG 2.1 A/AA |
| Compatibilidade | Chrome, Firefox e Safari (WebKit) | Mesmo comportamento nos três motores |

## 4. Técnicas de projeto de teste
- **Partição de equivalência**: login (credenciais válidas x vazias x incorretas x usuário bloqueado) e campos obrigatórios do checkout.
- **Análise de valor limite**: paginação da API (`limit` = 1 e 30) e faixas de valores (preço > 0; desconto entre 0% e 100%).
- **Tabela de decisão**: combinação nome/sobrenome/CEP preenchidos ou vazios no checkout.
- **Teste baseado em risco**: checkout e cálculo de total recebem mais casos por impactarem diretamente a receita.

## 5. Ambiente
- Aplicação: https://www.saucedemo.com – API: https://dummyjson.com
- Navegadores: Chromium, Firefox, WebKit (versões do Playwright)
- Execução: local (`npm test`) e GitHub Actions (push, pull request e diariamente às 08h)

## 6. Critérios
- **Entrada:** ambiente disponível, massa de dados definida (`data/`).
- **Saída:** 100% dos casos `@smoke` aprovados; nenhum defeito crítico aberto sem registro; relatório publicado.
- **Suspensão:** indisponibilidade do ambiente sob teste.

## 7. Gestão de defeitos
Defeitos são registrados como **Issues** no GitHub, usando o template de bug report (severidade, prioridade, passos, esperado x obtido, evidência). Defeitos conhecidos permanecem cobertos por testes marcados com `test.fail()`, que avisam automaticamente quando o defeito for corrigido. Lista atual: [`bugs.md`](bugs.md).

## 8. Entregáveis
Plano de testes, [casos de teste](casos-de-teste.md), scripts automatizados, relatório HTML (Playwright e Newman) publicado no GitHub Pages e bug reports.
