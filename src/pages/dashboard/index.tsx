import { Box, Text, SimpleGrid, VStack, Spinner, Flex } from "@chakra-ui/react";
import { useTransactionsList } from "../../hooks/useTransactions";

import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { Container } from "../../components/Metrics/Container";

export default function Dashboard() {
  const { data, isLoading, isFetching, error } = useTransactionsList(0, 10);

  const outAmount = 111;
  const inAmount = 150;
  const totalAmount = inAmount - outAmount;

  return (
    <Container title="Dashboard" isFetching={isFetching} error={error}>
      <VStack>
        <SimpleGrid
          minChildWidth="240px"
          spacing={["6", "8"]}
          columns={[1, 3]}
          w="100%"
        >
          <Box
            bg="red.400"
            color="black"
            p="3"
            borderRadius={8}
            textColor="white"
          >
            <Text>Saídas:</Text>
            {isLoading ? (
              <Flex justify="center" p={2}>
                <Spinner size="lg" color="white" />
              </Flex>
            ) : (
              <Text fontWeight="semibold" fontSize="3xl">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "EUR",
                }).format(outAmount)}
              </Text>
            )}
          </Box>
          <Box
            bg="blue.400"
            color="black"
            p="3"
            borderRadius={8}
            textColor="white"
          >
            <Text>Entradas:</Text>
            {isLoading ? (
              <Flex justify="center" p={2}>
                <Spinner size="lg" color="white" />
              </Flex>
            ) : (
              <Text fontWeight="semibold" fontSize="3xl">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "EUR",
                }).format(inAmount)}
              </Text>
            )}
          </Box>
          <Box
            bg="green.400"
            color="black"
            p="3"
            borderRadius={8}
            textColor="white"
          >
            <Text>Total:</Text>
            {isLoading ? (
              <Flex justify="center" p={2}>
                <Spinner size="lg" color="white" />
              </Flex>
            ) : (
              <Text fontWeight="semibold" fontSize="3xl">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "EUR",
                }).format(totalAmount)}
              </Text>
            )}
          </Box>
        </SimpleGrid>
      </VStack>
    </Container>
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
