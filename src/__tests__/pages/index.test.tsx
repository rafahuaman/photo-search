import { USE_CURATED_PHOTOS_KEY } from "@/hooks/useCuratedPhotos";
import {
  mockCuratedPhotosResponse,
  mockCuratedPhotosSecondPageResponse,
} from "@/mockData/curatedPhotos";
import Home from "@/pages/index";
import { queryClient, render, screen, userEvent, waitFor } from "@/test-utils";
import mockRouter from "next-router-mock";

describe("Home", () => {
  it("renders home", () => {
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

  describe("pagination", () => {
    describe("clicking Next", () => {
      beforeEach(() => {
        const page = 1;
        queryClient.setQueryData([USE_CURATED_PHOTOS_KEY, page], {
          ...mockCuratedPhotosResponse,
          hasNext: true,
        });
      });

      it("retrieves the next page when the user clicks Next", async () => {
        render(<Home />);

        fetchMock.once(JSON.stringify(mockCuratedPhotosSecondPageResponse));
        const user = userEvent.setup();
        user.click(screen.getByRole("button", { name: /next/i }));

        expect(
          await screen.findByTestId(
            `photo-card-${mockCuratedPhotosSecondPageResponse.photos[0].id}`
          )
        ).toBeInTheDocument();
        expect(
          screen.queryByTestId(
            `photo-card-${mockCuratedPhotosResponse.photos[0].id}`
          )
        ).not.toBeInTheDocument();
      });

      it("increases the page param by 1", async () => {
        render(<Home />);

        fetchMock.once(JSON.stringify(mockCuratedPhotosSecondPageResponse));
        const user = userEvent.setup();
        user.click(screen.getByRole("button", { name: /next/i }));

        await waitFor(() => {
          expect(mockRouter).toMatchObject({
            asPath: "/?page=2",
          });
        });
      });

      it("requests the second page from the server", async () => {
        render(<Home />);

        fetchMock.once(JSON.stringify(mockCuratedPhotosSecondPageResponse));
        const user = userEvent.setup();
        user.click(screen.getByRole("button", { name: /next/i }));

        expect(fetchMock).toHaveBeenCalledWith("/api/photos?page=2");
      });
    });

    it("renders the next page button when the API response hasNext is true", () => {
      const page = 1;
      queryClient.setQueryData([USE_CURATED_PHOTOS_KEY, page], {
        ...mockCuratedPhotosResponse,
        hasNext: true,
      });
      render(<Home />);
      expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
    });

    it("does not renders the next page button when the API response hasNext is false", () => {
      const page = 1;
      queryClient.setQueryData([USE_CURATED_PHOTOS_KEY, page], {
        ...mockCuratedPhotosResponse,
        hasNext: false,
      });
      render(<Home />);
      expect(
        screen.queryByRole("button", { name: /next/i })
      ).not.toBeInTheDocument();
    });

    it("renders the previous page button when the page is not first", () => {
      const page = 2;
      queryClient.setQueryData([USE_CURATED_PHOTOS_KEY, page], {
        ...mockCuratedPhotosResponse,
        page,
      });
      mockRouter.push("/?page=2");
      render(<Home />);
      expect(
        screen.getByRole("button", { name: /previous/i })
      ).toBeInTheDocument();
    });

    it("does not render the previous page button on the first page", () => {
      const page = 1;
      queryClient.setQueryData([USE_CURATED_PHOTOS_KEY, page], {
        ...mockCuratedPhotosResponse,
        page,
      });
      render(<Home />);
      expect(
        screen.queryByRole("button", { name: /previous/i })
      ).not.toBeInTheDocument();
    });
  });
});
