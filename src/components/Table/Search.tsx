import { KeyboardEvent, useState } from "react";
import { Button, Icon, FormControl, Input } from "@chakra-ui/react";
import { RiSearchLine } from "react-icons/ri";

interface SearchProps {
  isLoading: boolean;
  onExecuteSearch: (searchText: string) => void;
}

export function Search({ isLoading, onExecuteSearch }: SearchProps) {
  const [searchValue, setSearchValue] = useState("");

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter") {
      onExecuteSearch(searchValue);
    }
  }

  return (
    <FormControl w="fit-content">
      <Input
        id="searchText"
        name="searchText"
        type="text"
        placeholder="Pesquisar"
        value={searchValue}
        onChange={({ target }) => setSearchValue(target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
        border="1px"
        borderColor="teal"
        focusBorderColor="teal"
        borderRadius="md"
        w="15rem"
        bg="gray.900"
        variant="outline"
        _hover={{
          bg: "gray.900",
        }}
        size="sm"
      />
      <Button
        as="button"
        variant="outline"
        border="1px"
        borderColor="teal"
        position="relative"
        top="-1px"
        ml="1"
        colorScheme="gray"
        size="sm"
        _hover={{
          bg: "gray.900",
        }}
        onClick={() => onExecuteSearch(searchValue)}
      >
        <Icon as={RiSearchLine} fontSize="13" />
      </Button>
    </FormControl>
  );
}
