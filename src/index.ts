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

app.get("/api/posts/:id", async (c) => {
  const id = c.req.param('id');
  const result = await c.env.DB.prepare(
      `SELECT id, title, body, created_at FROM posts WHERE id = ?`
  ).bind(id).first();

  return c.json(result)
});

app.post("/api/posts", async (c) => {
    const request = await c.req.parseBody();
    const title = request['title'];
    const body = request['body'];
    const created_at = new Date().toISOString();
    const result = await c.env.DB.prepare(
        `
        INSERT INTO posts (title, body, created_at)
        VALUES (?, ?, ?)
        `
    )
        .bind(title, body, created_at)
        .run();

    return c.json(
        {
            ok: true,
            meta: result.meta,
        },
        201
    );
});

export default app;
