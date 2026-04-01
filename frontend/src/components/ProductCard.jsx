import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { buildAssetUrl } from "../utils/api";
import { currency } from "../utils/format";

export default function ProductCard({ product, delay = 0 }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay }}
      className="group overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-glow dark:border-white/10 dark:bg-white/5"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={buildAssetUrl(product.image)}
            alt={product.name}
            className="h-80 w-full object-cover transition duration-700 group-hover:scale-105"
          />
          {product.sale ? (
            <span className="absolute left-4 top-4 rounded-full bg-ember px-3 py-1 text-xs font-bold text-white">
              {product.badge || "Sale"}
            </span>
          ) : null}
        </div>
        <div className="space-y-3 p-5">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-display text-xl font-bold">{product.name}</h3>
            <div className="text-right">
              <p className="font-semibold">{currency(product.price)}</p>
              {product.compare_price ? (
                <p className="text-xs text-black/45 line-through dark:text-white/40">
                  {currency(product.compare_price)}
                </p>
              ) : null}
            </div>
          </div>
          <p className="text-sm text-black/65 dark:text-white/60">{product.short_description}</p>
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-black/45 dark:text-white/40">
            <span>{product.category}</span>
            <span>{product.stock} in stock</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
