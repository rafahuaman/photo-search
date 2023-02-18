import { mockPexelsPhotosResponse } from "@/mockData/pexels";
import { default as photoSearchHandler } from "@/pages/api/photos/search";
import { createMocks } from "node-mocks-http";

describe("/api/photos/search", () => {
  describe("/search", () => {
    it("returns relevant photos", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: { query: "test" },
      });
      const firstPhoto = mockPexelsPhotosResponse.photos[0];
      const secondPhoto = mockPexelsPhotosResponse.photos[1];
      fetchMock.once(JSON.stringify(mockPexelsPhotosResponse));

      await photoSearchHandler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          page: mockPexelsPhotosResponse.page,
          perPage: mockPexelsPhotosResponse.per_page,
          photos: [
            {
              id: firstPhoto.id,
              alt: firstPhoto.alt,
              url: firstPhoto.src.large,
              photographerName: firstPhoto.photographer,
              photographerUrl: firstPhoto.photographer_url,
            },
            {
              id: secondPhoto.id,
              alt: secondPhoto.alt,
              url: secondPhoto.src.large,
              photographerName: secondPhoto.photographer,
              photographerUrl: secondPhoto.photographer_url,
            },
          ],
        })
      );
    });

    it("calls the Pexels Search Photos API with the API Key", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: { query: "test" },
      });
      fetchMock.once(JSON.stringify(mockPexelsPhotosResponse));

      await photoSearchHandler(req, res);

      expect(fetch).toHaveBeenCalledWith(
        "https://api.pexels.com/v1//search?query=test&page=1&per_page=10",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "SOME_KEY",
            "Content-Type": "application/json",
            "User-Agent": "Pexels/JavaScript",
          },
        }
      );
    });

    it("returns hasNext: true if next_page attribute exists", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: { query: "test" },
      });
      fetchMock.once(
        JSON.stringify({
          ...mockPexelsPhotosResponse,
          next_page: "https://api.pexels.com/v1/curated/?page=1&per_page=2",
        })
      );

      await photoSearchHandler(req, res);

      expect(JSON.parse(res._getData()).hasNext).toEqual(true);
    });

    it("returns hasNext: false if next_page attribute does not exist", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: { query: "test" },
      });
      fetchMock.once(
        JSON.stringify({
          ...mockPexelsPhotosResponse,
          next_page: undefined,
        })
      );

      await photoSearchHandler(req, res);

      expect(JSON.parse(res._getData()).hasNext).toEqual(false);
    });

    it("returns a 500 when the call to Pexels API fails", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: { query: "test" },
      });
      fetchMock.mockRejectOnce();

      await photoSearchHandler(req, res);

      expect(res._getStatusCode()).toBe(500);
    });

    it("returns a 400 when the call does not include a query term", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: {},
      });

      await photoSearchHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(fetch).not.toHaveBeenCalled();
    });

    it("returns a 400 when the the query has only white spaces", async () => {
      const { req, res } = createMocks({
        method: "GET",
        query: { query: "  " },
      });

      await photoSearchHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(fetch).not.toHaveBeenCalled();
    });
  });
});
