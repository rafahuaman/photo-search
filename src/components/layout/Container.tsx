import { Container as ChakraContainer, ContainerProps } from "@chakra-ui/react";

export default function Container({ children, ...props }: ContainerProps) {
  return (
    <ChakraContainer px={{ base: 4, lg: 0 }} maxW="container.xl" {...props}>
      {children}
    </ChakraContainer>
  );
}
