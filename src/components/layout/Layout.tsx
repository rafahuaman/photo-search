import { Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import Container from "./Container";

import NavBar from "./NavBar";

function Main({ children }: { children: ReactNode }) {
  return (
    <Flex as="main" role="main" direction="column" flex="1" py="16">
      <Container flex="1">{children}</Container>
    </Flex>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Flex direction="column" flex="1">
      <NavBar />
      <Main>{children}</Main>
    </Flex>
  );
}
