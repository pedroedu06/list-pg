# Lista PG

App Android para controlar quem já pagou uma rifa/bolão. Você cadastra as pessoas (número + nome), marca quem pagou e o app gera a lista pronta para copiar e colar no WhatsApp. A lista mostra **só quem pagou**, ordenado pelo número:

```
1 - fulano PG
3 - beltrano PG
```

Não tem backend nem login: os dados ficam salvos no próprio celular.

## Stack

- [Expo](https://docs.expo.dev/) SDK 57 + React Native + TypeScript
- [Expo Router](https://docs.expo.dev/router/introduction/) para navegação
- [expo-sqlite](https://docs.expo.dev/versions/v57.0.0/sdk/sqlite/) + [Drizzle ORM](https://orm.drizzle.team/docs/connect-expo-sqlite) como banco local
- [vitest-expo](https://github.com/niondigital/vitest-expo) + [Testing Library](https://callstack.github.io/react-native-testing-library/) para testes
- [Bun](https://bun.sh/) como gerenciador de pacotes

## Pré-requisitos

- Node.js 24+
- Bun 1.3+
- Celular Android com o app **Expo Go** ([Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent))

## Rodar localmente

```bash
bun install
bun run start
```

Escaneie o QR code que aparece no terminal com o Expo Go. O celular e o computador precisam estar na mesma rede Wi-Fi. Se não conectar (rede corporativa, firewall), use o modo túnel:

```bash
bunx expo start --tunnel
```

Para instalar pacotes, use sempre `bunx expo install <pacote>` em vez de `bun add`. Ele escolhe a versão compatível com o SDK do Expo.

## Banco de dados

- SQLite local no aparelho, arquivo `lista-pg.db`. Não precisa configurar nada.
- As migrations rodam sozinhas quando o app abre (`useMigrations` em `src/app/_layout.tsx`).
- O schema fica em `src/db/schema.ts` e as migrations geradas, em `drizzle/`.

Para alterar o schema:

1. Edite `src/db/schema.ts`.
2. Gere a migration:
   ```bash
   bun run db:generate
   ```
3. Commite a pasta `drizzle/` junto com a mudança.

Para zerar o banco no celular, limpe os dados do app (Configurações → Apps → Expo Go/Lista PG → Armazenamento → Limpar dados) ou reinstale o app.

## Testes e qualidade

```bash
bun run test        # roda todos os testes uma vez
bun run test:watch  # modo watch
bun run typecheck   # TypeScript
bun run lint        # ESLint
```

- Os testes de tela usam vitest-expo, que roda o código React Native real com os módulos nativos mockados.
- Os testes de banco usam SQLite em memória (better-sqlite3) com as **mesmas migrations** de `drizzle/`. Use `createTestDb()` de `src/db/test-db.ts`.

## Gerar e instalar o app (APK)

O APK é gerado na nuvem pelo [EAS Build](https://docs.expo.dev/build/introduction/). Você precisa de uma conta Expo (é grátis).

```bash
bunx eas-cli login
```

```bash
bunx eas-cli build -p android --profile preview
```

- No primeiro build, o EAS pergunta o *package name* do Android (ex.: `com.seunome.listapg`) e se deve criar a chave de assinatura. Aceite as duas coisas.
- Quando o build terminar, o terminal mostra um link e um QR code para baixar o `.apk`.
- No celular, abra o link, baixe e instale o APK. O Android vai pedir permissão para "instalar apps de fontes desconhecidas" para o navegador. Permita.
- Para atualizar o app, gere um novo build e instale por cima. Os dados são mantidos.

Os profiles de build estão em `eas.json`. `preview` gera um APK para instalar direto, e `production` gera um AAB para a Play Store.

## Estrutura

```
src/
  app/            rotas (expo-router): cada arquivo é uma tela
    index.tsx     Lista: checks de quem pagou + Limpar
    editar.tsx    cadastro de pessoas
    previa.tsx    texto final + Copiar / Enviar no WhatsApp
  components/     componentes reutilizáveis
  constants/      tema e espaçamentos
  db/             schema, cliente do banco e helper de testes
  hooks/
  lib/            formatação da mensagem e compartilhamento
drizzle/          migrations geradas pelo drizzle-kit
```
