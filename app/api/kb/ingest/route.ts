import prisma from "@/lib/db";
export async function POST(req: Request) {
  const { sourceId } = await req.json();
  const src = await prisma.kbSource.findUnique({ where:{ id: sourceId }});
  if (!src) return new Response("not found", { status:404 });
  const r = await fetch(src.url, { headers:{ "User-Agent":"AI-Workbench/0.1" }});
  const html = await r.text();
  const text = html.replace(/<script[\s\S]*?<\/script>/g,"").replace(/<style[\s\S]*?<\/style>/g,"").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
  const chunks: string[] = []; const size = 1200; for (let i=0;i<text.length;i+=size) chunks.push(text.slice(i,i+size));
  await prisma.kbChunk.createMany({ data: chunks.map(c => ({ sourceId, url: src.url, text: c })) });
  await prisma.kbSource.update({ where:{ id: sourceId }, data:{ status:"ingested" }});
  return Response.json({ ok:true, chunks: chunks.length });
}
