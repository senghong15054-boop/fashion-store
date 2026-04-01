import { useSearchParams, Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function OrderSuccessPage() {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <>
      <SEO title="Order Success" description="Your order was placed successfully." />
      <section className="section-shell py-20">
        <div className="mx-auto max-w-2xl rounded-[2.5rem] bg-aurora p-10 text-center shadow-glow dark:bg-auroraDark">
          <p className="text-sm uppercase tracking-[0.25em] text-ember">Order received</p>
          <h1 className="mt-4 font-display text-5xl font-bold">Thank you for your order.</h1>
          <p className="mt-4 text-black/65 dark:text-white/65">
            Your payment screenshot will be reviewed manually. Order reference: <strong>#{orderId}</strong>
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/shop" className="btn-primary">Continue shopping</Link>
            <Link to="/contact" className="btn-secondary">Need help?</Link>
          </div>
        </div>
      </section>
    </>
  );
}
