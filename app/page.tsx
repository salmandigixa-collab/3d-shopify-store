import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { StoreScene } from '@/components/StoreScene';
import { mockProducts } from '@/lib/mock-data';
import { ArrowRight, ShieldCheck, Sparkles, Truck } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-midnight text-mist">
      <Header />

      <section className="mx-auto max-w-7xl px-6 pb-14 pt-10 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              Immersive commerce
            </div>

            <h1 className="max-w-xl text-5xl font-black tracking-tight text-white md:text-6xl">
              Design the next sensation in 3D shopping.
            </h1>

            <p className="mt-6 max-w-xl text-lg text-slate-300">
              A premium storefront experience where products feel alive, tactile, and ready to sell — built for the future of Shopify.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#shop"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-slate-900 transition hover:scale-[1.02]"
              >
                Shop collection
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#features"
                className="inline-flex items-center rounded-full border border-white/15 px-6 py-3 font-semibold text-white transition hover:border-accent hover:text-accent"
              >
                Explore features
              </a>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-bold text-white">24H</div>
                <div>Dispatch</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-bold text-white">4.9</div>
                <div>Rated</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-2xl font-bold text-white">3D</div>
                <div>Product viewer</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-aurora blur-3xl" />
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-panel/90 shadow-glow">
              <StoreScene />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Truck,
              title: 'Fast fulfillment',
              text: 'Keep conversion high with smooth shipping experiences and a premium post-purchase flow.'
            },
            {
              icon: ShieldCheck,
              title: 'Trust built in',
              text: 'Luxury-grade details, secure payments, and a frictionless UX designed for premium brands.'
            },
            {
              icon: Sparkles,
              title: 'Immersive design',
              text: 'Turn product storytelling into an interactive experience customers remember.'
            }
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="mb-4 inline-flex rounded-2xl bg-accent/15 p-3 text-accent">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
              <p className="text-slate-300">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="shop" className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-accent">Featured drop</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Curated essentials</h2>
          </div>
          <a href="#" className="text-sm font-medium text-accent hover:text-white">
            View all products
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-12 lg:px-8">
        <div className="rounded-[2rem] border border-accent/30 bg-gradient-to-br from-accent/10 via-slate-900 to-panel p-8 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-accent">Build your brand</p>
              <h3 className="mt-3 text-3xl font-bold text-white">Launch a luxury e-commerce experience.</h3>
            </div>
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-accent"
            >
              Start your store
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
