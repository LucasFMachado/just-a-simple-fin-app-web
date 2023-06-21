import { IGetResponse, IGetListResponse, ITransaction } from "../interfaces";
import { api } from "../services/api";
import { getAPIClient } from "../services/axios";

export async function getTransaction(
  transactionId: string,
  ctx?: any
): Promise<IGetResponse<ITransaction>> {
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
    } as ITransaction;

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
): Promise<IGetListResponse<ITransaction>> {
  try {
    const { data } = await api.get(`transactions?page=${page}&take=${take}`);

    const count = Number(data?.count);

    const list = data?.list.map((transaction: ITransaction) => ({
      id: transaction.id,
      title: transaction.title,
      category_id: transaction.category_id,
      amount: Number(transaction.amount).toFixed(2),
      created_at: new Date(transaction.created_at).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    })) as ITransaction[];

    return {
      list,
      count,
    };
  } catch (err) {
    throw Error;
  }
}
