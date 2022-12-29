import { UseToastOptions, theme } from "@chakra-ui/react";

export function toastError(title: string): UseToastOptions {
  return {
    title: title,
    status: "error",
    duration: 5000,
    isClosable: true,
    variant: "left-accent",
    position: "top",
    containerStyle: { color: theme.colors.red[600] },
  };
}

export function toastSuccess(title: string): UseToastOptions {
  return {
    title: title,
    status: "success",
    duration: 3000,
    isClosable: true,
    variant: "left-accent",
    position: "top",
    containerStyle: { color: theme.colors.green[600] },
  };
}

export function toastWarn(title: string): UseToastOptions {
  return {
    title: title,
    status: "warning",
    duration: 3000,
    isClosable: true,
    variant: "left-accent",
    position: "top",
    containerStyle: { color: theme.colors.yellow[600] },
  };
}

export function toastInfo(title: string): UseToastOptions {
  return {
    title: title,
    status: "info",
    duration: 3000,
    isClosable: true,
    variant: "left-accent",
    position: "top",
    containerStyle: { color: theme.colors.blue[600] },
  };
}
