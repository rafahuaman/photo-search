import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  HStack,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Image from "next/image";

type PhotoCardProps = {
  id: number;
  url: string;
  photographerName: string;
  photographerUrl: string;
  alt: string;
  priority: boolean;
};
const PHOTO_CARD_IMAGE_WIDTH = 940;
const PHOTO_CARD_IMAGE_HEIGHT = 650;

function PhotoCard({
  id,
  url,
  photographerName,
  photographerUrl,
  alt,
  priority,
}: PhotoCardProps) {
  return (
    <Box
      as="article"
      bg={useColorModeValue("white", "gray.800")}
      maxW="sm"
      borderWidth="1px"
      shadow="lg"
      data-testid={`photo-card-${id}`}
    >
      <Image
        src={url}
        alt={alt}
        width={PHOTO_CARD_IMAGE_WIDTH}
        height={PHOTO_CARD_IMAGE_HEIGHT}
        priority={priority}
      />

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
