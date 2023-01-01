import {
  IGetResponse,
  IGetListResponse,
  IGetOptionsResponse,
  IOption,
} from "../interfaces";
import { api } from "../services/api";
import { getAPIClient } from "../services/axios";

interface Category {
  id: string;
  title: string;
  type_id: string;
  active: boolean;
  created_at: string;
}

export async function getCategory(
  categoryId: string,
  ctx?: any
): Promise<IGetResponse<Category>> {
  try {
    const axiosApi = ctx ? getAPIClient(ctx) : api;

    const { data } = await axiosApi.get(`categories/${categoryId}`);

    const category = {
      id: data.id,
      title: data.title,
      type_id: data.type_id,
      active: data.active,
      created_at: new Date(data.created_at).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    };

    return {
      data: category,
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

export async function getCategoriesList(
  page: number,
  take: number
): Promise<IGetListResponse<Category>> {
  try {
    const { data } = await api.get(`categories?page=${page}&take=${take}`);

    const count = Number(data?.count);

    const list = data?.list.map((category: Category) => ({
      id: category.id,
      title: category.title,
      type_id: category.type_id,
      active: category.active,
      created_at: new Date(category.created_at).toLocaleDateString("pt-BR", {
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

export async function getCategoryOptions(
  ctx?: any
): Promise<IGetOptionsResponse> {
  try {
    const axiosApi = ctx ? getAPIClient(ctx) : api;

    const { data } = await axiosApi.get("categories/options");

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
