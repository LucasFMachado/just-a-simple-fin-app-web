import { ReactNode } from "react";
import { Box, Flex, Heading, Text, Spinner, Divider } from "@chakra-ui/react";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";

interface ContainerProps {
  title: string;
  isFetching: boolean;
  error: unknown;
  children: ReactNode;
}

export function Container({
  title,
  isFetching,
  error,
  children,
}: ContainerProps) {
  return (
    <Box>
      <Header />
      <Flex w="100%" my="3" maxWidth={1480} mx="auto" px="6">
        <Sidebar />

        <Box flex="1" borderRadius={8} bg="gray.800" p="3">
          <Flex mb="2" justify="space-between" align="center">
            <Heading size="lg" fontWeight="normal">
              <Text fontWeight="bold">{title}</Text>
              {isFetching && <Spinner size="sm" color="gray.500" ml="4" />}
            </Heading>
          </Flex>
          <Divider mb="5" mt="1" />
          {error ? (
            <Flex justify="center">
              <Text>Falha ao obter dados dos usuários.</Text>
            </Flex>
          ) : (
            children
          )}
        </Box>
      </Flex>
    </Box>
  );
}
