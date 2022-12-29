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
    <Flex justify="center">
      <NextLink href={`/${route}/${id}`} passHref>
        <Button
          as="button"
          size="sm"
          fontSize="sm"
          colorScheme="blue"
          leftIcon={<Icon as={RiPencilLine} fontSize="16" />}
        >
          Alterar
        </Button>
      </NextLink>
      <Button
        onClick={onOpen}
        size="sm"
        ml="1"
        fontSize="sm"
        colorScheme="red"
        leftIcon={<Icon as={RiDeleteBinLine} fontSize="16" />}
      >
        Deletar
      </Button>

      <DeleteModal isOpen={isOpen} onClose={onClose} route={route} id={id} />
    </Flex>
  );
}
