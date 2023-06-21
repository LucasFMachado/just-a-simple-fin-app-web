import { useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useTransactionsList } from "../../hooks/useTransactions";
import { Container } from "../../components/Table/Container";
import { Actions } from "../../components/Table/Actions";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";

export default function ListTransactions() {
  const [lineChecked, setLineChecked] = useState("");
  const [page, setPage] = useState(0);
  const [take] = useState(10);
  const { data, isLoading, isFetching, error } = useTransactionsList(
    page,
    take
  );

  return (
    <Container
      title="Transações"
      createRoute="/transactions/create"
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      totalRegisters={data?.count || 0}
      currentPage={page}
      onPageChange={setPage}
    >
      <Table colorScheme="whiteAlpha">
        <Thead>
          <Tr>
            <Th px="1">Transação</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.list.map((transaction) => (
            <Tr
              key={transaction.id}
              onClick={() => setLineChecked(transaction.id)}
            >
              <Td px="1">
                <Box>
                  <Text fontWeight="bold" color="teal.400" mb="1">
                    {transaction.title}
                  </Text>
                  <Text>R$ {transaction.amount}</Text>
                </Box>
                {lineChecked == transaction.id && (
                  <Actions route="transactions" id={transaction.id} />
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
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
