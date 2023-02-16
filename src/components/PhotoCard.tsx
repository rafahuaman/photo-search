import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  HStack,
  Image,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

type PhotoCardProps = {
  url: string;
  photographerName: string;
  photographerUrl: string;
  alt: string;
};

function PhotoCard({
  url,
  photographerName,
  photographerUrl,
  alt,
}: PhotoCardProps) {
  return (
    <Box
      as="article"
      bg={useColorModeValue("white", "gray.800")}
      maxW="sm"
      borderWidth="1px"
      shadow="lg"
    >
      <Image src={url} alt={alt} />

      <Flex p="6" justifyContent="space-between" alignContent="center">
        <Link
          href={photographerUrl}
          isExternal
          fontSize="2xl"
          fontWeight="semibold"
        >
          <HStack>
            <Text>{photographerName}</Text>
            <ExternalLinkIcon />
          </HStack>
        </Link>
      </Flex>
    </Box>
  );
}

export default PhotoCard;
