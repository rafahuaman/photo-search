import { USE_CURATED_PHOTOS_KEY } from "@/hooks/useCuratedPhotos";
import { mockCuratedPhotosResponse } from "@/mockData/curatedPhotos";
import Home from "@/pages/index";
import { queryClient, render, screen } from "@/test-utils";

describe("Home", () => {
  it("renders home", async () => {
    const page = 1;
    queryClient.setQueryData(
      [USE_CURATED_PHOTOS_KEY, page],
      mockCuratedPhotosResponse
    );
    render(<Home />);
    const firstPhotographer =
      mockCuratedPhotosResponse.photos[0].photographerName;
    const lastPhotographer =
      mockCuratedPhotosResponse.photos[
        mockCuratedPhotosResponse.photos.length - 1
      ].photographerName;

    expect(screen.getByText(firstPhotographer)).toBeInTheDocument();
    expect(screen.getByText(lastPhotographer)).toBeInTheDocument();
  });
});
