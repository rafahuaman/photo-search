import { PhotosResponse } from "@/pages/api/photos";
import { useQuery } from "@tanstack/react-query";

async function fetchCuratedPhotos(page: number): Promise<PhotosResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
  });
  const res = await fetch("/api/photos?" + params);

  const result = await res.json();
  return result as PhotosResponse;
}

export const USE_CURATED_PHOTOS_KEY = "CURATED_PHOTOS";

export default function useCuratedPhotos(page: number) {
  return useQuery({
    queryKey: [USE_CURATED_PHOTOS_KEY, page],
    queryFn: () => fetchCuratedPhotos(page),
    keepPreviousData: true,
  });
}
