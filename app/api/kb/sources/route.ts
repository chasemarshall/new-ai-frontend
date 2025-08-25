import prisma from "@/lib/db";
export async function POST(req: Request) {
  const { orgId = "demo", url } = await req.json();
  const src = await prisma.kbSource.create({ data: { orgId, url }});
  return Response.json({ source: src });
}
