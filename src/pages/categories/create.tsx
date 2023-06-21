import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
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
import { getTypeOptions } from "../../requests/types";
import { IOption } from "../../interfaces";

interface ICreateCategory {
  typeOptions: IOption[];
}

type CategoryValues = {
  title: string;
  type_id: string;
};

const createCategoryFormSchema = object().shape({
  title: string().required("Título obrigatório"),
  type_id: string().required("Tipo obrigatório"),
});

export default function CreateCategory({ typeOptions }: ICreateCategory) {
  const router = useRouter();
  const toast = useToast();

  const { register, handleSubmit, formState } = useForm<CategoryValues>({
    resolver: yupResolver(createCategoryFormSchema),
  });

  async function handleCreateCategory(values: CategoryValues) {
    await createCategory.mutateAsync(values);
    router.push("/categories");
  }

  const createCategory = useMutation(
    async (category: CategoryValues) => {
      await api.post("categories", category);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("categories");
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
          onSubmit={handleSubmit(handleCreateCategory)}
        >
          <Heading size="lg" fontWeight="normal">
            Criar categoria
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
                {...register("type_id")}
                name="type_id"
                options={typeOptions}
                label="Tipo"
                error={formState.errors.type_id}
              />
            </SimpleGrid>
          </VStack>

          <Flex mt={["6", "8"]} justify="flex-end">
            <HStack spacing="4">
              <Link href="/categories" passHref>
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

  const { options } = await getTypeOptions(ctx);

  return {
    props: {
      typeOptions: options,
    },
  };
};
