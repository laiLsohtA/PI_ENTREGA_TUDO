// CategoryFilter component - iFood-style horizontal scrollable categories
import { Wrench, Shirt, Smartphone, UtensilsCrossed, Gem, Home, Dumbbell, Package } from "lucide-react";

const CATEGORIES = [
  { name: "Todos", icon: Package, color: "#000" },
  { name: "Ferramentas", icon: Wrench, color: "#FF6B35" },
  { name: "Roupas", icon: Shirt, color: "#E91E8C" },
  { name: "Eletrônicos", icon: Smartphone, color: "#2196F3" },
  { name: "Alimentos", icon: UtensilsCrossed, color: "#4CAF50" },
  { name: "Acessórios", icon: Gem, color: "#9C27B0" },
  { name: "Casa", icon: Home, color: "#FF9800" },
  { name: "Esportes", icon: Dumbbell, color: "#F44336" },
  { name: "Outros", icon: Package, color: "#607D8B" },
];

interface CategoryFilterProps {
  selected: string;
  onChange: (category: string) => void;
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="w-full">
      {/* Desktop grid */}
      <div className="hidden sm:grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selected === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => onChange(cat.name)}
              className={`category-card flex flex-col items-center gap-2 p-3 rounded-xl ${isActive ? "active" : ""}`}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: isActive ? "hsl(45,100%,51%)" : `${cat.color}22` }}
              >
                <Icon size={20} style={{ color: isActive ? "#000" : cat.color }} />
              </div>
              <span className={`text-xs font-semibold leading-tight text-center ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Mobile horizontal scroll */}
      <div className="sm:hidden flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selected === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => onChange(cat.name)}
              className={`category-card flex flex-col items-center gap-1.5 p-3 rounded-xl shrink-0 w-[72px] ${isActive ? "active" : ""}`}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ backgroundColor: isActive ? "hsl(45,100%,51%)" : `${cat.color}22` }}
              >
                <Icon size={18} style={{ color: isActive ? "#000" : cat.color }} />
              </div>
              <span className={`text-[10px] font-semibold leading-tight text-center ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
