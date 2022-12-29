import { useEffect } from "react";
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
import { getUser } from "../../requests/users";
import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";

interface IUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface IUpdateUser {
  hasError: boolean;
  message?: string;
  user?: IUser;
}

interface UserFormValues {
  id: string;
  name: string;
  email: string;
  // createdAt: string;
}

const updateUserFormSchema = object().shape({
  name: string().required("Nome obrigatório"),
  email: string().required("E-mail obrigatório").email("E-mail inválido"),
  password: string().required("Senha obrigatória"),
  password_confirm: string()
    .oneOf([ref("password")], "Senhas não são iguais")
    .required("Confirmação de senha obrigatória"),
});

export default function UpdateUser({ hasError, message, user }: IUpdateUser) {
  const router = useRouter();
  const toast = useToast();
  // const [response, setResponse] = useState<IGetResponse<User>>({
  //   hasError: false,
  //   message: "",
  //   data: undefined,
  // });

  // useEffect(() => {
  //   async function requestUser() {
  //     const { hasError, user, message } = await getUser(String(slug));
  //     setResponse({ hasError, user, message });
  //     if (hasError) {
  //       toast(toastError(message));
  //       throw Error;
  //     }
  //   }
  //   requestUser();
  // }, []);

  useEffect(() => {
    if (hasError && message) {
      toast(toastError(message));
      throw Error;
    }
  }, []);

  const { register, handleSubmit, formState } = useForm<UserFormValues>({
    defaultValues: {
      id: user?.id,
      name: user?.name,
      email: user?.email,
    },
    resolver: yupResolver(updateUserFormSchema),
  });

  console.warn("handleSubmit", handleSubmit);

  async function handleUpdateUser(values: UserFormValues) {
    console.warn(["entrou aqui:: ", values]);
    await updateUser.mutateAsync(values);
    router.push("/users");
  }

  const updateUser = useMutation(
    async (user: UserFormValues) => {
      await api.put(`user/${user.id}`, user);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
      onError: ({ res }) => {
        toast(toastError(res.statusText));
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
          onSubmit={handleSubmit(handleUpdateUser)}
        >
          <Heading size="lg" fontWeight="normal">
            Alterar usuário
          </Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing={["6", "8"]}>
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                {...register("name")}
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

  const { hasError, data, message } = await getUser(
    String(ctx.params?.slug),
    ctx
  );

  return {
    props: {
      hasError,
      user: data,
      message,
    },
  };
};
