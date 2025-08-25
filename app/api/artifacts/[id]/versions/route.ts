import prisma from "@/lib/db"; import { makeDiff } from "@/lib/diff"; import { autoSummarize } from "@/lib/summarize";
export async function POST(req: Request, { params }:{ params:{ id:string }}) {
  const { parentVersionId, branch = "main", contentText, blobUrl, summary, modelName, provider, paramsJson } = await req.json();
  const parent = parentVersionId ? await prisma.artifactVersion.findUnique({ where:{ id: parentVersionId }}) : null;
  const diffJson = parent?.contentText ? makeDiff(parent.contentText, contentText ?? "") : undefined;
  const autoSummary = await autoSummarize({ prev: parent?.contentText ?? "", next: contentText ?? "", notes: summary ?? "" });
  const v = await prisma.artifactVersion.create({
    data: { artifactId: params.id, parentId: parentVersionId, branch, contentText, blobUrl, summary, autoSummary, diffJson, modelName, provider, paramsJson }
  });
  await prisma.artifact.update({ where:{ id: params.id }, data:{ latestVersionId: v.id }});
  return Response.json({ version: v });
}
