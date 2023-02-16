import type { NextApiRequest, NextApiResponse } from "next";
import { createClient, Photos as PexelsPhotos } from "pexels";

const PEXELS_API_KEY = process.env.PEXELS_API_KEY || "";

type ErrorResponse = {
  message: string;
};

type Photo = {
  id: number;
  alt: string;
  url: string;
  photographerName: string;
  photographerUrl: string;
};

export type PhotosResponse = {
  page: number;
  perPage: number;
  photos: Photo[];
};
// const PHOTOS_PER_PAGE_DEFAULT = 10;
const PAGE_DEFAULT = 1;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PhotosResponse | ErrorResponse>
) {
  const { page } = req.query;
  try {
    const result = await fetchCuratedPhotosServer(Number(page));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error." });
  }
}

export async function fetchCuratedPhotosServer(
  page: number
): Promise<PhotosResponse> {
  const pexelsClient = createClient(PEXELS_API_KEY);

  const curatedPhotos = (await pexelsClient.photos.curated({
    page: page || PAGE_DEFAULT,
    per_page: 10,
  })) as PexelsPhotos;

  const result = {
    page: curatedPhotos.page,
    perPage: curatedPhotos.per_page,
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
