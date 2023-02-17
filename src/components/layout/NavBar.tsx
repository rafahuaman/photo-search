import { MoonIcon, Search2Icon, SunIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  FormControl,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  VisuallyHidden,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Container from "./Container";

type SearchBar = {
  query: string;
};

export default function NavBar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  const searchQuery = router.query.query as string;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchBar>({
    defaultValues: {
      query: searchQuery,
    },
  });
  const onSubmit = (data: SearchBar) => {
    router.push({ pathname: "/search", query: { query: data.query } });
  };

  return (
    <Box
      as="nav"
      role="navigation"
      bg={useColorModeValue("white", "gray.900")}
      boxShadow="sm"
    >
      <Container py={{ base: "4", lg: "5" }}>
        <HStack
          alignItems={"center"}
          justifyContent={"space-between"}
          spacing={6}
        >
          <Text fontSize="xl" flexShrink={0}>
            Photo Search
          </Text>
          <Box as="form" onSubmit={handleSubmit(onSubmit)} w="full">
            <FormControl>
              <InputGroup variant={"filled"}>
                <InputLeftElement pointerEvents="none">
                  <Search2Icon color="gray.300" />
                </InputLeftElement>

                <Input
                  rounded={"full"}
                  type="search"
                  placeholder="Search"
                  {...register("query", {
                    required: "A search term is required",
                  })}
                />
              </InputGroup>
              <VisuallyHidden>
                {errors.query && errors.query.message}
              </VisuallyHidden>
            </FormControl>
          </Box>

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
        </HStack>
      </Container>
    </Box>
  );
}
