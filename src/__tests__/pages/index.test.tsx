import { USE_CURATED_PHOTOS_KEY } from "@/hooks/useCuratedPhotos";
import {
  mockCuratedPhotosEmptyResponse,
  mockCuratedPhotosResponse,
  mockCuratedPhotosSecondPageResponse,
} from "@/mockData/curatedPhotos";
import { mockPexelsPhotosResponse } from "@/mockData/pexels";
import Home, { getServerSideProps } from "@/pages/index";
import { queryClient, render, screen, userEvent, waitFor } from "@/test-utils";
import { ServerResponse } from "http";
import { axe } from "jest-axe";
import { GetServerSidePropsContext } from "next";
import mockRouter from "next-router-mock";
import { ParsedUrlQuery } from "querystring";

describe("Home", () => {
  beforeEach(() => {
    // Simulates how we set the prime the cache via hydration when the page is server-side rendered
    const page = 1;
    queryClient.setQueryData(
      [USE_CURATED_PHOTOS_KEY, page],
      mockCuratedPhotosResponse
    );

    // Mocks the prefetching of the next page
    fetchMock.once(JSON.stringify(mockCuratedPhotosSecondPageResponse));
  });

  it("renders the home page", () => {
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

  it("prefetches the second page from the server", async () => {
    render(<Home />);

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith("/api/photos?page=2")
    );
  });

  it("renders without axe violations", async () => {
    queryClient.setQueryData(
      [USE_CURATED_PHOTOS_KEY, 2],
      mockCuratedPhotosEmptyResponse
    );
    const { container } = render(<Home />);

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it("displays an error message if the request fails", async () => {
    queryClient.clear();
    fetchMock.resetMocks();
    const page = 1;
    queryClient.setQueryData(
      [USE_CURATED_PHOTOS_KEY, page],
      mockCuratedPhotosResponse
    );
    // Fails prefetching and all subsequent fetches
    fetchMock.mockReject(new Error("Internal server error."));

    render(<Home />);

    const user = userEvent.setup();
    user.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() =>
      expect(screen.getByText(/oops! Something went wrong./i)).toBeVisible()
    );
  });

  it("displays an error if the request returns something other than 200", async () => {
    queryClient.clear();
    fetchMock.resetMocks();
    const page = 1;
    queryClient.setQueryData(
      [USE_CURATED_PHOTOS_KEY, page],
      mockCuratedPhotosResponse
    );
    render(<Home />);

    fetchMock.once("", { status: 429 });
    const user = userEvent.setup();
    user.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() =>
      expect(screen.getByText(/oops! Something went wrong./i)).toBeVisible()
    );
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

        // Mock prefetching of third page
        fetchMock.once(JSON.stringify(mockCuratedPhotosEmptyResponse));
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

        // Mock prefetching of third page
        fetchMock.once(JSON.stringify(mockCuratedPhotosEmptyResponse));
        const user = userEvent.setup();
        user.click(screen.getByRole("button", { name: /next/i }));

        await waitFor(() => {
          expect(mockRouter).toMatchObject({
            asPath: "/?page=2",
          });
        });
      });

      it("prefetches the third page from the server", async () => {
        render(<Home />);

        // Mock prefetching of third page
        fetchMock.once(JSON.stringify(mockCuratedPhotosEmptyResponse));
        const user = userEvent.setup();
        user.click(screen.getByRole("button", { name: /next/i }));

        await waitFor(() =>
          expect(fetchMock).toHaveBeenCalledWith("/api/photos?page=3")
        );
      });
    });

    describe("clicking Previous", () => {
      beforeEach(() => {
        queryClient.clear();
        fetchMock.resetMocks();
        const page = 2;
        queryClient.setQueryData([USE_CURATED_PHOTOS_KEY, page], {
          ...mockCuratedPhotosSecondPageResponse,
          hasNext: true,
        });
        mockRouter.setCurrentUrl("/?page=2");
      });

      it("displays the previous page when the user clicks Previous", async () => {
        render(<Home />);

        fetchMock.once(JSON.stringify(mockCuratedPhotosResponse));
        const user = userEvent.setup();
        user.click(screen.getByRole("button", { name: /previous/i }));

        await waitFor(() =>
          expect(
            screen.queryByTestId(
              `photo-card-${mockCuratedPhotosSecondPageResponse.photos[0].id}`
            )
          ).not.toBeInTheDocument()
        );

        expect(
          await screen.findByTestId(
            `photo-card-${mockCuratedPhotosResponse.photos[0].id}`
          )
        ).toBeInTheDocument();
      });

      it("decreases the page param by 1", async () => {
        render(<Home />);

        fetchMock.once(JSON.stringify(mockCuratedPhotosResponse));
        const user = userEvent.setup();
        user.click(screen.getByRole("button", { name: /previous/i }));

        await waitFor(() => {
          expect(mockRouter).toMatchObject({
            asPath: "/?page=1",
          });
        });
      });

      it("requests the first page from the server", async () => {
        render(<Home />);

        fetchMock.once(JSON.stringify(mockCuratedPhotosResponse));
        const user = userEvent.setup();
        user.click(screen.getByRole("button", { name: /previous/i }));

        await waitFor(() =>
          expect(fetchMock).toHaveBeenCalledWith("/api/photos?page=1")
        );
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
      mockRouter.setCurrentUrl("/?page=2");
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

describe("getServerSideProps", () => {
  it("return the dehydrated CURATED_PHOTOS query for the current page", async () => {
    const context = {
      query: { page: "2" } as ParsedUrlQuery,
      res: { setHeader: jest.fn() } as unknown as ServerResponse,
    };
    fetchMock.once(JSON.stringify(mockPexelsPhotosResponse));

    const response = await getServerSideProps(
      context as GetServerSidePropsContext
    );
    expect(response).toEqual({
      props: {
        dehydratedState: {
          queries: [
            expect.objectContaining({
              queryKey: ["CURATED_PHOTOS", 2],
              state: expect.objectContaining({
                data: expect.objectContaining({
                  photos: [
                    expect.objectContaining({
                      id: mockPexelsPhotosResponse.photos[0].id,
                      url: mockPexelsPhotosResponse.photos[0].src.large,
                    }),
                    expect.objectContaining({
                      id: mockPexelsPhotosResponse.photos[1].id,
                      url: mockPexelsPhotosResponse.photos[1].src.large,
                    }),
                  ],
                }),
              }),
            }),
          ],
          mutations: [],
        },
      },
    });
  });

  it("return the dehydrated CURATED_PHOTOS query first page when no param is specified", async () => {
    const context = {
      query: {} as ParsedUrlQuery,
      res: { setHeader: jest.fn() } as unknown as ServerResponse,
    };
    fetchMock.once(JSON.stringify(mockPexelsPhotosResponse));

    const response = await getServerSideProps(
      context as GetServerSidePropsContext
    );
    expect(response).toEqual({
      props: {
        dehydratedState: {
          queries: [
            expect.objectContaining({
              queryKey: ["CURATED_PHOTOS", 1],
            }),
          ],
          mutations: [],
        },
      },
    });
  });
});
