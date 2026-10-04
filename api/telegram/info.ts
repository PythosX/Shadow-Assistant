import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requiredEnv } from "../../lib/env.js";
import { telegram } from "../../lib/telegram.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });
  try {
    const setupSecret = requiredEnv("SETUP_SECRET");
    const supplied = String(req.headers["x-setup-secret"] ?? req.query.secret ?? "");
    if (supplied !== setupSecret) return res.status(401).json({ ok: false, error: "Unauthorized" });
    const result = await telegram("getWebhookInfo");
    return res.status(200).json({ ok: true, webhook: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, error: error instanceof Error ? error.message : "Info failed" });
  }
}
