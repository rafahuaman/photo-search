import MasonryPhotoLayout from "@/components/MasonryPhotoLayout";
import useCuratedPhotos, {
  prefetchCuratedPhotos,
  USE_CURATED_PHOTOS_KEY,
} from "@/hooks/useCuratedPhotos";
import { Button, ButtonGroup, VStack } from "@chakra-ui/react";
import { dehydrate, QueryClient, useQueryClient } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { fetchCuratedPhotosServer } from "./api/photos";

export default function Home() {
  const router = useRouter();
  const page = Number(router.query.page) || 1;
  const { data, isError } = useCuratedPhotos(page);
  const queryClient = useQueryClient();
  const showPrevious = page > 1;
  const showNext = data?.hasNext;

  useEffect(() => {
    prefetchCuratedPhotos(queryClient, page + 1);
  }, [page, queryClient]);

  if (isError) return null;

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
        <title>Photo Search | Home</title>
        <meta name="description" content="Photo Search Exercise" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <VStack spacing={10}>
        <MasonryPhotoLayout photos={data?.photos || []} />

        <ButtonGroup variant="outline" colorScheme="teal" spacing="6">
          {showPrevious && <Button onClick={handlePrevious}>Previous</Button>}
          {showNext && <Button onClick={handleNext}>Next</Button>}
        </ButtonGroup>
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
