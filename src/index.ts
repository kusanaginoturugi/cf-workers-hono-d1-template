import { Hono } from "hono";

type Env = {
  Bindings: {
    DB: D1Database;
    APP_ENV: string;
    SESSION_SECRET: string;
  };
};

const app = new Hono<Env>();

app.get("/", (c) => {
  return c.text("Hello Cloudflare Workers");
});

app.get("/health", (c) => {
  return c.json({
    ok: true,
    env: c.env.APP_ENV ?? "unknown",
  });
});

app.get("/api/posts", async (c) => {
  const result = await c.env.DB.prepare(
    "SELECT id, title, body, created_at FROM posts ORDER BY id DESC"
  ).all();

  return c.json(result.results);
});

export default app;
