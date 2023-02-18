import { PhotosResponse } from "@/types";
import { useToast } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

async function fetchCuratedPhotos(page: number): Promise<PhotosResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
  });
  const response = await fetch("/api/photos?" + params);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const result = await response.json();
  return result as PhotosResponse;
}

export const USE_CURATED_PHOTOS_KEY = "CURATED_PHOTOS";

export default function useCuratedPhotos(page: number) {
  const toast = useToast();
  return useQuery({
    queryKey: [USE_CURATED_PHOTOS_KEY, page],
    queryFn: () => fetchCuratedPhotos(page),
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
