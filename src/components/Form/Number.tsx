import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";
import {
  FormControl,
  FormLabel,
  NumberInput as ChakraNumberInput,
  NumberInputField as ChakraNumberInputField,
  NumberInputFieldProps as ChakraNumberInputFieldProps,
  FormErrorMessage,
} from "@chakra-ui/react";

interface NumberInputProps extends ChakraNumberInputFieldProps {
  name: string;
  label?: string;
  error?: FieldError;
}

const NumberInputBase: ForwardRefRenderFunction<
  HTMLInputElement,
  NumberInputProps
> = ({ name, label, error = null, ...rest }, ref) => {
  return (
    <FormControl isInvalid={!!error}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <ChakraNumberInput
        size="lg"
        focusBorderColor="teal.500"
        variant="filled"
        precision={2}
        step={0.2}
      >
        <ChakraNumberInputField
          id={name}
          name={name}
          type="tel"
          bg="gray.900"
          _hover={{
            bg: "gray.900",
          }}
          ref={ref}
          {...rest}
        />
      </ChakraNumberInput>
      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const Number = forwardRef(NumberInputBase);
