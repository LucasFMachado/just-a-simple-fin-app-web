import {
  IGetResponse,
  IGetListResponse,
  IGetOptionsResponse,
  IOption,
  ICategory,
} from "../interfaces";
import { api } from "../services/api";
import { getAPIClient } from "../services/axios";

export async function getCategory(
  categoryId: string,
  ctx?: any
): Promise<IGetResponse<ICategory>> {
  try {
    const axiosApi = ctx ? getAPIClient(ctx) : api;

    const { data } = await axiosApi.get(`categories/${categoryId}`);

    const category = {
      id: data.id,
      title: data.title,
      type_id: data.type_id,
      type: data.type,
      active: data.active,
      created_at: new Date(data.created_at).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    } as ICategory;

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
): Promise<IGetListResponse<ICategory>> {
  try {
    const { data } = await api.get(`categories?page=${page}&take=${take}`);

    const count = Number(data?.count);

    const list = data?.list.map((category: ICategory) => ({
      id: category.id,
      title: category.title,
      type_id: category.type_id,
      type: category.type,
      active: category.active,
      created_at: new Date(category.created_at).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    })) as ICategory[];

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
