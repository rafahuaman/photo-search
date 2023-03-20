import { Photo } from "@/types";
import { Fade, SimpleGrid, VStack } from "@chakra-ui/react";
import PhotoCard from "./PhotoCard";

type MasonryColumnProps = {
  photos: Photo[];
};

function MasonryColumn({ photos }: MasonryColumnProps) {
  return (
    <VStack spacing={8}>
      {photos.map(
        (
          {
            id,
            url,
            photographerName,
            photographerUrl,
            alt,
            width,
            height,
            placeholderColor,
          },
          index
        ) => (
          <Fade key={id} in>
            <PhotoCard
              id={id}
              url={url}
              photographerName={photographerName}
              photographerUrl={photographerUrl}
              alt={alt}
              priority={index === 0}
              originalWidth={width}
              originalHeight={height}
              placeholderColor={placeholderColor}
            />
          </Fade>
        )
      )}
    </VStack>
  );
}

function buildThreeColumnsInHorizontalOrder(photos: Photo[]) {
  const column1 = [];
  const column2 = [];
  const column3 = [];
  for (let i = 0; i < photos.length; i++) {
    const remainder = (i + 1) % 3;
    switch (remainder) {
      case 1:
        column1.push(photos[i]);
        break;
      case 2:
        column2.push(photos[i]);
        break;
      case 0:
        column3.push(photos[i]);
        break;
    }
  }
  return [column1, column2, column3];
}

type MasonryLayoutProps = {
  photos: Photo[];
};

function MasonryPhotoLayout({ photos }: MasonryLayoutProps) {
  const [column1, column2, column3] =
    buildThreeColumnsInHorizontalOrder(photos);
  return (
    <SimpleGrid columns={[1, 2, 3]} spacing={8}>
      <MasonryColumn photos={column1} />
      <MasonryColumn photos={column2} />
      <MasonryColumn photos={column3} />
    </SimpleGrid>
  );
}

export default MasonryPhotoLayout;
