import prisma from "@/lib/db";
export async function GET() {
  const items = await prisma.stylePreset.findMany({ orderBy:{ name:"asc" }});
  return Response.json({ items });
}
