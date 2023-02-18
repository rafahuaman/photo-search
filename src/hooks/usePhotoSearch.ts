import { PhotosResponse } from "@/pages/api/photos";
import { useToast } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

async function fetchPhotoSearch(
  query: string,
  page: number
): Promise<PhotosResponse> {
  const params = new URLSearchParams({
    query,
    page: page.toString(),
  });
  const response = await fetch("/api/photos/search?" + params);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const result = await response.json();
  return result as PhotosResponse;
}

export const USE_PHOTO_SEARCH_KEY = "PHOTO_SEARCH";

export default function usePhotoSearch(query: string, page: number) {
  const toast = useToast();
  return useQuery({
    queryKey: [USE_PHOTO_SEARCH_KEY, query, page],
    queryFn: () => fetchPhotoSearch(query, page),
    onError: () =>
      toast({
        title: "Oops! Something went wrong.",
        description: "Please try again at a later time.",
        status: "error",
        isClosable: true,
      }),
    keepPreviousData: true,
  });
}
