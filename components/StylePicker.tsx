"use client";
import { useEffect, useState } from "react";
import Button from "./Button";

export default function StylePicker({ conversationId, onChange }:{ conversationId: string; onChange?: (slug:string)=>void; }) {
  const [styles, setStyles] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("normal");

  useEffect(() => { fetch("/api/styles").then(r=>r.json()).then(d=>setStyles(d.items || [])); }, []);

  async function apply(slug: string) {
    setActive(slug);
    await fetch(`/api/conversations/${conversationId}/style`, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ styleSlug: slug }) });
    onChange?.(slug);
    setOpen(false);
  }

  return (
    <div className="relative">
      <Button tone="glass" onClick={()=>setOpen(v=>!v)}>Style: {active}</Button>
      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-3xl border bg-white/90 shadow-soft backdrop-blur p-1">
          {styles.map((s:any) => (
            <button key={s.slug} onClick={()=>apply(s.slug)} className={`w-full text-left p-3 rounded-2xl hover:bg-black/5 ${active===s.slug?"bg-black/5":""}`}>
              <div className="font-medium">{s.name}</div>
              <div className="text-xs opacity-70 line-clamp-2">{s.toneSys}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
