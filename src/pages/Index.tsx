// Home page - EntregaTudo marketplace landing page
// Banner + categories (iFood style) + featured products

import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowRight, Star, ShoppingBag, Truck, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import heroBanner from "@/assets/hero-banner.png";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  created_at: string;
}

export default function Index() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatured();
  }, []);

  async function fetchFeatured() {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6);
    if (!error && data) setFeaturedProducts(data as Product[]);
    setLoading(false);
  }

  function handleCategorySelect(category: string) {
    setSelectedCategory(category);
    navigate(category === "Todos" ? "/products" : `/products?category=${encodeURIComponent(category)}`);
  }

  return (
    <div className="min-h-screen">
      {/* ── HERO BANNER ── */}
      <section className="hero-section relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Text */}
            <div className="flex-1 text-center lg:text-left animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-brand-yellow/20 border border-brand-yellow/30 rounded-full px-4 py-1.5 text-sm font-semibold text-foreground mb-4">
                🚚 Entrega rápida em todo o Brasil
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-tight mb-4">
                Bem-vindo ao<br />
                <span className="text-brand-black relative inline-block">
                  EntregaTudo
                  <span className="absolute -bottom-2 left-0 right-0 h-3 bg-brand-yellow opacity-60 -skew-x-3 rounded" />
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
                O marketplace completo para comprar e vender de tudo. Ferramentas, roupas, eletrônicos e muito mais com entrega rápida.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  to="/products"
                  className="btn-brand inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-bold"
                >
                  <ShoppingBag size={20} />
                  Ver Produtos
                </Link>
                <Link
                  to="/add-product"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-bold border-2 border-brand-black text-brand-black bg-transparent hover:bg-brand-black hover:text-brand-yellow transition-all"
                >
                  Cadastrar Produto
                  <ArrowRight size={18} />
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-5 justify-center lg:justify-start mt-8">
                {[
                  { icon: Truck, label: "Entrega Rápida" },
                  { icon: Shield, label: "Compra Segura" },
                  { icon: Star, label: "Produtos Verificados" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                    <Icon size={16} className="text-brand-yellow" style={{ color: "hsl(45,100%,40%)" }} />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image */}
            <div className="flex-1 flex justify-center lg:justify-end animate-slide-in">
              <img
                src={heroBanner}
                alt="EntregaTudo marketplace"
                className="w-full max-w-lg rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIAS (iFood style) ── */}
      <section className="py-10 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-foreground">Explorar por Categoria</h2>
              <p className="text-muted-foreground text-sm mt-1">Clique para filtrar os produtos</p>
            </div>
            <Link
              to="/products"
              className="text-sm font-semibold text-foreground hover:text-brand-black underline-offset-2 hover:underline flex items-center gap-1"
            >
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>
          <CategoryFilter selected={selectedCategory} onChange={handleCategorySelect} />
        </div>
      </section>

      {/* ── PRODUTOS RECENTES ── */}
      <section className="py-10 section-pastel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-foreground">Adicionados Recentemente</h2>
              <p className="text-muted-foreground text-sm mt-1">Os mais novos do marketplace</p>
            </div>
            <Link
              to="/products"
              className="btn-brand inline-flex items-center gap-1.5 px-5 py-2 rounded-lg text-sm font-bold"
            >
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="product-card h-52 animate-pulse bg-muted" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── STATS BANNER ── */}
      <section className="py-10 bg-brand-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { value: "23+", label: "Produtos disponíveis" },
              { value: "8", label: "Categorias" },
              { value: "100%", label: "Entrega garantida" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-4xl font-black text-brand-yellow mb-1">{value}</div>
                <div className="text-gray-400 text-sm font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-black py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-brand-yellow font-extrabold text-xl mb-2">EntregaTudo</div>
          <p className="text-gray-500 text-sm">© 2024 EntregaTudo. O marketplace que entrega tudo.</p>
        </div>
      </footer>
    </div>
  );
}
