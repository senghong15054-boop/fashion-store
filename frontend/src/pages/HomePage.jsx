import { useEffect, useState } from "react";
import { ArrowRight, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SEO from "../components/SEO";
import ProductCard from "../components/ProductCard";
import LoadingBlock from "../components/LoadingBlock";
import { apiFetch } from "../utils/api";
import { useLanguage } from "../context/LanguageContext";

const perks = [
  { title: "Premium quality", icon: Sparkles, text: "Heavyweight cotton, elevated cuts, and clean finishing." },
  { title: "Manual payment review", icon: ShieldCheck, text: "ABA KHQR checkout with screenshot approval by admin." },
  { title: "Fast local delivery", icon: Truck, text: "Built for Cambodia-focused order flow with direct contact options." }
];

export default function HomePage() {
  const { t } = useLanguage();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/products?limit=6")
      .then((data) => setFeatured(data.items.filter((item) => item.is_featured).slice(0, 3)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO title="Home" description="Premium T-shirt store with a modern shopping experience." />
      <section className="relative overflow-hidden py-12">
        <div className="section-shell">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-8">
              <span className="inline-flex rounded-full border border-ember/20 bg-ember/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-ember">
                {t.home.badge}
              </span>
              <div className="space-y-5">
                <h1 className="max-w-2xl font-display text-5xl font-extrabold leading-none sm:text-6xl">
                  {t.home.title}
                </h1>
                <p className="max-w-xl text-lg text-black/65 dark:text-white/65">
                  {t.home.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/shop" className="btn-primary">{t.home.shopCollection} <ArrowRight className="ml-2" size={16} /></Link>
                <Link to="/contact" className="btn-secondary">{t.home.contactTeam}</Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {perks.map((perk) => (
                  <div key={perk.title} className="glass-panel rounded-[1.75rem] p-5">
                    <perk.icon className="mb-4 text-ember" />
                    <h2 className="mb-2 font-semibold">{perk.title}</h2>
                    <p className="text-sm text-black/60 dark:text-white/60">{perk.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative rounded-[2.5rem] bg-aurora p-5 shadow-glow dark:bg-auroraDark">
              <div className="overflow-hidden rounded-[2rem]">
                <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80" alt="Hero premium tee" className="h-[540px] w-full object-cover" />
              </div>
              <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="glass-panel absolute bottom-10 right-0 max-w-xs rounded-[1.75rem] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-ember">Studio pick</p>
                <h3 className="mt-2 font-display text-2xl font-bold">{t.home.studioTitle}</h3>
                <p className="mt-2 text-sm text-black/65 dark:text-white/65">
                  {t.home.studioDescription}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="section-shell space-y-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-ember">{t.home.featuredLabel}</p>
              <h2 className="mt-2 font-display text-4xl font-bold">{t.home.featuredTitle}</h2>
            </div>
            <Link to="/shop" className="btn-secondary">{t.home.viewAll}</Link>
          </div>
          {loading ? <LoadingBlock label={t.common.loading} /> : null}
          <div className="card-grid">
            {featured.map((product, index) => <ProductCard key={product.id} product={product} delay={index * 0.1} />)}
          </div>
        </div>
      </section>
    </>
  );
}
