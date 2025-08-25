export function makeDiff(a: string, b: string) {
  const aLines = a?.split("\n") ?? [], bLines = b?.split("\n") ?? [];
  return { before: aLines, after: bLines };
}
