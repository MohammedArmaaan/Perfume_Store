import { useState } from "react";
import { useNavigate } from "react-router";
import { useStore } from "../../store/useStore";
import apiClient from "../../api/client";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { cart, clearCart } = useStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'US'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart.reduce((total, item) => {
    const price = item.product.discount_price || item.product.price;
    return total + (price * item.quantity);
  }, 0);
  const shipping = subtotal > 150 ? 0 : 15;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);
    try {
      // Step 1: Create Order in Laravel Backend
      const response = await apiClient.post('/checkout', {
        shipping_details: formData,
        cart_items: cart.map(item => ({ product_id: item.product.id, quantity: item.quantity })),
        amount: total
      });

      const orderData = response.data;

      // Step 2: Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_mock', // Mock Key
        amount: total * 100, // amount in paisa
        currency: "USD",
        name: "Aura Perfumes",
        description: "Luxury Fragrance Purchase",
        order_id: orderData.razorpay_order_id,
        handler: function (response: any) {
          // In a real app, you would send response.razorpay_payment_id back to Laravel to verify the signature
          alert(`Payment successful! Order ID: ${orderData.order_id}`);
          clearCart();
          navigate('/');
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
        },
        theme: {
          color: "#26221f" // luxury-950
        }
      };

      // Mock Razorpay window if script isn't loaded (for this sandbox)
      if (typeof window !== 'undefined' && !window.Razorpay) {
        window.Razorpay = class MockRazorpay {
          options: any;
          constructor(opts: any) { this.options = opts; }
          open() { 
            setTimeout(() => {
              this.options.handler({ razorpay_payment_id: 'pay_mock123' });
            }, 1500);
          }
        };
      }

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred during checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-serif text-luxury-950 mb-6">Checkout</h1>
        <p className="text-luxury-600 mb-8">Your cart is empty. Please add items before checking out.</p>
        <button onClick={() => navigate('/shop')} className="bg-luxury-950 text-white px-8 py-3 text-sm uppercase tracking-widest hover:bg-luxury-800 transition-colors">
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-serif text-luxury-950 mb-8">Secure Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Checkout Form */}
        <div className="lg:w-2/3">
          <form onSubmit={handleCheckout} className="space-y-8">
            {/* Contact Info */}
            <section>
              <h2 className="text-xl font-serif text-luxury-950 mb-4 border-b border-luxury-200 pb-2">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input 
                    type="text" name="firstName" placeholder="First Name" 
                    value={formData.firstName} onChange={handleInputChange}
                    className={`w-full border p-3 text-sm focus:outline-none focus:border-luxury-950 ${errors.firstName ? 'border-red-500' : 'border-luxury-300'}`}
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <input 
                    type="text" name="lastName" placeholder="Last Name" 
                    value={formData.lastName} onChange={handleInputChange}
                    className={`w-full border p-3 text-sm focus:outline-none focus:border-luxury-950 ${errors.lastName ? 'border-red-500' : 'border-luxury-300'}`}
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
                <div className="md:col-span-2">
                  <input 
                    type="email" name="email" placeholder="Email Address" 
                    value={formData.email} onChange={handleInputChange}
                    className={`w-full border p-3 text-sm focus:outline-none focus:border-luxury-950 ${errors.email ? 'border-red-500' : 'border-luxury-300'}`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>
            </section>

            {/* Shipping Info */}
            <section>
              <h2 className="text-xl font-serif text-luxury-950 mb-4 border-b border-luxury-200 pb-2">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <input 
                    type="text" name="address" placeholder="Street Address" 
                    value={formData.address} onChange={handleInputChange}
                    className={`w-full border p-3 text-sm focus:outline-none focus:border-luxury-950 ${errors.address ? 'border-red-500' : 'border-luxury-300'}`}
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>
                <div>
                  <input 
                    type="text" name="city" placeholder="City" 
                    value={formData.city} onChange={handleInputChange}
                    className={`w-full border p-3 text-sm focus:outline-none focus:border-luxury-950 ${errors.city ? 'border-red-500' : 'border-luxury-300'}`}
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <input 
                    type="text" name="zipCode" placeholder="ZIP / Postal Code" 
                    value={formData.zipCode} onChange={handleInputChange}
                    className={`w-full border p-3 text-sm focus:outline-none focus:border-luxury-950 ${errors.zipCode ? 'border-red-500' : 'border-luxury-300'}`}
                  />
                  {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                </div>
                <div className="md:col-span-2">
                  <select 
                    name="country" value={formData.country} onChange={handleInputChange}
                    className="w-full border border-luxury-300 p-3 text-sm focus:outline-none focus:border-luxury-950"
                  >
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
              </div>
            </section>

            <button 
              type="submit" 
              disabled={isProcessing}
              className="w-full bg-luxury-950 text-white py-4 text-sm uppercase tracking-widest hover:bg-luxury-800 transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Pay with Razorpay'}
            </button>
          </form>
        </div>

        {/* Order Summary (Sidebar) */}
        <div className="lg:w-1/3">
          <div className="bg-luxury-100 p-8 sticky top-28">
            <h2 className="text-xl font-serif text-luxury-950 mb-6 border-b border-luxury-200 pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
              {cart.map(item => (
                <div key={item.id} className="flex items-center">
                  <div className="w-16 h-16 bg-white shrink-0 mr-4 border border-luxury-200">
                    <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-serif text-luxury-950 line-clamp-1">{item.product.name}</h4>
                    <p className="text-xs text-luxury-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-medium text-luxury-950">
                    ${((item.product.discount_price || item.product.price) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 text-sm mb-6 border-t border-luxury-200 pt-6">
              <div className="flex justify-between text-luxury-700">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-luxury-700">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`}</span>
              </div>
            </div>

            <div className="border-t border-luxury-200 pt-4">
              <div className="flex justify-between items-center text-xl font-serif text-luxury-950">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
