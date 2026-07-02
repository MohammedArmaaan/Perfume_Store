import { Outlet, Link, useNavigate } from "react-router";
import { ShoppingBag, Search, Menu, User as UserIcon, X, Heart, ChevronDown } from "lucide-react";
import { useStore } from "../../store/useStore";
import { useState, useEffect } from "react";

// -------------------------------------------------------------
// Page Loader Component (Runs on page reload)
// -------------------------------------------------------------
function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger animations instantly on mount
    setMounted(true);
    
    // Start fading out the loader after 2.2 seconds
    const fadeTimer = setTimeout(() => setIsFadingOut(true), 2200);
    
    // Completely remove the loader from the DOM after 3 seconds
    const removeTimer = setTimeout(() => setIsLoading(false), 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div 
      className={`fixed inset-0 z-[99999] bg-[#EFE9E1] flex flex-col items-center justify-center transition-all duration-[800ms] ease-in-out ${
        isFadingOut ? "opacity-0 -translate-y-8 pointer-events-none" : "opacity-100 translate-y-0"
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Animated Novak Text */}
        <h1 
          className={`font-serif text-4xl md:text-7xl text-[#322D29] uppercase transition-all duration-[2000ms] ease-out ${
            mounted ? "tracking-[0.4em] opacity-100 scale-100 ml-[0.4em]" : "tracking-[0.1em] opacity-0 scale-95"
          }`}
        >
          Novaq
        </h1>
        
        {/* Elegant Thin Progress Line */}
        <div className="w-24 md:w-32 h-[1px] bg-[#D1C7BD]/50 mt-6 md:mt-8 overflow-hidden rounded-full">
          <div 
            className="h-full bg-[#72383D] transition-all duration-[2000ms] ease-out"
            style={{ width: mounted ? "100%" : "0%" }}
          ></div>
        </div>
        
        {/* Subtitle Fade In */}
        <span 
           className={`mt-4 text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-medium text-[#AC9C8D] transition-opacity duration-1000 delay-700 ${
             mounted ? "opacity-100" : "opacity-0"
           }`}
        >
          Luxury Perfumery
        </span>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Main App Layout Component
// -------------------------------------------------------------
export default function AppLayout() {
  const cart = useStore((state) => state.cart);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // States for Smart Header (Hide on scroll down, show on scroll up)
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navigate = useNavigate();

  // Scroll Listener for Smart Header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // If search or mobile menu is open, always keep header visible
      if (isSearchOpen || isMobileMenuOpen) {
        setIsVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      // Hide header if scrolling down and past 100px, otherwise show it
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isSearchOpen, isMobileMenuOpen]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Initial Page Loader */}
      <PageLoader />

      <div className="min-h-screen flex flex-col bg-[#EFE9E1] selection:bg-[#72383D] selection:text-[#EFE9E1] font-sans relative">
        
        {/* ----------------------------- */}
        {/* MAIN HEADER                   */}
        {/* ----------------------------- */}
        <header 
          className={`w-full z-50 sticky top-0 transition-transform duration-300 ease-in-out ${
            isVisible ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          {/* Top Announcement Bar - Dark Theme */}
          <div className="bg-[#322D29] text-[#EFE9E1] text-[9px] sm:text-[10px] md:text-xs text-center uppercase tracking-[0.15em] font-semibold w-full py-2.5 px-2 leading-tight">
            BUY ANY 8 INSPIRED PERFUMES (100ML) FOR JUST ₹7000 ✨
          </div>

          {/* Main Navigation Area - Light Theme */}
          <div className="w-full bg-[#EFE9E1] border-b border-[#D1C7BD]/50 shadow-sm relative z-50">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-6">
              <div className="flex justify-between items-center relative min-h-[50px] md:min-h-[60px]">
                
                {/* Left Side: Mobile Menu & Logo */}
                <div className="flex items-center">
                  <button 
                    className="p-1 -ml-1 mr-2 text-[#322D29] hover:text-[#72383D] transition-colors lg:hidden"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                  
                  <Link to="/" className="flex flex-col items-center md:items-start text-center md:text-left group">
                    <span className="text-xl sm:text-2xl md:text-4xl font-serif tracking-[0.25em] text-[#322D29] group-hover:text-[#72383D] transition-colors uppercase leading-none">
                      Novaq
                    </span>
                    <span className="text-[7px] md:text-[10px] uppercase tracking-[0.3em] font-medium text-[#AC9C8D] mt-1 md:mt-1.5 ml-0.5 md:ml-1">
                      Perfumery
                    </span>
                  </Link>
                </div>

                {/* Center: Inline Search Bar (Toggled) */}
                {isSearchOpen && (
                  <div className="flex flex-1 flex-col justify-center items-center px-4 md:px-12 absolute inset-0 z-10 w-full bg-[#EFE9E1]">
                    <form onSubmit={handleSearchSubmit} className="relative w-full max-w-2xl bg-[#EFE9E1]">
                      <input 
                        type="text" 
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for fragrances..." 
                        className="w-full bg-[#EFE9E1] border border-[#322D29] text-[#322D29] py-2 md:py-2.5 px-3 md:px-4 rounded-[2px] pr-10 focus:outline-none focus:border-[#72383D] focus:ring-1 focus:ring-[#72383D] transition-all placeholder:text-[#AC9C8D] text-sm md:text-base"
                      />
                      <button 
                        type="submit"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#322D29] hover:text-[#72383D] transition-colors"
                      >
                        <Search className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </form>
                    <div className="mt-2 md:mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] md:text-sm text-[#322D29]">
                      <span className="text-[#AC9C8D] hidden sm:block">Popular Searches:</span>
                      <Link to="/shop?search=solid" className="underline hover:text-[#72383D] transition-colors decoration-[#D1C7BD] underline-offset-4">Solid</Link>
                      <Link to="/shop?search=luxe" className="underline hover:text-[#72383D] transition-colors decoration-[#D1C7BD] underline-offset-4">Luxe</Link>
                      <Link to="/shop?search=inspired" className="underline hover:text-[#72383D] transition-colors decoration-[#D1C7BD] underline-offset-4">Inspired</Link>
                    </div>
                  </div>
                )}

                {/* Right Side: Account, Wishlist & Cart */}
                <div className={`flex items-center justify-end space-x-3 sm:space-x-5 md:space-x-6 z-20 bg-[#EFE9E1] ${isSearchOpen ? 'pl-2' : ''}`}>
                  
                  {/* Search Toggle (Hidden when active) */}
                  {!isSearchOpen && (
                    <button 
                      onClick={() => setIsSearchOpen(true)}
                      className="text-[#322D29] hover:text-[#72383D] transition-colors flex items-center space-x-2 p-1"
                      title="Search"
                    >
                      <span className="hidden lg:block text-xs font-semibold uppercase tracking-widest mt-0.5">Search</span>
                      <Search className="w-5 h-5 md:w-5 md:h-5" />
                    </button>
                  )}

                  {!isSearchOpen && <div className="hidden lg:block h-6 w-[1px] bg-[#D1C7BD] mx-2"></div>}
                  {isSearchOpen && (
                     <button onClick={() => setIsSearchOpen(false)} className="lg:hidden text-[#322D29] p-1 ml-2"><X className="w-5 h-5"/></button>
                  )}

                  {/* User Account */}
                  <div className="relative hidden sm:block">
                    <button 
                      className={`flex items-center space-x-2 p-1 focus:outline-none transition-colors ${isUserMenuOpen ? 'text-[#72383D]' : 'text-[#322D29] hover:text-[#72383D]'}`}
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      title="Account"
                    >
                      <UserIcon className="w-5 h-5" />
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-6 w-48 bg-[#EFE9E1] border border-[#D1C7BD] shadow-xl py-2 z-50">
                        <Link to="/orders" className="block px-5 py-3 text-sm font-medium text-[#322D29] hover:bg-[#D1C7BD]/30 hover:text-[#72383D] transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                          My Orders
                        </Link>
                        <Link to="/profile" className="block px-5 py-3 text-sm font-medium text-[#322D29] hover:bg-[#D1C7BD]/30 hover:text-[#72383D] transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                          Profile
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Wishlist Icon */}
                  <Link to="/wishlist" className="text-[#322D29] hover:text-[#72383D] transition-colors flex items-center p-1">
                    <Heart className="w-5 h-5" />
                  </Link>

                  {/* Cart Icon */}
                  <Link to="/cart" className="relative text-[#322D29] hover:text-[#72383D] transition-colors flex items-center group p-1">
                    <ShoppingBag className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-[#72383D] text-[#EFE9E1] text-[8px] md:text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Navigation Bar (Desktop Only) - Dark Theme with CORRECTED LINKS */}
          <div className="hidden lg:block w-full bg-[#322D29] shadow-md relative z-40">
            <div className="max-w-[1400px] mx-auto px-4 py-4">
              <nav className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
                <Link to="/shop?tag=deals" className="text-xs font-bold text-[#EFE9E1] hover:text-[#AC9C8D] transition-colors uppercase tracking-widest flex items-center gap-1.5">
                  Deals <ChevronDown className="w-3.5 h-3.5" />
                </Link>
                <Link to="/shop?collection=elite-edition" className="text-xs font-bold text-[#EFE9E1] hover:text-[#AC9C8D] transition-colors uppercase tracking-widest">
                  Elite Edition
                </Link>
                <Link to="/shop" className="text-xs font-bold text-[#EFE9E1] hover:text-[#AC9C8D] transition-colors uppercase tracking-widest">
                  Find Your Fragrance
                </Link>
                <Link to="/shop?tag=new-arrival" className="text-xs font-bold text-[#EFE9E1] hover:text-[#AC9C8D] transition-colors uppercase tracking-widest flex items-center gap-1.5">
                  New Arrival <ChevronDown className="w-3.5 h-3.5" />
                </Link>
                <Link to="/shop?collection=collaboration" className="text-xs font-bold text-[#EFE9E1] hover:text-[#AC9C8D] transition-colors uppercase tracking-widest">
                  Collaboration
                </Link>
                <Link to="/shop?collection=niche-edition" className="text-xs font-bold text-[#EFE9E1] hover:text-[#AC9C8D] transition-colors uppercase tracking-widest">
                  Niche Edition
                </Link>
                <Link to="/shop?collection=luxe-edition" className="text-xs font-bold text-[#EFE9E1] hover:text-[#AC9C8D] transition-colors uppercase tracking-widest">
                  Luxe Edition
                </Link>
                <Link to="/shop?collection=gift-sets" className="text-xs font-bold text-[#EFE9E1] hover:text-[#AC9C8D] transition-colors uppercase tracking-widest">
                  Gift Sets
                </Link>
              </nav>
              
              {/* Second Row Navigation */}
              <nav className="flex flex-wrap justify-center items-center gap-x-10 mt-5 mb-1">
                <Link to="/shop?category=inspired" className="text-xs font-bold text-[#EFE9E1] hover:text-[#AC9C8D] transition-colors uppercase tracking-widest flex items-center gap-1.5">
                  Inspired Perfumes <ChevronDown className="w-3.5 h-3.5" />
                </Link>
                <Link to="/shop?category=byob" className="text-xs font-bold text-[#EFE9E1] hover:text-[#AC9C8D] transition-colors uppercase tracking-widest">
                  BYOB
                </Link>
                <Link to="/shop?category=lotion-body-wash" className="text-xs font-bold text-[#EFE9E1] hover:text-[#AC9C8D] transition-colors uppercase tracking-widest flex items-center gap-1.5">
                  Lotion & Body Wash <ChevronDown className="w-3.5 h-3.5" />
                </Link>
                <Link to="/shop" className="text-xs font-bold text-[#EFE9E1] hover:text-[#AC9C8D] transition-colors uppercase tracking-widest flex items-center gap-1.5">
                  More <ChevronDown className="w-3.5 h-3.5" />
                </Link>
              </nav>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 w-full bg-[#EFE9E1] z-40 lg:hidden overflow-y-auto border-t border-[#D1C7BD] shadow-inner h-[calc(100vh-70px)]">
              <nav className="flex flex-col p-6 space-y-6">
                <Link to="/shop?tag=deals" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-serif text-[#322D29] uppercase tracking-widest border-b border-[#D1C7BD]/30 pb-4">
                  Deals
                </Link>
                <Link to="/shop?collection=elite-edition" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-serif text-[#322D29] uppercase tracking-widest border-b border-[#D1C7BD]/30 pb-4">
                  Elite Edition
                </Link>
                <Link to="/shop?category=inspired" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-serif text-[#322D29] uppercase tracking-widest border-b border-[#D1C7BD]/30 pb-4">
                  Inspired Perfumes
                </Link>
                <Link to="/shop?collection=gift-sets" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-serif text-[#72383D] uppercase tracking-widest border-b border-[#D1C7BD]/30 pb-4">
                  Gift Sets
                </Link>
                <div className="pt-4 flex flex-col space-y-6">
                  <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center text-sm font-bold uppercase tracking-widest text-[#322D29]">
                    <UserIcon className="w-5 h-5 mr-3 text-[#AC9C8D]" /> My Orders
                  </Link>
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center text-sm font-bold uppercase tracking-widest text-[#322D29]">
                    <UserIcon className="w-5 h-5 mr-3 text-[#AC9C8D]" /> Profile
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </header>

        {/* ----------------------------- */}
        {/* MAIN CONTENT                  */}
        {/* ----------------------------- */}
        <main className="flex-grow">
          <Outlet />
        </main>

        {/* ----------------------------- */}
        {/* FOOTER                        */}
        {/* ----------------------------- */}
        <footer className="bg-[#322D29] text-[#AC9C8D] py-12 md:py-16 border-t border-[#322D29]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="font-serif text-2xl md:text-3xl text-[#EFE9E1] mb-6 md:mb-8 uppercase tracking-[0.2em]">Novaq</p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-8 md:mb-10 text-xs md:text-sm font-medium tracking-wider uppercase">
              <Link to="/about" className="hover:text-[#EFE9E1] hover:scale-105 transition-all">About Us</Link>
              <Link to="/contact" className="hover:text-[#EFE9E1] hover:scale-105 transition-all">Contact</Link>
              <Link to="/admin" className="hover:text-[#EFE9E1] hover:scale-105 transition-all sm:border-l border-[#AC9C8D]/40 sm:pl-8">Admin Panel</Link>
            </div>
            <p className="text-[10px] md:text-xs tracking-widest text-[#AC9C8D]/70">&copy; {new Date().getFullYear()} Novaq Perfumes. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}