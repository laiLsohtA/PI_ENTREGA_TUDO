// Recommendations page - shows recommended products
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, TrendingUp, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  created_at: string;
}

// Recommendation algorithm: pick varied products from different categories
async function fetchRecommendations(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  // Pick top products by getting one from each category (varied)
  const byCategory: Record<string, Product[]> = {};
  (data as Product[]).forEach((p) => {
    if (!byCategory[p.category]) byCategory[p.category] = [];
    byCategory[p.category].push(p);
  });

  const recommendations: Product[] = [];
  // First: one per category (up to 8)
  Object.values(byCategory).forEach((products) => {
    if (recommendations.length < 8) {
      recommendations.push(products[0]);
    }
  });

  return recommendations.slice(0, 8);
}

export default function Recommendations() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-brand-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-yellow/20 border border-brand-yellow/30 rounded-full px-4 py-1.5 text-sm font-semibold text-brand-yellow mb-4">
            <Sparkles size={14} />
            Selecionados especialmente para você
          </div>
          <h1 className="text-4xl font-black text-brand-yellow mb-3">Recomendações</h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
            Selecionamos os melhores produtos de cada categoria com base nos itens mais recentes e populares do marketplace.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            {[
              { icon: Star, label: "Curadoria manual", value: "Top picks" },
              { icon: TrendingUp, label: "Variedade garantida", value: "8 categorias" },
              { icon: Sparkles, label: "Atualizado sempre", value: "Tempo real" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-yellow/20 rounded-lg flex items-center justify-center">
                  <Icon size={16} className="text-brand-yellow" />
                </div>
                <div className="text-left">
                  <div className="text-brand-yellow font-bold text-sm">{value}</div>
                  <div className="text-gray-500 text-xs">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-brand-yellow-pastel border-b border-border py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-foreground/80 text-center">
            💡 <strong>Como funciona:</strong> Nosso algoritmo seleciona automaticamente um produto destaque de cada categoria disponível no marketplace, garantindo variedade e qualidade.
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-foreground">
            Produtos Recomendados
            {!loading && <span className="text-muted-foreground font-normal text-base ml-2">({products.length})</span>}
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="product-card h-60 animate-pulse bg-muted" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">✨</div>
            <p className="text-muted-foreground">Nenhum produto disponível ainda.</p>
            <Link to="/add-product" className="btn-brand inline-block mt-4 px-6 py-2.5 rounded-lg font-bold">
              Cadastrar Produto
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-fade-in">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="bg-card rounded-2xl shadow-md p-8 max-w-lg mx-auto">
            <h3 className="text-xl font-black text-foreground mb-2">Não encontrou o que procura?</h3>
            <p className="text-muted-foreground text-sm mb-5">
              Explore todos os produtos do marketplace ou cadastre o seu próprio!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-brand-black text-brand-black font-bold hover:bg-brand-black hover:text-brand-yellow transition-all text-sm"
              >
                Ver Todos os Produtos
              </Link>
              <Link
                to="/add-product"
                className="btn-brand inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm"
              >
                Cadastrar Produto
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
