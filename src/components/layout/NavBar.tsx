import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  IconButton,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import Container from "./Container";

export default function NavBar() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box
      as="nav"
      role="navigation"
      bg={useColorModeValue("white", "gray.900")}
      boxShadow="sm"
    >
      <Container py={{ base: "4", lg: "5" }}>
        <Flex alignItems={"center"} justifyContent={"space-between"}>
          <Text fontSize="xl">Photo Search</Text>

          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              <IconButton
                variant="ghost"
                aria-label="Toggle Dark Mode"
                icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
              />
            </Stack>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}
