import { ShoppingCart, Heart } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  onClickAdd?: () => void;
}

export function ProductCard({ id, name, description, price, imageUrl, category, onClickAdd }: ProductCardProps) {
  return (
    <div className="group bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl || "/placeholder-product.png"}
          alt={name}
          className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2 flex gap-2">
            <button className="bg-white/90 dark:bg-zinc-800/90 p-2 rounded-full shadow-sm hover:text-red-500 transition-colors">
                <Heart className="w-5 h-5" />
            </button>
        </div>
        <div className="absolute bottom-2 left-2">
            <span className="bg-primary-600/90 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-md tracking-wider backdrop-blur-sm">
                {category}
            </span>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg group-hover:text-primary-600 transition-colors">
          {name}
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm line-clamp-2 leading-relaxed h-10">
          {description}
        </p>
        
        <div className="flex items-center justify-between pt-2">
          <span className="text-xl font-black text-primary-600 dark:text-primary-400">
            {formatCurrency(price)}
          </span>
          <button
            onClick={onClickAdd}
            className="bg-primary-600 hover:bg-primary-700 active:scale-95 text-white p-3 rounded-xl transition-all shadow-lg shadow-primary-500/20"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
