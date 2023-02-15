import { ChakraProvider } from "@chakra-ui/react";
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

export default function Providers({ children, pageProps }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient({}));
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ChakraProvider>{children}</ChakraProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}
