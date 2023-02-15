import { Flex } from "@chakra-ui/react";
import { SkipNavContent, SkipNavLink } from "@chakra-ui/skip-nav";
import { ReactNode } from "react";
import Footer from "./Footer";
import Main from "./Main";
import NavBar from "./NavBar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Flex direction="column" flex="1">
      <SkipNavLink>Skip to content</SkipNavLink>
      <NavBar />
      <Main>
        <SkipNavContent />
        {children}
      </Main>
      <Footer />
    </Flex>
  );
}
