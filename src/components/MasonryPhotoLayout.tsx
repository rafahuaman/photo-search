import { Photo } from "@/types";
import { Box, Fade } from "@chakra-ui/react";
import PhotoCard from "./PhotoCard";

type MasonryLayoutProps = {
  photos: Photo[];
};

function MasonryPhotoLayout({ photos }: MasonryLayoutProps) {
  return (
    <Box sx={{ columnCount: [1, 2, 3], columnGap: 8, columnFill: "balance" }}>
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
          <Box key={id} mb={8}>
            <Fade in>
              <PhotoCard
                id={id}
                url={url}
                photographerName={photographerName}
                photographerUrl={photographerUrl}
                alt={alt}
                priority={index < 3}
                originalWidth={width}
                originalHeight={height}
                placeholderColor={placeholderColor}
              />
            </Fade>
          </Box>
        )
      )}
    </Box>
  );
}

export default MasonryPhotoLayout;
