// components/Layout.tsx
"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/storeAuth";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileText,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  Building2,
} from "lucide-react";
import Loading from "@/app/loading";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/products", label: "Produk", icon: Package },
  { href: "/sales", label: "Penjualan", icon: ShoppingCart },
  { href: "/customers", label: "Pelanggan", icon: Users },
  { href: "/invoices", label: "Invoice", icon: FileText },
  { href: "/reports", label: "Laporan", icon: BarChart2 },
  { href: "/settings", label: "Pengaturan", icon: Settings },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-16"} transition-all duration-300 bg-slate-900 text-white flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-slate-700">
          <Building2 className="text-blue-400 shrink-0" size={24} />
          {sidebarOpen && (
            <span className="ml-3 font-bold text-lg tracking-tight">
              OdooERP
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto text-slate-400 hover:text-white"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon size={20} className="shrink-0" />
                {sidebarOpen && (
                  <span className="text-sm font-medium">{label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="border-t border-slate-700 p-4">
          {sidebarOpen && (
            <div className="mb-3">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} />
            {sidebarOpen && <span className="text-sm">Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
          <h1 className="text-lg font-semibold text-gray-800 capitalize">
            {pathname.split("/")[1] || "Dashboard"}
          </h1>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {new Date().toLocaleDateString("id-ID", { dateStyle: "long" })}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </main>
    </div>
  );
}
