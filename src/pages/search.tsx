import Container from "@/components/layout/Container";
import PhotoCard from "@/components/PhotoCard";
import usePhotoSearch, {
  prefetchPhotoSearch,
  USE_PHOTO_SEARCH_KEY,
} from "@/hooks/usePhotoSearch";
import useSearchQueryUrlParam from "@/hooks/useSearchQueryUrlParam";
import { isBlank } from "@/utils/string";
import {
  Box,
  Button,
  ButtonGroup,
  Fade,
  Heading,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { dehydrate, QueryClient, useQueryClient } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { fetchPhotoSearchServer } from "./api/photos/search";

function SearchResults() {
  const router = useRouter();
  const page = Number(router.query.page) || 1;
  const searchQuery = useSearchQueryUrlParam();
  const { data, isError } = usePhotoSearch(searchQuery, page);
  const showPrevious = page > 1;
  const showNext = data?.hasNext;
  const queryClient = useQueryClient();

  useEffect(() => {
    prefetchPhotoSearch(queryClient, searchQuery, page + 1);
  }, [page, queryClient, searchQuery]);

  if (isError) return null;

  const handleNext = () => {
    router.push(
      {
        pathname: router.pathname,
        query: { query: searchQuery, page: page + 1 },
      },
      undefined,
      {
        shallow: true,
        scroll: true,
      }
    );
  };

  const handlePrevious = () => {
    router.push(
      {
        pathname: router.pathname,
        query: { query: searchQuery, page: page - 1 },
      },
      undefined,
      {
        shallow: true,
        scroll: true,
      }
    );
  };
  return (
    <VStack spacing={10}>
      <VStack spacing={10}>
        {data?.photos.map(
          ({ id, url, photographerName, photographerUrl, alt }, index) => (
            <Fade key={id} in>
              <PhotoCard
                id={id}
                url={url}
                photographerName={photographerName}
                photographerUrl={photographerUrl}
                alt={alt}
                priority={index === 0}
              />
            </Fade>
          )
        )}
      </VStack>

      <ButtonGroup variant="outline" colorScheme="teal" spacing="6">
        {showPrevious && <Button onClick={handlePrevious}>Previous</Button>}
        {showNext && <Button onClick={handleNext}>Next</Button>}
      </ButtonGroup>
    </VStack>
  );
}

function EmptySearch() {
  return (
    <Box as="section">
      <Container py={{ base: "16", md: "24" }}>
        <Stack spacing={{ base: "4", md: "5" }} align="center">
          <Heading size={{ base: "lg", md: "xl" }}>Welcome!</Heading>
          <Text color="muted" textAlign="center" fontSize="xl">
            Search for some pictures using the search bar above.
          </Text>
        </Stack>
      </Container>
    </Box>
  );
}

export default function Search() {
  const searchQuery = useSearchQueryUrlParam();
  const hasQuery = !isBlank(searchQuery);

  return (
    <>
      <Head>
        <title>Photo Search | Search</title>
        <meta
          name="description"
          content="Photo Search Exercise - Search Page"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {hasQuery ? <SearchResults /> : <EmptySearch />}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
  const { page: pageParam, query: queryParam } = context.query;
  const page = Number(pageParam) || 1;
  if (queryParam === undefined) {
    return { props: {} };
  }
  const query = queryParam as string;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([USE_PHOTO_SEARCH_KEY, query, page], () =>
    fetchPhotoSearchServer(query, page)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
