export default function Drawer({ open, onClose, children }:{ open:boolean; onClose:()=>void; children:React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div onClick={onClose} className="absolute inset-0 bg-ink/5 backdrop-blur-[10px] animate-reveal" />
      <div className="absolute right-0 top-0 h-full w-[380px] bg-white/80 backdrop-blur-[14px] border-l border-black/10 shadow-soft-lg animate-reveal">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
