import { useLanguage } from "../context/LanguageContext";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="hidden items-center rounded-full border border-black/10 p-1 dark:border-white/10 md:flex">
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`rounded-full px-3 py-1 text-xs font-semibold ${language === "en" ? "bg-ink text-white dark:bg-white dark:text-ink" : ""}`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("km")}
        className={`rounded-full px-3 py-1 text-xs font-semibold ${language === "km" ? "bg-ink text-white dark:bg-white dark:text-ink" : ""}`}
      >
        KH
      </button>
    </div>
  );
}
