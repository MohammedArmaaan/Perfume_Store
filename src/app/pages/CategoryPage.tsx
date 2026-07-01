import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, Link } from "react-router";
import { Filter, ChevronDown, Heart } from "lucide-react";
import apiClient from "../../api/client";
import { useStore } from "../../store/useStore";
import { Product, Category } from "../../types";

export default function CategoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Parse filters from URL
  const categoryFilter = searchParams.get('category') || '';
  const searchFilter = searchParams.get('search') || '';
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';
  const sort = searchParams.get('sort') || '';

  // Fetch Categories for Sidebar
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await apiClient.get<{ data: Category[] }>('/categories');
      return res.data.data;
    }
  });

  // Fetch Products based on URL query params (which match Laravel API expected params)
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', searchParams.toString()],
    queryFn: async () => {
      const res = await apiClient.get<{ data: Product[] }>('/products', {
        params: Object.fromEntries(searchParams.entries())
      });
      return res.data.data;
    }
  });

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      {/* Header */}
      <div className="border-b border-gray-200 pb-8 mb-8 flex flex-col md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-serif text-gray-900 mb-2">
            {categoryFilter ? (categories?.find(c => c.slug === categoryFilter)?.name || 'Collection') : 'All Fragrances'}
          </h1>
          <p className="text-gray-600">Discover our signature scents.</p>
        </div>
        
        <div className="mt-6 md:mt-0 flex items-center space-x-4">
          <div className="relative">
            <select 
              className="appearance-none bg-transparent border border-gray-300 py-2 pl-4 pr-10 text-sm text-gray-900 focus:outline-none focus:border-gray-900 cursor-pointer"
              value={sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
            >
              <option value="">Recommended</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
          
          <button 
            className="md:hidden flex items-center space-x-2 border border-gray-300 py-2 px-4 text-sm"
            onClick={() => setIsMobileFiltersOpen(true)}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Filters Sidebar (Desktop) */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="sticky top-28 space-y-8">
            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-medium uppercase tracking-widest text-gray-900 mb-4">Categories</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>
                  <button 
                    onClick={() => updateFilter('category', '')}
                    className={`hover:text-gray-900 ${!categoryFilter ? 'text-gray-900 font-bold' : ''}`}
                  >
                    All Categories
                  </button>
                </li>
                {categories?.map(c => (
                  <li key={c.id}>
                    <button 
                      onClick={() => updateFilter('category', c.slug)}
                      className={`hover:text-gray-900 ${categoryFilter === c.slug ? 'text-gray-900 font-bold' : ''}`}
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="text-sm font-medium uppercase tracking-widest text-gray-900 mb-4">Price</h3>
              <div className="flex items-center space-x-2">
                <input 
                  type="number" 
                  placeholder="Min" 
                  className="w-full border border-gray-300 p-2 text-sm bg-transparent focus:border-gray-900 focus:outline-none"
                  value={minPrice}
                  onChange={(e) => updateFilter('min_price', e.target.value)}
                />
                <span className="text-gray-400">-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  className="w-full border border-gray-300 p-2 text-sm bg-transparent focus:border-gray-900 focus:outline-none"
                  value={maxPrice}
                  onChange={(e) => updateFilter('max_price', e.target.value)}
                />
              </div>
            </div>

            {/* Clear Filters */}
            {(categoryFilter || minPrice || maxPrice || sort || searchFilter) && (
              <button 
                onClick={() => setSearchParams({})}
                className="text-xs uppercase tracking-widest border-b border-gray-400 text-gray-500 hover:text-gray-900 hover:border-gray-900 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse flex flex-col">
                  <div className="aspect-square bg-gray-100 mb-4 rounded-sm"></div>
                  <div className="h-4 bg-gray-100 w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-100 w-1/4 mb-4"></div>
                  <div className="h-10 bg-gray-100 w-full mt-auto"></div>
                </div>
              ))}
            </div>
          ) : products?.length === 0 ? (
            <div className="text-center py-24 text-gray-500">
              <p>No fragrances found matching your filters.</p>
              <button onClick={() => setSearchParams({})} className="mt-4 underline hover:text-gray-900">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Reusable Product Card Component (Matching the premium design)
// -------------------------------------------------------------
function ProductCard({ product, badge }: { product: Product, badge?: string }) {
  const [selectedSize, setSelectedSize] = useState("100ML");
  const addToCart = useStore(state => state.addToCart);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents navigating to product page
    if (product.stock > 0 && addToCart) {
      addToCart(product, 1);
    }
  };

  return (
    <div className="flex flex-col group w-full font-sans text-left relative bg-white h-full">
      {/* Optional Badge Support */}
      {badge && (
        <span className="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur text-gray-900 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 shadow-sm">
          {badge}
        </span>
      )}
      
      {/* Image Section with Hover Heart Icon */}
      <div className="relative aspect-square bg-gray-50 mb-4 overflow-hidden border border-gray-100 group/image shrink-0">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-105"
          />
        </Link>
        <button 
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white p-2.5 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.1)] opacity-0 group-hover/image:opacity-100 transition-all duration-300 hover:text-red-500 text-gray-900 z-10"
          title="Add to Wishlist"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Product Details Section */}
      <div className="flex flex-col flex-grow">
        {/* Title */}
        <Link to={`/product/${product.id}`}>
          <h3 className="text-[15px] font-semibold text-gray-900 mb-1.5 line-clamp-2 min-h-[44px] leading-snug hover:text-gray-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2 text-sm">
          <div className="flex text-[#d4af37] text-base leading-none">
            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          </div>
          <span className="font-semibold text-gray-800 ml-1 text-[13px]">5</span>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline space-x-2 mb-2">
          <span className="font-bold text-gray-900 text-[15px]">
            Rs. {product.discount_price ? product.discount_price.toFixed(2) : product.price.toFixed(2)}
          </span>
          {product.discount_price && (
            <span className="text-gray-400 line-through text-[13px]">
              Rs. {product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* EMI Structure */}
        <div className="flex items-center text-[13px] text-gray-600 mb-4 space-x-1.5">
          <span>or <span className="font-semibold text-gray-800">₹200</span>/month</span>
          <button className="border border-gray-400 px-1.5 py-0.5 text-[10px] font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors rounded-sm uppercase tracking-wide">
            Buy on EMI
          </button>
        </div>

        {/* Size Variants */}
        <div className="flex items-center space-x-2 mb-4 mt-auto">
          <button 
            onClick={(e) => { e.preventDefault(); setSelectedSize("100ML"); }}
            className={`border px-3 py-1 text-[11px] font-medium tracking-wider transition-colors ${
              selectedSize === "100ML" ? "border-gray-900 text-gray-900 font-semibold" : "border-gray-300 text-gray-500 hover:border-gray-900"
            }`}
          >
            100ML
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); setSelectedSize("15 ML"); }}
            className={`border px-3 py-1 text-[11px] font-medium tracking-wider transition-colors ${
              selectedSize === "15 ML" ? "border-gray-900 text-gray-900 font-semibold" : "border-gray-300 text-gray-500 hover:border-gray-900"
            }`}
          >
            15 ML
          </button>
        </div>

        {/* Full-width solid Add to Cart Button */}
        <button 
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full bg-[#1c1c1c] text-white py-3.5 px-4 text-xs font-semibold tracking-widest hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase mt-auto"
        >
          {product.stock === 0 ? 'Out of Stock' : 'ADD TO CART'}
        </button>
      </div>
    </div>
  );
}