import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { ArrowRight, Star, Heart, CheckCircle2, ShieldCheck, Leaf, Droplets, Play } from "lucide-react";
import apiClient from "../../api/client";
import { useStore } from "../../store/useStore";
import { Product, Category } from "../../types";

// -------------------------------------------------------------
// Scroll Animation Wrapper
// -------------------------------------------------------------
function FadeIn({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    
    if (domRef.current) observer.observe(domRef.current);
    return () => {
      if (domRef.current) observer.unobserve(domRef.current);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-[1200ms] ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// -------------------------------------------------------------
// Main HomePage Component
// -------------------------------------------------------------
export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: products, isLoading: loadingProducts } = useQuery({
    queryKey: ['products', 'all'],
    queryFn: async () => {
      const res = await apiClient.get<{ data: Product[] }>('/products');
      return res.data.data;
    }
  });

  // Fallback empty arrays if products are loading
  const bestSellers = products?.slice(0, 4) || [];
  const blends = products?.slice(4, 8) || [];
  const mensCollection = products?.slice(8, 11) || [];
  const gifting = products?.slice(12, 16) || [];

  // Hero Banners Data
  const heroBanners = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=2000",
      span: "Limited Time Offer",
      titleMain: "FREE",
      titleHighlight: "Discovery Set",
      subtitlePrefix: "On Orders Above",
      subtitleHighlight: "₹1499",
      cta: "Claim Yours",
      link: "/shop"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1611242956059-53e4c29e6b22?auto=format&fit=crop&q=80&w=800",
      span: "New Arrivals",
      titleMain: "The Signature",
      titleHighlight: "Collection",
      subtitlePrefix: "Experience luxury that speaks",
      subtitleHighlight: "without words.",
      cta: "Explore Now",
      link: "/shop"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1591892212776-a09de24dbe84?auto=format&fit=crop&q=80&w=800",
      span: "Exclusive",
      titleMain: "The Art Of",
      titleHighlight: "Gifting",
      subtitlePrefix: "Make every moment",
      subtitleHighlight: "unforgettable.",
      cta: "Shop Gifts",
      link: "/shop?collection=gifting"
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
    <div className="w-full bg-[#EFE9E1] text-[#322D29] selection:bg-[#72383D] selection:text-[#EFE9E1]">
      
      {/* 1. TOP PROMO BANNER (Auto-Scrolling Slider) */}
      <FadeIn>
        <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden bg-[#322D29]">
          {heroBanners.map((banner, index) => {
            const isActive = index === currentSlide;
            
            return (
              <div 
                key={banner.id}
                className={`absolute inset-0 w-full h-full flex items-center transition-opacity duration-1000 ease-in-out ${
                  isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                {/* Background Image with Cinematic Zoom */}
                <div className="absolute inset-0 overflow-hidden bg-[#322D29]">
                  <img 
                    src={banner.image} 
                    alt="Promo Banner" 
                    className={`w-full h-full object-cover mix-blend-overlay transition-transform duration-[10s] ease-out ${
                      isActive ? "scale-105 opacity-70" : "scale-100 opacity-0"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#322D29]/95 via-[#322D29]/60 to-transparent"></div>
                </div>
                
                {/* Staggered Text Content */}
                <div className="relative z-10 left-8 md:left-24 max-w-xl">
                  <span 
                    className={`text-[#D1C7BD] text-xs md:text-sm uppercase tracking-[0.3em] font-semibold mb-4 block transition-all duration-700 ease-out ${
                      isActive ? "translate-y-0 opacity-100 delay-300" : "translate-y-4 opacity-0 delay-0"
                    }`}
                  >
                    {banner.span}
                  </span>
                  <h1 
                    className={`text-5xl md:text-7xl font-serif text-[#EFE9E1] mb-2 leading-tight transition-all duration-700 ease-out ${
                      isActive ? "translate-y-0 opacity-100 delay-500" : "translate-y-4 opacity-0 delay-0"
                    }`}
                  >
                    {banner.titleMain} <br/>
                    <span className="text-[#AC9C8D]">{banner.titleHighlight}</span>
                  </h1>
                  <p 
                    className={`text-[#D1C7BD] text-lg mb-8 font-light tracking-wide transition-all duration-700 ease-out ${
                      isActive ? "translate-y-0 opacity-100 delay-700" : "translate-y-4 opacity-0 delay-0"
                    }`}
                  >
                    {banner.subtitlePrefix} <span className="font-semibold text-[#EFE9E1]">{banner.subtitleHighlight}</span>
                  </p>
                  <div 
                    className={`transition-all duration-700 ease-out ${
                      isActive ? "translate-y-0 opacity-100 delay-1000" : "translate-y-4 opacity-0 delay-0"
                    }`}
                  >
                    <Link 
                      to={banner.link} 
                      className="inline-block bg-[#EFE9E1] text-[#322D29] px-8 py-3.5 text-sm uppercase tracking-widest font-bold hover:bg-[#D1C7BD] transition-all"
                    >
                      {banner.cta}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Slider Indicators */}
          <div className="absolute bottom-8 left-8 md:left-24 flex gap-3 z-20">
            {heroBanners.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === currentSlide ? "w-8 bg-[#EFE9E1]" : "w-2 bg-[#AC9C8D]/40 hover:bg-[#D1C7BD]"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </section>
      </FadeIn>

      {/* 2. BEST SELLERS GRID */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeader title="Best Sellers" link="/shop" />
          {loadingProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6"><SkeletonGrid count={4} /></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
              {bestSellers.map((p, i) => (
                <FadeIn key={p.id} delay={i * 100}><ProductCard product={p} badge="Bestseller" /></FadeIn>
              ))}
            </div>
          )}
        </FadeIn>
      </section>

      {/* 3. CURATED COLLECTIONS */}
      <section className="py-16 bg-[#D9D9D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionHeader title="Our Curated Collections" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { name: "For Him", img: "https://images.unsplash.com/photo-1591892212776-a09de24dbe84?auto=format&fit=crop&q=80&w=800" },
                { name: "For Her", img: "https://images.unsplash.com/photo-1611242956059-53e4c29e6b22?auto=format&fit=crop&q=80&w=800" },
                { name: "Unisex", img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800" },
                { name: "Signatures", img: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600" }
              ].map((cat, i) => (
                <FadeIn key={i} delay={i * 150}>
                  <Link to="/shop" className="block relative aspect-[3/4] group overflow-hidden border border-[#D1C7BD]">
                    <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#322D29]/90 via-[#322D29]/20 to-transparent"></div>
                    <div className="absolute bottom-6 left-0 right-0 text-center">
                      <h3 className="text-xl md:text-2xl font-serif text-[#EFE9E1] tracking-widest">{cat.name}</h3>
                      <span className="text-xs text-[#D1C7BD] uppercase tracking-widest mt-2 inline-flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                        Explore <ArrowRight className="w-3 h-3 ml-1" />
                      </span>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 4. OUR PERFUME BLENDS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionHeader title="Our Perfume Blends" link="/shop" />
          {loadingProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6"><SkeletonGrid count={4} /></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
              {blends.map((p, i) => (
                <FadeIn key={p.id} delay={i * 100}><ProductCard product={p} /></FadeIn>
              ))}
            </div>
          )}
        </FadeIn>
      </section>

      {/* 5. MID-PAGE BANNER & TRUST BADGES */}
      <section className="w-full">
        <FadeIn>
          <div className="relative w-full h-[50vh] bg-[#322D29] flex items-center justify-center overflow-hidden">
            <img src="https://images.unsplash.com/photo-1591892212776-a09de24dbe84?auto=format&fit=crop&q=80&w=2000" alt="Luxury Experience" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50" />
            <div className="relative z-10 text-center px-4">
              <Star className="w-8 h-8 text-[#72383D] mx-auto mb-6" />
              <h2 className="text-3xl md:text-5xl font-serif text-[#EFE9E1] mb-6 uppercase tracking-[0.2em] max-w-3xl leading-snug">
                Crafted for a <br/><span className="text-[#D1C7BD]">Luxurious Experience</span>
              </h2>
              <Link to="/shop" className="inline-block border border-[#D1C7BD] text-[#EFE9E1] px-10 py-3 text-sm uppercase tracking-widest hover:bg-[#72383D] hover:border-[#72383D] transition-colors">
                Shop The Collection
              </Link>
            </div>
          </div>
          
          <div className="bg-[#1A1816] py-8 border-t border-[#322D29]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-[#D1C7BD]">
                <div className="flex flex-col items-center justify-center">
                  <ShieldCheck className="w-6 h-6 mb-3 text-[#AC9C8D]" />
                  <span className="text-xs uppercase tracking-widest font-medium">Premium Quality</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <Droplets className="w-6 h-6 mb-3 text-[#AC9C8D]" />
                  <span className="text-xs uppercase tracking-widest font-medium">Long Lasting</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <Leaf className="w-6 h-6 mb-3 text-[#AC9C8D]" />
                  <span className="text-xs uppercase tracking-widest font-medium">Cruelty Free</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <Star className="w-6 h-6 mb-3 text-[#AC9C8D]" />
                  <span className="text-xs uppercase tracking-widest font-medium">Crafted in France</span>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 6. SPLIT INFO SECTION */}
      <section className="py-24 bg-[#EFE9E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2 relative group">
                <div className="absolute inset-0 bg-[#D1C7BD] translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500"></div>
                <img src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800" alt="Perfume ingredients" className="relative z-10 w-full aspect-[4/3] object-cover border border-[#AC9C8D]" />
              </div>
              <div className="lg:w-1/2">
                <h2 className="text-4xl lg:text-5xl font-serif text-[#322D29] leading-tight mb-6">
                  Why settle for ordinary, when you can experience <span className="text-[#72383D] italic">extraordinary</span>?
                </h2>
                <p className="text-[#AC9C8D] text-lg font-light mb-10 leading-relaxed">
                  Every bottle of Aura is an orchestration of the finest ingredients sourced globally. Masterfully blended to sit intimately on the skin, unraveling unique notes throughout your day.
                </p>
                <ul className="space-y-6 text-[#322D29] font-medium">
                  <li className="flex items-center"><CheckCircle2 className="w-6 h-6 text-[#72383D] mr-4" /> 25% High Perfume Concentration</li>
                  <li className="flex items-center"><CheckCircle2 className="w-6 h-6 text-[#72383D] mr-4" /> Macerated for 60 Days</li>
                  <li className="flex items-center"><CheckCircle2 className="w-6 h-6 text-[#72383D] mr-4" /> Phthalate & Paraben Free</li>
                </ul>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 7. MEN's COLLECTION */}
      <section className="py-20 bg-[#D9D9D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionHeader title="Men's Collection" link="/shop?category=men" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1 relative group overflow-hidden border border-[#D1C7BD] h-full min-h-[400px]">
                <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=800" alt="Men's Fragrance" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#322D29]/90 to-transparent"></div>
                <div className="absolute bottom-8 left-6">
                  <h3 className="text-2xl font-serif text-[#EFE9E1] mb-2">The Alpha</h3>
                  <Link to="/shop?category=men" className="text-xs text-[#D1C7BD] uppercase tracking-widest border-b border-[#D1C7BD] pb-1 hover:text-[#EFE9E1]">
                    Shop Men
                  </Link>
                </div>
              </div>
              
              {loadingProducts ? (
                <SkeletonGrid count={3} />
              ) : (
                mensCollection.map((p, i) => (
                  <FadeIn key={p.id} delay={i * 150}>
                     <ProductCard product={p} />
                  </FadeIn>
                ))
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 8. MOST WISHED FILTERS */}
      <section className="py-20 bg-[#EFE9E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionHeader title="Mood & Atmosphere" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { name: "Woody & Amber", img: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800" },
                { name: "Fresh Citrus", img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800" },
                { name: "Spicy Oriental", img: "https://images.unsplash.com/photo-1611242956059-53e4c29e6b22?auto=format&fit=crop&q=80&w=800" },
                { name: "Floral Musk", img: "https://images.unsplash.com/photo-1591892212776-a09de24dbe84?auto=format&fit=crop&q=80&w=800" }
              ].map((mood, i) => (
                <FadeIn key={i} delay={i * 150}>
                  <Link to="/shop" className="block relative aspect-square group overflow-hidden border border-[#D1C7BD]">
                    <img src={mood.img} alt={mood.name} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" />
                    <div className="absolute inset-0 bg-[#322D29]/40 group-hover:bg-[#322D29]/20 transition-colors duration-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <h3 className="text-xl md:text-2xl text-center font-serif text-[#EFE9E1] tracking-widest">{mood.name}</h3>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 9. INSTAGRAM REELS TESTIMONIAL SECTION */}
      <InstagramReelsSection />

      {/* 10. GIFTING SECTION */}
      <section className="py-20 bg-[#D9D9D9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionHeader title="The Art of Gifting" link="/shop" />
            {loadingProducts ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6"><SkeletonGrid count={4} /></div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                {gifting.map((p, i) => (
                  <FadeIn key={p.id} delay={i * 100}><ProductCard product={p} badge="Gift Set" /></FadeIn>
                ))}
              </div>
            )}
          </FadeIn>
        </div>
      </section>

    </div>
  );
}

// -------------------------------------------------------------
// Instagram Reels Section Component
// -------------------------------------------------------------
function InstagramReelsSection() {
  const reels = [
    {
      id: 1,
      thumbnail: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=600",
      views: "124K",
      handle: "@perfume.junkie"
    },
    {
      id: 2,
      thumbnail: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=600",
      views: "89K",
      handle: "@luxe.scents"
    },
    {
      id: 3,
      thumbnail: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=600",
      views: "210K",
      handle: "@style.by.marc"
    },
    {
      id: 4,
      thumbnail: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&q=80&w=600",
      views: "150K",
      handle: "@fragrance.daily"
    }
  ];

  return (
    <section className="py-24 bg-[#322D29]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-[#EFE9E1] tracking-wide mb-4">
              Loved By The Community
            </h2>
            <p className="text-[#AC9C8D] text-sm uppercase tracking-widest font-medium">
              Join the conversation on Instagram
            </p>
            <div className="w-16 h-px bg-[#72383D] mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {reels.map((reel, i) => (
              <FadeIn key={reel.id} delay={i * 150}>
                <a 
                  href="#" 
                  className="relative block aspect-[9/16] group overflow-hidden border border-[#D1C7BD]/20 bg-[#1A1816] rounded-sm cursor-pointer"
                >
                  <img 
                    src={reel.thumbnail} 
                    alt="Instagram Reel" 
                    className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-luminosity group-hover:mix-blend-normal"
                  />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/40 transition-colors duration-300">
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full text-white group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-6 h-6 fill-current" />
                    </div>
                  </div>

                  {/* Gradient & Meta Info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1816] via-transparent to-transparent opacity-90"></div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-[#EFE9E1]">
                    <span className="text-xs font-medium tracking-wide">{reel.handle}</span>
                    <span className="text-xs font-semibold flex items-center text-[#D1C7BD]">
                      <Play className="w-3 h-3 mr-1" /> {reel.views}
                    </span>
                  </div>
                </a>
              </FadeIn>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// Helper Component: Section Header
// -------------------------------------------------------------
function SectionHeader({ title, link }: { title: string, link?: string }) {
  return (
    <div className="relative flex flex-col items-center justify-center mb-12">
      <h2 className="text-3xl md:text-4xl font-serif text-[#322D29] tracking-wide">{title}</h2>
      <div className="w-16 h-px bg-[#72383D] mt-4 mb-2"></div>
      {link && (
        <Link 
          to={link} 
          className="md:absolute right-0 top-1/2 md:-translate-y-1/2 mt-4 md:mt-0 text-[10px] font-bold uppercase tracking-[0.2em] text-[#322D29] border border-[#AC9C8D] px-5 py-2.5 hover:bg-[#322D29] hover:text-[#EFE9E1] hover:border-[#322D29] transition-all"
        >
          View All
        </Link>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// Helper Component: Skeleton Loading Grid
// -------------------------------------------------------------
function SkeletonGrid({ count }: { count: number }) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="w-full flex flex-col">
          <div className="w-full aspect-square bg-[#D1C7BD]/40 animate-pulse border border-[#AC9C8D]/20 mb-4"></div>
          <div className="h-4 bg-[#D1C7BD]/40 w-3/4 mb-2 animate-pulse"></div>
          <div className="h-3 bg-[#D1C7BD]/40 w-1/2 mb-4 animate-pulse"></div>
          <div className="h-10 bg-[#D1C7BD]/40 w-full mt-auto animate-pulse"></div>
        </div>
      ))}
    </>
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
    <div className="flex flex-col group w-full font-sans text-left relative bg-transparent transition-all duration-500 hover:-translate-y-1.5 cursor-pointer">
      
      {/* Premium Badge */}
      {badge && (
        <span className="absolute top-3 left-3 z-20 bg-[#72383D] text-[#EFE9E1] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 shadow-sm">
          {badge}
        </span>
      )}
      
      {/* Image Section */}
      <div className="relative aspect-square bg-[#FFFFFF] mb-5 overflow-hidden border border-[#D1C7BD] transition-all duration-500 group-hover:border-[#72383D]/40 group-hover:shadow-[0_10px_30px_rgba(50,45,41,0.12)]">
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
          className="absolute bottom-5 left-1/2 -translate-x-1/2 translate-y-4 bg-[#EFE9E1] p-3 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)] opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out hover:bg-[#72383D] hover:text-[#EFE9E1] text-[#322D29] z-20"
          title="Add to Wishlist"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Product Details Section */}
      <div className="flex flex-col flex-grow px-1">
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