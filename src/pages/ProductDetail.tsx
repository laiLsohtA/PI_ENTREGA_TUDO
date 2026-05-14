// Product Detail page
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Tag, Calendar, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  created_at: string;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) fetchProduct(parseInt(id));
  }, [id]);

  async function fetchProduct(productId: number) {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (error || !data) {
      setError("Produto não encontrado.");
    } else {
      setProduct(data as Product);
    }
    setLoading(false);
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(date));

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="text-6xl">📦</div>
        <h2 className="text-2xl font-bold">{error}</h2>
        <Link to="/products" className="btn-brand px-6 py-2.5 rounded-lg font-bold">
          Voltar aos Produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb / Back */}
      <div className="bg-brand-black py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-yellow text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar
          </button>
        </div>
      </div>

      {/* Product */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-card rounded-2xl shadow-lg overflow-hidden animate-fade-in">
          {/* Yellow accent top */}
          <div className="h-3 bg-brand-yellow" />

          <div className="p-8 lg:p-12">
            {/* Category + date */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <span className="category-badge text-sm px-4 py-1.5">
                <Tag size={12} className="inline mr-1.5" />
                {product.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar size={12} />
                Cadastrado em {formatDate(product.created_at)}
              </span>
            </div>

            {/* Name */}
            <h1 className="text-3xl lg:text-4xl font-black text-foreground mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="inline-block bg-brand-yellow-pastel border border-brand-yellow/30 rounded-xl px-6 py-4 mb-8">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Preço</div>
              <div className="text-4xl font-black text-foreground">{formatPrice(product.price)}</div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Descrição do Produto</h2>
              <p className="text-foreground leading-relaxed text-base whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-brand-black text-brand-black font-bold hover:bg-brand-black hover:text-brand-yellow transition-all"
              >
                <ArrowLeft size={16} />
                Ver Mais Produtos
              </Link>
              <button
                onClick={() => navigator.share?.({ title: product.name, text: product.description })}
                className="btn-brand inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold"
              >
                <Share2 size={16} />
                Compartilhar
              </button>
            </div>
          </div>
        </div>

        {/* Related suggestion */}
        <div className="mt-8 text-center">
          <Link
            to="/recommendations"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            ✨ Ver recomendações personalizadas
          </Link>
        </div>
      </div>
    </div>
  );
}
