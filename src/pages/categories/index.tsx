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
  useBreakpointValue,
} from "@chakra-ui/react";
import { useCategoriesList } from "../../hooks/useCategories";
import { Container } from "../../components/Table/Container";
import { Actions } from "../../components/Table/Actions";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";

export default function ListCategories() {
  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  });

  const [page, setPage] = useState(0);
  const [take] = useState(10);
  const { data, isLoading, isFetching, error } = useCategoriesList(page, take);

  return (
    <Container
      title="Usuários"
      createRoute="/categories/create"
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
            <Th>Usuário</Th>
            {isWideVersion && <Th>Data de Cadastro</Th>}
            <Th w="8"></Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.list.map((category) => (
            <Tr key={category.id}>
              <Td>
                <Box>
                  <Text color="teal.400">
                    <Text fontWeight="bold">{category.title}</Text>
                  </Text>
                  {/* <Text fontSize="small" color="gray.300">
                    {category.email}
                  </Text> */}
                </Box>
              </Td>
              {isWideVersion && <Td>{category.created_at}</Td>}
              <Td>
                <Actions route="categories" id={category.id} />
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
