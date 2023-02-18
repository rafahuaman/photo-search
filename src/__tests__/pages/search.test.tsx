import { USE_PHOTO_SEARCH_KEY } from "@/hooks/usePhotoSearch";
import { mockPexelsPhotosResponse } from "@/mockData/pexels";
import {
  mockPhotoSearchResponse,
  mockPhotoSearchSecondPageResponse,
} from "@/mockData/photoSearch";
import Search, { getServerSideProps } from "@/pages/search";
import { queryClient, render, screen, userEvent, waitFor } from "@/test-utils";
import { ServerResponse } from "http";
import { GetServerSidePropsContext } from "next";
import mockRouter from "next-router-mock";
import { ParsedUrlQuery } from "querystring";

const testQuery = "test query";
const pathWithTestQuery = `/search?query=${testQuery}`;

describe("Search", () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl(pathWithTestQuery);
  });

  it("renders the search page with results", () => {
    const page = 1;
    queryClient.setQueryData(
      [USE_PHOTO_SEARCH_KEY, testQuery, page],
      mockPhotoSearchResponse
    );

    render(<Search />);
    const firstPhotographer =
      mockPhotoSearchResponse.photos[0].photographerName;
    const lastPhotographer =
      mockPhotoSearchResponse.photos[mockPhotoSearchResponse.photos.length - 1]
        .photographerName;

    expect(screen.getByText(firstPhotographer)).toBeInTheDocument();
    expect(screen.getByText(lastPhotographer)).toBeInTheDocument();
  });

  it("displays an error message if the request fails", async () => {
    const page = 1;
    queryClient.setQueryData(
      [USE_PHOTO_SEARCH_KEY, testQuery, page],
      mockPhotoSearchResponse
    );
    render(<Search />);

    fetchMock.mockRejectedValueOnce(
      JSON.stringify({ message: "Internal Server Error" })
    );
    const user = userEvent.setup();
    user.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() =>
      expect(screen.getByText(/oops! Something went wrong./i)).toBeVisible()
    );
  });

  it("renders the search page empty state when no query is not provided", () => {
    mockRouter.setCurrentUrl("/search");

    render(<Search />);

    expect(screen.getByText(/welcome!/i)).toBeVisible();
  });

  describe("pagination", () => {
    describe("visibility", () => {
      it("renders the next page button when the API response hasNext is true", () => {
        const page = 1;
        queryClient.setQueryData([USE_PHOTO_SEARCH_KEY, testQuery, page], {
          ...mockPhotoSearchResponse,
          hasNext: true,
        });
        render(<Search />);
        expect(
          screen.getByRole("button", { name: /next/i })
        ).toBeInTheDocument();
      });

      it("does not renders the next page button when the API response hasNext is false", () => {
        const page = 1;
        queryClient.setQueryData([USE_PHOTO_SEARCH_KEY, testQuery, page], {
          ...mockPhotoSearchResponse,
          hasNext: false,
        });
        render(<Search />);
        expect(
          screen.queryByRole("button", { name: /next/i })
        ).not.toBeInTheDocument();
      });

      it("renders the previous page button when the page is not first", () => {
        const page = 2;
        queryClient.setQueryData([USE_PHOTO_SEARCH_KEY, testQuery, page], {
          ...mockPhotoSearchResponse,
          page,
        });
        mockRouter.setCurrentUrl(`${pathWithTestQuery}&page=${2}`);
        render(<Search />);
        expect(
          screen.getByRole("button", { name: /previous/i })
        ).toBeInTheDocument();
      });

      it("does not render the previous page button on the first page", () => {
        const page = 1;
        queryClient.setQueryData([USE_PHOTO_SEARCH_KEY, testQuery, page], {
          ...mockPhotoSearchResponse,
          page,
        });
        render(<Search />);
        expect(
          screen.queryByRole("button", { name: /previous/i })
        ).not.toBeInTheDocument();
      });
    });

    describe("clicking Next", () => {
      beforeEach(() => {
        const page = 1;
        queryClient.setQueryData([USE_PHOTO_SEARCH_KEY, testQuery, page], {
          ...mockPhotoSearchResponse,
          hasNext: true,
        });
      });

      it("retrieves the next page when the user clicks Next", async () => {
        render(<Search />);

        fetchMock.once(JSON.stringify(mockPhotoSearchSecondPageResponse));
        const user = userEvent.setup();
        user.click(screen.getByRole("button", { name: /next/i }));

        expect(
          await screen.findByTestId(
            `photo-card-${mockPhotoSearchSecondPageResponse.photos[0].id}`
          )
        ).toBeInTheDocument();
        expect(
          screen.queryByTestId(
            `photo-card-${mockPhotoSearchResponse.photos[0].id}`
          )
        ).not.toBeInTheDocument();
      });

      it("increases the page param by 1", async () => {
        render(<Search />);

        fetchMock.once(JSON.stringify(mockPhotoSearchSecondPageResponse));
        const user = userEvent.setup();
        user.click(screen.getByRole("button", { name: /next/i }));

        await waitFor(() => {
          expect(mockRouter).toMatchObject({
            asPath: `/search?query=${encodeURIComponent(testQuery)}&page=2`,
          });
        });
      });

      it("requests the second page from the server", async () => {
        render(<Search />);

        fetchMock.once(JSON.stringify(mockPhotoSearchSecondPageResponse));
        const user = userEvent.setup();
        user.click(screen.getByRole("button", { name: /next/i }));

        await waitFor(() =>
          expect(fetchMock).toHaveBeenCalledWith(
            "/api/photos/search?query=test+query&page=2"
          )
        );
      });
    });

    describe("clicking Previous", () => {
      beforeEach(() => {
        const page = 2;
        queryClient.setQueryData([USE_PHOTO_SEARCH_KEY, testQuery, page], {
          ...mockPhotoSearchSecondPageResponse,
          hasNext: true,
        });
        mockRouter.setCurrentUrl(`${pathWithTestQuery}&page=${2}`);
      });

      it("displays the previous page when the user clicks Previous", async () => {
        render(<Search />);

        fetchMock.once(JSON.stringify(mockPhotoSearchResponse));
        const user = userEvent.setup();
        user.click(screen.getByRole("button", { name: /previous/i }));

        await waitFor(() =>
          expect(
            screen.queryByTestId(
              `photo-card-${mockPhotoSearchSecondPageResponse.photos[0].id}`
            )
          ).not.toBeInTheDocument()
        );

        expect(
          await screen.findByTestId(
            `photo-card-${mockPhotoSearchResponse.photos[0].id}`
          )
        ).toBeInTheDocument();
      });

      it("decreases the page param by 1", async () => {
        render(<Search />);

        fetchMock.once(JSON.stringify(mockPhotoSearchSecondPageResponse));
        const user = userEvent.setup();
        user.click(screen.getByRole("button", { name: /previous/i }));

        await waitFor(() => {
          expect(mockRouter).toMatchObject({
            asPath: `/search?query=${encodeURIComponent(testQuery)}&page=1`,
          });
        });
      });

      it("requests the first page from the server", async () => {
        render(<Search />);

        fetchMock.once(JSON.stringify(mockPhotoSearchSecondPageResponse));
        const user = userEvent.setup();
        user.click(screen.getByRole("button", { name: /previous/i }));

        await waitFor(() =>
          expect(fetchMock).toHaveBeenCalledWith(
            `/api/photos/search?query=test+query&page=1`
          )
        );
      });
    });
  });
});

describe("getServerSideProps", () => {
  it("return the dehydrated PHOTO_SEARCH query for the current page", async () => {
    const context = {
      query: { page: "2", query: testQuery } as ParsedUrlQuery,
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
              queryKey: [USE_PHOTO_SEARCH_KEY, testQuery, 2],
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

  it("return the dehydrated PHOTO_SEARCH query first page when no param is specified", async () => {
    const context = {
      query: { query: testQuery } as ParsedUrlQuery,
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
              queryKey: [USE_PHOTO_SEARCH_KEY, testQuery, 1],
            }),
          ],
          mutations: [],
        },
      },
    });
  });

  it("return the empty props when no search query is specified", async () => {
    const context = {
      query: {} as ParsedUrlQuery,
      res: { setHeader: jest.fn() } as unknown as ServerResponse,
    };

    const response = await getServerSideProps(
      context as GetServerSidePropsContext
    );
    expect(response).toEqual({
      props: {},
    });
    expect(fetch).not.toHaveBeenCalled();
  });
});
