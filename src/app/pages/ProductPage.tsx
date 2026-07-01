import { useState } from "react";
import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Minus, Plus } from "lucide-react";
import apiClient from "../../api/client";
import { useStore } from "../../store/useStore";
import { Product } from "../../types";

export default function ProductPage() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const addToCart = useStore(state => state.addToCart);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await apiClient.get<{ data: Product }>(`/products/${id}`);
      return res.data.data;
    }
  });

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    await addToCart(product, quantity);
    setAdding(false);
    // Could trigger a toast or side cart open here
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-12 animate-pulse">
        <div className="w-full md:w-1/2 aspect-square bg-luxury-200"></div>
        <div className="w-full md:w-1/2 space-y-6">
          <div className="h-10 bg-luxury-200 w-3/4"></div>
          <div className="h-6 bg-luxury-200 w-1/4"></div>
          <div className="h-32 bg-luxury-200 w-full"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-serif text-luxury-950 mb-4">Product not found</h2>
        <Link to="/shop" className="text-luxury-600 hover:text-luxury-950 underline">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-luxury-500 mb-8">
        <Link to="/" className="hover:text-luxury-950">Home</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link to="/shop" className="hover:text-luxury-950">Shop</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        {product.category && (
          <>
            <Link to={`/shop?category=${product.category.slug}`} className="hover:text-luxury-950">{product.category.name}</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
          </>
        )}
        <span className="text-luxury-900">{product.name}</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
        {/* Images */}
        <div className="w-full md:w-1/2">
          <div className="aspect-square bg-luxury-100 mb-4">
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.slice(1).map((img, i) => (
                <div key={i} className="aspect-square bg-luxury-100 cursor-pointer border border-transparent hover:border-luxury-400">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-serif text-luxury-950 mb-2">{product.name}</h1>
          
          <div className="text-xl mb-6">
            {product.discount_price ? (
              <div className="flex items-center space-x-4">
                <span className="text-luxury-500 line-through">${product.price}</span>
                <span className="text-luxury-950">${product.discount_price}</span>
              </div>
            ) : (
              <span className="text-luxury-950">${product.price}</span>
            )}
          </div>

          <p className="text-luxury-700 leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="border-t border-b border-luxury-200 py-6 mb-8 space-y-4">
            <div className="flex items-start">
              <span className="w-32 text-sm uppercase tracking-widest text-luxury-500 shrink-0">Top Notes</span>
              <span className="text-sm text-luxury-950">{product.fragrance_notes.top.join(', ')}</span>
            </div>
            <div className="flex items-start">
              <span className="w-32 text-sm uppercase tracking-widest text-luxury-500 shrink-0">Heart</span>
              <span className="text-sm text-luxury-950">{product.fragrance_notes.middle.join(', ')}</span>
            </div>
            <div className="flex items-start">
              <span className="w-32 text-sm uppercase tracking-widest text-luxury-500 shrink-0">Base Notes</span>
              <span className="text-sm text-luxury-950">{product.fragrance_notes.base.join(', ')}</span>
            </div>
            <div className="flex items-start">
              <span className="w-32 text-sm uppercase tracking-widest text-luxury-500 shrink-0">Longevity</span>
              <span className="text-sm text-luxury-950">{product.longevity} • {product.projection} Projection</span>
            </div>
          </div>

          <div className="flex items-center space-x-6 mb-8">
            <div className="flex items-center border border-luxury-300">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 text-luxury-600 hover:text-luxury-950 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center text-luxury-950">{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="p-3 text-luxury-600 hover:text-luxury-950 transition-colors"
                disabled={quantity >= product.stock}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className="flex-1 bg-luxury-950 text-white py-3.5 px-8 text-sm uppercase tracking-widest hover:bg-luxury-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.stock === 0 ? 'Out of Stock' : adding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>

          <div className="text-xs text-luxury-500 uppercase tracking-widest space-y-2">
            <p>Complimentary shipping on orders over $150.</p>
            <p>Free returns within 30 days.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
