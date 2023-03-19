export type ErrorResponse = {
  message: string;
};

type Photo = {
  id: number;
  alt: string;
  url: string;
  photographerName: string;
  photographerUrl: string;
  width: number;
  height: number;
  placeholderColor: string;
};

export type PhotosResponse = {
  page: number;
  perPage: number;
  hasNext: boolean;
  photos: Photo[];
};
