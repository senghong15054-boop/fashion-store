import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { useCart } from "../context/CartContext";
import { buildAssetUrl } from "../utils/api";
import { currency } from "../utils/format";
import { useLanguage } from "../context/LanguageContext";

export default function CartPage() {
  const { t } = useLanguage();
  const { cart, subtotal, updateQty, removeItem } = useCart();

  return (
    <>
      <SEO title="Cart" description="Review your shopping cart before checkout." />
      <section className="section-shell py-12">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-ember">{t.common.cart}</p>
          <h1 className="mt-2 font-display text-4xl font-bold">{t.cartPage.title}</h1>
        </div>
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {cart.length === 0 ? <div className="glass-panel rounded-[2rem] p-8">{t.cartPage.empty} <Link to="/shop" className="text-ember">{t.cartPage.browse}</Link></div> : null}
            {cart.map((item) => (
              <div key={`${item.id}-${item.color}-${item.size}`} className="glass-panel flex flex-col gap-4 rounded-[2rem] p-4 sm:flex-row sm:items-center">
                <img src={buildAssetUrl(item.image)} alt={item.name} className="h-28 w-28 rounded-[1.25rem] object-cover" />
                <div className="flex-1">
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-sm text-black/60 dark:text-white/60">Color {item.color} • Size {item.size}</p>
                  <p className="mt-2 font-semibold">{currency(item.price)}</p>
                </div>
                <input type="number" min="1" value={item.qty} onChange={(event) => updateQty(item.id, item.color, item.size, Number(event.target.value))} className="input-field max-w-24" />
                <button type="button" onClick={() => removeItem(item.id, item.color, item.size)} className="btn-secondary">{t.common.remove}</button>
              </div>
            ))}
          </div>
          <aside className="glass-panel h-fit rounded-[2rem] p-6">
            <h2 className="font-display text-2xl font-bold">{t.common.summary}</h2>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between"><span>{t.common.subtotal}</span><span>{currency(subtotal)}</span></div>
              <div className="flex justify-between"><span>{t.common.shipping}</span><span>{t.common.calculatedInCheckout}</span></div>
            </div>
            <Link to="/checkout" className="btn-primary mt-6 w-full">{t.cartPage.continueToCheckout}</Link>
          </aside>
        </div>
      </section>
    </>
  );
}
