import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import SEO from "../components/SEO";
import { useCart } from "../context/CartContext";
import { currency } from "../utils/format";

const coupons = {
  SAVE10: 0.1,
  VIP15: 0.15
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, subtotal, clearCart } = useCart();
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    note: "",
    couponCode: ""
  });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const discount = useMemo(() => subtotal * (coupons[form.couponCode.toUpperCase()] || 0), [subtotal, form.couponCode]);
  const total = subtotal - discount;
  const khqrValue = import.meta.env.VITE_ABA_KHQR_PAYLOAD || "ABA KHQR PAYMENT";
  const staticKhqrImage = "https://pay.ababank.com/oRF8/lsvh1myr.jpg";
  const abaAccountName = "SENGHONG OUK";
  const abaPaymentUrl = import.meta.env.VITE_ABA_PAYMENT_URL || "https://pay.ababank.com/oRF8/lsvh1myr";

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please upload your payment screenshot before placing the order.");
      return;
    }
    setSubmitting(true);

    const payload = new FormData();
    payload.append("customerName", form.customerName);
    payload.append("email", form.email);
    payload.append("phone", form.phone);
    payload.append("address", form.address);
    payload.append("note", form.note);
    payload.append("couponCode", form.couponCode.toUpperCase());
    payload.append("subtotal", subtotal.toString());
    payload.append("discount", discount.toString());
    payload.append("total", total.toString());
    payload.append("items", JSON.stringify(cart.map((item) => ({ productId: item.id, qty: item.qty, size: item.size, price: item.price }))));
    if (file) payload.append("paymentScreenshot", file);

    try {
      const result = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/order`, {
        method: "POST",
        body: payload
      });
      const data = await result.json();
      if (!result.ok) throw new Error(data.message || "Checkout failed");
      clearCart();
      navigate(`/success?orderId=${data.orderId}`);
    } catch (error) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Checkout" description="Checkout securely using ABA KHQR and upload your payment screenshot." />
      <section className="section-shell py-12">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-ember">Checkout</p>
          <h1 className="mt-2 font-display text-4xl font-bold">Complete your payment</h1>
        </div>
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <form onSubmit={handleSubmit} className="glass-panel space-y-4 rounded-[2rem] p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="input-field" placeholder="Full name" required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
              <input className="input-field" placeholder="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input className="input-field" placeholder="Phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input className="input-field" placeholder="Coupon code" value={form.couponCode} onChange={(e) => setForm({ ...form, couponCode: e.target.value })} />
            </div>
            <textarea className="input-field min-h-32" placeholder="Delivery address" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <textarea className="input-field min-h-24" placeholder="Order note (optional)" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
            <div className="rounded-[1.5rem] bg-black/5 p-4 dark:bg-white/5">
              <label className="mb-2 block text-sm font-semibold">Upload payment screenshot</label>
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>
            <button type="submit" disabled={submitting || cart.length === 0} className="btn-primary w-full disabled:opacity-40">
              {submitting ? "Processing..." : "Place order"}
            </button>
          </form>
          <aside className="glass-panel h-fit rounded-[2rem] p-6">
            <h2 className="font-display text-2xl font-bold">ABA KHQR</h2>
            <p className="mt-2 text-sm text-black/60 dark:text-white/60">Scan the QR, complete the transfer, then upload your payment screenshot for manual verification.</p>
            <div className="mt-6 overflow-hidden rounded-[2rem] border border-black/5 bg-white p-4 shadow-lg dark:border-white/10">
              <img
                src={staticKhqrImage}
                alt="ABA KHQR payment"
                className="mx-auto max-h-[32rem] w-full rounded-[1.5rem] object-contain"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                  const fallback = event.currentTarget.nextElementSibling;
                  if (fallback) fallback.style.display = "block";
                }}
              />
              <div style={{ display: "none" }} className="mx-auto max-w-sm">
                <QRCode value={khqrValue} className="h-full w-full" />
              </div>
            </div>
            <div className="mt-4 rounded-[1.5rem] bg-black/5 p-4 dark:bg-white/5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-ember">Account name</p>
              <p className="mt-2 text-lg font-semibold">{abaAccountName}</p>
            </div>
            <a
              href={abaPaymentUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary mt-4 w-full"
            >
              Open ABA payment link
            </a>
            <div className="mt-4 rounded-[1.5rem] border border-black/5 p-4 text-sm dark:border-white/10">
              <p className="font-semibold">Payment instructions</p>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-black/65 dark:text-white/65">
                <li>Open your ABA mobile app and scan the KHQR code.</li>
                <li>Or tap the payment button above to open the ABA payment page directly.</li>
                <li>Transfer the exact total shown on this checkout page.</li>
                <li>Take a clear screenshot after payment is successful.</li>
                <li>Upload the screenshot before placing your order.</li>
              </ol>
            </div>
            <div className="mt-4 rounded-[1.5rem] bg-ember px-4 py-5 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">Amount to pay</p>
              <p className="mt-2 font-display text-4xl font-bold">{currency(total)}</p>
              <p className="mt-2 text-sm text-white/80">Pay this exact amount, then upload the payment screenshot.</p>
            </div>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{currency(subtotal)}</span></div>
              <div className="flex justify-between"><span>Discount</span><span>-{currency(discount)}</span></div>
              <div className="flex justify-between text-base font-bold"><span>Total</span><span>{currency(total)}</span></div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
