import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { Package, ChevronRight, Clock, CheckCircle } from "lucide-react";
import apiClient from "../../api/client";
import { Order } from "../../types";
import { format } from "date-fns";

export default function UserOrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await apiClient.get<{ data: Order[] }>('/orders');
      return res.data.data;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-luxury-950 mb-2">Order History</h1>
        <p className="text-luxury-600">Track and manage your past purchases.</p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2].map(i => (
            <div key={i} className="h-48 bg-white border border-luxury-200 animate-pulse"></div>
          ))}
        </div>
      ) : orders?.length === 0 ? (
        <div className="text-center py-24 bg-white border border-luxury-200">
          <Package className="w-12 h-12 text-luxury-300 mx-auto mb-4" />
          <h2 className="text-xl font-serif text-luxury-950 mb-2">No orders found</h2>
          <p className="text-luxury-600 mb-6">You haven't placed any orders yet.</p>
          <Link to="/shop" className="bg-luxury-950 text-white px-8 py-3 text-sm uppercase tracking-widest hover:bg-luxury-800 transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders?.map((order) => (
            <div key={order.id} className="bg-white border border-luxury-200 overflow-hidden">
              <div className="bg-luxury-50 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between border-b border-luxury-200">
                <div className="flex flex-wrap gap-x-8 gap-y-4 mb-4 md:mb-0">
                  <div>
                    <p className="text-xs text-luxury-500 uppercase tracking-widest mb-1">Order Placed</p>
                    <p className="text-sm text-luxury-950 font-medium">{format(new Date(order.created_at), 'MMMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-luxury-500 uppercase tracking-widest mb-1">Total</p>
                    <p className="text-sm text-luxury-950 font-medium">${order.total_amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-luxury-500 uppercase tracking-widest mb-1">Order ID</p>
                    <p className="text-sm text-luxury-950 font-medium">{order.id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 text-xs uppercase tracking-widest flex items-center ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {order.status === 'delivered' ? <CheckCircle className="w-3 h-3 mr-1.5" /> : <Clock className="w-3 h-3 mr-1.5" />}
                    {order.status}
                  </span>
                  <Link 
                    to={`/orders/${order.id}`}
                    className="text-sm text-luxury-700 hover:text-luxury-950 flex items-center font-medium border border-luxury-300 px-4 py-2 hover:bg-luxury-100 transition-colors"
                  >
                    View Details <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
              
              <div className="p-6 flex gap-6 overflow-x-auto">
                {order.items.map((item) => (
                  <div key={item.id} className="flex-shrink-0 w-64 flex items-center space-x-4">
                    <img src={item.product?.images[0]} alt="" className="w-20 h-20 object-cover bg-luxury-100 border border-luxury-200" />
                    <div>
                      <h4 className="text-sm font-serif text-luxury-950 line-clamp-2">{item.product?.name}</h4>
                      <p className="text-xs text-luxury-600 mt-1">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
