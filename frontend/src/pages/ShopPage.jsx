import { useEffect, useMemo, useState } from "react";
import SEO from "../components/SEO";
import ProductCard from "../components/ProductCard";
import LoadingBlock from "../components/LoadingBlock";
import { apiFetch } from "../utils/api";

const categories = ["All", "Essentials", "Graphics", "Sport"];

export default function ShopPage() {
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

  const title = useMemo(() => (category === "All" ? "Shop collection" : `${category} collection`), [category]);

  return (
    <>
      <SEO title="Shop" description="Shop premium T-shirts with filter, search, and pagination." />
      <section className="section-shell py-12">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-ember">Shop</p>
            <h1 className="mt-2 font-display text-4xl font-bold">{title}</h1>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1.3fr_1fr]">
            <input type="text" value={search} onChange={(event) => { setPage(1); setSearch(event.target.value); }} placeholder="Search premium tee..." className="input-field" />
            <select value={category} onChange={(event) => { setPage(1); setCategory(event.target.value); }} className="input-field">
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
        </div>
        {loading ? <LoadingBlock label="Loading products..." /> : null}
        <div className="card-grid">
          {products.map((product, index) => <ProductCard key={product.id} product={product} delay={index * 0.05} />)}
        </div>
        <div className="mt-10 flex items-center justify-center gap-3">
          <button type="button" onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1} className="btn-secondary disabled:opacity-40">Previous</button>
          <span className="text-sm text-black/65 dark:text-white/65">Page {page} of {pages}</span>
          <button type="button" onClick={() => setPage((prev) => Math.min(prev + 1, pages))} disabled={page === pages} className="btn-secondary disabled:opacity-40">Next</button>
        </div>
      </section>
    </>
  );
}
