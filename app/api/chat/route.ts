import prisma from "@/lib/db";
import { routerChat } from "@/lib/router";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json(); // {conversationId, model, messages, params, styleOverrideSlug?}
  let style: any = null;
  if (body.styleOverrideSlug) {
    style = await prisma.stylePreset.findUnique({ where:{ slug: body.styleOverrideSlug }});
  } else if (body.conversationId) {
    const convo = await prisma.conversation.findUnique({ where:{ id: body.conversationId }});
    if (convo?.stylePresetId) style = await prisma.stylePreset.findUnique({ where:{ id: convo.stylePresetId }});
  }
  const sysTone = style?.toneSys ?? "";
  const mergedParams: any = {
    ...(style?.paramsJson?.max_tokens_hint === "short" ? { max_tokens: 300 } :
      style?.paramsJson?.max_tokens_hint === "medium" ? { max_tokens: 800 } :
      style?.paramsJson?.max_tokens_hint === "long" ? { max_tokens: 1600 } : {}),
    ...body.params
  };
  const messages = sysTone ? [{ role:"system", content: sysTone }, ...body.messages] : body.messages;
  const r = await routerChat({ model: body.model ?? "openai/gpt-4.1-mini", messages, params: mergedParams, stream: true });
  return new Response(r.body, { headers: { "Content-Type": "text/event-stream" }});
}
