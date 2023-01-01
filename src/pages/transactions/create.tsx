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
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { Select } from "../../components/Form/Select";
import { getCategoryOptions } from "../../requests/categories";
import { IOption } from "../../interfaces";
import { Number } from "../../components/Form/Number";

interface ICreateTransaction {
  categoryOptions: IOption[];
}

type TransactionValues = {
  title: string;
  category_id: string;
  amount: number;
};

const createTransactionFormSchema = object().shape({
  title: string().required("Título obrigatório"),
  category_id: string().required("Categoria obrigatória"),
  amount: number().positive().required("Valor obrigatório"),
});

export default function CreateTransaction({
  categoryOptions,
}: ICreateTransaction) {
  const router = useRouter();
  const toast = useToast();

  const { register, handleSubmit, formState } = useForm<TransactionValues>({
    resolver: yupResolver(createTransactionFormSchema),
  });

  async function handleCreateTransaction(values: TransactionValues) {
    await createTransaction.mutateAsync(values);
    router.push("/transactions");
  }

  const createTransaction = useMutation(
    async (transaction: TransactionValues) => {
      await api.post("transactions", transaction);
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
          onSubmit={handleSubmit(handleCreateTransaction)}
        >
          <Heading size="lg" fontWeight="normal">
            Criar transação
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
              >
                Criar
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

  const { options } = await getCategoryOptions(ctx);

  return {
    props: {
      categoryOptions: options,
    },
  };
};
