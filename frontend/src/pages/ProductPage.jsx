import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import LoadingBlock from "../components/LoadingBlock";
import { apiFetch, buildAssetUrl } from "../utils/api";
import { currency } from "../utils/format";
import { useCart } from "../context/CartContext";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`/products/${id}`)
      .then((data) => {
        setProduct(data);
        setActiveImage(data.image);
        setSize(data.sizes[0] || "");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="section-shell py-12"><LoadingBlock label="Loading product..." /></div>;
  if (!product) return <div className="section-shell py-12">Product not found.</div>;

  return (
    <>
      <SEO title={product.name} description={product.short_description} />
      <section className="section-shell py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr]">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-[2rem] border border-black/5 dark:border-white/10">
              <img src={buildAssetUrl(activeImage)} alt={product.name} className="h-[540px] w-full object-cover" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[product.image, ...(product.gallery || [])].map((image, index) => (
                <button type="button" key={`${image}-${index}`} onClick={() => setActiveImage(image)} className={`overflow-hidden rounded-[1.5rem] border ${activeImage === image ? "border-ember" : "border-black/5 dark:border-white/10"}`}>
                  <img src={buildAssetUrl(image)} alt="" className="h-28 w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-ember/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-ember">{product.badge || product.category}</span>
            <div>
              <h1 className="font-display text-4xl font-bold">{product.name}</h1>
              <p className="mt-3 text-black/65 dark:text-white/65">{product.description}</p>
            </div>
            <div className="flex items-end gap-3">
              <p className="font-display text-3xl font-bold">{currency(product.price)}</p>
              {product.compare_price ? <p className="pb-1 text-sm text-black/45 line-through dark:text-white/40">{currency(product.compare_price)}</p> : null}
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-black/55 dark:text-white/55">Select size</p>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((item) => (
                  <button type="button" key={item} onClick={() => setSize(item)} className={`rounded-full border px-5 py-2 text-sm font-semibold ${size === item ? "border-ember bg-ember text-white" : "border-black/10 dark:border-white/10"}`}>{item}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <input type="number" min="1" max={product.stock} value={qty} onChange={(event) => setQty(Number(event.target.value))} className="input-field max-w-28" />
              <button type="button" onClick={() => addToCart(product, size, qty)} className="btn-primary">Add to cart</button>
              <button type="button" onClick={() => { addToCart(product, size, qty); navigate('/checkout'); }} className="btn-secondary">Buy now</button>
            </div>
            <div className="glass-panel rounded-[2rem] p-5 text-sm text-black/60 dark:text-white/60">
              Stock available: {product.stock}. Free-form admin descriptions and gallery are supported through the dashboard.
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
