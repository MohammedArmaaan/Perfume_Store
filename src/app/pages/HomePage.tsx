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

  // Auto-scroll logic for Hero Banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 6000); // Changes slide every 6 seconds
    return () => clearInterval(timer);
  }, [heroBanners.length]);

  return (
    <div className="w-full bg-gray-50">
      
      {/* Auto-Sliding Hero Section with Premium Fade & Animation Effects */}
      <section className="relative h-[85vh] w-full overflow-hidden bg-[#0a0a0a]">
        {heroBanners.map((banner, index) => {
          const isActive = index === currentSlide;
          
          return (
            <div 
              key={index} 
              className={`absolute inset-0 w-full h-full flex items-center justify-center transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Background Image with Slow Zoom (Ken Burns Effect) */}
              <div className="absolute inset-0 overflow-hidden">
                <img 
                  src={banner.image} 
                  alt="Luxury perfume" 
                  className={`w-full h-full object-cover mix-blend-overlay transition-transform duration-[10s] ease-out ${
                    isActive ? "scale-105 opacity-50" : "scale-100 opacity-0"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent opacity-90"></div>
              </div>
              
              {/* Staggered Animated Text Content */}
              <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <span 
                  className={`text-gray-300 text-sm uppercase tracking-[0.3em] mb-6 block transition-all duration-700 ease-out ${
                    isActive ? "translate-y-0 opacity-100 delay-300" : "translate-y-4 opacity-0 delay-0"
                  }`}
                >
                  {banner.span}
                </span>
                
                <h1 
                  className={`text-5xl md:text-7xl text-white mb-8 uppercase tracking-widest font-serif leading-tight transition-all duration-700 ease-out ${
                    isActive ? "translate-y-0 opacity-100 delay-500" : "translate-y-4 opacity-0 delay-0"
                  }`}
                >
                  {banner.title}
                </h1>
                
                <p 
                  className={`text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light leading-relaxed transition-all duration-700 ease-out ${
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
                    className="inline-flex items-center justify-center bg-white text-black px-10 py-4 text-sm uppercase tracking-[0.2em] font-medium hover:bg-gray-200 transition-all hover:scale-105 duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)]"
                  >
                    Explore Collection <ArrowRight className="ml-3 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Interactive Scroll Indicators */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-3 z-20">
          {heroBanners.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-500 ${
                i === currentSlide ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Scrolling Marquee Banner */}
      <div className="w-full bg-[#0a0a0a] border-y border-gray-800 py-3 overflow-hidden flex relative z-20">
        <div className="animate-marquee whitespace-nowrap flex items-center">
          <span className="text-gray-300 text-xs uppercase tracking-widest mx-8 flex items-center"><Star className="w-3 h-3 mr-2 inline" /> Complimentary samples with every order</span>
          <span className="text-gray-300 text-xs uppercase tracking-widest mx-8 flex items-center"><Star className="w-3 h-3 mr-2 inline" /> Free express shipping over $150</span>
          <span className="text-gray-300 text-xs uppercase tracking-widest mx-8 flex items-center"><Star className="w-3 h-3 mr-2 inline" /> Crafted in Grasse, France</span>
          <span className="text-gray-300 text-xs uppercase tracking-widest mx-8 flex items-center"><Star className="w-3 h-3 mr-2 inline" /> Signature velvet packaging</span>
          <span className="text-gray-300 text-xs uppercase tracking-widest mx-8 flex items-center"><Star className="w-3 h-3 mr-2 inline" /> Complimentary samples with every order</span>
          <span className="text-gray-300 text-xs uppercase tracking-widest mx-8 flex items-center"><Star className="w-3 h-3 mr-2 inline" /> Free express shipping over $150</span>
          <span className="text-gray-300 text-xs uppercase tracking-widest mx-8 flex items-center"><Star className="w-3 h-3 mr-2 inline" /> Crafted in Grasse, France</span>
          <span className="text-gray-300 text-xs uppercase tracking-widest mx-8 flex items-center"><Star className="w-3 h-3 mr-2 inline" /> Signature velvet packaging</span>
        </div>
      </div>

      {/* Featured Fragrances - The Signature Collection */}
      <section className="py-24 bg-white relative">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gray-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <span className="text-gray-500 text-xs uppercase tracking-widest mb-2 block animate-pulse font-medium">Curated Selection</span>
              <h2 className="text-4xl font-serif text-gray-900 mb-4">The Signature Collection</h2>
              <p className="text-gray-600">Our most celebrated and sought-after fragrances, embodying the pinnacle of olfactory craftsmanship.</p>
            </div>
            <Link to="/shop" className="text-sm uppercase tracking-widest text-gray-900 hover:text-gray-600 flex items-center shrink-0 border-b border-gray-900 pb-1 hover:pr-2 transition-all duration-300 font-semibold">
              View All Signatures <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {[...Array(4)].map((_, i) => <div key={i} className="w-full aspect-square bg-gray-100 animate-pulse rounded-md"></div>)}
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
      <section className="py-24 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-gray-900 mb-4">Shop by Category</h2>
            <div className="w-16 h-px bg-gray-400 mx-auto mt-6"></div>
          </div>

          {loadingCategories ? (
            <div className="flex justify-center"><div className="animate-pulse w-full h-96 bg-gray-200"></div></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories?.map((category) => (
                <Link 
                  key={category.id} 
                  to={`/shop?category=${category.slug}`}
                  className="group relative h-[500px] overflow-hidden block rounded-sm shadow-md hover:shadow-xl transition-shadow duration-500"
                >
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-500 group-hover:opacity-80"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-10 flex flex-col items-center justify-center text-center">
                    <h3 className="text-3xl text-white font-serif tracking-widest uppercase mb-3 transform transition-transform duration-500 group-hover:-translate-y-2">{category.name}</h3>
                    <p className="text-gray-200 text-sm mb-6 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 transform translate-y-4 group-hover:translate-y-0">
                      {category.description}
                    </p>
                    <span className="text-white text-xs tracking-widest uppercase border border-white/50 px-6 py-3 opacity-0 group-hover:opacity-100 group-hover:border-white transition-all duration-500 delay-200 hover:bg-white hover:text-black">
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
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/3 translate-y-1/3"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-gray-900 mb-4">New Arrivals</h2>
            <p className="text-gray-600">The latest expressions of modern perfumery.</p>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {[...Array(4)].map((_, i) => <div key={i} className="w-full aspect-square bg-gray-100 animate-pulse rounded-md"></div>)}
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
      <section className="py-24 bg-[#0a0a0a] text-white relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-full lg:w-1/2 h-full opacity-30 lg:opacity-60 transition-transform duration-[10s] group-hover:scale-105">
          <img 
            src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1200" 
            alt="Gifting" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0a0a0a] to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:w-1/2 lg:pr-16 py-12">
            <h2 className="text-4xl md:text-5xl font-serif mb-6 uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">The Art of Gifting</h2>
            <p className="text-gray-300 text-lg mb-8 font-light leading-relaxed">
              Every Aura fragrance is meticulously packaged in our signature luxury wrapping, ensuring an unforgettable unboxing experience. Give the gift of timeless elegance.
            </p>
            <ul className="space-y-4 mb-10 text-gray-300">
              <li className="flex items-center hover:text-white transition-colors duration-300"><Star className="w-5 h-5 mr-3 text-gray-400"/> Complimentary Engraving</li>
              <li className="flex items-center hover:text-white transition-colors duration-300"><Star className="w-5 h-5 mr-3 text-gray-400"/> Luxury Velvet Packaging</li>
              <li className="flex items-center hover:text-white transition-colors duration-300"><Star className="w-5 h-5 mr-3 text-gray-400"/> Personalized Note Cards</li>
            </ul>
            <Link 
              to="/shop" 
              className="inline-block border border-gray-400 text-white px-8 py-4 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              Shop Gifts
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-gray-900 mb-4">Trending Now</h2>
            <p className="text-gray-600">Discover what others are falling in love with.</p>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {[...Array(8)].map((_, i) => <div key={i} className="w-full aspect-square bg-gray-100 animate-pulse rounded-md"></div>)}
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
              className="inline-block bg-[#1c1c1c] text-white px-10 py-4 text-sm font-medium uppercase tracking-widest hover:bg-black transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
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
// Reusable Product Card Component (Refined exactly to match image_c5a4a9.jpg)
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
    <div className="flex flex-col group w-full font-sans text-left relative bg-white">
      {/* Optional Badge Support */}
      {badge && (
        <span className="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur text-gray-900 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 shadow-sm">
          {badge}
        </span>
      )}
      
      {/* Image Section with Hover Heart Icon */}
      <div className="relative aspect-square bg-gray-50 mb-4 overflow-hidden border border-gray-100 group/image">
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