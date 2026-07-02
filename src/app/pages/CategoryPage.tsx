import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, Link } from "react-router";
import { Filter, ChevronDown, Heart, X, ChevronRight, ChevronLeft } from "lucide-react";
import apiClient from "../../api/client";
import { useStore } from "../../store/useStore";
import { Product, Category } from "../../types";

export default function CategoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

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

  // Fetch Products based on URL query params
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

  const currentCategoryName = categoryFilter 
    ? (categories?.find(c => c.slug === categoryFilter)?.name || 'Collection') 
    : 'Elite Edition'; // Defaulting to the reference image vibe

  return (
    <div className="w-full bg-[#EFE9E1] min-h-screen font-sans selection:bg-[#72383D] selection:text-[#EFE9E1]">
      
      {/* 1. Hero Banner */}
      <div className="relative w-full h-[30vh] md:h-[50vh] bg-[#322D29] overflow-hidden">
        {/* Placeholder image resembling the warm tones of the reference banner */}
        <img 
          src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=2000" 
          alt={currentCategoryName} 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-[#322D29]/60 to-transparent">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-[#EFE9E1] tracking-widest uppercase drop-shadow-md">
            {currentCategoryName}
          </h1>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* 2. Toolbar (Filter, Count, Sort) */}
        <div className="flex items-center justify-between border-b border-[#D1C7BD]/60 pb-4 mb-8">
          
          {/* Left: Filter Toggle */}
          <button 
            onClick={() => setIsFiltersOpen(true)}
            className="flex items-center space-x-2 text-[#322D29] hover:text-[#72383D] transition-colors"
          >
            <Filter className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">Filter</span>
          </button>

          {/* Center: Product Count */}
          <span className="hidden md:block text-xs font-semibold text-[#AC9C8D] uppercase tracking-widest">
            {products?.length || 0} Products
          </span>

          {/* Right: Sort Dropdown */}
          <div className="relative group">
            <select 
              className="appearance-none bg-[#322D29] border border-[#322D29] py-2 md:py-2.5 pl-4 pr-10 text-[9px] md:text-[10px] font-bold text-[#EFE9E1] uppercase tracking-[0.2em] focus:outline-none cursor-pointer rounded-none hover:bg-[#72383D] hover:border-[#72383D] transition-colors"
              value={sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
            >
              <option value="">Best Selling</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="alpha_asc">Alphabetically: A-Z</option>
              <option value="alpha_desc">Alphabetically: Z-A</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#EFE9E1] pointer-events-none" />
          </div>
        </div>

        {/* 3. Product Grid */}
        <div className="w-full">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-x-6 md:gap-y-10">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="animate-pulse flex flex-col">
                  <div className="aspect-square bg-[#D1C7BD]/40 border border-[#AC9C8D]/20 mb-4"></div>
                  <div className="h-4 bg-[#D1C7BD]/40 w-3/4 mb-2"></div>
                  <div className="h-3 bg-[#D1C7BD]/40 w-1/2 mb-4"></div>
                  <div className="h-10 bg-[#D1C7BD]/40 w-full mt-auto"></div>
                </div>
              ))}
            </div>
          ) : products?.length === 0 ? (
            <div className="text-center py-24 text-[#AC9C8D]">
              <p className="text-lg font-serif tracking-wide mb-4">No fragrances found matching your selection.</p>
              <button 
                onClick={() => setSearchParams({})} 
                className="border-b border-[#AC9C8D] text-xs uppercase tracking-widest hover:text-[#322D29] hover:border-[#322D29] transition-all pb-1"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-x-6 md:gap-y-12">
              {products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* 4. Pagination */}
        {products && products.length > 0 && (
          <div className="flex justify-center items-center space-x-4 mt-16 md:mt-24 border-t border-[#D1C7BD]/40 pt-10">
            <button className="text-[#AC9C8D] hover:text-[#322D29] transition-colors p-1" disabled>
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button className="w-8 h-8 rounded-full bg-[#322D29] text-[#EFE9E1] text-xs font-bold flex items-center justify-center transition-colors">
              1
            </button>
            <button className="w-8 h-8 rounded-full bg-transparent text-[#322D29] text-xs font-bold flex items-center justify-center hover:bg-[#D1C7BD]/30 transition-colors">
              2
            </button>
            
            <button className="text-[#322D29] hover:text-[#72383D] transition-colors p-1">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* 5. Filter Slide-out Drawer */}
      <div 
        className={`fixed inset-0 z-[100] transition-opacity duration-300 ${
          isFiltersOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-[#322D29]/50 backdrop-blur-sm" onClick={() => setIsFiltersOpen(false)} />
        
        {/* Drawer Panel */}
        <div 
          className={`absolute top-0 left-0 w-[85%] max-w-sm h-full bg-[#EFE9E1] shadow-2xl transform transition-transform duration-500 ease-out flex flex-col ${
            isFiltersOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#D1C7BD]">
            <h2 className="text-xl font-serif text-[#322D29] uppercase tracking-widest">Filters</h2>
            <button 
              onClick={() => setIsFiltersOpen(false)}
              className="text-[#322D29] hover:text-[#72383D] transition-colors p-2 -mr-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-10">
            
            {/* Category Filter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#AC9C8D] mb-5">Collections</h3>
              <ul className="space-y-4">
                <li>
                  <button 
                    onClick={() => { updateFilter('category', ''); setIsFiltersOpen(false); }}
                    className={`text-sm uppercase tracking-wider transition-colors ${!categoryFilter ? 'text-[#322D29] font-bold border-b border-[#322D29]' : 'text-[#322D29] hover:text-[#72383D]'}`}
                  >
                    All Collections
                  </button>
                </li>
                {categories?.map(c => (
                  <li key={c.id}>
                    <button 
                      onClick={() => { updateFilter('category', c.slug); setIsFiltersOpen(false); }}
                      className={`text-sm uppercase tracking-wider transition-colors ${categoryFilter === c.slug ? 'text-[#322D29] font-bold border-b border-[#322D29]' : 'text-[#322D29] hover:text-[#72383D]'}`}
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#AC9C8D] mb-5">Price Range</h3>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="text-[10px] text-[#AC9C8D] uppercase tracking-wider mb-1 block">Min</label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    className="w-full border border-[#D1C7BD] p-2.5 text-sm bg-transparent focus:border-[#72383D] focus:ring-1 focus:ring-[#72383D] focus:outline-none transition-all text-[#322D29] rounded-none"
                    value={minPrice}
                    onChange={(e) => updateFilter('min_price', e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] text-[#AC9C8D] uppercase tracking-wider mb-1 block">Max</label>
                  <input 
                    type="number" 
                    placeholder="5000" 
                    className="w-full border border-[#D1C7BD] p-2.5 text-sm bg-transparent focus:border-[#72383D] focus:ring-1 focus:ring-[#72383D] focus:outline-none transition-all text-[#322D29] rounded-none"
                    value={maxPrice}
                    onChange={(e) => updateFilter('max_price', e.target.value)}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Drawer Footer (Clear / Apply) */}
          <div className="p-6 border-t border-[#D1C7BD] bg-[#EFE9E1]">
            <button 
              onClick={() => { setSearchParams({}); setIsFiltersOpen(false); }}
              className="w-full border border-[#322D29] text-[#322D29] py-3.5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#322D29] hover:text-[#EFE9E1] transition-all duration-300"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

// -------------------------------------------------------------
// Reusable Product Card Component
// -------------------------------------------------------------
function ProductCard({ product, badge }: { product: Product, badge?: string }) {
  const [selectedSize, setSelectedSize] = useState("100ML");
  const addToCart = useStore(state => state.addToCart);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock > 0 && addToCart) {
      addToCart(product, 1);
    }
  };

  return (
    <div className="flex flex-col group w-full h-full font-sans text-left relative bg-transparent transition-all duration-500 hover:-translate-y-1.5 cursor-pointer">
      
      {/* Premium Badge */}
      {badge && (
        <span className="absolute top-2 left-2 md:top-3 md:left-3 z-20 bg-[#72383D] text-[#EFE9E1] text-[9px] md:text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 md:px-3 md:py-1.5 shadow-sm">
          {badge}
        </span>
      )}
      
      {/* Image Section */}
      <div className="relative aspect-square bg-[#FFFFFF] mb-4 md:mb-5 overflow-hidden border border-[#D1C7BD] transition-all duration-500 group-hover:border-[#72383D]/40 group-hover:shadow-[0_10px_30px_rgba(50,45,41,0.12)]">
        <div className="absolute inset-0 bg-[#322D29]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
        
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
          />
        </Link>
        
        {/* Wishlist Button */}
        <button 
          className="absolute bottom-3 left-1/2 md:bottom-5 md:left-1/2 -translate-x-1/2 translate-y-4 bg-[#EFE9E1] p-2.5 md:p-3 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)] opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out hover:bg-[#72383D] hover:text-[#EFE9E1] text-[#322D29] z-20"
          title="Add to Wishlist"
        >
          <Heart className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>
      </div>

      {/* Product Details Section */}
      <div className="flex flex-col flex-grow px-1">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-[14px] md:text-[15px] font-semibold text-[#322D29] mb-1.5 line-clamp-2 min-h-[40px] md:min-h-[44px] leading-snug transition-colors duration-300 group-hover:text-[#72383D]">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2 md:mb-3 text-sm">
          <div className="flex text-[#AC9C8D] text-sm md:text-base leading-none tracking-tight">
            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          </div>
          <span className="font-semibold text-[#AC9C8D] ml-1.5 text-[12px] md:text-[13px]">5</span>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline space-x-2 mb-2">
          <span className="font-bold text-[#322D29] text-[14px] md:text-[15px]">
            Rs. {product.discount_price ? product.discount_price.toFixed(2) : product.price.toFixed(2)}
          </span>
          {product.discount_price && (
            <span className="text-[#AC9C8D] line-through text-[12px] md:text-[13px]">
              Rs. {product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* EMI Structure */}
        {/* <div className="flex flex-wrap items-center text-[12px] md:text-[13px] text-[#AC9C8D] mb-4 md:mb-5 gap-1.5 md:space-x-1.5">
          <span>or <span className="font-semibold text-[#322D29]">₹200</span>/month</span>
          <button className="border border-[#D1C7BD] px-1.5 py-0.5 md:px-2 md:py-0.5 text-[9px] md:text-[10px] font-bold text-[#AC9C8D] bg-transparent hover:bg-[#D1C7BD] hover:text-[#322D29] transition-colors rounded-sm uppercase tracking-wide">
            Buy on EMI
          </button>
        </div> */}

        {/* Size Variants */}
        <div className="flex items-center space-x-2 mb-4 md:mb-5 mt-auto">
          <button 
            onClick={(e) => { e.preventDefault(); setSelectedSize("100ML"); }}
            className={`border px-3 py-1.5 md:px-4 md:py-1.5 text-[10px] md:text-[11px] font-medium tracking-wider transition-colors flex-1 text-center ${
              selectedSize === "100ML" ? "border-[#322D29] text-[#322D29] font-semibold bg-[#D1C7BD]/20" : "border-[#D1C7BD] text-[#AC9C8D] hover:border-[#322D29]"
            }`}
          >
            100ML
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); setSelectedSize("15 ML"); }}
            className={`border px-3 py-1.5 md:px-4 md:py-1.5 text-[10px] md:text-[11px] font-medium tracking-wider transition-colors flex-1 text-center ${
              selectedSize === "15 ML" ? "border-[#322D29] text-[#322D29] font-semibold bg-[#D1C7BD]/20" : "border-[#D1C7BD] text-[#AC9C8D] hover:border-[#322D29]"
            }`}
          >
            15 ML
          </button>
        </div>

        {/* Full-width solid Add to Cart Button */}
        <button 
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full bg-[#322D29] text-[#EFE9E1] py-3 md:py-3.5 px-4 text-[10px] md:text-xs font-semibold tracking-widest hover:bg-[#72383D] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase mt-auto"
        >
          {product.stock === 0 ? 'Out of Stock' : 'ADD TO CART'}
        </button>
      </div>
    </div>
  );
}