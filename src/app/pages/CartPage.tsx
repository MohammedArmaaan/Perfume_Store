import { Link } from "react-router";
import { Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import { useStore } from "../../store/useStore";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, isLoading } = useStore();

  const subtotal = cart.reduce((total, item) => {
    const price = item.product.discount_price || item.product.price;
    return total + (price * item.quantity);
  }, 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-serif text-luxury-950 mb-6">Your Shopping Cart</h1>
        <p className="text-luxury-600 mb-8">Your cart is currently empty.</p>
        <Link 
          to="/shop" 
          className="inline-block bg-luxury-950 text-white px-8 py-3 text-sm uppercase tracking-widest hover:bg-luxury-800 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-serif text-luxury-950 mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="border-b border-luxury-200 pb-4 mb-6 hidden sm:flex text-xs uppercase tracking-widest text-luxury-500">
            <div className="w-3/5">Product</div>
            <div className="w-1/5 text-center">Quantity</div>
            <div className="w-1/5 text-right">Total</div>
          </div>

          <div className={`space-y-6 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
            {cart.map((item) => {
              const price = item.product.discount_price || item.product.price;
              
              return (
                <div key={item.id} className="flex flex-col sm:flex-row items-center border-b border-luxury-200 pb-6">
                  {/* Product Info */}
                  <div className="w-full sm:w-3/5 flex items-center mb-4 sm:mb-0">
                    <Link to={`/product/${item.product.id}`} className="w-24 h-24 bg-luxury-100 shrink-0">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </Link>
                    <div className="ml-6">
                      <Link to={`/product/${item.product.id}`} className="text-lg font-serif text-luxury-950 hover:underline">
                        {item.product.name}
                      </Link>
                      <p className="text-luxury-600 text-sm mt-1">${price}</p>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="w-full sm:w-1/5 flex justify-center mb-4 sm:mb-0">
                    <div className="flex items-center border border-luxury-300">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-2 text-luxury-600 hover:text-luxury-950 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm text-luxury-950">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, Math.min(item.product.stock, item.quantity + 1))}
                        className="p-2 text-luxury-600 hover:text-luxury-950 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Total & Remove */}
                  <div className="w-full sm:w-1/5 flex justify-between sm:justify-end items-center">
                    <span className="text-luxury-950 font-medium sm:mr-4">
                      ${(price * item.quantity).toFixed(2)}
                    </span>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-luxury-400 hover:text-red-500 transition-colors p-2"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-luxury-100 p-8">
            <h2 className="text-xl font-serif text-luxury-950 mb-6 border-b border-luxury-200 pb-4">Order Summary</h2>
            
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between text-luxury-700">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-luxury-700">
                <span>Shipping</span>
                <span>{subtotal > 150 ? 'Complimentary' : '$15.00'}</span>
              </div>
            </div>

            <div className="border-t border-luxury-200 pt-4 mb-8">
              <div className="flex justify-between items-center text-lg font-serif text-luxury-950">
                <span>Total</span>
                <span>${(subtotal + (subtotal > 150 ? 0 : 15)).toFixed(2)}</span>
              </div>
            </div>

            <Link 
              to="/checkout"
              className="w-full bg-luxury-950 text-white flex items-center justify-center py-4 text-sm uppercase tracking-widest hover:bg-luxury-800 transition-colors"
            >
              Secure Checkout <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
