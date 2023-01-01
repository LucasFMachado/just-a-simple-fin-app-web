import {
  IGetResponse,
  IGetListResponse,
  IGetOptionsResponse,
  IOption,
} from "../interfaces";
import { api } from "../services/api";
import { getAPIClient } from "../services/axios";

interface Type {
  id: string;
  title: string;
  active: boolean;
  created_at: string;
}

export async function getType(
  typeId: string,
  ctx?: any
): Promise<IGetResponse<Type>> {
  try {
    const axiosApi = ctx ? getAPIClient(ctx) : api;

    const { data } = await axiosApi.get(`types/${typeId}`);

    const type = {
      id: data.id,
      title: data.title,
      active: data.active,
      created_at: new Date(data.created_at).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    };

    return {
      data: type,
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

export async function getTypesList(
  page: number,
  take: number
): Promise<IGetListResponse<Type>> {
  try {
    const { data } = await api.get(`types?page=${page}&take=${take}`);

    const count = Number(data?.count);

    const list = data?.list.map((type: Type) => ({
      id: type.id,
      title: type.title,
      active: type.active,
      created_at: new Date(type.created_at).toLocaleDateString("pt-BR", {
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

export async function getTypeOptions(ctx?: any): Promise<IGetOptionsResponse> {
  try {
    const axiosApi = ctx ? getAPIClient(ctx) : api;

    const { data } = await axiosApi.get("types/options");

    const options = data?.map((option: IOption) => ({
      value: option.value,
      label: option.label,
    }));

    return {
      options,
    };
  } catch (err) {
    throw Error;
  }
}
