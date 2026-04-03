import { useSearchParams, Link } from "react-router-dom";
import SEO from "../components/SEO";
import { useLanguage } from "../context/LanguageContext";

export default function OrderSuccessPage() {
  const { t } = useLanguage();
  const [params] = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <>
      <SEO title="Order Success" description="Your order was placed successfully." />
      <section className="section-shell py-20">
        <div className="mx-auto max-w-2xl rounded-[2.5rem] bg-aurora p-10 text-center shadow-glow dark:bg-auroraDark">
          <p className="text-sm uppercase tracking-[0.25em] text-ember">{t.success.label}</p>
          <h1 className="mt-4 font-display text-5xl font-bold">{t.success.title}</h1>
          <p className="mt-4 text-black/65 dark:text-white/65">
            {t.success.description} <strong>#{orderId}</strong>
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/shop" className="btn-primary">{t.common.continueShopping}</Link>
            <Link to="/contact" className="btn-secondary">{t.common.needHelp}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
