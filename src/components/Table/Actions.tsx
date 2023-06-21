import NextLink from "next/link";
import { Flex, Button, Icon, useDisclosure } from "@chakra-ui/react";
import { RiDeleteBinLine, RiPencilLine } from "react-icons/ri";
import { DeleteModal } from "../Modal/DeleteModal";

interface Actionsprops {
  route: string;
  id: string;
}

export function Actions({ route, id }: Actionsprops) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex justify="center" mt="3">
      <NextLink href={`/${route}/${id}`} passHref>
        <Button
          as="button"
          size="md"
          fontSize="md"
          colorScheme="cyan"
          leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
        >
          Alterar
        </Button>
      </NextLink>
      <Button
        onClick={onOpen}
        size="md"
        ml="3"
        fontSize="md"
        colorScheme="orange"
        leftIcon={<Icon as={RiDeleteBinLine} fontSize="16" />}
      >
        Deletar
      </Button>

      <DeleteModal isOpen={isOpen} onClose={onClose} route={route} id={id} />
    </Flex>
  );
}
