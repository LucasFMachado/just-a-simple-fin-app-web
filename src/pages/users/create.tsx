import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { useForm } from "react-hook-form";
import { object, ref, string } from "yup";
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

type UserValues = {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
};

const createUserFormSchema = object().shape({
  name: string().required("Nome obrigatório"),
  email: string().required("E-mail obrigatório").email("E-mail inválido"),
  password: string().required("Senha obrigatória"),
  password_confirm: string()
    .oneOf([ref("password")], "Senhas não são iguais")
    .required("Confirmação de senha obrigatória"),
});

export default function CreateUser() {
  const router = useRouter();
  const toast = useToast();

  const { register, handleSubmit, formState } = useForm<UserValues>({
    resolver: yupResolver(createUserFormSchema),
  });

  async function handleCreateUser(values: UserValues) {
    await createUser.mutateAsync(values);
    router.push("/users");
  }

  const createUser = useMutation(
    async (user: UserValues) => {
      await api.post("user", user);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
      onError: ({ response }) => {
        toast(toastError(response.statusText));
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
          onSubmit={handleSubmit(handleCreateUser)}
        >
          <Heading size="lg" fontWeight="normal">
            Criar usuário
          </Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing={["6", "8"]}>
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                {...register("name")}
                name="name"
                type="text"
                label="Nome"
                error={formState.errors.name}
              />
              <Input
                {...register("email")}
                name="email"
                type="email"
                label="E-mail"
                error={formState.errors.email}
              />
            </SimpleGrid>
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                {...register("password")}
                name="password"
                type="password"
                label="Senha"
                error={formState.errors.password}
              />
              <Input
                {...register("password")}
                name="password_confirm"
                type="password"
                label="Confirmar Senha"
                error={formState.errors.password_confirm}
              />
            </SimpleGrid>
          </VStack>

          <Flex mt={["6", "8"]} justify="flex-end">
            <HStack spacing="4">
              <Link href="/users" passHref>
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
                colorScheme="red"
                isLoading={formState.isSubmitting}
                loadingText="Carregando"
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

  return {
    props: {},
  };
};
