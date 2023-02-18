import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, RenderOptions } from "@testing-library/react";
import { setMedia } from "mock-match-media";
import React, { ReactElement } from "react";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
  logger: {
    log: console.log,
    warn: console.warn,
    // no more errors on the console for tests
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    error: process.env.NODE_ENV === "test" ? jest.fn() : console.error,
  },
});

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>{children}</ChakraProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything from testing-library
export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
// override render method
export { customRender as render };

export const setMobileScreen = () => {
  // Based on Iphone 7 screen size
  setMedia({
    width: "375px",
    type: "screen",
    orientation: "portrait",
  });
};

export const setDesktopScreen = () => {
  setMedia({
    width: "993px",
    type: "screen",
    orientation: "portrait",
  });
};
