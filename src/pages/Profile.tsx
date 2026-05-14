import { Link, Navigate } from "react-router-dom";
import { LogOut, PackagePlus, ShieldCheck, UserRound } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Profile() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const displayName = user.user_metadata?.name || user.email;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-brand-black py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-brand-yellow/20 border border-brand-yellow/30 rounded-full px-4 py-1.5 text-sm font-semibold text-brand-yellow mb-4">
            <ShieldCheck size={14} /> Sessão autenticada
          </div>
          <h1 className="text-3xl font-black text-brand-yellow mb-2">Minha conta</h1>
          <p className="text-gray-400 text-sm">Área de validação do fluxo RF07/RF08 para a Fase 03.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card rounded-2xl shadow-lg p-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-brand-yellow rounded-2xl flex items-center justify-center">
                <UserRound size={32} className="text-brand-black" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-foreground">{displayName}</h2>
                <p className="text-muted-foreground text-sm">{user.email}</p>
              </div>
            </div>

            <div className="bg-brand-yellow-pastel border border-brand-yellow/30 rounded-xl p-5 mb-6">
              <h3 className="font-black text-foreground mb-2">Evidência de autenticação</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Esta página só é exibida quando existe uma sessão ativa no Supabase Auth. Ela serve como evidência visual de que o usuário realizou login e que o frontend identifica a sessão atual.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/add-product" className="btn-brand inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold">
                <PackagePlus size={16} /> Cadastrar produto
              </Link>
              <button
                onClick={() => signOut()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-brand-black text-brand-black font-bold hover:bg-brand-black hover:text-brand-yellow transition-all"
              >
                <LogOut size={16} /> Sair
              </button>
            </div>
          </div>

          <div className="bg-card rounded-2xl shadow-lg p-6 h-fit">
            <h3 className="font-black text-foreground mb-3">Status Fase 03</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>✅ RF07 - Cadastro de usuário em desenvolvimento funcional</li>
              <li>✅ RF08 - Login/autenticação em desenvolvimento funcional</li>
              <li>✅ Controle de sessão via Supabase Auth</li>
              <li>✅ Logout operacional no frontend</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
