import { useState } from "react";
import SEO from "../components/SEO";
import { apiFetch } from "../utils/api";
import { useCustomer } from "../context/CustomerContext";
import { useLanguage } from "../context/LanguageContext";

const registerInitial = {
  fullName: "",
  username: "",
  email: "",
  password: ""
};

const loginInitial = {
  email: "",
  password: ""
};

export default function AccountPage() {
  const { t } = useLanguage();
  const { customer, login, logout } = useCustomer();
  const [mode, setMode] = useState("register");
  const [registerForm, setRegisterForm] = useState(registerInitial);
  const [loginForm, setLoginForm] = useState(loginInitial);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const payload = await apiFetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm)
      });
      login(payload);
      setRegisterForm(registerInitial);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const payload = await apiFetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm)
      });
      login(payload);
      setLoginForm(loginInitial);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (customer) {
    return (
      <>
        <SEO title="Account" description="Manage your Premium Tee account." />
        <section className="section-shell py-16">
          <div className="mx-auto max-w-2xl glass-panel rounded-[2rem] p-8">
            <p className="text-sm uppercase tracking-[0.25em] text-ember">Account</p>
            <h1 className="mt-2 font-display text-4xl font-bold">{t.account.welcome} {customer.fullName || customer.username}.</h1>
            <p className="mt-4 text-black/65 dark:text-white/65">{customer.email}</p>
            <button type="button" onClick={logout} className="btn-primary mt-6">
              Logout
            </button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <SEO title="Account" description="Register or log in to your Premium Tee customer account." />
      <section className="section-shell py-16">
        <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-ember">Account</p>
            <h1 className="mt-2 font-display text-5xl font-bold">{t.account.title}</h1>
            <p className="mt-4 text-black/65 dark:text-white/65">
              {t.account.description}
            </p>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setMode("register")} className={mode === "register" ? "btn-primary" : "btn-secondary"}>
                {t.account.register}
              </button>
              <button type="button" onClick={() => setMode("login")} className={mode === "login" ? "btn-primary" : "btn-secondary"}>
                {t.account.login}
              </button>
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-6">
            {mode === "register" ? (
              <form onSubmit={handleRegister} className="space-y-4">
                <h2 className="font-display text-3xl font-bold">{t.account.register}</h2>
                <input className="input-field" placeholder="Full name" value={registerForm.fullName} onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })} />
                <input className="input-field" placeholder="Username" value={registerForm.username} onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })} />
                <input className="input-field" placeholder="Email" type="email" value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} />
                <input className="input-field" placeholder="Password" type="password" value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} />
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? t.account.creating : t.account.createAccount}
                </button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <h2 className="font-display text-3xl font-bold">{t.account.login}</h2>
                <input className="input-field" placeholder="Email" type="email" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} />
                <input className="input-field" placeholder="Password" type="password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? t.account.signingIn : t.account.login}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
