import { Outlet, Link, useNavigate } from "react-router";
import { ShoppingBag, Search, Menu, User as UserIcon } from "lucide-react";
import { useStore } from "../../store/useStore";
import { useState } from "react";

export default function AppLayout() {
  const cart = useStore((state) => state.cart);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-luxury-50">
      <header className="sticky top-0 z-50 bg-luxury-50/80 backdrop-blur-md border-b border-luxury-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button className="p-2 text-luxury-900 hover:text-black">
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Logo */}
            <div className="flex-1 flex justify-center sm:justify-start">
              <Link to="/" className="text-2xl font-serif tracking-widest text-luxury-950 uppercase">
                Aura
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden sm:flex space-x-8">
              <Link to="/shop" className="text-sm font-medium text-luxury-700 hover:text-luxury-950 transition-colors uppercase tracking-wider">
                Fragrances
              </Link>
              <Link to="/shop?category=men" className="text-sm font-medium text-luxury-700 hover:text-luxury-950 transition-colors uppercase tracking-wider">
                Men
              </Link>
              <Link to="/shop?category=women" className="text-sm font-medium text-luxury-700 hover:text-luxury-950 transition-colors uppercase tracking-wider">
                Women
              </Link>
            </nav>

            {/* Right icons */}
            <div className="flex items-center justify-end flex-1 space-x-4 sm:space-x-6">
              <button className="text-luxury-700 hover:text-luxury-950 hidden sm:block">
                <Search className="w-5 h-5" />
              </button>
              
              {/* User Dropdown */}
              <div className="relative hidden sm:block">
                <button 
                  className="text-luxury-700 hover:text-luxury-950 flex items-center focus:outline-none"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <UserIcon className="w-5 h-5" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-luxury-200 shadow-lg py-2 z-50">
                    <Link 
                      to="/orders" 
                      className="block px-4 py-2 text-sm text-luxury-700 hover:bg-luxury-50 hover:text-luxury-950"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link 
                      to="#" 
                      className="block px-4 py-2 text-sm text-luxury-700 hover:bg-luxury-50 hover:text-luxury-950"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Quick Links */}
              <Link to="/orders" className="sm:hidden text-xs font-medium uppercase tracking-widest text-luxury-700">
                Orders
              </Link>

              <Link to="/cart" className="relative text-luxury-700 hover:text-luxury-950 flex items-center">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-luxury-950 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-luxury-950 text-luxury-300 py-12 border-t border-luxury-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-serif text-2xl text-white mb-6 uppercase tracking-widest">Aura</p>
          <div className="flex justify-center space-x-6 mb-8 text-sm">
            <Link to="#" className="hover:text-white transition-colors">About Us</Link>
            <Link to="#" className="hover:text-white transition-colors">Contact</Link>
            <Link to="/admin" className="hover:text-white transition-colors border-l border-luxury-700 pl-6">Admin Panel</Link>
          </div>
          <p className="text-xs">&copy; {new Date().getFullYear()} Aura Perfumes. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
