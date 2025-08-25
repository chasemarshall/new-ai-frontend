import prisma from "@/lib/db";

async function main() {
  // Org + Project
  const org = await prisma.org.upsert({ where:{ id:"demo" }, update:{}, create:{ id:"demo", name:"Demo Org" }});
  await prisma.project.upsert({ where:{ id:"proj" }, update:{}, create:{ id:"proj", orgId: org.id, name:"Demo Project" }});

  const presets = [
    { name:"Normal", slug:"normal", toneSys:"Be helpful and natural. Match user formality. Keep answers compact unless asked.", paramsJson:{ temperature:0.5, top_p:0.9, max_tokens_hint:"auto", frequency_penalty:0 }},
    { name:"Learning", slug:"learning", toneSys:"Patient teacher. Explain step-by-step with simple examples.", paramsJson:{ temperature:0.4, top_p:0.9, max_tokens_hint:"medium", frequency_penalty:0 }},
    { name:"Concise", slug:"concise", toneSys:"Answer in 1–3 bullets or 2 short sentences. No filler.", paramsJson:{ temperature:0.3, top_p:0.85, max_tokens_hint:"short", frequency_penalty:0.2 }},
    { name:"Explanatory", slug:"explanatory", toneSys:"Educational tone. Define terms, then a clear, ordered explanation.", paramsJson:{ temperature:0.5, top_p:0.9, max_tokens_hint:"long", frequency_penalty:0 }},
    { name:"Formal", slug:"formal", toneSys:"Professional, structured, complete sentences. Include rationale.", paramsJson:{ temperature:0.35, top_p:0.9, max_tokens_hint:"medium", frequency_penalty:0 }}
  ];
  for (const p of presets) await prisma.stylePreset.upsert({ where:{ slug:p.slug }, update:p as any, create:p as any });
}

main().then(()=>process.exit(0)).catch(e=>{ console.error(e); process.exit(1); });
