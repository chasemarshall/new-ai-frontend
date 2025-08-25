import prisma from "@/lib/db";
export async function POST(req: Request) {
  const { projectId = "proj", type, name, contentText, blobUrl, summary } = await req.json();
  const art = await prisma.artifact.create({ data: { projectId, type, name }});
  const v = await prisma.artifactVersion.create({ data: { artifactId: art.id, contentText, blobUrl, summary }});
  await prisma.artifact.update({ where:{ id: art.id }, data:{ latestVersionId: v.id }});
  return Response.json({ artifact: art, version: v });
}
