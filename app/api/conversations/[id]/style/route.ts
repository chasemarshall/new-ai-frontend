import prisma from "@/lib/db";
export async function POST(req: Request, { params }: { params:{ id:string }}) {
  const { styleSlug } = await req.json();
  const preset = await prisma.stylePreset.findUnique({ where:{ slug: styleSlug }});
  if (!preset) return new Response("unknown style", { status:404 });
  const conversation = await prisma.conversation.upsert({
    where:{ id: params.id }, update:{ stylePresetId: preset.id }, create:{ id: params.id, projectId: "proj", stylePresetId: preset.id }
  });
  return Response.json({ ok:true, conversation });
}
