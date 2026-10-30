# 🧪 QA Automation – E-commerce & API

[![Testes automatizados](https://github.com/vituGiovani/qa-automation-playwright/actions/workflows/tests.yml/badge.svg)](https://github.com/vituGiovani/qa-automation-playwright/actions/workflows/tests.yml)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?logo=postman&logoColor=white)
![SQL](https://img.shields.io/badge/SQL-003B57?logo=sqlite&logoColor=white)

Suíte de testes automatizados cobrindo o ciclo de qualidade de ponta a ponta: **planejamento, testes E2E, testes de API, validação de dados com SQL, acessibilidade, CI/CD e gestão de defeitos**.

📊 **[Ver relatórios ao vivo](https://vitugiovani.github.io/qa-automation-playwright/)** – atualizados automaticamente a cada execução do pipeline.

---

## 🎯 O que é testado

| Camada | Alvo | Destaques |
|---|---|---|
| **E2E** | [Sauce Demo](https://www.saucedemo.com) | Login, carrinho, ordenação e checkout em **Chrome, Firefox e Safari**, com Page Object Model |
| **API REST** | [DummyJSON](https://dummyjson.com) | Status HTTP, **contrato via JSON Schema**, regras de negócio, CRUD e segurança de rotas autenticadas |
| **Postman** | DummyJSON | Coleção executada no CI via **Newman**, com relatório HTML |
| **Dados (SQL)** | Carrinhos da API | Dados carregados em SQLite e validados com **consultas SQL** de consistência |
| **Acessibilidade** | Sauce Demo | **axe-core** com regras WCAG 2.1 AA |
| **Defeitos** | Sauce Demo + API | 4 bugs encontrados (3 na interface, 1 nos dados da API via SQL), documentados e cobertos por testes com `test.fail()` |

## 📁 Estrutura

```
├── .github/
│   ├── workflows/tests.yml     # Pipeline CI/CD: testes + publicação dos relatórios
│   └── ISSUE_TEMPLATE/         # Template de bug report
├── docs/
│   ├── plano-de-testes.md      # Escopo, estratégia, técnicas e critérios
│   ├── casos-de-teste.md       # 40+ casos com técnica e prioridade
│   └── bugs.md                 # Defeitos encontrados
├── pages/                      # Page Objects (Login, Inventory, Cart, Checkout)
├── fixtures/                   # Fixtures do Playwright (páginas prontas, usuário logado)
├── data/                       # Massa de dados de teste
├── postman/                    # Coleção Postman
├── sql/                        # Schema e consultas de validação
└── tests/
    ├── e2e/                    # Testes de interface
    ├── api/                    # Testes de API + schemas de contrato
    ├── sql/                    # Validação de dados com SQL
    └── a11y/                   # Acessibilidade
```

## 🧠 Decisões de projeto

- **Page Object Model + fixtures**: os testes descrevem *o que* validar; os seletores e ações ficam nas páginas. Uma mudança no HTML exige ajuste em um único lugar.
- **Seletores estáveis** (`data-test`): não quebram com mudanças de layout ou texto.
- **Testes de contrato**: validar só o status 200 não basta. O JSON Schema garante estrutura e tipos da resposta.
- **Técnicas de teste explícitas**: partição de equivalência, valor limite e tabela de decisão (veja o [plano de testes](docs/plano-de-testes.md)).
- **Defeitos conhecidos com `test.fail()`**: a pipeline segue verde enquanto o bug existe e **avisa sozinha** quando ele for corrigido.
- **Evidências automáticas**: screenshot, vídeo e trace guardados em cada falha.
- **Regressão contínua**: o pipeline roda a cada push, em pull requests e **diariamente** de forma agendada.

## ▶️ Como executar

Pré-requisito: Node.js 22+

```bash
npm install
npx playwright install

npm test                 # suíte completa
npm run test:api         # só API + SQL
npm run test:e2e         # só interface (3 navegadores)
npm run test:headed      # interface com o navegador visível
npx playwright test --grep @smoke   # só os testes críticos
npm run test:postman     # coleção Postman via Newman
npm run report           # abre o relatório HTML
```

## 🐞 Defeitos encontrados

| ID | Defeito | Severidade |
|---|---|---|
| BUG-01 | Imagens de produto repetidas | Média |
| BUG-02 | Ordenação do catálogo não funciona | Média |
| BUG-03 | Campo "Last Name" não aceita digitação no checkout | **Crítica** |
| BUG-04 | API retorna carrinhos com o mesmo produto duplicado (encontrado via SQL) | Média |

Detalhes, passos e evidências em [`docs/bugs.md`](docs/bugs.md) e nas [Issues](https://github.com/vituGiovani/qa-automation-playwright/issues).

---

Feito por **Victor Giovani de Oliveira** · [LinkedIn](https://www.linkedin.com/in/vituGiovanni/)
