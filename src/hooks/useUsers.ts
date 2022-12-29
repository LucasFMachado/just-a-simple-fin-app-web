import { useQuery } from "react-query";
import { getUsersList } from "../requests/users";

export function useUsersList(page: number, take: number) {
  return useQuery(["users", page], () => getUsersList(page, take), {
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}
