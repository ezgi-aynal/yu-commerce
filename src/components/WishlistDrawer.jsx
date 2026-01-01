import { fmt } from "../utils/money";

export default function DrawerWishlist({ open, wish, products, onAdd, onRemove, onOpen, onClose, onClear }) {
  return (
    <aside className={[
      "fixed top-0 right-0 h-full w-[380px] max-w-[92vw] bg-white z-50 border-l border-slate-200 transition-transform",
      open ? "translate-x-0" : "translate-x-full",
    ].join(" ")}>
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200">
        <div className="text-lg font-black">Wishlist</div>
        <button onClick={onClose} className="h-10 w-10 rounded-full border border-slate-200 grid place-items-center">✕</button>
      </div>

      <div className="p-5 space-y-3 overflow-auto h-[calc(100%-8.5rem)]">
        {wish.length === 0 ? <div className="text-slate-500">No saved items.</div> : null}

        {wish.map((id) => {
          const p = products.find((x) => x.id === id);
          if (!p) return null;
          return (
            <div key={id} className="border border-slate-200 rounded-2xl p-4 flex gap-3">
              <button onClick={() => onOpen(id)} className="h-12 w-12 rounded-xl bg-slate-50 grid place-items-center">
                <img src={p.img} alt="" className="h-6 w-6 opacity-80" />
              </button>

              <div className="flex-1">
                <div className="font-black">{p.name}</div>
                <div className="text-sm text-slate-500">{p.category}</div>
                <div className="mt-2 font-black">{fmt(p.price)}</div>
              </div>

              <div className="flex flex-col gap-2">
                <button onClick={() => onAdd(id, 1)} className="px-3 py-2 rounded-xl bg-black text-white text-sm font-semibold">Add</button>
                <button onClick={() => onRemove(id)} className="px-3 py-2 rounded-xl bg-slate-100 text-sm font-semibold">Remove</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-5 border-t border-slate-200">
        <button onClick={onClear} className="w-full py-3 rounded-full bg-white border border-slate-200 font-semibold hover:bg-slate-50">
          Clear wishlist
        </button>
      </div>
    </aside>
  );
}
