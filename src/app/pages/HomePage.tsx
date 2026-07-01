import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { ArrowRight, Star, Heart } from "lucide-react";
import apiClient from "../../api/client";
import { useStore } from "../../store/useStore";
import { Product, Category } from "../../types";

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: products, isLoading: loadingProducts } = useQuery({
    queryKey: ['products', 'all'],
    queryFn: async () => {
      const res = await apiClient.get<{ data: Product[] }>('/products');
      return res.data.data;
    }
  });

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await apiClient.get<{ data: Category[] }>('/categories');
      return res.data.data;
    }
  });

  const featuredProducts = products?.filter(p => p.is_featured).slice(0, 4);
  const newArrivals = products?.slice(8, 12);
  const bestSellers = products?.slice(16, 24);

  const heroBanners = [
    {
      image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800",
      title: "Discover Your Signature Aura",
      subtitle: "An exclusive collection of handcrafted fragrances designed to leave a lasting impression and elevate your everyday presence.",
      span: "Maison de l'Aura"
    },
    {
      image: "https://images.unsplash.com/photo-1591892212776-a09de24dbe84?auto=format&fit=crop&q=80&w=800",
      title: "The Art of Elegance",
      subtitle: "Experience luxury that speaks without words. A symphony of delicate notes curated for the modern connoisseur.",
      span: "New Arrivals"
    },
    {
      image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=2000",
      title: "Gift of Timeless Beauty",
      subtitle: "Make every moment unforgettable with our beautifully packaged signature gifts.",
      span: "Exclusive Gifting"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 6000); 
    return () => clearInterval(timer);
  }, [heroBanners.length]);

  return (
    <div className="w-full bg-[#EFE9E1] text-[#322D29] selection:bg-[#72383D] selection:text-[#EFE9E1]">
      
      {/* Auto-Sliding Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden bg-[#322D29]">
        {heroBanners.map((banner, index) => {
          const isActive = index === currentSlide;
          
          return (
            <div 
              key={index} 
              className={`absolute inset-0 w-full h-full flex items-center justify-center transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <div className="absolute inset-0 overflow-hidden bg-[#322D29]">
                <img 
                  src={banner.image} 
                  alt="Luxury perfume" 
                  className={`w-full h-full object-cover mix-blend-overlay transition-transform duration-[10s] ease-out ${
                    isActive ? "scale-105 opacity-60" : "scale-100 opacity-0"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#322D29]/95 via-[#322D29]/40 to-transparent opacity-90"></div>
              </div>
              
              <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <span 
                  className={`text-[#D1C7BD] text-sm uppercase tracking-[0.3em] mb-6 block transition-all duration-700 ease-out font-medium ${
                    isActive ? "translate-y-0 opacity-100 delay-300" : "translate-y-4 opacity-0 delay-0"
                  }`}
                >
                  {banner.span}
                </span>
                
                <h1 
                  className={`text-5xl md:text-7xl text-[#EFE9E1] mb-8 uppercase tracking-widest font-serif leading-tight transition-all duration-700 ease-out ${
                    isActive ? "translate-y-0 opacity-100 delay-500" : "translate-y-4 opacity-0 delay-0"
                  }`}
                >
                  {banner.title}
                </h1>
                
                <p 
                  className={`text-lg md:text-xl text-[#AC9C8D] mb-10 max-w-2xl mx-auto font-light leading-relaxed transition-all duration-700 ease-out ${
                    isActive ? "translate-y-0 opacity-100 delay-700" : "translate-y-4 opacity-0 delay-0"
                  }`}
                >
                  {banner.subtitle}
                </p>
                
                <div 
                  className={`transition-all duration-700 ease-out ${
                    isActive ? "translate-y-0 opacity-100 delay-1000" : "translate-y-4 opacity-0 delay-0"
                  }`}
                >
                  <Link 
                    to="/shop" 
                    className="inline-flex items-center justify-center bg-[#EFE9E1] text-[#322D29] px-10 py-4 text-sm uppercase tracking-[0.2em] font-medium hover:bg-[#D1C7BD] transition-all hover:scale-105 duration-300"
                  >
                    Explore Collection <ArrowRight className="ml-3 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
        
        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-3 z-20">
          {heroBanners.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === currentSlide ? "w-10 bg-[#EFE9E1]" : "w-2 bg-[#AC9C8D]/40 hover:bg-[#D1C7BD]"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Scrolling Marquee Banner */}
      <div className="w-full bg-[#D1C7BD] border-y border-[#AC9C8D] py-3 overflow-hidden flex relative z-20">
        <div className="animate-marquee whitespace-nowrap flex items-center">
          {[...Array(8)].map((_, idx) => (
            <span key={idx} className="text-[#322D29] font-medium text-xs uppercase tracking-widest mx-8 flex items-center">
              <Star className="w-3 h-3 mr-2 inline text-[#72383D]" /> 
              {idx % 4 === 0 && "Complimentary samples with every order"}
              {idx % 4 === 1 && "Free express shipping over $150"}
              {idx % 4 === 2 && "Crafted in Grasse, France"}
              {idx % 4 === 3 && "Signature velvet packaging"}
            </span>
          ))}
        </div>
      </div>

      {/* Featured Fragrances - The Signature Collection */}
      <section className="py-24 bg-[#EFE9E1] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <span className="text-[#72383D] text-xs uppercase tracking-widest mb-2 block animate-pulse font-bold">Curated Selection</span>
              <h2 className="text-4xl font-serif text-[#322D29] mb-4">The Signature Collection</h2>
              <p className="text-[#AC9C8D]">Our most celebrated and sought-after fragrances, embodying the pinnacle of olfactory craftsmanship.</p>
            </div>
            <Link to="/shop" className="text-sm uppercase tracking-widest text-[#322D29] hover:text-[#72383D] flex items-center shrink-0 border-b border-[#322D29] hover:border-[#72383D] pb-1 hover:pr-2 transition-all duration-300 font-semibold">
              View All Signatures <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {[...Array(4)].map((_, i) => <div key={i} className="w-full aspect-square bg-[#D9D9D9] animate-pulse rounded-md"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {featuredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Explore Categories */}
      <section className="py-24 bg-[#D9D9D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-[#322D29] mb-4">Shop by Category</h2>
            <div className="w-16 h-px bg-[#72383D] mx-auto mt-6"></div>
          </div>

          {loadingCategories ? (
            <div className="flex justify-center"><div className="animate-pulse w-full h-96 bg-[#D1C7BD]"></div></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories?.map((category) => (
                <Link 
                  key={category.id} 
                  to={`/shop?category=${category.slug}`}
                  className="group relative h-[500px] overflow-hidden block rounded-sm shadow-md hover:shadow-2xl transition-all duration-700 border border-[#D1C7BD]"
                >
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#322D29]/95 via-[#322D29]/30 to-transparent transition-opacity duration-500 group-hover:opacity-90"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-10 flex flex-col items-center justify-center text-center">
                    <h3 className="text-3xl text-[#EFE9E1] font-serif tracking-widest uppercase mb-3 transform transition-transform duration-500 group-hover:-translate-y-2">{category.name}</h3>
                    <p className="text-[#D1C7BD] text-sm mb-6 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 transform translate-y-4 group-hover:translate-y-0">
                      {category.description}
                    </p>
                    <span className="text-[#EFE9E1] text-xs tracking-widest uppercase border border-[#EFE9E1]/50 px-6 py-3 opacity-0 group-hover:opacity-100 group-hover:border-[#EFE9E1] transition-all duration-500 delay-200 hover:bg-[#EFE9E1] hover:text-[#322D29]">
                      Explore {category.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-24 bg-[#EFE9E1] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-[#322D29] mb-4">New Arrivals</h2>
            <p className="text-[#AC9C8D]">The latest expressions of modern perfumery.</p>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {[...Array(4)].map((_, i) => <div key={i} className="w-full aspect-square bg-[#D9D9D9] animate-pulse rounded-md"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {newArrivals?.map((product) => (
                <ProductCard key={product.id} product={product} badge="New" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Brand Banner / The Art of Gifting */}
      <section className="py-24 bg-[#322D29] text-[#EFE9E1] relative overflow-hidden group border-y border-[#AC9C8D]/30">
        <div className="absolute right-0 top-0 w-full lg:w-1/2 h-full opacity-60 transition-transform duration-[10s] group-hover:scale-105">
          <img 
            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1200" 
            alt="Gifting" 
            className="w-full h-full object-cover mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#322D29] via-[#322D29]/70 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:w-1/2 lg:pr-16 py-12">
            <h2 className="text-4xl md:text-5xl font-serif mb-6 uppercase tracking-widest text-[#EFE9E1]">
              The Art of Gifting
            </h2>
            <p className="text-[#D1C7BD] text-lg mb-8 font-light leading-relaxed">
              Every Aura fragrance is meticulously packaged in our signature luxury wrapping, ensuring an unforgettable unboxing experience. Give the gift of timeless elegance.
            </p>
            <ul className="space-y-4 mb-10 text-[#D1C7BD] font-medium">
              <li className="flex items-center hover:text-[#EFE9E1] transition-colors duration-300"><Star className="w-5 h-5 mr-3 text-[#72383D]"/> Complimentary Engraving</li>
              <li className="flex items-center hover:text-[#EFE9E1] transition-colors duration-300"><Star className="w-5 h-5 mr-3 text-[#72383D]"/> Luxury Velvet Packaging</li>
              <li className="flex items-center hover:text-[#EFE9E1] transition-colors duration-300"><Star className="w-5 h-5 mr-3 text-[#72383D]"/> Personalized Note Cards</li>
            </ul>
            <Link 
              to="/shop" 
              className="inline-block border border-[#D1C7BD] text-[#D1C7BD] px-8 py-4 text-sm uppercase tracking-widest hover:bg-[#72383D] hover:border-[#72383D] hover:text-[#EFE9E1] transition-all duration-300"
            >
              Shop Gifts
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers Grid */}
      <section className="py-24 bg-[#D9D9D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-[#322D29] mb-4">Trending Now</h2>
            <p className="text-[#AC9C8D]">Discover what others are falling in love with.</p>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {[...Array(8)].map((_, i) => <div key={i} className="w-full aspect-square bg-[#D1C7BD] animate-pulse rounded-md"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
              {bestSellers?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="mt-16 text-center">
            <Link 
              to="/shop" 
              className="inline-block bg-[#322D29] text-[#EFE9E1] px-10 py-4 text-sm font-medium uppercase tracking-widest hover:bg-[#72383D] transition-all duration-300 hover:-translate-y-1 shadow-md"
            >
              View Full Collection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// -------------------------------------------------------------
// Reusable Product Card Component (LUXE Theme with Enhanced Hover)
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
    <div className="flex flex-col group w-full font-sans text-left relative bg-transparent transition-all duration-500 hover:-translate-y-1.5 cursor-pointer">
      {/* Premium Badge */}
      {badge && (
        <span className="absolute top-3 left-3 z-20 bg-[#72383D] text-[#EFE9E1] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 shadow-sm">
          {badge}
        </span>
      )}
      
      {/* Image Section - Adding soft shadow and border color change on hover */}
      <div className="relative aspect-square bg-[#FFFFFF] mb-5 overflow-hidden border border-[#D1C7BD] transition-all duration-500 group-hover:border-[#72383D]/40 group-hover:shadow-[0_10px_30px_rgba(50,45,41,0.12)]">
        
        {/* Very subtle overlay to make the image slightly deeper on hover */}
        <div className="absolute inset-0 bg-[#322D29]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
        
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
          />
        </Link>
        
        {/* Wishlist Button - Added slide-up animation (translate-y-4 to translate-y-0) */}
        <button 
          className="absolute bottom-5 left-1/2 -translate-x-1/2 translate-y-4 bg-[#EFE9E1] p-3 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)] opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out hover:bg-[#72383D] hover:text-[#EFE9E1] text-[#322D29] z-20"
          title="Add to Wishlist"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Product Details Section */}
      <div className="flex flex-col flex-grow px-1">
        {/* Title - Auto changes to burgundy on parent card hover */}
        <Link to={`/product/${product.id}`}>
          <h3 className="text-[15px] font-semibold text-[#322D29] mb-1.5 line-clamp-2 min-h-[44px] leading-snug transition-colors duration-300 group-hover:text-[#72383D]">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-3 text-sm">
          <div className="flex text-[#AC9C8D] text-base leading-none tracking-tight">
            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          </div>
          <span className="font-semibold text-[#AC9C8D] ml-1.5 text-[13px]">5</span>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline space-x-2 mb-2">
          <span className="font-bold text-[#322D29] text-[15px]">
            Rs. {product.discount_price ? product.discount_price.toFixed(2) : product.price.toFixed(2)}
          </span>
          {product.discount_price && (
            <span className="text-[#AC9C8D] line-through text-[13px]">
              Rs. {product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* EMI Structure */}
        <div className="flex items-center text-[13px] text-[#AC9C8D] mb-5 space-x-1.5">
          <span>or <span className="font-semibold text-[#322D29]">₹200</span>/month</span>
          <button className="border border-[#D1C7BD] px-2 py-0.5 text-[10px] font-bold text-[#AC9C8D] bg-transparent hover:bg-[#D1C7BD] hover:text-[#322D29] transition-colors rounded-sm uppercase tracking-wide">
            Buy on EMI
          </button>
        </div>

        {/* Size Variants */}
        <div className="flex items-center space-x-2 mb-5 mt-auto">
          <button 
            onClick={(e) => { e.preventDefault(); setSelectedSize("100ML"); }}
            className={`border px-4 py-1.5 text-[11px] font-medium tracking-wider transition-colors ${
              selectedSize === "100ML" ? "border-[#322D29] text-[#322D29] font-semibold bg-[#D1C7BD]/20" : "border-[#D1C7BD] text-[#AC9C8D] hover:border-[#322D29]"
            }`}
          >
            100ML
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); setSelectedSize("15 ML"); }}
            className={`border px-4 py-1.5 text-[11px] font-medium tracking-wider transition-colors ${
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
          className="w-full bg-[#322D29] text-[#EFE9E1] py-3.5 px-4 text-xs font-semibold tracking-widest hover:bg-[#72383D] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase mt-auto"
        >
          {product.stock === 0 ? 'Out of Stock' : 'ADD TO CART'}
        </button>
      </div>
    </div>
  );
}