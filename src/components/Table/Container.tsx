import { ReactNode } from "react";
import NextLink from "next/link";
import {
  Box,
  Flex,
  Heading,
  Button,
  Text,
  Icon,
  Spinner,
  Divider,
} from "@chakra-ui/react";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { RiAddLine } from "react-icons/ri";
import { Pagination } from "./Pagination";
import { Search } from "./Search";

interface ContainerProps {
  title: string;
  createRoute: string;
  isLoading: boolean;
  isFetching: boolean;
  error: unknown;
  totalRegisters: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  // onExecuteSearch: (searchText: string) => void;
  children: ReactNode;
}

export function Container({
  title,
  createRoute,
  isLoading,
  isFetching,
  error,
  totalRegisters,
  currentPage,
  onPageChange,
  // onExecuteSearch,
  children,
}: ContainerProps) {
  return (
    <Box>
      <Header />
      <Flex w="100%" my="3" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="gray.800" p="6">
          <Flex mb="2" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              <Text fontWeight="bold">{title}</Text>
              {!isLoading && isFetching && (
                <Spinner size="sm" color="gray.500" ml="4" />
              )}
            </Heading>
          </Flex>
          <Divider mb="5" mt="1" />
          <Flex mb="4" justify="space-between" align="center">
            <NextLink href={createRoute} passHref>
              <Button
                as="button"
                size="sm"
                fontSize="sm"
                colorScheme="teal"
                leftIcon={<Icon as={RiAddLine} fontSize="20" />}
              >
                Criar novo
              </Button>
            </NextLink>

            {/* <Search isLoading={isLoading} onExecuteSearch={onExecuteSearch} /> */}
          </Flex>
          {isLoading ? (
            <Flex justify="center">
              <Spinner />
            </Flex>
          ) : error ? (
            <Flex justify="center">
              <Text>Falha ao obter dados dos usuários.</Text>
            </Flex>
          ) : (
            children
          )}
          <Pagination
            totalCountRegisters={totalRegisters}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </Box>
      </Flex>
    </Box>
  );
}
