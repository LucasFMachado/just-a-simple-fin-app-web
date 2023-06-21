import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  fonts: {
    heading: "Montserrat",
    body: "Montserrat",
  },
  styles: {
    global: {
      body: {
        bg: "gray.900",
        color: "gray.50",
      },
      html: {
        "@media (max-width: 960px)": {
          fontSize: "93.75%",
        },
        "@media (max-width: 768px)": {
          fontSize: "87.5%",
        },
        "@media (max-width: 600px)": {
          fontSize: "81.25%",
        },
      },
    },
  },
});
