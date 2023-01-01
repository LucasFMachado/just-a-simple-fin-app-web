import { useQuery } from "react-query";
import { getCategoriesList } from "../requests/categories";

export function useCategoriesList(page: number, take: number) {
  return useQuery(["categories", page], () => getCategoriesList(page, take), {
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}
