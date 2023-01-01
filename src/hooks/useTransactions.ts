import { useQuery } from "react-query";
import { getTransactionsList } from "../requests/transactions";

export function useTransactionsList(page: number, take: number) {
  return useQuery(
    ["transactions", page],
    () => getTransactionsList(page, take),
    {
      staleTime: 1000 * 60 * 10, // 10 minutos
    }
  );
}
