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
  Icon,
  Flex,
} from "@chakra-ui/react";
import { useCategoriesList } from "../../hooks/useCategories";
import { Container } from "../../components/Table/Container";
import { Actions } from "../../components/Table/Actions";
import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { FiPlusSquare, FiMinusSquare } from "react-icons/fi";

export default function ListCategories() {
  const [page, setPage] = useState(0);
  const [take] = useState(10);
  const { data, isLoading, isFetching, error } = useCategoriesList(page, take);

  return (
    <Container
      title="Categorias"
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
            <Th px="1">Descrição</Th>
            <Th px="1" w="8"></Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.list.map((category) => {
            const typeColor = +category.type_id === 1 ? "green.400" : "red.400";
            const typeIcon =
              +category.type_id === 1 ? FiPlusSquare : FiMinusSquare;
            return (
              <Tr key={category.id}>
                <Td px="1">
                  <Flex>
                    <Icon
                      as={typeIcon}
                      fontSize="15"
                      mr="2"
                      color={typeColor}
                    />
                    <Text>{category.title}</Text>
                  </Flex>
                </Td>
                <Td px="1">
                  <Actions route="categories" id={category.id} />
                </Td>
              </Tr>
            );
          })}
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
