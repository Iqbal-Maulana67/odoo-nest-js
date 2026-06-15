// app/dashboard/page.tsx
'use client';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Package, Users, ShoppingCart } from 'lucide-react';
import Layout from '@/components/Layout';

const salesData = [
  { bulan: 'Jan', penjualan: 12400000 },
  { bulan: 'Feb', penjualan: 18200000 },
  { bulan: 'Mar', penjualan: 15800000 },
  { bulan: 'Apr', penjualan: 22100000 },
  { bulan: 'Mei', penjualan: 19700000 },
  { bulan: 'Jun', penjualan: 28500000 },
];

function StatCard({ title, value, icon: Icon, color, change }: any) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500 font-medium">{title}</span>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-xs text-green-600 mt-1">+{change}% dari bulan lalu</p>
    </div>
  );
}

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await dashboardApi.getStats();
      return data;
    },
  });

  const statCards = [
    { title: 'Total Penjualan', value: 'Rp 28,5 Jt', icon: TrendingUp, color: 'bg-blue-500', change: 12 },
    { title: 'Total Produk', value: stats?.totalProducts ?? '...', icon: Package, color: 'bg-violet-500', change: 3 },
    { title: 'Pelanggan Aktif', value: stats?.totalCustomers ?? '...', icon: Users, color: 'bg-emerald-500', change: 8 },
    { title: 'Order Bulan Ini', value: stats?.totalOrders ?? '...', icon: ShoppingCart, color: 'bg-amber-500', change: 15 },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-700 mb-4">Tren Penjualan</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v / 1000000}Jt`} />
                <Tooltip formatter={(v: any) => `Rp ${(v / 1000000).toFixed(1)} Jt`} />
                <Line type="monotone" dataKey="penjualan" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-700 mb-4">Penjualan per Bulan</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v / 1000000}Jt`} />
                <Tooltip formatter={(v: any) => `Rp ${(v / 1000000).toFixed(1)} Jt`} />
                <Bar dataKey="penjualan" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
}