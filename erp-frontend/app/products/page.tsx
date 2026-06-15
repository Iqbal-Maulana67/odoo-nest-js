// app/products/page.tsx
"use client";
import React, { useState } from "react";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDestroyProduct,
} from "@/hooks/useProducts";
import Layout from "@/components/Layout";
import { Plus, Search, Edit2, Trash2, Package } from "lucide-react";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [idDelete, setIdDelete] = useState<number>(-1);
  const [isProduct, setIsProduct] = useState<boolean>(false);
  const [form, setForm] = useState({
    name: "",
    list_price: "",
    qty_available: "",
    default_code: "",
    type: "",
  });

  const { data: products, isLoading } = useProducts({
    search: search,
    limit: 50,
  });
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDestroyProduct();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.type && form.type != "product") {
      form.qty_available = "0";
    }
    const payload = { ...form, list_price: parseFloat(form.list_price) };
    if (editing) {
      updateProduct.mutate({ id: editing.id, data: payload });
    } else {
      createProduct.mutate(payload);
    }
    setShowModal(false);
    setForm({
      name: "",
      list_price: "",
      qty_available: "",
      type: "",
      default_code: "",
    });
    setEditing(null);
  };

  const handleDeleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    deleteProduct.mutate(idDelete);
    setShowDeleteModal(false);
    setIdDelete(-1);
  };

  return (
    <Layout>
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari produk..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => {
              setEditing(null);

              setForm({
                name: "",
                list_price: "",
                qty_available: "",
                type: "",
                default_code: "",
              });
              
              setIsProduct(true);

              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} /> Tambah Produk
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-600">
                  Default Code
                </th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">
                  Nama Produk
                </th>
                <th className="text-right px-6 py-3 font-medium text-gray-600">
                  Harga
                </th>
                <th className="text-right px-6 py-3 font-medium text-gray-600">
                  Stok
                </th>
                <th className="text-right px-6 py-3 font-medium text-gray-600">
                  Tipe
                </th>
                <th className="text-center px-6 py-3 font-medium text-gray-600">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    Memuat data...
                  </td>
                </tr>
              ) : products?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <Package size={40} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-400">Belum ada produk</p>
                  </td>
                </tr>
              ) : (
                products?.map((p: any) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-500 text-xs">
                      {p.default_code || "-"}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {p.name}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-700">
                      Rp {Number(p.list_price).toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      { p.type == 'product' ? 
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          p.qty_available > 10
                            ? "bg-green-100 text-green-700"
                            : p.qty_available > 0
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {p.qty_available ?? 0} unit
                      </span> 
                      : 
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700`}
                      >
                        unavailable
                      </span> 
                      }
                      
                    </td>
                    <td className="px-6 py-4 text-right">{p.type}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditing(p);

                            setForm({
                              name: p.name,
                              list_price: p.list_price,
                              qty_available: p.qty_available,
                              type: p.type,
                              default_code: p.default_code,
                            });

                            if (p.type == "product") {
                              setIsProduct(false);
                            } else setIsProduct(true);

                            setShowModal(true);
                          }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => {
                            setIdDelete(p.id);
                            setShowDeleteModal(true);
                          }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
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

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editing ? "Edit Produk" : "Tambah Produk Baru"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Produk
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="text-black w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Harga Jual (Rp)
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  value={form.list_price}
                  onChange={(e) =>
                    setForm({ ...form, list_price: e.target.value })
                  }
                  className="text-black w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stok {isProduct ? "(disabled)" : ""}
                </label>
                <input
                  required={isProduct ? false : true}
                  disabled={isProduct ? true : false}
                  type="number"
                  min="0"
                  value={form.qty_available}
                  onChange={(e) =>
                    setForm({ ...form, qty_available: e.target.value })
                  }
                  className="text-black w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipe Produk
                </label>
                <select
                  required
                  value={form.type}
                  onChange={(e) => {
                    if (e.target.value == "product") {
                      setIsProduct(false);
                    } else setIsProduct(true);
                    setForm({ ...form, type: e.target.value });
                  }}
                  className="text-black w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Tipe Produk</option>
                  <option value="product">Product</option>
                  <option value="consu">Consumable</option>
                  <option value="service">Service</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kode Produk
                </label>
                <select
                  value={form.default_code}
                  onChange={(e) =>
                    setForm({ ...form, default_code: e.target.value })
                  }
                  className="text-black w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose </option>
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-black flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  {editing ? "Simpan" : "Tambah"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">Delete Produk</h2>
            <form onSubmit={handleDeleteSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Are you sure to delete this product?
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="text-black flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
