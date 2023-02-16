import PhotoCard from "@/components/PhotoCard";
import useCuratedPhotos, {
  USE_CURATED_PHOTOS_KEY,
} from "@/hooks/useCuratedPhotos";
import { VStack } from "@chakra-ui/react";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { fetchCuratedPhotosServer } from "./api/photos";

export default function Home() {
  const { data } = useCuratedPhotos(1);
  return (
    <>
      <Head>
        <title>Photo Search</title>
        <meta name="description" content="Photo Search Exercise" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <VStack spacing={10}>
        {data?.photos.map(
          ({ id, url, photographerName, photographerUrl, alt }) => (
            <PhotoCard
              key={id}
              url={url}
              photographerName={photographerName}
              photographerUrl={photographerUrl}
              alt={alt}
            />
          )
        )}
      </VStack>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
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
