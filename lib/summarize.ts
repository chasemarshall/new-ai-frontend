import { routerChat } from "./router";
export async function autoSummarize({ prev, next, notes }:{prev:string; next:string; notes:string;}) {
  const prompt = `You write crisp changelogs.\n1) One-line summary\n2) 3-6 key changes\n3) Impact/Risks\n4) Reference user notes if useful.\n\nPREV:\n${(prev||"").slice(0,8000)}\n\nNEW:\n${(next||"").slice(0,8000)}\n\nNOTES:\n${notes||""}`;
  const r = await routerChat({ model: "openai/gpt-4.1-mini", messages:[{role:"user", content: prompt}]});
  const j = await r.json();
  return j.choices?.[0]?.message?.content ?? "";
}
