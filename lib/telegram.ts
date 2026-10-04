import { requiredEnv } from "./env.js";

const apiBase = () => `https://api.telegram.org/bot${requiredEnv("TELEGRAM_BOT_TOKEN")}`;

export async function telegram<T = unknown>(method: string, body?: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${apiBase()}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = (await response.json()) as { ok?: boolean; result?: T; description?: string };
  if (!response.ok || !data.ok) {
    throw new Error(`Telegram ${method} failed: ${data.description ?? response.statusText}`);
  }
  return data.result as T;
}

export async function sendMessage(chatId: number | string, text: string, replyToMessageId?: number) {
  // Telegram limits message text to 4096 characters. Split safely for longer AI replies.
  const chunks = splitText(text, 3900);
  for (const chunk of chunks) {
    await telegram("sendMessage", {
      chat_id: chatId,
      text: chunk,
      ...(replyToMessageId ? { reply_parameters: { message_id: replyToMessageId } } : {}),
      disable_web_page_preview: false,
    });
  }
}

export async function sendTyping(chatId: number | string) {
  await telegram("sendChatAction", { chat_id: chatId, action: "typing" });
}

function splitText(text: string, max: number): string[] {
  if (text.length <= max) return [text];
  const result: string[] = [];
  let remaining = text.trim();
  while (remaining.length > max) {
    let cut = remaining.lastIndexOf("\n", max);
    if (cut < Math.floor(max * 0.55)) cut = remaining.lastIndexOf(" ", max);
    if (cut < Math.floor(max * 0.55)) cut = max;
    result.push(remaining.slice(0, cut).trim());
    remaining = remaining.slice(cut).trim();
  }
  if (remaining) result.push(remaining);
  return result;
}
