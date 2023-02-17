import { PhotosResponse } from "@/pages/api/photos";
import { useQuery } from "@tanstack/react-query";

async function fetchPhotoSearch(
  query: string,
  page: number
): Promise<PhotosResponse> {
  const params = new URLSearchParams({
    query,
    page: page.toString(),
  });
  const res = await fetch("/api/search?" + params);

  const result = await res.json();
  return result as PhotosResponse;
}

export const USE_PHOTO_SEARCH_KEY = "PHOTO_SEARCH";

export default function usePhotoSearch(query: string, page: number) {
  return useQuery({
    queryKey: [USE_PHOTO_SEARCH_KEY, query, page],
    queryFn: () => fetchPhotoSearch(query, page),
    keepPreviousData: true,
  });
}
