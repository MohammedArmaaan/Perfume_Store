import { useQuery } from "@tanstack/react-query";
import { DollarSign, ShoppingCart, PackageSearch, Users } from "lucide-react";
import apiClient from "../../../api/client";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const res = await apiClient.get('/admin/stats');
      return res.data.data;
    }
  });

  const cards = [
    { title: 'Total Revenue', value: stats ? `$${stats.total_revenue.toFixed(2)}` : '...', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Total Orders', value: stats?.total_orders || '...', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Total Products', value: stats?.total_products || '...', icon: PackageSearch, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Total Customers', value: stats?.total_customers || '...', icon: Users, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-serif text-luxury-950 mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center">
            <div className={`p-4 rounded-full ${card.bg} ${card.color} mr-4`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-serif text-luxury-950 mb-4">Recent Activity</h2>
        <p className="text-gray-500 text-sm">Dashboard charts and activity feeds would go here in a production environment.</p>
        <div className="h-64 bg-gray-50 mt-4 rounded border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
          Chart Placeholder
        </div>
      </div>
    </div>
  );
}
