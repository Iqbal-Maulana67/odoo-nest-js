import { salesApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useSales(params?: {
  limit?: number;
  offset?: number;
  search?: string;
  sortDate?: string;
}) {
  return useQuery({
    queryKey: ["sales", params],
    queryFn: async () => {
      const { data } = await salesApi.getAll(params);
      return data;
    },
    staleTime: 30_000,
  });
}

export function useSalesDetail(id: number) {
  return useQuery({
    queryKey: ["saleDetail", id],
    queryFn: async () => {
      const { data } = await salesApi.getOne(id);
      return data;
    },
    staleTime: 30_000,
  });
}
