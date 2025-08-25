import prisma from "@/lib/db";
export async function POST(req: Request) {
  const { orgId = "demo", title, tags = [], bodyMd } = await req.json();
  const p = await prisma.playbook.create({ data: { orgId, title, tags, bodyMd }});
  return Response.json({ playbook: p });
}
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q") ?? "";
  const rows = await prisma.$queryRawUnsafe(`
    SELECT * FROM "Playbook"
    WHERE to_tsvector('english', "title" || ' ' || array_to_string("tags",' ') || ' ' || "bodyMd")
    @@ plainto_tsquery('english', $1)
    ORDER BY "createdAt" DESC LIMIT 20;`, q);
  return Response.json({ results: rows });
}
