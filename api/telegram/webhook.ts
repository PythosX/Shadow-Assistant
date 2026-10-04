import type { VercelRequest, VercelResponse } from "@vercel/node";
import { env } from "../../lib/env.js";
import { generateCreatorReply } from "../../lib/ai.js";
import { loadCreatorKnowledge } from "../../lib/knowledge.js";
import { matchRule } from "../../lib/rules.js";
import { sendMessage, sendTyping } from "../../lib/telegram.js";

type TelegramUpdate = {
  update_id?: number;
  message?: {
    message_id?: number;
    chat?: { id?: number | string; type?: string };
    text?: string;
    from?: { first_name?: string; username?: string };
  };
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  const expectedSecret = env("TELEGRAM_WEBHOOK_SECRET");
  if (expectedSecret) {
    const received = String(req.headers["x-telegram-bot-api-secret-token"] ?? "");
    if (received !== expectedSecret) return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  const update = req.body as TelegramUpdate;
  const message = update?.message;
  const text = message?.text?.trim();
  const chatId = message?.chat?.id;

  // Telegram expects a fast successful response. For this simple MVP we process the
  // AI call in the same invocation; Vercel's Node function keeps the request open.
  if (!text || chatId === undefined) return res.status(200).json({ ok: true, ignored: true });

  try {
    if (text === "/start") {
      await sendMessage(chatId, "👋 Hi! I'm Shadow Assistant. Ask me anything about the creator, projects, skills, work, links or services.");
      return res.status(200).json({ ok: true });
    }

    if (text === "/help") {
      await sendMessage(chatId, "Try questions like:\n• What projects has the creator built?\n• What technologies does he use?\n• Where can I see his GitHub?\n• Can I hire him?\n\nI answer using the creator knowledge configured for Shadow.");
      return res.status(200).json({ ok: true });
    }

    const rule = matchRule(text);
    if (rule.matched) {
      await sendMessage(chatId, rule.text, message.message_id);
      return res.status(200).json({ ok: true, mode: "rule" });
    }

    await sendTyping(chatId);
    const knowledge = await loadCreatorKnowledge();
    const answer = await generateCreatorReply(text, knowledge);
    await sendMessage(chatId, answer, message.message_id);

    return res.status(200).json({ ok: true, mode: "ai" });
  } catch (error) {
    console.error("Shadow webhook error:", error);
    try {
      await sendMessage(chatId, "Sorry, I couldn't process that right now. Please try again in a moment.");
    } catch (sendError) {
      console.error("Failed to send fallback:", sendError);
    }
    return res.status(200).json({ ok: true, handled: false });
  }
}
