export default function Toasts({ items }) {
  return (
    <div className="fixed z-[80] right-4 bottom-4 space-y-2">
      {items.map((t) => (
        <div key={t.id} className="bg-white border border-slate-200 shadow-lg rounded-2xl px-4 py-3 w-[280px]">
          <div className="font-semibold">{t.title}</div>
          {t.sub ? <div className="text-sm text-slate-500 mt-0.5">{t.sub}</div> : null}
        </div>
      ))}
    </div>
  );
}
