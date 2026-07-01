import { Outlet, Link, useNavigate } from "react-router";
import { ShoppingBag, Search, Menu, User as UserIcon, X } from "lucide-react";
import { useStore } from "../../store/useStore";
import { useState, useEffect } from "react";

export default function AppLayout() {
  const cart = useStore((state) => state.cart);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigate = useNavigate();

  // Prevent scrolling when search overlay or mobile menu is open
  useEffect(() => {
    if (isSearchOpen || isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isSearchOpen, isMobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#EFE9E1] selection:bg-[#72383D] selection:text-[#EFE9E1] font-sans">
      
      {/* ----------------------------- */}
      {/* FULL SCREEN SEARCH OVERLAY    */}
      {/* ----------------------------- */}
      <div 
        className={`fixed inset-0 bg-[#EFE9E1]/95 backdrop-blur-xl z-[100] flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${
          isSearchOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <button 
          onClick={() => setIsSearchOpen(false)}
          className="absolute top-8 right-8 text-[#322D29] hover:text-[#72383D] transition-colors p-2"
        >
          <X className="w-8 h-8" />
        </button>
        
        <div className="w-full max-w-3xl px-6">
          <p className="text-[#AC9C8D] text-sm uppercase tracking-[0.3em] font-medium mb-4 text-center">
            What are you looking for?
          </p>
          <form onSubmit={handleSearchSubmit} className="relative group">
            <input 
              type="text" 
              autoFocus={isSearchOpen}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fragrances, categories..." 
              className="w-full bg-transparent border-b-2 border-[#D1C7BD] text-3xl md:text-5xl text-[#322D29] py-4 pr-12 focus:outline-none focus:border-[#72383D] transition-colors placeholder:text-[#AC9C8D]/50 font-serif"
            />
            <button 
              type="submit"
              className="absolute right-0 bottom-6 text-[#AC9C8D] group-hover:text-[#72383D] transition-colors"
            >
              <Search className="w-8 h-8" />
            </button>
          </form>
        </div>
      </div>

      {/* ----------------------------- */}
      {/* MAIN HEADER                   */}
      {/* ----------------------------- */}
      <header className="sticky top-0 z-50 flex flex-col w-full bg-[#EFE9E1]">
        
        {/* Top Announcement Bar */}
        <div className="bg-[#322D29] text-[#EFE9E1] text-[10px] sm:text-xs text-center py-2 uppercase tracking-[0.2em] font-medium w-full">
          Free Shipping On Prepaid Orders | Buy Now Pay Later Options Available
        </div>

        {/* Main Navigation Area */}
        <div className="w-full border-b border-[#D1C7BD] bg-[#EFE9E1]/90 backdrop-blur-md">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              
              {/* Left Side: Mobile Menu & Search */}
              <div className="flex items-center flex-1 justify-start space-x-4">
                <button 
                  className="p-2 -ml-2 text-[#322D29] hover:text-[#72383D] transition-colors lg:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
                
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="text-[#322D29] hover:text-[#72383D] transition-colors flex items-center space-x-2"
                  title="Search"
                >
                  <Search className="w-5 h-5" />
                  <span className="hidden sm:block text-xs font-semibold uppercase tracking-widest mt-0.5">Search</span>
                </button>
              </div>

              {/* Center: Logo */}
              <div className="flex-1 flex justify-center">
                <Link to="/" className="text-3xl font-serif tracking-[0.25em] text-[#322D29] hover:text-[#72383D] transition-colors uppercase">
                  Aura
                </Link>
              </div>

              {/* Right Side: Account & Cart */}
              <div className="flex items-center justify-end flex-1 space-x-5 sm:space-x-8">
                
                {/* User Account */}
                <div className="relative hidden sm:block">
                  <button 
                    className={`flex items-center space-x-2 focus:outline-none transition-colors ${isUserMenuOpen ? 'text-[#72383D]' : 'text-[#322D29] hover:text-[#72383D]'}`}
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    title="Account"
                  >
                    <UserIcon className="w-5 h-5" />
                    <span className="text-xs font-semibold uppercase tracking-widest mt-0.5">Account</span>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-6 w-48 bg-[#EFE9E1] border border-[#D1C7BD] shadow-xl py-2 z-50">
                      <Link to="/orders" className="block px-5 py-3 text-sm font-medium text-[#322D29] hover:bg-[#D1C7BD]/30 hover:text-[#72383D] transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                        My Orders
                      </Link>
                      <Link to="#" className="block px-5 py-3 text-sm font-medium text-[#322D29] hover:bg-[#D1C7BD]/30 hover:text-[#72383D] transition-colors" onClick={() => setIsUserMenuOpen(false)}>
                        Profile
                      </Link>
                    </div>
                  )}
                </div>

                {/* Cart Icon */}
                <Link to="/cart" className="relative text-[#322D29] hover:text-[#72383D] transition-colors flex items-center space-x-2 group">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="hidden sm:block text-xs font-semibold uppercase tracking-widest mt-0.5">Cart</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 sm:-right-3 bg-[#72383D] text-[#EFE9E1] text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Navigation Bar (Desktop Only) */}
        <div className="hidden lg:flex w-full bg-[#EFE9E1] border-b border-[#D1C7BD]/50 justify-center">
          <nav className="flex space-x-12 py-4">
            <Link to="/shop" className="text-xs font-bold text-[#322D29] hover:text-[#72383D] transition-colors uppercase tracking-[0.2em]">
              All Fragrances
            </Link>
            <Link to="/shop?category=men" className="text-xs font-bold text-[#322D29] hover:text-[#72383D] transition-colors uppercase tracking-[0.2em]">
              For Him
            </Link>
            <Link to="/shop?category=women" className="text-xs font-bold text-[#322D29] hover:text-[#72383D] transition-colors uppercase tracking-[0.2em]">
              For Her
            </Link>
            <Link to="/shop?category=unisex" className="text-xs font-bold text-[#322D29] hover:text-[#72383D] transition-colors uppercase tracking-[0.2em]">
              Unisex
            </Link>
            <Link to="/shop?collection=gift-sets" className="text-xs font-bold text-[#72383D] hover:text-[#322D29] transition-colors uppercase tracking-[0.2em]">
              Gift Sets
            </Link>
          </nav>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 top-[104px] bg-[#EFE9E1] z-40 lg:hidden overflow-y-auto border-t border-[#D1C7BD]">
            <nav className="flex flex-col p-6 space-y-6">
              <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-serif text-[#322D29] uppercase tracking-widest border-b border-[#D1C7BD]/30 pb-4">
                All Fragrances
              </Link>
              <Link to="/shop?category=men" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-serif text-[#322D29] uppercase tracking-widest border-b border-[#D1C7BD]/30 pb-4">
                For Him
              </Link>
              <Link to="/shop?category=women" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-serif text-[#322D29] uppercase tracking-widest border-b border-[#D1C7BD]/30 pb-4">
                For Her
              </Link>
              <Link to="/shop?collection=gift-sets" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-serif text-[#72383D] uppercase tracking-widest border-b border-[#D1C7BD]/30 pb-4">
                Gift Sets
              </Link>
              <div className="pt-4 flex space-x-6">
                <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center text-sm font-bold uppercase tracking-widest text-[#322D29]">
                  <UserIcon className="w-5 h-5 mr-2" /> Orders
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
      <footer className="bg-[#322D29] text-[#AC9C8D] py-16 border-t border-[#322D29]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-serif text-3xl text-[#EFE9E1] mb-8 uppercase tracking-[0.2em]">Aura</p>
          <div className="flex justify-center space-x-8 mb-10 text-sm font-medium tracking-wider uppercase">
            <Link to="#" className="hover:text-[#EFE9E1] hover:scale-105 transition-all">About Us</Link>
            <Link to="#" className="hover:text-[#EFE9E1] hover:scale-105 transition-all">Contact</Link>
            <Link to="/admin" className="hover:text-[#EFE9E1] hover:scale-105 transition-all border-l border-[#AC9C8D]/40 pl-8">Admin Panel</Link>
          </div>
          <p className="text-xs tracking-widest text-[#AC9C8D]/70">&copy; {new Date().getFullYear()} Aura Perfumes. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}