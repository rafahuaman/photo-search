import { ErrorResponse, PhotosResponse } from "@/types";
import { isBlank } from "@/utils/string";
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient, Photos as PexelsPhotos } from "pexels";

const PEXELS_API_KEY = process.env.PEXELS_API_KEY as string;
const PHOTOS_PER_PAGE_DEFAULT = 10;
const PAGE_DEFAULT = 1;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PhotosResponse | ErrorResponse>
) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
  const { page, query } = req.query;
  if (isBlank(query)) {
    return res.status(400).send({ message: "Bad Request." });
  }

  try {
    const result = await fetchPhotoSearchServer(query as string, Number(page));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error." });
  }
}

export async function fetchPhotoSearchServer(
  query: string,
  page: number
): Promise<PhotosResponse> {
  const pexelsClient = createClient(PEXELS_API_KEY);

  const curatedPhotos = (await pexelsClient.photos.search({
    query,
    page: page || PAGE_DEFAULT,
    per_page: PHOTOS_PER_PAGE_DEFAULT,
  })) as PexelsPhotos;

  const result = {
    page: curatedPhotos.page,
    perPage: curatedPhotos.per_page,
    hasNext: !!curatedPhotos.next_page,
    photos: curatedPhotos.photos.map((photo) => ({
      id: photo.id,
      alt: photo.alt || "",
      url: photo.src.large,
      photographerName: photo.photographer,
      photographerUrl: photo.photographer_url,
    })),
  };
  return result;
}
