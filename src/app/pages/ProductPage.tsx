import { useState } from "react";
import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Minus, Plus, Heart, ShieldCheck, Droplets, Leaf, Star, Share2, Upload } from "lucide-react";
import apiClient from "../../api/client";
import { useStore } from "../../store/useStore";
import { Product } from "../../types";

export default function ProductPage() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("100ML");
  const [adding, setAdding] = useState(false);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  
  // FIX: Moved hooks to the top before any conditional returns
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  
  const addToCart = useStore(state => state.addToCart);

  // Fetch Current Product
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await apiClient.get<{ data: Product }>(`/products/${id}`);
      return res.data.data;
    }
  });

  // Fetch Suggested Products (Mocking related products)
  const { data: suggestedProducts } = useQuery({
    queryKey: ['products', 'suggested'],
    queryFn: async () => {
      const res = await apiClient.get<{ data: Product[] }>('/products');
      return res.data.data.slice(0, 4);
    }
  });

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    await addToCart(product, quantity);
    setAdding(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-12 flex flex-col lg:flex-row gap-12 animate-pulse bg-[#EFE9E1] min-h-screen">
        <div className="w-full lg:w-3/5 flex gap-4">
           <div className="hidden md:block w-24 bg-[#D1C7BD]/40 h-full"></div>
           <div className="flex-1 aspect-[4/5] bg-[#D1C7BD]/40"></div>
        </div>
        <div className="w-full lg:w-2/5 space-y-6">
          <div className="h-12 bg-[#D1C7BD]/40 w-3/4"></div>
          <div className="h-6 bg-[#D1C7BD]/40 w-1/4"></div>
          <div className="h-32 bg-[#D1C7BD]/40 w-full mt-12"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-32 bg-[#EFE9E1] min-h-screen">
        <h2 className="text-3xl font-serif text-[#322D29] mb-4">Product not found</h2>
        <Link to="/shop" className="text-[#72383D] hover:text-[#322D29] border-b border-[#72383D] hover:border-[#322D29] transition-colors pb-1 uppercase tracking-widest text-sm font-bold">
          Return to Shop
        </Link>
      </div>
    );
  }

  // Gallery Images: First is product image, rest are static aesthetic placeholders for now
  const galleryImages = [
    product.images[0],
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzwDE_JdI0fxQ7Z7CDvR6TIUBDvT_EMjY9mdCtze_u3w&s=10",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPBGdjRycoZyCEfL8bTu6qRSA16Qcb8k7qIlV6yz12aw&s=10",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVMoUL3smRbUk166Ry-GVwcPhfBhnegXy7hL7moRD2LQ&s=10"
  ];

  return (
    <div className="w-full bg-[#EFE9E1] text-[#322D29] font-sans selection:bg-[#72383D] selection:text-[#EFE9E1]">
      
      {/* 1. TOP TITLE & BREADCRUMBS */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-6 text-center">
        <h1 className="text-3xl md:text-5xl font-serif text-[#322D29] mb-3 md:mb-4 tracking-wide leading-tight">
          {product.name}
        </h1>
        <div className="flex items-center justify-center space-x-2 text-sm md:text-base">
          <div className="flex text-[#D1C7BD] text-lg">
            <Star className="w-4 h-4 fill-[#322D29] text-[#322D29]" />
            <Star className="w-4 h-4 fill-[#322D29] text-[#322D29]" />
            <Star className="w-4 h-4 fill-[#322D29] text-[#322D29]" />
            <Star className="w-4 h-4 fill-[#322D29] text-[#322D29]" />
            <Star className="w-4 h-4 fill-[#322D29] text-[#322D29]" />
          </div>
          <span className="text-xs text-[#AC9C8D] font-medium tracking-widest uppercase">(45)</span>
        </div>
      </div>

      {/* Breadcrumb Row */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-4 flex justify-between items-center border-b border-[#D1C7BD]/50 mb-8 md:mb-12">
        <nav className="flex items-center text-[10px] md:text-xs text-[#AC9C8D] uppercase tracking-widest font-semibold">
          <Link to="/" className="hover:text-[#322D29] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 mx-2" />
          <Link to="/shop" className="hover:text-[#322D29] transition-colors">Shop</Link>
          {product.category && (
            <>
              <ChevronRight className="w-3 h-3 mx-2" />
              <Link to={`/shop?category=${product.category.slug}`} className="hover:text-[#322D29] transition-colors">
                {product.category.name}
              </Link>
            </>
          )}
        </nav>
        <div className="flex space-x-4">
           <button className="text-[#322D29] hover:text-[#72383D] transition-colors"><Heart className="w-5 h-5" /></button>
           <button className="text-[#322D29] hover:text-[#72383D] transition-colors"><Share2 className="w-5 h-5" /></button>
        </div>
      </div>

      {/* 2. MAIN PRODUCT AREA (Gallery Left, Details Right) */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-20 md:mb-32">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          
          {/* Left: Product Image Gallery */}
          {/* Mobile: col-reverse puts thumbnails below main image. Desktop: row puts thumbnails left. */}
          <div className="w-full lg:w-3/5 flex flex-col-reverse md:flex-row gap-3 md:gap-4 lg:h-[700px]">
            
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto w-full md:w-24 shrink-0 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {galleryImages.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`relative w-20 h-24 md:w-full md:h-32 shrink-0 snap-start transition-all duration-300 overflow-hidden ${
                    selectedImageIdx === idx 
                      ? 'border-2 border-[#322D29] opacity-100' 
                      : 'border border-[#D1C7BD] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Active Image */}
            <div className="flex-1 bg-[#FFFFFF] border border-[#D1C7BD] overflow-hidden relative group aspect-[4/5] md:aspect-auto md:h-full">
              <img 
                key={selectedImageIdx} // Re-renders on change to re-trigger animations if needed
                src={galleryImages[selectedImageIdx]} 
                alt={`${product.name} main view`}
                className="w-full h-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-105"
              />
            </div>
          </div>

          {/* Right: Sticky Details */}
          <div className="w-full lg:w-2/5">
            <div className="sticky top-28 flex flex-col">
              
              {/* Viewing Banner */}
              <div className="bg-[#EFE9E1] border border-[#D1C7BD] p-3 mb-6 flex items-center shadow-sm">
                <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse mr-3"></div>
                <span className="text-xs md:text-sm font-semibold tracking-wide">24 people are looking at this right now</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                 {product.discount_price ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-xl md:text-2xl font-bold text-[#322D29]">Rs. {product.discount_price.toFixed(2)}</span>
                    <span className="text-sm md:text-base text-[#AC9C8D] line-through">Rs. {product.price.toFixed(2)}</span>
                    <span className="bg-[#72383D] text-[#EFE9E1] text-[10px] font-bold px-2 py-1 uppercase tracking-widest">Sale</span>
                  </div>
                ) : (
                  <span className="text-xl md:text-2xl font-bold text-[#322D29]">Rs. {product.price.toFixed(2)}</span>
                )}
                <p className="text-[10px] md:text-xs text-[#AC9C8D] mt-2 uppercase tracking-widest">Tax included. Shipping calculated at checkout.</p>
              </div>

              {/* Key Ingredients Visuals */}
              <div className="mb-8">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-[#AC9C8D]">Key Ingredients</h3>
                <div className="flex gap-3">
                  {["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjnruTwOrlmmdx60Hg_lakvOqHXXrrGljGqy8tdnuKcWgkiSrvBaStAVXVL1hmpxAPrb_cSf7vigi-fL49buXGpMrbOP3QbVgCEoQJWjlm&s=10", "https://www.bhg.com/thmb/7z_YYtg7GNInWI1VcUQcX0tHnro=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/blooming-light-pink-roses-00866f008bac4418a48b8d9a63b3cb0a.jpg", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA42ltJsqu9ZoKbbe9GMuPi3VcmS4Ts4EUdcgX9LVzRg&s=10"].map((src, i) => (
                    <div key={i} className="w-14 h-14 rounded-full overflow-hidden border border-[#D1C7BD]">
                      <img src={src} className="w-full h-full object-cover" alt="Ingredient" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="mb-8">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-[#AC9C8D]">Size: <span className="text-[#322D29]">{selectedSize}</span></h3>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => setSelectedSize("100ML")}
                    className={`px-6 md:px-8 py-2.5 md:py-3 text-[10px] md:text-xs font-bold tracking-widest uppercase transition-colors border ${
                      selectedSize === "100ML" ? "border-[#322D29] bg-[#322D29] text-[#EFE9E1]" : "border-[#D1C7BD] text-[#322D29] hover:border-[#322D29]"
                    }`}
                  >
                    100 ML
                  </button>
                  <button 
                    onClick={() => setSelectedSize("15ML")}
                    className={`px-6 md:px-8 py-2.5 md:py-3 text-[10px] md:text-xs font-bold tracking-widest uppercase transition-colors border ${
                      selectedSize === "15ML" ? "border-[#322D29] bg-[#322D29] text-[#EFE9E1]" : "border-[#D1C7BD] text-[#322D29] hover:border-[#322D29]"
                    }`}
                  >
                    15 ML
                  </button>
                  <button 
                    onClick={() => setSelectedSize("5ML")}
                    className={`px-6 md:px-8 py-2.5 md:py-3 text-[10px] md:text-xs font-bold tracking-widest uppercase transition-colors border ${
                      selectedSize === "5ML" ? "border-[#322D29] bg-[#322D29] text-[#EFE9E1]" : "border-[#D1C7BD] text-[#322D29] hover:border-[#322D29]"
                    }`}
                  >
                    5 ML
                  </button>
                </div>
              </div>

              {/* Add to Cart & Buy Now */}
              <div className="space-y-3 mb-8">
                <div className="flex gap-3 h-12 md:h-14">
                  <div className="flex items-center border border-[#322D29] w-28 md:w-32 bg-transparent">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex-1 h-full flex items-center justify-center text-[#322D29] hover:bg-[#D1C7BD]/30 transition-colors">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="flex-1 text-center font-bold text-sm">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="flex-1 h-full flex items-center justify-center text-[#322D29] hover:bg-[#D1C7BD]/30 transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button 
                    onClick={handleAddToCart}
                    disabled={adding || product.stock === 0}
                    className="flex-1 bg-transparent border border-[#322D29] text-[#322D29] text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#322D29] hover:text-[#EFE9E1] transition-all disabled:opacity-50"
                  >
                    {product.stock === 0 ? 'Sold Out' : adding ? 'Adding...' : 'Add to Cart'}
                  </button>
                </div>
                <button className="w-full h-12 md:h-14 bg-[#322D29] text-[#EFE9E1] text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#72383D] transition-colors">
                  Buy It Now
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 py-6 border-y border-[#D1C7BD]/50 mb-8 text-center">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-[#72383D]" />
                  <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-semibold">Premium Quality</span>
                </div>
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Droplets className="w-5 h-5 md:w-6 md:h-6 text-[#72383D]" />
                  <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-semibold">Long Lasting</span>
                </div>
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Leaf className="w-5 h-5 md:w-6 md:h-6 text-[#72383D]" />
                  <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-semibold">Cruelty Free</span>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-sm text-[#322D29]/80 font-light leading-relaxed">
                <p>{product.description}</p>
                <p className="mt-4 font-medium text-[#322D29]">Perfect for: Evening wear, special occasions, making a lasting impression.</p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* 3. ESSENCE OF TROPICAL LUXURY (Cinematic Banner) */}
      <div className="w-full py-20 md:py-32 bg-[#EFE9E1] border-t border-[#D1C7BD]/40">
        <div className="text-center mb-10 md:mb-16 px-4">
          <h2 className="text-3xl md:text-5xl font-serif text-[#322D29] mb-4">Essence of Luxury</h2>
          <p className="text-[10px] md:text-xs text-[#AC9C8D] uppercase tracking-[0.2em] max-w-2xl mx-auto leading-relaxed">
            Experience an unforgettable journey curated with the rarest ingredients sourced from the global capitals of perfumery.
          </p>
        </div>
        <div className="w-full h-[40vh] md:h-[80vh] bg-[#322D29] relative">
          <img 
            src="https://images.unsplash.com/photo-1591892212776-a09de24dbe84?auto=format&fit=crop&q=80&w=2500" 
            alt="Cinematic Vibe" 
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#EFE9E1] via-transparent to-transparent opacity-50"></div>
        </div>
      </div>

      {/* 4. YOU MAY ALSO LIKE (Grid) */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-32">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-[#322D29]">You may also like</h2>
        </div>
        <div className="flex overflow-x-auto md:grid md:grid-cols-4 gap-4 md:gap-x-6 gap-y-10 pb-6 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {suggestedProducts?.map(p => (
            <div key={p.id} className="w-[80vw] sm:w-[45vw] md:w-auto flex-shrink-0 snap-start">
               <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>

      {/* 5. CUSTOMER REVIEWS & FORM */}
      <div className="bg-[#FFFFFF] py-16 md:py-32 border-t border-[#D1C7BD]/40" id="reviews-section">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-serif text-[#322D29] text-center mb-12 md:mb-16">Customer Reviews</h2>
          
          {/* Review Summary Top Header */}
          <div className="flex flex-col md:flex-row items-center justify-between bg-[#EFE9E1]/50 p-6 md:p-8 border border-[#D1C7BD] mb-4 gap-y-8">
            
            <div className="text-center md:text-left">
              <div className="flex text-[#322D29] text-xl justify-center md:justify-start mb-2">
                <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-sm font-bold text-[#322D29]">5.00 out of 5</p>
              <p className="text-xs text-[#AC9C8D]">Based on 4 reviews</p>
            </div>

            {/* Rating Bars */}
            <div className="flex-1 w-full max-w-sm mx-auto px-0 md:px-12 space-y-2">
              {[ {stars: 5, count: 4}, {stars: 4, count: 0}, {stars: 3, count: 0}, {stars: 2, count: 0}, {stars: 1, count: 0} ].map(row => (
                <div key={row.stars} className="flex items-center text-xs">
                  <span className="w-12 text-[#322D29] flex items-center">{row.stars} <Star className="w-3 h-3 ml-1" /></span>
                  <div className="flex-1 h-2 bg-[#D1C7BD]/30 mx-3 rounded-full overflow-hidden">
                    <div className="h-full bg-[#72383D]" style={{ width: row.count > 0 ? '100%' : '0%' }}></div>
                  </div>
                  <span className="w-6 text-right text-[#AC9C8D]">{row.count}</span>
                </div>
              ))}
            </div>

            <div className="text-center md:text-right">
              <button 
                onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                className={`px-6 md:px-8 py-3 md:py-3.5 text-xs uppercase tracking-widest font-bold transition-colors ${
                  isReviewFormOpen 
                  ? "bg-[#D1C7BD] text-[#322D29] hover:bg-[#AC9C8D]" 
                  : "bg-[#322D29] text-[#EFE9E1] hover:bg-[#72383D]"
                }`}
              >
                {isReviewFormOpen ? 'Cancel review' : 'Write a Review'}
              </button>
            </div>
          </div>

          {/* Expandable Review Form */}
          <div 
            className={`transition-all duration-700 ease-in-out overflow-hidden ${
              isReviewFormOpen ? 'max-h-[1500px] opacity-100 mb-16' : 'max-h-0 opacity-0 mb-0'
            }`}
          >
            <div className="max-w-2xl mx-auto pt-8 border-t border-[#D1C7BD]/50">
              <h3 className="text-xl font-bold text-[#322D29] text-center mb-6">Write a review</h3>

              {/* Interactive Rating */}
              <div className="flex flex-col items-center mb-6">
                <span className="text-xs text-[#AC9C8D] mb-2 uppercase tracking-widest">Rating</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star 
                        className={`w-8 h-8 transition-colors duration-200 ${
                          star <= (hoverRating || rating) 
                            ? 'fill-[#72383D] text-[#72383D]' 
                            : 'fill-transparent text-[#D1C7BD]'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsReviewFormOpen(false); }}>
                <div>
                  <label className="block text-[11px] text-[#AC9C8D] text-center mb-2">Review Title</label>
                  <input 
                    type="text" 
                    placeholder="Give your review a title" 
                    className="w-full bg-transparent border border-[#D1C7BD] p-3 text-sm text-[#322D29] focus:outline-none focus:border-[#72383D] transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-[11px] text-[#AC9C8D] text-center mb-2">Review content (1500)</label>
                  <textarea 
                    rows={4} 
                    placeholder="Start writing here..." 
                    className="w-full bg-transparent border border-[#D1C7BD] p-3 text-sm text-[#322D29] focus:outline-none focus:border-[#72383D] transition-colors resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-[11px] text-[#AC9C8D] text-center mb-2">Picture/Video (optional)</label>
                  <div className="w-24 h-24 mx-auto border-2 border-dashed border-[#D1C7BD] flex items-center justify-center cursor-pointer hover:bg-[#D1C7BD]/10 transition-colors group">
                    <Upload className="w-6 h-6 text-[#AC9C8D] group-hover:text-[#72383D] transition-colors" />
                  </div>
                </div>

                <div>
                  <input 
                    type="text" 
                    placeholder="YouTube URL" 
                    className="w-full bg-transparent border border-[#D1C7BD] p-3 text-sm text-[#322D29] focus:outline-none focus:border-[#72383D] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#AC9C8D] text-center mb-2">Display name (displayed publicly like John Smith)</label>
                  <input 
                    type="text" 
                    placeholder="Display name" 
                    className="w-full bg-transparent border border-[#D1C7BD] p-3 text-sm text-[#322D29] focus:outline-none focus:border-[#72383D] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#AC9C8D] text-center mb-2">Email address</label>
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="w-full bg-transparent border border-[#D1C7BD] p-3 text-sm text-[#322D29] focus:outline-none focus:border-[#72383D] transition-colors"
                  />
                </div>

                <p className="text-[10px] text-[#AC9C8D] text-center leading-relaxed mt-4 px-4">
                  How we use your data: We'll only contact you about the review you left, and only if necessary. By submitting your review, you agree to Judge.me's terms, privacy and content policies.
                </p>

                <div className="flex justify-center items-center space-x-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsReviewFormOpen(false)} 
                    className="border border-[#322D29] text-[#322D29] px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-[#D1C7BD]/20 transition-colors"
                  >
                    Cancel review
                  </button>
                  <button 
                    type="submit"
                    className="bg-[#72383D] text-[#EFE9E1] px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-[#322D29] transition-colors"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-8 md:space-y-10 mt-8">
            {[
              { name: "Sarah M.", date: "12 Oct 2023", title: "Absolutely Divine!", text: "This fragrance lasts all day and I get so many compliments. The dry down is incredible." },
              { name: "Priya K.", date: "05 Sep 2023", title: "My new signature scent", text: "I was hesitant to buy perfume online, but this exceeded all expectations. It's sophisticated and not overpowering." }
            ].map((review, i) => (
              <div key={i} className="border-b border-[#D1C7BD]/50 pb-8 md:pb-10">
                <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-3 md:mb-4 gap-y-2">
                  <div>
                    <div className="flex text-[#322D29] mb-2">
                      <Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" />
                    </div>
                    <span className="font-bold text-[#322D29] text-sm flex items-center">
                      {review.name} <span className="ml-2 px-1.5 py-0.5 bg-[#D1C7BD]/30 text-[9px] uppercase tracking-widest text-[#72383D] rounded-sm">Verified</span>
                    </span>
                  </div>
                  <span className="text-xs text-[#AC9C8D]">{review.date}</span>
                </div>
                <h4 className="font-bold text-[#322D29] mb-2">{review.title}</h4>
                <p className="text-sm text-[#322D29]/80 leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}

// -------------------------------------------------------------
// Reusable Product Card Component (For "You May Also Like")
// -------------------------------------------------------------
function ProductCard({ product }: { product: Product }) {
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
      <div className="relative aspect-square bg-[#FFFFFF] mb-4 md:mb-5 overflow-hidden border border-[#D1C7BD] transition-all duration-500 group-hover:border-[#72383D]/40 group-hover:shadow-[0_10px_30px_rgba(50,45,41,0.12)]">
        <div className="absolute inset-0 bg-[#322D29]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110" />
        </Link>
        <button className="absolute bottom-3 left-1/2 md:bottom-5 md:left-1/2 -translate-x-1/2 translate-y-4 bg-[#EFE9E1] p-2.5 md:p-3 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.1)] opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out hover:bg-[#72383D] hover:text-[#EFE9E1] text-[#322D29] z-20">
          <Heart className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>
      </div>

      <div className="flex flex-col flex-grow px-1">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-[14px] md:text-[15px] font-semibold text-[#322D29] mb-1.5 line-clamp-2 min-h-[40px] md:min-h-[44px] leading-snug hover:text-[#72383D] transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-center space-x-1 mb-2 md:mb-3 text-sm">
          <div className="flex text-[#AC9C8D] text-sm md:text-base leading-none">
            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
          </div>
          <span className="font-semibold text-[#AC9C8D] ml-1.5 text-[12px] md:text-[13px]">5</span>
        </div>
        <div className="flex items-baseline space-x-2 mb-4">
          <span className="font-bold text-[#322D29] text-[14px] md:text-[15px]">
            Rs. {product.discount_price ? product.discount_price.toFixed(2) : product.price.toFixed(2)}
          </span>
          {product.discount_price && <span className="text-[#AC9C8D] line-through text-[12px] md:text-[13px]">Rs. {product.price.toFixed(2)}</span>}
        </div>
        
        <div className="flex items-center space-x-2 mb-4 md:mb-5 mt-auto">
          <button onClick={(e) => { e.preventDefault(); setSelectedSize("100ML"); }} className={`border px-3 py-1.5 flex-1 text-center text-[10px] md:text-[11px] font-medium tracking-wider transition-colors ${selectedSize === "100ML" ? "border-[#322D29] text-[#322D29] bg-[#D1C7BD]/20 font-semibold" : "border-[#D1C7BD] text-[#AC9C8D]"}`}>100ML</button>
          <button onClick={(e) => { e.preventDefault(); setSelectedSize("15ML"); }} className={`border px-3 py-1.5 flex-1 text-center text-[10px] md:text-[11px] font-medium tracking-wider transition-colors ${selectedSize === "15ML" ? "border-[#322D29] text-[#322D29] bg-[#D1C7BD]/20 font-semibold" : "border-[#D1C7BD] text-[#AC9C8D]"}`}>15 ML</button>
        </div>
        
        <button onClick={handleAddToCart} disabled={product.stock === 0} className="w-full bg-[#322D29] text-[#EFE9E1] py-3 md:py-3.5 text-[10px] md:text-xs font-semibold tracking-widest hover:bg-[#72383D] uppercase transition-colors disabled:opacity-50 mt-auto">
          {product.stock === 0 ? 'Out of Stock' : 'ADD TO CART'}
        </button>
      </div>
    </div>
  );
}