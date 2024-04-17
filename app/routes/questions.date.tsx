import { json } from "@remix-run/cloudflare";

export async function loader({ context }) {
  const { env } = context.cloudflare;

  console.log("Env", env);

  await env.demo_cache.put("date", new Date().toString(), {
    expirationTtl: 60,
  });

  const dateFromCache = await env.demo_cache.get("date");

  return json({ date: dateFromCache });
}
