import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import { useAdmin } from "../context/AdminContext";
import { apiFetch, buildAssetUrl, API_URL } from "../utils/api";
import { currency } from "../utils/format";

const initialForm = {
  name: "",
  slug: "",
  price: "",
  comparePrice: "",
  colors: "Black,White",
  sizes: "S,M,L,XL",
  stock: "10",
  sale: true,
  category: "Essentials",
  badge: "New",
  shortDescription: "",
  description: "",
  isFeatured: true
};

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { token, logout } = useAdmin();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState("");
  const [galleryPreview, setGalleryPreview] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const headers = { Authorization: `Bearer ${token}` };

  const handleAuthFailure = (message = "Your admin session expired. Please log in again.") => {
    logout();
    alert(message);
    navigate("/admin");
  };

  const load = async () => {
    try {
      const [statsData, orderData, productData] = await Promise.all([
        apiFetch("/admin/dashboard", { headers }),
        apiFetch("/admin/orders", { headers }),
        apiFetch("/products?limit=20")
      ]);
      setStats(statsData);
      setOrders(orderData);
      setProducts(productData.items);
    } catch (error) {
      if (String(error.message).toLowerCase().includes("unauthorized") || String(error.message).toLowerCase().includes("invalid token")) {
        return handleAuthFailure();
      }
      alert(error.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submitProduct = async (event) => {
    event.preventDefault();
    if (!editingId && !image) {
      alert("Please upload a main product photo before saving.");
      return;
    }
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, String(value)));
    if (editingId && !galleryFiles.length && galleryPreview.length) {
      payload.append("gallery", JSON.stringify(galleryPreview));
    }
    if (editingId && imagePreview && !image) {
      payload.append("image", imagePreview);
    }
    if (image) payload.append("image", image);
    galleryFiles.forEach((file) => payload.append("gallery", file));

    const endpoint = editingId
      ? `${API_URL}/admin/product/${editingId}`
      : `${API_URL}/admin/product/add`;

    const response = await fetch(endpoint, {
      method: editingId ? "PUT" : "POST",
      headers,
      body: payload
    });
    const data = await response.json();
    if (response.status === 401) {
      return handleAuthFailure(data.message || "Your admin session expired. Please log in again.");
    }
    if (!response.ok) {
      const validationMessage = Array.isArray(data.errors)
        ? data.errors.map((item) => item.msg).join(", ")
        : null;
      return alert(validationMessage || data.message || "Unable to save product");
    }
    setForm(initialForm);
    setImage(null);
    setGalleryFiles([]);
    setImagePreview("");
    setGalleryPreview([]);
    setEditingId(null);
    load();
  };

  const updateStatus = async (id, status) => {
    try {
      await apiFetch(`/admin/order/update/${id}`, {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      });
      load();
    } catch (error) {
      if (String(error.message).toLowerCase().includes("unauthorized") || String(error.message).toLowerCase().includes("invalid token")) {
        return handleAuthFailure();
      }
      alert(error.message);
    }
  };

  const statusLabel = (status) => {
    if (status === "pending") return "Pending Verification";
    if (status === "paid") return "Paid";
    return "Shipped";
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    const response = await fetch(`${API_URL}/admin/product/${id}`, { method: "DELETE", headers });
    const data = await response.json().catch(() => ({}));
    if (response.status === 401) {
      return handleAuthFailure(data.message || "Your admin session expired. Please log in again.");
    }
    if (!response.ok) {
      return alert(data.message || "Unable to delete product");
    }
    load();
  };

  const editProduct = (product) => {
    setEditingId(product.id);
    setImage(null);
    setGalleryFiles([]);
    setImagePreview(product.image || "");
    setGalleryPreview(Array.isArray(product.gallery) ? product.gallery : []);
    setForm({
      name: product.name || "",
      slug: product.slug || "",
      price: product.price || "",
      comparePrice: product.compare_price || "",
      colors: Array.isArray(product.colors) ? product.colors.join(",") : "Black,White",
      sizes: Array.isArray(product.sizes) ? product.sizes.join(",") : "S,M,L,XL",
      stock: product.stock || "0",
      sale: Boolean(product.sale),
      category: product.category || "",
      badge: product.badge || "",
      shortDescription: product.short_description || "",
      description: product.description || "",
      isFeatured: Boolean(product.is_featured)
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setImage(null);
    setGalleryFiles([]);
    setImagePreview("");
    setGalleryPreview([]);
    setForm(initialForm);
  };

  const onImageChange = (event) => {
    const nextFile = event.target.files?.[0] || null;
    setImage(nextFile);
    setImagePreview(nextFile ? URL.createObjectURL(nextFile) : "");
  };

  const onGalleryChange = (event) => {
    const files = Array.from(event.target.files || []);
    setGalleryFiles(files);
    setGalleryPreview(files.map((file) => URL.createObjectURL(file)));
  };

  return (
    <>
      <SEO title="Admin Dashboard" description="Manage products, sales, and orders." />
      <section className="section-shell py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-ember">Dashboard</p>
            <h1 className="mt-2 font-display text-4xl font-bold">Store command center</h1>
          </div>
          <button type="button" onClick={logout} className="btn-secondary">Logout</button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="glass-panel rounded-[2rem] p-5"><p className="text-sm text-black/60 dark:text-white/60">Total sales</p><h2 className="mt-3 font-display text-3xl font-bold">{currency(stats?.totalSales || 0)}</h2></div>
          <div className="glass-panel rounded-[2rem] p-5"><p className="text-sm text-black/60 dark:text-white/60">Total orders</p><h2 className="mt-3 font-display text-3xl font-bold">{stats?.totalOrders || 0}</h2></div>
          <div className="glass-panel rounded-[2rem] p-5"><p className="text-sm text-black/60 dark:text-white/60">Products</p><h2 className="mt-3 font-display text-3xl font-bold">{stats?.totalProducts || 0}</h2></div>
          <div className="glass-panel rounded-[2rem] p-5"><p className="text-sm text-black/60 dark:text-white/60">Paid orders</p><h2 className="mt-3 font-display text-3xl font-bold">{stats?.statusStats?.find((item) => item.status === "paid")?.count || 0}</h2></div>
        </div>

        <div className="mt-10 grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <form onSubmit={submitProduct} className="glass-panel space-y-4 rounded-[2rem] p-6">
            <div className="flex items-center gap-3"><Plus className="text-ember" /><h2 className="font-display text-2xl font-bold">{editingId ? "Edit product" : "Add product"}</h2></div>
            <input className="input-field" placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="input-field" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="input-field" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              <input className="input-field" placeholder="Compare price" value={form.comparePrice} onChange={(e) => setForm({ ...form, comparePrice: e.target.value })} />
              <input className="input-field" placeholder="Colors comma separated" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} />
              <input className="input-field" placeholder="Sizes comma separated" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} />
              <input className="input-field" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="input-field" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              <input className="input-field" placeholder="Badge" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-3 rounded-[1.5rem] border border-dashed border-black/10 p-4 dark:border-white/10">
                <label className="block text-sm font-semibold">Main product photo</label>
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={onImageChange} />
                {imagePreview ? (
                  <img
                    src={buildAssetUrl(imagePreview)}
                    alt="Main preview"
                    className="h-40 w-full rounded-[1.25rem] object-cover"
                  />
                ) : (
                  <p className="text-sm text-black/50 dark:text-white/50">Upload the primary storefront image.</p>
                )}
              </div>
              <div className="space-y-3 rounded-[1.5rem] border border-dashed border-black/10 p-4 dark:border-white/10">
                <label className="block text-sm font-semibold">Gallery photos</label>
                <input type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={onGalleryChange} />
                {galleryPreview.length ? (
                  <div className="grid grid-cols-3 gap-2">
                    {galleryPreview.map((preview, index) => (
                      <img
                        key={`${preview}-${index}`}
                        src={buildAssetUrl(preview)}
                        alt={`Gallery preview ${index + 1}`}
                        className="h-24 w-full rounded-[1rem] object-cover"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-black/50 dark:text-white/50">Add detail shots, alternate colors, or model images.</p>
                )}
              </div>
            </div>
            <input className="input-field" placeholder="Short description" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
            <textarea className="input-field min-h-28" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="flex gap-4 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.sale} onChange={(e) => setForm({ ...form, sale: e.target.checked })} /> Sale</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured</label>
            </div>
            <div className="flex gap-3">
              <button className="btn-primary w-full">{editingId ? "Save changes" : "Add product"}</button>
              {editingId ? <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button> : null}
            </div>
          </form>
          <div className="space-y-8">
            <div className="glass-panel rounded-[2rem] p-6">
              <h2 className="font-display text-2xl font-bold">Manage orders</h2>
              <div className="mt-4 space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="rounded-[1.5rem] border border-black/5 p-4 dark:border-white/10">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold">#{order.id} {order.customer_name}</p>
                        <p className="text-sm text-black/60 dark:text-white/60">{order.email} • {order.phone}</p>
                        <p className="mt-1 text-sm font-medium">{currency(order.total)} • {statusLabel(order.status)}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => updateStatus(order.id, "pending")} className={`rounded-full px-4 py-2 text-xs font-semibold ${order.status === "pending" ? "bg-ember text-white" : "border border-black/10 dark:border-white/10"}`}>Pending</button>
                        <button type="button" onClick={() => updateStatus(order.id, "paid")} className={`rounded-full px-4 py-2 text-xs font-semibold ${order.status === "paid" ? "bg-emerald-600 text-white" : "border border-black/10 dark:border-white/10"}`}>Verify Payment</button>
                        <button type="button" onClick={() => updateStatus(order.id, "shipped")} className={`rounded-full px-4 py-2 text-xs font-semibold ${order.status === "shipped" ? "bg-sky-600 text-white" : "border border-black/10 dark:border-white/10"} ${order.status !== "paid" && order.status !== "shipped" ? "opacity-50" : ""}`}>Mark Shipped</button>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_220px]">
                      <div className="space-y-3 text-sm text-black/65 dark:text-white/65">
                        <p><span className="font-semibold text-black dark:text-white">Address:</span> {order.address}</p>
                        {order.note ? <p><span className="font-semibold text-black dark:text-white">Note:</span> {order.note}</p> : null}
                        {order.coupon_code ? <p><span className="font-semibold text-black dark:text-white">Coupon:</span> {order.coupon_code}</p> : null}
                        <div className="rounded-[1rem] bg-black/5 p-3 dark:bg-white/5">
                          <p className="font-semibold text-black dark:text-white">Order items</p>
                          <div className="mt-3 space-y-3">
                            {order.items?.map((item) => (
                              <div key={`${order.id}-${item.product_id}-${item.size}`} className="flex items-center gap-3">
                                <img src={buildAssetUrl(item.image)} alt={item.name} className="h-12 w-12 rounded-xl object-cover" />
                                <div className="flex-1">
                                  <p className="font-medium text-black dark:text-white">{item.name}</p>
                                  <p className="text-xs">Size {item.size} • Qty {item.qty}</p>
                                </div>
                                <p className="text-xs font-semibold">{currency(item.price)}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        {order.payment_screenshot ? (
                          <a href={buildAssetUrl(order.payment_screenshot)} target="_blank" rel="noreferrer" className="block">
                            <img src={buildAssetUrl(order.payment_screenshot)} alt={`Payment screenshot for order ${order.id}`} className="h-48 w-full rounded-[1rem] object-cover" />
                            <span className="mt-2 inline-flex text-sm text-ember">Open screenshot</span>
                          </a>
                        ) : (
                          <div className="rounded-[1rem] bg-black/5 p-4 text-sm text-black/60 dark:bg-white/5 dark:text-white/60">No payment screenshot uploaded.</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-panel rounded-[2rem] p-6">
              <h2 className="font-display text-2xl font-bold">Manage products</h2>
              <div className="mt-4 space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 rounded-[1.5rem] border border-black/5 p-4 dark:border-white/10">
                    <img src={buildAssetUrl(product.image)} alt={product.name} className="h-20 w-20 rounded-[1rem] object-cover" />
                    <div className="flex-1">
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-black/60 dark:text-white/60">{currency(product.price)} • {product.stock} in stock</p>
                    </div>
                    <button type="button" onClick={() => editProduct(product)} className="rounded-full bg-black/5 p-3 dark:bg-white/10">
                      <Pencil size={16} />
                    </button>
                    <button type="button" onClick={() => deleteProduct(product.id)} className="rounded-full bg-red-500/10 p-3 text-red-500"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
