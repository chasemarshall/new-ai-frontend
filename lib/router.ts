export async function routerChat(body: {
  model: string;
  messages: {role:"system"|"user"|"assistant"; content:string}[];
  stream?: boolean;
  params?: Record<string, any>;
  routerHeaders?: Record<string,string>;
}) {
  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type":"application/json",
      "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`,
      "HTTP-Referer": process.env.APP_URL ?? "http://localhost:3000",
      "X-Title": "AI Workbench",
      ...body.routerHeaders
    },
    body: JSON.stringify({ stream: body.stream ?? false, model: body.model, messages: body.messages, ...body.params })
  });
  if (!r.ok) throw new Error(`OpenRouter ${r.status}`);
  return r;
}
