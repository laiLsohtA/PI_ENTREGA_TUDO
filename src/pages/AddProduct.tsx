// Add Product page - form with validation and feedback
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, AlertCircle, Package, LockKeyhole } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";

const CATEGORIES = ["Ferramentas", "Roupas", "Eletrônicos", "Alimentos", "Acessórios", "Casa", "Esportes", "Outros"];

const productSchema = z.object({
  name: z.string().trim().min(3, "Nome deve ter pelo menos 3 caracteres").max(100, "Nome muito longo"),
  description: z.string().trim().min(10, "Descrição deve ter pelo menos 10 caracteres").max(1000, "Descrição muito longa"),
  price: z.number({ invalid_type_error: "Informe um preço válido" }).min(0.01, "Preço deve ser maior que zero").max(999999, "Preço muito alto"),
  category: z.string().min(1, "Selecione uma categoria"),
});

type FormData = { name: string; description: string; price: string; category: string };
type FieldErrors = Partial<Record<keyof FormData, string>>;

export default function AddProduct() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [form, setForm] = useState<FormData>({ name: "", description: "", price: "", category: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrors({});
    setErrorMsg("");

    // Validate
    const result = productSchema.safeParse({
      name: form.name,
      description: form.description,
      price: parseFloat(form.price.replace(",", ".")),
      category: form.category,
    });

    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormData;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      setStatus("idle");
      return;
    }

    // Submit to DB
    const { error } = await supabase.from("products").insert({
      name: result.data.name,
      description: result.data.description,
      price: result.data.price,
      category: result.data.category,
    });

    if (error) {
      setErrorMsg("Erro ao cadastrar produto. Tente novamente.");
      setStatus("error");
    } else {
      setStatus("success");
      setTimeout(() => navigate("/products"), 2500);
    }
  }

  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="bg-card rounded-2xl shadow-lg p-8 max-w-md w-full text-center animate-fade-in">
          <div className="w-16 h-16 bg-brand-yellow rounded-2xl flex items-center justify-center mx-auto mb-5">
            <LockKeyhole size={32} className="text-brand-black" />
          </div>
          <h1 className="text-2xl font-black text-foreground mb-2">Login necessário</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Para cadastrar produtos, entre com uma conta do EntregaTudo. Essa restrição demonstra a evolução dos requisitos RF07/RF08 na Fase 03.
          </p>
          <Link to="/login" className="btn-brand inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold">
            Entrar ou cadastrar conta
          </Link>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="bg-card rounded-2xl shadow-lg p-10 max-w-md w-full text-center animate-fade-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-foreground mb-2">Produto Cadastrado!</h2>
          <p className="text-muted-foreground text-sm mb-6">
            "<strong>{form.name}</strong>" foi adicionado com sucesso. Redirecionando...
          </p>
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div className="bg-brand-yellow h-1.5 animate-[shimmer_2.5s_linear_forwards]" style={{ width: "100%" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-brand-black py-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-yellow text-sm font-medium transition-colors mb-4"
          >
            <ArrowLeft size={16} /> Voltar
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center">
              <Package size={20} className="text-brand-black" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-brand-yellow">Cadastrar Produto</h1>
              <p className="text-gray-400 text-sm">Preencha os dados do seu produto</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-card rounded-2xl shadow-lg overflow-hidden animate-fade-in">
          <div className="h-2 bg-brand-yellow" />
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Global error */}
            {status === "error" && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                <AlertCircle size={16} />
                {errorMsg}
              </div>
            )}

            <div className="bg-brand-yellow-pastel border border-brand-yellow/30 rounded-xl px-4 py-3 text-sm text-foreground">
              Produto será cadastrado por usuário autenticado: <strong>{user?.email}</strong>.
            </div>

            {/* Nome */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-1.5">
                Nome do Produto <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ex: Furadeira Bosch 650W"
                className={`w-full px-4 py-3 rounded-xl border-2 text-sm bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all ${errors.name ? "border-red-400" : "border-border focus:border-brand-yellow"}`}
              />
              {errors.name && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} />{errors.name}</p>}
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-1.5">
                Descrição <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Descreva as características e detalhes do produto..."
                className={`w-full px-4 py-3 rounded-xl border-2 text-sm bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all resize-none ${errors.description ? "border-red-400" : "border-border focus:border-brand-yellow"}`}
              />
              <div className="flex justify-between mt-1">
                {errors.description ? (
                  <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} />{errors.description}</p>
                ) : <span />}
                <span className="text-xs text-muted-foreground">{form.description.length}/1000</span>
              </div>
            </div>

            {/* Preço + Categoria (side by side) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Preço */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5">
                  Preço (R$) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">R$</span>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0,00"
                    step="0.01"
                    min="0"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 text-sm bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all ${errors.price ? "border-red-400" : "border-border focus:border-brand-yellow"}`}
                  />
                </div>
                {errors.price && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} />{errors.price}</p>}
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5">
                  Categoria <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all ${errors.category ? "border-red-400" : "border-border focus:border-brand-yellow"}`}
                >
                  <option value="">Selecione...</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} />{errors.category}</p>}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-brand w-full py-4 rounded-xl text-base font-black disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-brand-black border-t-transparent rounded-full animate-spin" />
                    Cadastrando...
                  </span>
                ) : (
                  "Cadastrar Produto"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
