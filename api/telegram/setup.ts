import type { VercelRequest, VercelResponse } from "@vercel/node";
import { env, requiredEnv } from "../../lib/env.js";
import { telegram } from "../../lib/telegram.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const setupSecret = requiredEnv("SETUP_SECRET");
    const supplied = String(req.headers["x-setup-secret"] ?? req.query.secret ?? "");
    if (supplied !== setupSecret) return res.status(401).json({ ok: false, error: "Unauthorized" });

    const baseUrl = env("PUBLIC_BASE_URL").replace(/\/$/, "") || `https://${req.headers.host}`;
    const webhookSecret = requiredEnv("TELEGRAM_WEBHOOK_SECRET");
    const webhookUrl = `${baseUrl}/api/telegram/webhook`;

    const result = await telegram("setWebhook", {
      url: webhookUrl,
      secret_token: webhookSecret,
      allowed_updates: ["message"],
      drop_pending_updates: false,
    });

    return res.status(200).json({ ok: true, webhookUrl, telegram: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, error: error instanceof Error ? error.message : "Setup failed" });
  }
}
