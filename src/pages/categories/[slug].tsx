import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { useForm } from "react-hook-form";
import { boolean, object, string } from "yup";
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
import { getCategory } from "../../requests/categories";
import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";
import { Select } from "../../components/Form/Select";
import { getTypeOptions } from "../../requests/types";
import { IOption } from "../../interfaces";
import { Switch } from "../../components/Form/Switch";

interface ICategory {
  id: string;
  title: string;
  type_id: string;
  active: boolean;
  created_at: string;
}

interface IUpdateCategory {
  hasError: boolean;
  message?: string;
  category?: ICategory;
  typeOptions: IOption[];
}

interface CategoryFormValues {
  id: string;
  title: string;
  type_id: string;
  active: boolean;
}

const updateCategoryFormSchema = object().shape({
  title: string().required("Título obrigatório"),
  type_id: string().required("Tipo obrigatório"),
  active: boolean(),
});

export default function UpdateCategory({
  hasError,
  message,
  category,
  typeOptions,
}: IUpdateCategory) {
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (hasError && message) {
      toast(toastError(message));
      throw Error;
    }
  }, []);

  const { register, handleSubmit, formState } = useForm<CategoryFormValues>({
    defaultValues: {
      id: category?.id,
      title: category?.title,
      type_id: category?.type_id,
      active: category?.active,
    },
    resolver: yupResolver(updateCategoryFormSchema),
  });

  async function handleUpdateCategory(values: CategoryFormValues) {
    await updateCategory.mutateAsync(values);
    router.push("/categories");
  }

  const updateCategory = useMutation(
    async (category: CategoryFormValues) => {
      await api.put(`categories/${category.id}`, category);
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
          onSubmit={handleSubmit(handleUpdateCategory)}
        >
          <Heading size="lg" fontWeight="normal">
            Alterar categoria
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
              <Switch
                {...register("active")}
                name="active"
                label="Ativo"
                error={formState.errors.active}
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

  const { hasError, data, message } = await getCategory(
    String(ctx.params?.slug),
    ctx
  );

  const { options } = await getTypeOptions(ctx);

  return {
    props: {
      hasError,
      category: data,
      typeOptions: options,
      message,
    },
  };
};
