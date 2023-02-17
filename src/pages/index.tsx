import PhotoCard from "@/components/PhotoCard";
import useCuratedPhotos, {
  USE_CURATED_PHOTOS_KEY,
} from "@/hooks/useCuratedPhotos";
import { Button, VStack } from "@chakra-ui/react";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { fetchCuratedPhotosServer } from "./api/photos";

export default function Home() {
  const router = useRouter();
  const page = Number(router.query.page) || 1;
  const { data } = useCuratedPhotos(page);
  const showPrevious = page > 1;
  const showNext = data?.hasNext;

  const handleNext = () => {
    router.push({ pathname: "/", query: { page: page + 1 } }, undefined, {
      shallow: true,
      scroll: true,
    });
  };

  const handlePrevious = () => {
    router.push({ pathname: "/", query: { page: page - 1 } }, undefined, {
      shallow: true,
      scroll: true,
    });
  };

  return (
    <>
      <Head>
        <title>Photo Search</title>
        <meta name="description" content="Photo Search Exercise" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <VStack spacing={10}>
        <VStack spacing={10}>
          {data?.photos.map(
            ({ id, url, photographerName, photographerUrl, alt }) => (
              <PhotoCard
                id={id}
                key={id}
                url={url}
                photographerName={photographerName}
                photographerUrl={photographerUrl}
                alt={alt}
              />
            )
          )}
        </VStack>

        {showPrevious && (
          <Button colorScheme="teal" variant="outline" onClick={handlePrevious}>
            Previous
          </Button>
        )}
        {showNext && (
          <Button colorScheme="teal" variant="outline" onClick={handleNext}>
            Next
          </Button>
        )}
      </VStack>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
  const { page: pageParam } = context.query;
  const page = Number(pageParam) || 1;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([USE_CURATED_PHOTOS_KEY, page], () =>
    fetchCuratedPhotosServer(page)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
