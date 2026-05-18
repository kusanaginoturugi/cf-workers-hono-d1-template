[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
npm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiation `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```

### テンプレートの使い方

#### テンプレートのコピー
```sh
gh repo create doralive --template git@github.com:kusanaginoturugi/cf-workers-hono-d1-template.git --private --clone
```

#### 環境構築
```sh
npm ci
npx wrangler d1 migrations apply doralivedb --local
npm run dev
```
#### 手動デプロイ
```txt
npm run deploy
```

手動でデプロイするより、cloudflare との連携をする方がおすすめ。

