import { useEffect, useMemo, useState } from "react";
import SEO from "../components/SEO";
import ProductCard from "../components/ProductCard";
import LoadingBlock from "../components/LoadingBlock";
import { apiFetch } from "../utils/api";
import { useLanguage } from "../context/LanguageContext";

const categories = ["Essentials", "Graphics", "Sport"];

export default function ShopPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams({
      page: String(page),
      limit: "6",
      search,
      category: category === "All" ? "" : category
    }).toString();

    apiFetch(`/products?${query}`)
      .then((data) => {
        setProducts(data.items);
        setPages(data.pages || 1);
      })
      .finally(() => setLoading(false));
  }, [search, category, page]);

  const title = useMemo(() => (category === "All" ? t.shopPage.title : `${category} collection`), [category, t]);

  return (
    <>
      <SEO title="Shop" description="Shop premium T-shirts with filter, search, and pagination." />
      <section className="section-shell py-12">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-ember">{t.common.shop}</p>
            <h1 className="mt-2 font-display text-4xl font-bold">{title}</h1>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1.3fr_1fr]">
            <input type="text" value={search} onChange={(event) => { setPage(1); setSearch(event.target.value); }} placeholder={t.shopPage.search} className="input-field" />
            <select value={category} onChange={(event) => { setPage(1); setCategory(event.target.value); }} className="input-field">
              <option>{t.shopPage.all}</option>
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
        </div>
        {loading ? <LoadingBlock label={t.common.loading} /> : null}
        <div className="card-grid">
          {products.map((product, index) => <ProductCard key={product.id} product={product} delay={index * 0.05} />)}
        </div>
        <div className="mt-10 flex items-center justify-center gap-3">
          <button type="button" onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1} className="btn-secondary disabled:opacity-40">{t.common.previous}</button>
          <span className="text-sm text-black/65 dark:text-white/65">{t.shopPage.page} {page} / {pages}</span>
          <button type="button" onClick={() => setPage((prev) => Math.min(prev + 1, pages))} disabled={page === pages} className="btn-secondary disabled:opacity-40">{t.common.next}</button>
        </div>
      </section>
    </>
  );
}
