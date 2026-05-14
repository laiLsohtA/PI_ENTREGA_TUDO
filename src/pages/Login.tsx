import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle, LockKeyhole, Mail, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type Mode = "login" | "register";

export default function Login() {
  const navigate = useNavigate();
  const { user, loading, signIn, signUp, signOut } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const isRegister = mode === "register";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!email.trim() || !password.trim()) {
      setMessage({ type: "error", text: "Informe e-mail e senha para continuar." });
      return;
    }

    if (isRegister) {
      if (!name.trim()) {
        setMessage({ type: "error", text: "Informe seu nome para criar a conta." });
        return;
      }
      if (password.length < 6) {
        setMessage({ type: "error", text: "A senha deve ter pelo menos 6 caracteres." });
        return;
      }
      if (password !== confirmPassword) {
        setMessage({ type: "error", text: "A confirmação de senha não confere." });
        return;
      }
    }

    setSubmitting(true);

    try {
      if (isRegister) {
        const result = await signUp(name.trim(), email.trim(), password);
        if (result.error) {
          setMessage({ type: "error", text: traduzirErro(result.error) });
        } else if (result.needsConfirmation) {
          setMessage({
            type: "success",
            text: "Cadastro solicitado com sucesso. Se a confirmação por e-mail estiver ativa no Supabase, confirme a conta antes de fazer login.",
          });
          setMode("login");
        } else {
          setMessage({ type: "success", text: "Cadastro realizado e sessão iniciada com sucesso." });
          setTimeout(() => navigate("/products"), 700);
        }
      } else {
        const result = await signIn(email.trim(), password);
        if (result.error) {
          setMessage({ type: "error", text: traduzirErro(result.error) });
        } else {
          setMessage({ type: "success", text: "Login realizado com sucesso." });
          setTimeout(() => navigate("/products"), 700);
        }
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (!loading && user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="bg-card rounded-2xl shadow-lg p-8 max-w-md w-full text-center animate-fade-in">
          <div className="w-16 h-16 bg-brand-yellow rounded-2xl flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-brand-black" />
          </div>
          <h1 className="text-2xl font-black text-foreground mb-2">Usuário autenticado</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Sessão ativa para <strong>{user.email}</strong>.
          </p>
          <div className="flex flex-col gap-3">
            <Link to="/add-product" className="btn-brand px-6 py-3 rounded-xl font-bold">
              Cadastrar produto
            </Link>
            <button
              onClick={async () => {
                await signOut();
                setMessage({ type: "success", text: "Sessão encerrada." });
              }}
              className="px-6 py-3 rounded-xl border-2 border-brand-black text-brand-black font-bold hover:bg-brand-black hover:text-brand-yellow transition-all"
            >
              Sair da conta
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-brand-black py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-brand-yellow/20 border border-brand-yellow/30 rounded-full px-4 py-1.5 text-sm font-semibold text-brand-yellow mb-4">
            <LockKeyhole size={14} /> RF07/RF08 - Autenticação
          </div>
          <h1 className="text-3xl font-black text-brand-yellow mb-2">
            {isRegister ? "Criar conta" : "Entrar no EntregaTudo"}
          </h1>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Fluxo de autenticação integrado ao Supabase Auth para controle de acesso ao marketplace.
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-card rounded-2xl shadow-lg overflow-hidden animate-fade-in">
          <div className="h-2 bg-brand-yellow" />
          <div className="grid grid-cols-2 border-b border-border">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setMessage(null);
              }}
              className={`py-4 text-sm font-bold transition-colors ${!isRegister ? "bg-brand-yellow-pastel text-brand-black" : "text-muted-foreground hover:text-foreground"}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setMessage(null);
              }}
              className={`py-4 text-sm font-bold transition-colors ${isRegister ? "bg-brand-yellow-pastel text-brand-black" : "text-muted-foreground hover:text-foreground"}`}
            >
              Cadastro
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {message && (
              <div className={`flex items-start gap-3 rounded-xl px-4 py-3 text-sm border ${message.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
                {message.type === "success" ? <CheckCircle size={16} className="mt-0.5" /> : <AlertCircle size={16} className="mt-0.5" />}
                <span>{message.text}</span>
              </div>
            )}

            {isRegister && (
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5">Nome</label>
                <div className="relative">
                  <UserPlus size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-foreground mb-1.5">E-mail</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-foreground mb-1.5">Senha</label>
              <div className="relative">
                <LockKeyhole size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo de 6 caracteres"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow"
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5">Confirmar senha</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a senha"
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-brand w-full py-4 rounded-xl text-base font-black disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Processando..." : isRegister ? "Cadastrar usuário" : "Entrar"}
            </button>

            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              Esta tela registra a evolução dos requisitos RF07 e RF08, conectando o frontend ao serviço de autenticação do Supabase.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function traduzirErro(error: string) {
  const lower = error.toLowerCase();
  if (lower.includes("invalid login credentials")) return "E-mail ou senha inválidos.";
  if (lower.includes("already registered") || lower.includes("already exists")) return "Este e-mail já possui cadastro.";
  if (lower.includes("password")) return "Verifique a senha informada. Ela deve atender às regras mínimas.";
  if (lower.includes("email")) return "Verifique o e-mail informado.";
  return error;
}
