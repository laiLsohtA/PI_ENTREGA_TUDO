// Navbar component with EntregaTudo branding and authentication status

import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { LogOut, Menu, UserRound, X } from "lucide-react";
import logoImg from "@/assets/logo.png";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { to: "/", label: "Início" },
  { to: "/products", label: "Produtos" },
  { to: "/recommendations", label: "Recomendações" },
  { to: "/add-product", label: "Cadastrar" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, loading, signOut } = useAuth();

  const renderNavLink = (link: { to: string; label: string }, mobile = false) => (
    <Link
      key={link.to}
      to={link.to}
      onClick={() => mobile && setOpen(false)}
      className={`${mobile ? "block px-4 py-3 mb-1" : "px-4 py-2"} rounded-lg text-sm font-semibold transition-all duration-150 ${
        location.pathname === link.to
          ? "bg-brand-yellow text-brand-black"
          : "text-gray-300 hover:text-brand-yellow hover:bg-white/10"
      }`}
    >
      {link.label}
    </Link>
  );

  return (
    <nav className="navbar sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src={logoImg}
              alt="EntregaTudo"
              className="h-10 w-10 rounded-lg object-cover"
            />
            <span className="text-brand-yellow font-extrabold text-xl tracking-tight hidden sm:block">
              EntregaTudo
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => renderNavLink(link))}
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-2">
            {!loading && user ? (
              <>
                <Link
                  to="/profile"
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    location.pathname === "/profile"
                      ? "bg-brand-yellow text-brand-black"
                      : "text-gray-300 hover:text-brand-yellow hover:bg-white/10"
                  }`}
                >
                  <UserRound size={16} /> Minha conta
                </Link>
                <button
                  onClick={() => signOut()}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:text-brand-yellow hover:bg-white/10 transition-all"
                >
                  <LogOut size={16} /> Sair
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  location.pathname === "/login"
                    ? "bg-brand-yellow text-brand-black"
                    : "bg-white/10 text-brand-yellow hover:bg-brand-yellow hover:text-brand-black"
                }`}
              >
                <UserRound size={16} /> Entrar
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-gray-300 hover:text-brand-yellow p-2 rounded-lg transition-colors"
            aria-label="Menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-black border-t border-white/10 px-4 pb-4 pt-2 animate-fade-in">
          {navLinks.map((link) => renderNavLink(link, true))}
          {!loading && user ? (
            <>
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-semibold mb-1 transition-all ${
                  location.pathname === "/profile"
                    ? "bg-brand-yellow text-brand-black"
                    : "text-gray-300 hover:text-brand-yellow hover:bg-white/10"
                }`}
              >
                Minha conta
              </Link>
              <button
                onClick={async () => {
                  await signOut();
                  setOpen(false);
                }}
                className="block w-full text-left px-4 py-3 rounded-lg text-sm font-semibold text-gray-300 hover:text-brand-yellow hover:bg-white/10 transition-all"
              >
                Sair
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-semibold mb-1 transition-all ${
                location.pathname === "/login"
                  ? "bg-brand-yellow text-brand-black"
                  : "text-brand-yellow hover:bg-white/10"
              }`}
            >
              Entrar / Cadastrar
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
