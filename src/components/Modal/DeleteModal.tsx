import { useState } from "react";
import {
  Button,
  Text,
  Modal,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "react-query";
import { api } from "../../services/api";
import { queryClient } from "../../services/queryClient";
import { toastError } from "../../utils/toastOptions";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: string;
  id: string;
}

export function DeleteModal({ isOpen, onClose, route, id }: DeleteModalProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await deleteItem.mutateAsync();
    setLoading(false);
  }

  const deleteItem = useMutation(
    async () => {
      await api.delete(`${route}/${id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(route);
        onClose();
      },
      onError: ({ response }) => {
        toast(toastError(response?.data?.message));
        throw Error;
      },
    }
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="gray.800">
        <ModalHeader>
          <Text>Deletar item?</Text>
        </ModalHeader>
        <ModalCloseButton disabled={loading} />
        <ModalBody>Tem certeza que deseja deletar o item?</ModalBody>

        <ModalFooter>
          <Button
            mr="3"
            onClick={onClose}
            colorScheme="whiteAlpha"
            disabled={loading}
          >
            Fechar
          </Button>
          <Button
            onClick={handleDelete}
            colorScheme="red"
            isLoading={loading}
            loadingText="Carregando"
          >
            Deletar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
