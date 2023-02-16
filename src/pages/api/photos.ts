import type { NextApiRequest, NextApiResponse } from "next";
import { createClient, Photos as PexelsPhotos } from "pexels";

const PEXELS_API_KEY = process.env.PEXELS_API_KEY || "";

type ErrorResponse = {
  message: string;
};

type Photo = {
  id: number;
};

type PhotosResponse = {
  page: number;
  perPage: number;
  photos: Photo[];
};
// const PHOTOS_PER_PAGE_DEFAULT = 10;
// const PAGE_DEFAULT = 1;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PhotosResponse | ErrorResponse>
) {
  const pexelsClient = createClient(PEXELS_API_KEY);
  try {
    const curatedPhotos = (await pexelsClient.photos.curated({
      page: 1,
      per_page: 10,
    })) as PexelsPhotos;
    const result = {
      page: curatedPhotos.page,
      perPage: curatedPhotos.per_page,
      photos: curatedPhotos.photos.map((photo) => ({
        id: photo.id,
        alt: photo.alt,
        url: photo.src.large,
        photographerName: photo.photographer,
        photographerUrl: photo.photographer_url,
      })),
    };
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error." });
  }
}
