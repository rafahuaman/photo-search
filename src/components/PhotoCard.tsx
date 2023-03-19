import { hexColorDataUrl } from "@/utils/hexColorDataUrl";
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
  originalWidth: number;
  originalHeight: number;
  placeholderColor: string;
};
const PHOTO_CARD_IMAGE_WIDTH = 460;

function PhotoCard({
  id,
  url,
  photographerName,
  photographerUrl,
  alt,
  priority,
  originalWidth,
  originalHeight,
  placeholderColor,
}: PhotoCardProps) {
  const imageRatio = originalWidth / originalHeight;
  const height = PHOTO_CARD_IMAGE_WIDTH / imageRatio;

  return (
    <Box
      as="article"
      bg={useColorModeValue("white", "gray.800")}
      maxW="sm"
      borderWidth="1px"
      shadow="lg"
      data-testid={`photo-card-${id}`}
      sx={{ "break-inside": "avoid" }}
    >
      <Image
        src={url}
        alt={alt}
        width={PHOTO_CARD_IMAGE_WIDTH}
        height={height}
        priority={priority}
        placeholder="blur"
        blurDataURL={hexColorDataUrl(placeholderColor)}
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
