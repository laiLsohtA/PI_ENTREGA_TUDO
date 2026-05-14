// Products listing page - with search, category filter and grid
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  created_at: string;
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "Todos";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, [category]);

  async function fetchProducts() {
    setLoading(true);
    let query = supabase.from("products").select("*", { count: "exact" });

    if (category && category !== "Todos") {
      query = query.eq("category", category);
    }

    const { data, error, count } = await query.order("created_at", { ascending: false });

    if (!error && data) {
      setProducts(data as Product[]);
      setTotal(count ?? data.length);
    }
    setLoading(false);
  }

  function handleCategoryChange(cat: string) {
    setCategory(cat);
    setSearch("");
    if (cat === "Todos") {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="bg-brand-black py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-black text-brand-yellow mb-1">Produtos</h1>
          <p className="text-gray-400 text-sm">
            {total} produto{total !== 1 ? "s" : ""} {category !== "Todos" ? `em ${category}` : "disponíveis"}
          </p>

          {/* Search bar */}
          <div className="relative mt-5 max-w-xl">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar produto por nome ou descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-yellow text-sm"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b border-border py-5 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryFilter selected={category} onChange={handleCategoryChange} />
        </div>
      </div>

      {/* Products grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter summary */}
        <div className="flex items-center gap-2 mb-5">
          <SlidersHorizontal size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {search ? (
              <>Mostrando <strong>{filtered.length}</strong> resultado{filtered.length !== 1 ? "s" : ""} para "<strong>{search}</strong>"</>
            ) : (
              <>Mostrando <strong>{filtered.length}</strong> produto{filtered.length !== 1 ? "s" : ""}</>
            )}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="product-card h-60 animate-pulse bg-muted" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-brand-yellow-pastel rounded-full flex items-center justify-center mb-4">
              <Search size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Nenhum produto encontrado</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              {search
                ? `Não encontramos produtos para "${search}". Tente outro termo.`
                : `Não há produtos na categoria "${category}" ainda.`}
            </p>
            <button
              onClick={() => { setSearch(""); handleCategoryChange("Todos"); }}
              className="btn-brand mt-5 px-6 py-2.5 rounded-lg text-sm font-bold"
            >
              Ver todos os produtos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
