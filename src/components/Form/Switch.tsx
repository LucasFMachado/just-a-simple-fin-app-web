import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";
import {
  FormControl,
  FormLabel,
  Switch as ChakraSwitch,
  SwitchProps as ChakraSwitchProps,
  FormErrorMessage,
  Flex,
} from "@chakra-ui/react";

interface SwitchProps extends ChakraSwitchProps {
  name: string;
  label?: string;
  error?: FieldError | undefined;
}

const SwitchBase: ForwardRefRenderFunction<HTMLInputElement, SwitchProps> = (
  { name, label, value, error, ...rest },
  ref
) => {
  return (
    <FormControl isInvalid={!!error}>
      {label && (
        <FormLabel textAlign="center" htmlFor={name}>
          {label}
        </FormLabel>
      )}
      <Flex mt="4" justify="center">
        <ChakraSwitch
          id={name}
          name={name}
          value={value}
          colorScheme="teal"
          bg="gray.900"
          variant="filled"
          _hover={{
            bg: "gray.900",
          }}
          size="lg"
          ref={ref}
          {...rest}
        />
      </Flex>
      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const Switch = forwardRef(SwitchBase);
