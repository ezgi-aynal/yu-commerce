import { money } from "../utils/money";

export default function CartDrawer({ open, items, onClose }) {
  if (!open) return null;

  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-[360px] max-w-[92vw] bg-white shadow-2xl border-l border-slate-200">
        <div className="h-16 px-4 border-b border-slate-200 flex items-center justify-between">
          <div className="text-lg font-extrabold">Your Cart</div>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full border border-slate-200 hover:bg-slate-50"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-3 overflow-auto h-[calc(100%-16rem)]">
          {items.length === 0 ? (
            <div className="text-slate-600">Cart is empty.</div>
          ) : (
            items.map((it) => (
              <div key={it.id} className="rounded-2xl border border-slate-200 p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-xl">
                    {it.emoji}
                  </div>
                  <div>
                    <div className="font-extrabold leading-tight">{it.name}</div>
                    <div className="text-sm text-slate-500">
                      {it.category} • x{it.qty}
                    </div>
                  </div>
                </div>
                <div className="font-extrabold">{money(it.price * it.qty)}</div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
            <div className="flex items-center justify-between text-slate-700">
              <span className="font-semibold">Subtotal</span>
              <span className="font-extrabold">{money(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-700 mt-2">
              <span className="font-semibold">Discount</span>
              <span className="font-extrabold">-{money(0)}</span>
            </div>
            <div className="border-t border-slate-200 my-3" />
            <div className="flex items-center justify-between">
              <span className="text-lg font-extrabold">Total</span>
              <span className="text-lg font-extrabold">{money(subtotal)}</span>
            </div>
          </div>

          <button className="mt-4 w-full h-12 rounded-full bg-indigo-600 text-white font-extrabold hover:bg-indigo-500">
            Checkout
          </button>
        </div>
      </aside>
    </div>
  );
}
