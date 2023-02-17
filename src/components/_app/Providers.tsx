import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import type { StyleFunctionProps } from "@chakra-ui/styled-system";
import { mode } from "@chakra-ui/theme-tools";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";

interface ProvidersProps {
  children: React.ReactNode;
  pageProps: { dehydratedState: unknown };
}

const chakraOverrides = extendTheme({
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: mode("gray.50", "gray.800")(props),
      },
    }),
  },
});

export default function Providers({ children, pageProps }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient({}));
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ChakraProvider theme={chakraOverrides}>{children}</ChakraProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}
