import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { useForm } from "react-hook-form";
import { number, object, string } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Flex,
  Heading,
  Divider,
  VStack,
  HStack,
  SimpleGrid,
  Button,
  useToast,
} from "@chakra-ui/react";
import { Input } from "../../components/Form/Input";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { api } from "../../services/api";
import { queryClient } from "../../services/queryClient";
import { toastError } from "../../utils/toastOptions";
import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";
import { Select } from "../../components/Form/Select";
import { IOption } from "../../interfaces";
import { getTransaction } from "../../requests/transactions";
import { getCategoryOptions } from "../../requests/categories";
import { Number } from "../../components/Form/Number";

interface ITransaction {
  id: string;
  title: string;
  category_id: string;
  amount: number;
  created_at: string;
}

interface IUpdateTransaction {
  hasError: boolean;
  message?: string;
  transaction?: ITransaction;
  categoryOptions: IOption[];
}

interface TransactionFormValues {
  id: string;
  title: string;
  category_id: string;
  amount: number;
}

const updateTransactionFormSchema = object().shape({
  title: string().required("Título obrigatório"),
  category_id: string().required("Categoria obrigatória"),
  amount: number().positive("Valor válido").required("Valor obrigatório"),
});

export default function UpdateTransaction({
  hasError,
  message,
  transaction,
  categoryOptions,
}: IUpdateTransaction) {
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (hasError && message) {
      toast(toastError(message));
      throw Error;
    }
  }, []);

  const { register, handleSubmit, formState } = useForm<TransactionFormValues>({
    defaultValues: {
      id: transaction?.id,
      title: transaction?.title,
      category_id: transaction?.category_id,
      amount: transaction?.amount,
    },
    resolver: yupResolver(updateTransactionFormSchema),
  });

  async function handleUpdateTransaction(values: TransactionFormValues) {
    await updateTransaction.mutateAsync(values);
    router.push("/transactions");
  }

  const updateTransaction = useMutation(
    async (transaction: TransactionFormValues) => {
      await api.put(`transactions/${transaction.id}`, transaction);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("transactions");
      },
      onError: ({ response }) => {
        toast(toastError(response?.data?.message));
        throw Error;
      },
    }
  );

  return (
    <Box>
      <Header />

      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <Box
          as="form"
          flex="1"
          borderRadius={8}
          bg="gray.800"
          p={["6", "8"]}
          onSubmit={handleSubmit(handleUpdateTransaction)}
        >
          <Heading size="lg" fontWeight="normal">
            Alterar transação
          </Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing={["6", "8"]}>
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                {...register("title")}
                name="title"
                type="text"
                label="Título"
                error={formState.errors.title}
              />
              <Select
                {...register("category_id")}
                name="category_id"
                options={categoryOptions}
                label="Tipo"
                error={formState.errors.category_id}
              />
              <Number
                {...register("amount")}
                name="amount"
                label="Título"
                error={formState.errors.amount}
              />
            </SimpleGrid>
          </VStack>

          <Flex mt={["6", "8"]} justify="flex-end">
            <HStack spacing="4">
              <Link href="/transactions" passHref>
                <Button
                  as="button"
                  colorScheme="whiteAlpha"
                  disabled={formState.isSubmitting}
                >
                  Cancelar
                </Button>
              </Link>
              <Button
                type="submit"
                colorScheme="teal"
                isLoading={formState.isSubmitting}
                loadingText="Carregando"
                disabled={formState.isSubmitting || hasError}
              >
                Salvar
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["jasfa.token"]: token } = parseCookies(ctx);

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { hasError, data, message } = await getTransaction(
    String(ctx.params?.slug),
    ctx
  );

  const { options } = await getCategoryOptions(ctx);

  return {
    props: {
      hasError,
      transaction: data,
      categoryOptions: options,
      message,
    },
  };
};
