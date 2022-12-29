import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { AuthProvider } from "../contexts/AuthContext";
import { SidebarDrawerProvider } from "../contexts/SidebarDrawerContext";
import { queryClient } from "../services/queryClient";
import { theme } from "../styles/theme";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <SidebarDrawerProvider>
            <Component {...pageProps} />
          </SidebarDrawerProvider>
          <ReactQueryDevtools />
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}
