# Tarefas — Front-end

Interface em **Next.js e TypeScript** para a [API de tarefas](https://github.com/anjos-404/tarefas-api) feita em ASP.NET Core. Juntos, os dois projetos formam uma aplicação full-stack de ponta a ponta.

## Funcionalidades

- Listar, criar, concluir e remover tarefas
- Filtro por todas, pendentes e concluídas
- Atualização otimista: a tela muda na hora e desfaz se a API falhar
- Mensagem de erro com botão para tentar de novo
- Tema claro e escuro automático

## Como rodar

1. Suba a API (veja o README do [tarefas-api](https://github.com/anjos-404/tarefas-api)). Ela fica em `http://localhost:5000`.
2. Rode o front:

```bash
npm install
npm run dev
```


```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Estrutura

```
src/lib/api.ts                    tipos e chamadas à API
src/app/page.tsx                  tela principal, estado e filtros
src/components/FormNovaTarefa.tsx formulário de nova tarefa
src/components/ItemTarefa.tsx     uma tarefa da lista
```

## Tecnologias

Next.js · React · TypeScript · Tailwind CSS
