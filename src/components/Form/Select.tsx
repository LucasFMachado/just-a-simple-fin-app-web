import { forwardRef, ForwardRefRenderFunction } from "react";
import { FieldError } from "react-hook-form";
import {
  FormControl,
  FormLabel,
  Select as ChakraSelect,
  SelectProps as ChakraSelectProps,
  FormErrorMessage,
} from "@chakra-ui/react";
import { IOption } from "../../interfaces";

interface SelectProps extends ChakraSelectProps {
  name: string;
  label?: string;
  options: IOption[];
  error?: FieldError | undefined;
}

const SelectBase: ForwardRefRenderFunction<HTMLSelectElement, SelectProps> = (
  { name, label, value, options, error, ...rest },
  ref
) => {
  return (
    <FormControl isInvalid={!!error}>
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
      <ChakraSelect
        id={name}
        name={name}
        value={value}
        focusBorderColor="teal.500"
        bg="gray.900"
        variant="filled"
        _hover={{
          bg: "gray.900",
        }}
        size="lg"
        ref={ref}
        {...rest}
      >
        {options?.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </ChakraSelect>
      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const Select = forwardRef(SelectBase);
