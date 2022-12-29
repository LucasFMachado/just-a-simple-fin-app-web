import { IGetResponse, IGetListResponse } from "../interfaces";
import { api } from "../services/api";
import { getAPIClient } from "../services/axios";

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export async function getUser(
  userId: string,
  ctx?: any
): Promise<IGetResponse<User>> {
  try {
    const axiosApi = ctx ? getAPIClient(ctx) : api;

    const { data } = await axiosApi.get(`user/${userId}`);

    const user = {
      id: data.id,
      name: data.name,
      email: data.email.toLowerCase(),
      createdAt: new Date(data.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    };

    return {
      data: user,
      hasError: false,
      message: "",
    };
  } catch (err) {
    return {
      data: undefined,
      hasError: true,
      message: "Ocorreu um erro ao buscar os dados",
    };
  }
}

export async function getUsersList(
  page: number,
  take: number
): Promise<IGetListResponse<User>> {
  try {
    const { data } = await api.get(`user?page=${page}&take=${take}`);

    const count = Number(data?.count);

    const list = data?.list.map((user: User) => ({
      id: user.id,
      name: user.name,
      email: user.email.toLowerCase(),
      createdAt: new Date(user.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    }));

    return {
      list,
      count,
    };
  } catch (err) {
    throw Error;
  }
}
