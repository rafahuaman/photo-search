import { mockPexelsPhotosResponse } from "@/mockData/pexels";
import { default as photosHandler } from "@/pages/api/photos";
import { createMocks } from "node-mocks-http";

describe("/api/photos", () => {
  it("returns curated photos", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });
    const firstPhoto = mockPexelsPhotosResponse.photos[0];
    const secondPhoto = mockPexelsPhotosResponse.photos[1];
    fetchMock.once(JSON.stringify(mockPexelsPhotosResponse));

    await photosHandler(req, res);

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
            width: 4160,
            height: 6240,
            placeholderColor: "#7F6E64",
          },
          {
            id: secondPhoto.id,
            alt: secondPhoto.alt,
            url: secondPhoto.src.large,
            photographerName: secondPhoto.photographer,
            photographerUrl: secondPhoto.photographer_url,
            width: 3888,
            height: 5184,
            placeholderColor: "#6C6258",
          },
        ],
      })
    );
  });

  it("calls the Pexels Curated Photos API with the API Key", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });
    fetchMock.once(JSON.stringify(mockPexelsPhotosResponse));

    await photosHandler(req, res);

    expect(fetch).toHaveBeenCalledWith(
      "https://api.pexels.com/v1//curated?page=1&per_page=10",
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
    });
    fetchMock.once(
      JSON.stringify({
        ...mockPexelsPhotosResponse,
        next_page: "https://api.pexels.com/v1/curated/?page=1&per_page=2",
      })
    );

    await photosHandler(req, res);

    expect(JSON.parse(res._getData()).hasNext).toEqual(true);
  });

  it("returns hasNext: false if next_page attribute does not exist", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });
    fetchMock.once(
      JSON.stringify({
        ...mockPexelsPhotosResponse,
        next_page: undefined,
      })
    );

    await photosHandler(req, res);

    expect(JSON.parse(res._getData()).hasNext).toEqual(false);
  });

  it("returns a 500 when the call to Pexels API fails", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });
    fetchMock.mockRejectOnce();

    await photosHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
  });
});
