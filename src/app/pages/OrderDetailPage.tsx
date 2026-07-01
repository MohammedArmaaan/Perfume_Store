import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import { Package, Truck, CheckCircle, Clock, ChevronLeft } from "lucide-react";
import apiClient from "../../api/client";
import { Order } from "../../types";
import { format } from "date-fns";

export default function OrderDetailPage() {
  const { id } = useParams();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const res = await apiClient.get<{ data: Order }>(`/orders/${id}`);
      return res.data.data;
    }
  });

  if (isLoading) {
    return <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse min-h-screen">
      <div className="h-8 bg-luxury-200 w-1/4 mb-8"></div>
      <div className="h-64 bg-white border border-luxury-200 mb-8"></div>
      <div className="h-64 bg-white border border-luxury-200"></div>
    </div>;
  }

  if (!order) {
    return <div className="max-w-4xl mx-auto px-4 py-24 text-center min-h-screen">
      <h2 className="text-2xl font-serif text-luxury-950 mb-4">Order Not Found</h2>
      <Link to="/orders" className="text-luxury-600 hover:text-luxury-950 underline">Return to Orders</Link>
    </div>;
  }

  const steps = ['pending', 'processing', 'shipped', 'delivered'];
  const currentStepIndex = steps.indexOf(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <Link to="/orders" className="inline-flex items-center text-sm text-luxury-600 hover:text-luxury-950 mb-8">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Orders
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif text-luxury-950 mb-2">Order {order.id}</h1>
          <p className="text-luxury-600">Placed on {format(new Date(order.created_at), 'MMMM dd, yyyy')}</p>
        </div>
        <div className="mt-4 md:mt-0 font-medium text-lg text-luxury-950">
          Total: ${order.total_amount.toFixed(2)}
        </div>
      </div>

      {/* Tracking Timeline */}
      <div className="bg-white border border-luxury-200 p-8 mb-8">
        <h3 className="text-lg font-serif text-luxury-950 mb-8">Shipping Status</h3>
        <div className="relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-luxury-100 rounded"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-luxury-950 rounded transition-all duration-500"
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          ></div>
          
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              let Icon = Package;
              if (step === 'processing') Icon = Clock;
              if (step === 'shipped') Icon = Truck;
              if (step === 'delivered') Icon = CheckCircle;

              return (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 bg-white ${
                    isCompleted ? 'border-luxury-950 text-luxury-950' : 'border-luxury-200 text-luxury-300'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`mt-3 text-xs uppercase tracking-widest font-medium ${
                    isCurrent ? 'text-luxury-950' : isCompleted ? 'text-luxury-700' : 'text-luxury-400'
                  }`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Items */}
        <div className="md:col-span-2 space-y-6">
          <h3 className="text-lg font-serif text-luxury-950 mb-4 border-b border-luxury-200 pb-2">Items Included</h3>
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 bg-white border border-luxury-200 p-4">
              <img src={item.product?.images[0]} alt="" className="w-20 h-20 object-cover bg-luxury-100" />
              <div className="flex-1">
                <Link to={`/product/${item.product_id}`} className="font-serif text-luxury-950 hover:underline">
                  {item.product?.name}
                </Link>
                <p className="text-sm text-luxury-600 mt-1">Qty: {item.quantity}</p>
              </div>
              <div className="font-medium text-luxury-950">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* Shipping Details */}
        <div>
          <div className="bg-luxury-50 border border-luxury-200 p-6 sticky top-28">
            <h3 className="text-lg font-serif text-luxury-950 mb-4 border-b border-luxury-200 pb-2">Shipping Details</h3>
            <address className="not-italic text-sm text-luxury-700 space-y-1">
              <p className="font-medium text-luxury-950">{order.shipping_details.firstName} {order.shipping_details.lastName}</p>
              <p>{order.shipping_details.address}</p>
              <p>{order.shipping_details.city}, {order.shipping_details.zipCode}</p>
              <p>{order.shipping_details.country}</p>
              <p className="pt-2">{order.shipping_details.email}</p>
            </address>

            <h3 className="text-lg font-serif text-luxury-950 mb-4 border-b border-luxury-200 pb-2 mt-8">Summary</h3>
            <div className="space-y-2 text-sm text-luxury-700">
              <div className="flex justify-between">
                <span>Payment</span>
                <span className="uppercase">{order.payment_status}</span>
              </div>
              <div className="flex justify-between font-medium text-luxury-950 pt-2 border-t border-luxury-200 mt-2">
                <span>Total</span>
                <span>${order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
