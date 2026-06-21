// app/products/page.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  StickyNoteCheck,
  StickyNoteOff,
  StickyNote,
  Eye,
  Filter,
  FilterIcon,
} from "lucide-react";
import { useSales, useSalesDetail } from "@/hooks/useSales";
import Link from "next/link";

export default function SalesPage() {
  const [search, setSearch] = useState("");
  const [sortDate, setSortDate] = useState("");

  const { data: sales, isLoading } = useSales({
    search: search,
    limit: 50,
    sortDate: sortDate ? sortDate : "desc",
  });

  return (
    <Layout>
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-start justify-items-stretch">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari penjualan..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <FilterDropdown value={sortDate} onChange={setSortDate} />

          <button
            onClick={() => {}}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors ml-auto"
          >
            <Plus size={16} /> Tambah Penjualan
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-600">
                  Number
                </th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">
                  Partner Name
                </th>
                <th className="px-6 py-3 font-medium text-gray-600">State</th>
                <th className="text-right px-6 py-3 font-medium text-gray-600">
                  Total Amount
                </th>
                <th className="text-right px-6 py-3 font-medium text-gray-600">
                  Date Order
                </th>
                <th className="px-6 py-3 font-medium text-gray-600">
                  Invoiced
                </th>
                <th className="text-center px-6 py-3 font-medium text-gray-600">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    Memuat data...
                  </td>
                </tr>
              ) : sales?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <Package size={40} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-400">Belum ada penjualan</p>
                  </td>
                </tr>
              ) : (
                sales?.map((p: any) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {p.name}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {/* [1] Partner Name */}
                      {p.partner_id[1]}
                    </td>
                    <td className="flex justify-center px-6 py-4 text-gray-700 text-center">
                      {p.state == "draft" ? (
                        <div className="w-fit px-3 py-1 bg-gray-600/20 rounded-full">
                          <span className="text-xs font-semibold text-gray-600">
                            DRAFT
                          </span>
                        </div>
                      ) : p.state == "sale" ? (
                        <div className="w-fit px-3 py-1 bg-green-600/20 rounded-full">
                          <span className="text-xs font-semibold text-green-600">
                            SALE
                          </span>
                        </div>
                      ) : p.state == "cancel" ? (
                        <div className="w-fit px-3 py-1 bg-red-600/20 rounded-full">
                          <span className="text-xs font-semibold text-red-600">
                            CANCELLED
                          </span>
                        </div>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-700">
                      Rp {Number(p.amount_total).toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-700">
                      {p.date_order}
                    </td>
                    <td className="flex justify-center px-6 py-4 text-gray-700">
                      {p.invoice_status == "to invoice" ? (
                        <div className="flex justify-center items-center gap-1 w-fit px-2 py-1 bg-yellow-600/20 rounded-full">
                          <StickyNote size={20} className="stroke-yellow-600" />
                          <span className="text-xs font-semibold text-yellow-600">
                            To Invoice
                          </span>
                        </div>
                      ) : p.invoice_status == "invoiced" ? (
                        <div className="flex justify-center items-center gap-1 w-fit px-3 py-1 bg-green-600/20 rounded-full">
                          <StickyNoteCheck
                            size={20}
                            className="stroke-green-600"
                          />
                          <span className="text-xs font-semibold text-green-600">
                            Invoiced
                          </span>
                        </div>
                      ) : p.invoice_status == "no" ? (
                        <div className="flex justify-center items-center gap-1 w-fit px-3 py-1 bg-red-600/20 rounded-full">
                          <StickyNoteOff size={20} className="stroke-red-600" />
                          <span className="text-xs font-semibold text-red-600">
                            Nothing
                          </span>
                        </div>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2 ">
                        <Link
                          href={"/sales/" + p.id}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors"
                        >
                          <Eye size={20} />
                        </Link>
                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-600/10 transition-colors">
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => {}}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-600/10 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

// FilterDropdown — terima props, jangan punya state sendiri untuk ini
function FilterDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-2 py-2 border border-gray-200 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        <FilterIcon size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-md shadow-lg z-10 px-2 py-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">Order Date</label>
            <select
              value={value} // ← controlled by parent
              onChange={(e) => onChange(e.target.value)} // ← panggil setter dari parent
              className="text-black w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">DESCENDING</option>
              <option value="asc">ASCENDING</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
