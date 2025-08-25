import prisma from "@/lib/db";
export async function POST(req: Request) {
  const { orgId = "demo", query } = await req.json();
  const rows = await prisma.$queryRawUnsafe(`
    SELECT c.id, c.url, c.text FROM "KbChunk" c
    WHERE c."sourceId" IN (SELECT id FROM "KbSource" WHERE "orgId" = $1)
    AND to_tsvector('english', c.text) @@ plainto_tsquery('english', $2)
    LIMIT 8;`, orgId, query);
  return Response.json({ context: rows });
}
