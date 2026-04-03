import SEO from "../components/SEO";
import { useLanguage } from "../context/LanguageContext";

export default function ContactPage() {
  const { t } = useLanguage();
  const telegram = import.meta.env.VITE_TELEGRAM_URL || "https://t.me/Ouksenghong";
  const facebook = import.meta.env.VITE_FACEBOOK_URL || "https://www.facebook.com/share/1T5p7EyR6c/";
  const phone = import.meta.env.VITE_PHONE_NUMBER || "0715764442";

  return (
    <>
      <SEO title="Contact" description="Contact Premium Tee through Telegram, Facebook, or phone." />
      <section className="section-shell py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-ember">{t.contact.label}</p>
            <h1 className="mt-2 font-display text-4xl font-bold">{t.contact.title}</h1>
            <p className="mt-4 max-w-xl text-black/65 dark:text-white/65">
              {t.contact.description}
            </p>
          </div>
          <div className="grid gap-4">
            <a href={telegram} target="_blank" rel="noreferrer" className="glass-panel rounded-[2rem] p-6 hover:border-ember">
              <h2 className="font-semibold">{t.contact.telegram}</h2>
              <p className="mt-2 text-sm text-black/60 dark:text-white/60">{telegram}</p>
            </a>
            <a href={facebook} target="_blank" rel="noreferrer" className="glass-panel rounded-[2rem] p-6 hover:border-ember">
              <h2 className="font-semibold">{t.contact.facebook}</h2>
              <p className="mt-2 text-sm text-black/60 dark:text-white/60">{facebook}</p>
            </a>
            <a href={`tel:${phone}`} className="glass-panel rounded-[2rem] p-6 hover:border-ember">
              <h2 className="font-semibold">{t.contact.phone}</h2>
              <p className="mt-2 text-sm text-black/60 dark:text-white/60">{phone}</p>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
