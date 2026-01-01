import { fmt } from "../utils/money";

export default function ModalCheckout({ open, cart, products, subtotal, discount, total, onClose, onPlaceOrder }) {
  if (!open) return null;

  const first = cart[0] ? products.find((p) => p.id === cart[0].id) : null;

  return (
    <div className="fixed inset-0 z-60 grid place-items-center px-4">
      <div className="w-full max-w-[1100px] bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 h-10 w-10 rounded-full border border-slate-200 grid place-items-center">✕</button>

        <div className="p-7">
          <div className="grid lg:grid-cols-[1.3fr_1fr] gap-8">
            <div>
              <h2 className="text-4xl font-black">Checkout</h2>
              <div className="text-slate-500 mt-1">Front-end demo checkout. No real payment will be processed.</div>

              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <Field label="Full name" placeholder="Jane Doe" />
                <Field label="Email" placeholder="jane@example.com" />
                <Field label="City" placeholder="İzmir" />
                <Field label="ZIP" placeholder="35000" />
                <Field className="sm:col-span-2" label="Address" placeholder="Street / Building / Flat" />
                <Field label="Card number" placeholder="1234 5678 9012 3456" />
                <Field label="Expiry" placeholder="MM/YY" />
                <Field label="CVC" placeholder="123" />
                <Field label="Note (optional)" placeholder="Leave at the door..." />
              </div>

              <button onClick={onPlaceOrder} className="w-full mt-6 py-3 rounded-full bg-white border border-slate-200 font-semibold hover:bg-slate-50">
                Place Order
              </button>
            </div>

            <div>
              <div className="text-lg font-black">Order Summary</div>

              <div className="mt-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 grid place-items-center">
                    {first ? <img src={first.img} alt="" className="h-5 w-5 opacity-80" /> : "🧾"}
                  </div>
                  <div className="font-semibold">
                    {first ? first.name : "Items"} <span className="text-slate-500 font-normal">× {cart.reduce((s, x) => s + x.qty, 0)}</span>
                  </div>
                </div>
                <div className="font-black">{fmt(total)}</div>
              </div>

              <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-4">
                <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span className="font-semibold">{fmt(subtotal)}</span></div>
                <div className="flex justify-between mt-2"><span className="text-slate-500">Discount</span><span className="font-semibold">-{fmt(discount)}</span></div>
                <div className="border-t border-slate-200 my-3" />
                <div className="flex justify-between text-base"><span className="font-black">Total</span><span className="font-black">{fmt(total)}</span></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function Field({ label, placeholder, className = "" }) {
  return (
    <div className={className}>
      <div className="font-black mb-2">{label}</div>
      <input className="w-full border border-slate-200 rounded-2xl px-4 py-3 outline-none" placeholder={placeholder} />
    </div>
  );
}
