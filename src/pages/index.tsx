import { useAuth } from "../contexts/AuthContext";
import { useForm } from "react-hook-form";
import Image from "next/image";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Flex, Button, Stack } from "@chakra-ui/react";
import { Input } from "../components/Form/Input";
import { PageTitle } from "../components/PageTitle";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";

interface SingInFormValues {
  email: string;
  password: string;
}

const signInFormSchema = yup.object().shape({
  email: yup.string().required("Email obrigatório"),
  password: yup.string().required("Senha obrigatória"),
});

export default function Home() {
  const { signIn } = useAuth();

  const { register, handleSubmit, formState } = useForm<SingInFormValues>({
    resolver: yupResolver(signInFormSchema),
  });

  async function handleSignIn(values: SingInFormValues) {
    await signIn(values);
  }

  return (
    <>
      <PageTitle title="Login" />
      <Flex w="100vw" h="100vh" align="center" justify="center">
        <Flex
          as="form"
          w="100%"
          maxWidth={360}
          bg="gray.800"
          p={["6", "8"]}
          borderRadius={8}
          flexDir="column"
          onSubmit={handleSubmit(handleSignIn)}
        >
          <Stack spacing="4">
            <Flex as="div" justify="center" mb="4">
              <Image
                src="/images/piggy-bank.png"
                alt="Logo"
                width={200}
                height={225}
              />
            </Flex>
            <Input
              {...register("email")}
              name="email"
              type="email"
              label="E-mail"
              error={formState.errors.email}
            />
            <Input
              {...register("password")}
              name="password"
              type="password"
              label="Senha"
              error={formState.errors.password}
            />
          </Stack>

          <Button
            type="submit"
            mt="6"
            colorScheme="teal"
            size="lg"
            isLoading={formState.isSubmitting}
          >
            Entrar
          </Button>
        </Flex>
      </Flex>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { ["jasfa.token"]: token } = parseCookies(ctx);

  if (token) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
