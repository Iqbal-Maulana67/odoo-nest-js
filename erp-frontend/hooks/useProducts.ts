// hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "@/lib/api";
import { toast } from "react-hot-toast";

export function useProducts(params?: {
  limit?: number;
  offset?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const { data } = await productsApi.getAll(params);
      return data;
    },
    staleTime: 30_000,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => productsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produk berhasil ditambahkan!");
    },
    onError: () => toast.error("Gagal menambahkan produk"),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      productsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produk berhasil diperbarui!");
    },
  });
}

export function useDestroyProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => productsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produk berhasil dihapus!");
    },
  });
}
