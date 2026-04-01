import { useState } from "react";
import { Navigate } from "react-router-dom";
import SEO from "../components/SEO";
import { useAdmin } from "../context/AdminContext";
import { apiFetch } from "../utils/api";

export default function AdminLoginPage() {
  const { token, login } = useAdmin();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  if (token) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await apiFetch("/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      login(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Admin Login" description="Secure admin login for Premium Tee." />
      <section className="section-shell py-20">
        <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-4 rounded-[2rem] border border-black/5 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-white/5">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-ember">Admin</p>
            <h1 className="mt-2 font-display text-4xl font-bold">Sign in</h1>
          </div>
          <input className="input-field" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <input className="input-field" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "Signing in..." : "Login"}</button>
          <p className="text-xs text-black/50 dark:text-white/50">Default seed credentials: admin / admin123</p>
        </form>
      </section>
    </>
  );
}
