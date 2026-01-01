import { fmt } from "../utils/money";

export default function ModalQuickView({ open, product, isWished, onAdd, onWish, onClose }) {
  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-60 grid place-items-center px-4">
      <div className="w-full max-w-[820px] bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 h-10 w-10 rounded-full border border-slate-200 grid place-items-center">✕</button>

        <div className="grid md:grid-cols-2">
          <div className="bg-slate-50 grid place-items-center p-10">
            <img src={product.img} alt="" className="h-20 w-20 opacity-80" />
          </div>

          <div className="p-7">
            <div className="text-sm text-slate-500">{product.category} • Stock {product.stock}</div>
            <h3 className="text-3xl font-black mt-2">{product.name}</h3>
            <div className="text-xl font-black mt-4">{fmt(product.price)}</div>

            <div className="mt-6 flex gap-3">
              <button onClick={onAdd} className="flex-1 py-3 rounded-full bg-black text-white font-semibold">Add to cart</button>
              <button onClick={onWish} className="w-14 py-3 rounded-full border border-slate-200 font-semibold">
                {isWished(product.id) ? "💜" : "🤍"}
              </button>
            </div>

            <p className="text-slate-500 text-sm mt-5">
              Quick view modal. Later you can connect this to real product detail page + backend.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
