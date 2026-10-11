import { ShoppingBag } from 'lucide-react';

export type Product = {
  id: number;
  name: string;
  price: string;
  category: string;
  accent: string;
  description: string;
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
      <div
        className="relative h-80 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${product.accent}22, rgba(15,23,42,0.8) 60%)`
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_30%)]" />
        <div
          className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-[30%] border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.12)]"
          style={{ background: product.accent }}
        />
        <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-[28%] border border-slate-900/30 bg-slate-950/40 backdrop-blur-sm" />
      </div>

      <div className="p-5">
        <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
          <span>{product.category}</span>
          <span>{product.price}</span>
        </div>

        <h3 className="text-2xl font-semibold text-white">{product.name}</h3>
        <p className="mt-2 text-sm text-slate-400">{product.description}</p>

        <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-slate-900 transition group-hover:translate-x-0.5">
          <ShoppingBag className="h-4 w-4" />
          Add to cart
        </button>
      </div>
    </article>
  );
}
