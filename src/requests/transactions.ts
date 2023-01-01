import { IGetResponse, IGetListResponse } from "../interfaces";
import { api } from "../services/api";
import { getAPIClient } from "../services/axios";

interface Transaction {
  id: string;
  title: string;
  category_id: string;
  amount: number;
  created_at: string;
}

export async function getTransaction(
  transactionId: string,
  ctx?: any
): Promise<IGetResponse<Transaction>> {
  try {
    const axiosApi = ctx ? getAPIClient(ctx) : api;

    const { data } = await axiosApi.get(`transactions/${transactionId}`);

    const transaction = {
      id: data.id,
      title: data.title,
      category_id: data.category_id,
      amount: data.amount,
      created_at: new Date(data.created_at).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    };

    return {
      data: transaction,
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

export async function getTransactionsList(
  page: number,
  take: number
): Promise<IGetListResponse<Transaction>> {
  try {
    const { data } = await api.get(`transactions?page=${page}&take=${take}`);

    const count = Number(data?.count);

    const list = data?.list.map((transaction: Transaction) => ({
      id: transaction.id,
      title: transaction.title,
      category_id: transaction.category_id,
      amount: transaction.amount,
      created_at: new Date(transaction.created_at).toLocaleDateString("pt-BR", {
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
