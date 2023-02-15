import { Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import Footer from "./Footer";
import Main from "./Main";
import NavBar from "./NavBar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Flex direction="column" flex="1">
      <NavBar />
      <Main>{children}</Main>
      <Footer />
    </Flex>
  );
}
