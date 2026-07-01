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
  
  const navigate = useNavigate();

  // Prevent scrolling when search overlay is open
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#EFE9E1] selection:bg-[#72383D] selection:text-[#EFE9E1]">
      
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
      <header className="sticky top-0 z-50 bg-[#EFE9E1]/80 backdrop-blur-md border-b border-[#D1C7BD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button className="p-2 text-[#322D29] hover:text-[#72383D] transition-colors">
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Logo */}
            <div className="flex-1 flex justify-center sm:justify-start">
              <Link to="/" className="text-2xl font-serif tracking-widest text-[#322D29] hover:text-[#72383D] transition-colors uppercase">
                Aura
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden sm:flex space-x-10">
              <Link to="/shop" className="text-xs font-semibold text-[#322D29] hover:text-[#72383D] transition-colors uppercase tracking-[0.15em]">
                Fragrances
              </Link>
              <Link to="/shop?category=men" className="text-xs font-semibold text-[#322D29] hover:text-[#72383D] transition-colors uppercase tracking-[0.15em]">
                Men
              </Link>
              <Link to="/shop?category=women" className="text-xs font-semibold text-[#322D29] hover:text-[#72383D] transition-colors uppercase tracking-[0.15em]">
                Women
              </Link>
            </nav>

            {/* Right icons */}
            <div className="flex items-center justify-end flex-1 space-x-5 sm:space-x-7">
              
              {/* Search Button */}
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="text-[#322D29] hover:text-[#72383D] transition-colors hidden sm:block"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              
              {/* User Dropdown */}
              <div className="relative hidden sm:block">
                <button 
                  className={`flex items-center focus:outline-none transition-colors ${isUserMenuOpen ? 'text-[#72383D]' : 'text-[#322D29] hover:text-[#72383D]'}`}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  title="Account"
                >
                  <UserIcon className="w-5 h-5" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-4 w-48 bg-[#EFE9E1] border border-[#D1C7BD] shadow-[0_10px_30px_rgba(50,45,41,0.1)] py-2 z-50">
                    <Link 
                      to="/orders" 
                      className="block px-5 py-2.5 text-sm font-medium text-[#322D29] hover:bg-[#D1C7BD]/30 hover:text-[#72383D] transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link 
                      to="#" 
                      className="block px-5 py-2.5 text-sm font-medium text-[#322D29] hover:bg-[#D1C7BD]/30 hover:text-[#72383D] transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Quick Links */}
              <Link to="/orders" className="sm:hidden text-[10px] font-bold uppercase tracking-widest text-[#322D29]">
                Orders
              </Link>

              {/* Cart Icon */}
              <Link to="/cart" className="relative text-[#322D29] hover:text-[#72383D] transition-colors flex items-center group">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#72383D] text-[#EFE9E1] text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
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