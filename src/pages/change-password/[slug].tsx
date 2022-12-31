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
import { toastError } from "../../utils/toastOptions";
import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";

interface IChangePassword {
  slug: string;
}

interface ChangePasswordFormValues {
  id: string;
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

const updateUserFormSchema = object().shape({
  old_password: string().required("old password is not defined!"),
  new_password: string().required("New password is not defined!"),
  new_password_confirm: string()
    .oneOf([ref("new_password")], "Passwords does not match!")
    .required("New password confirmation is not defined!"),
});

export default function ChangePassword({ slug }: IChangePassword) {
  const router = useRouter();
  const toast = useToast();

  const { register, handleSubmit, formState } =
    useForm<ChangePasswordFormValues>({
      defaultValues: {
        id: slug,
        old_password: "",
        new_password: "",
        new_password_confirm: "",
      },
      resolver: yupResolver(updateUserFormSchema),
    });

  async function handleUpdateUser(values: ChangePasswordFormValues) {
    await updateUser.mutateAsync(values);
    router.push("/dashboard");
  }

  const updateUser = useMutation(
    async (values: ChangePasswordFormValues) => {
      await api.put(`/users/change-password/${values.id}`, values);
    },
    {
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
          onSubmit={handleSubmit(handleUpdateUser)}
        >
          <Heading size="lg" fontWeight="normal">
            Alterar senha
          </Heading>

          <Divider my="6" borderColor="gray.700" />

          <VStack spacing={["6", "8"]}>
            <SimpleGrid minChildWidth="240px" spacing={["6", "8"]} w="100%">
              <Input
                {...register("old_password")}
                name="old_password"
                type="password"
                label="Antiga senha"
                error={formState.errors.old_password}
              />
              <Input
                {...register("new_password")}
                name="new_password"
                type="password"
                label="Nova senha"
                error={formState.errors.new_password}
              />
              <Input
                {...register("new_password_confirm")}
                name="new_password_confirm"
                type="password"
                label="Confirmar nova senha"
                error={formState.errors.new_password_confirm}
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
                disabled={formState.isSubmitting}
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
    props: {
      slug: String(ctx.params?.slug),
    },
  };
};
