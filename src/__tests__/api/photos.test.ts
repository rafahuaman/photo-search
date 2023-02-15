import { mockPexelsCuratedPhotosResponse } from "@/mockData/pexels";
import { default as photosHandler } from "@/pages/api/photos";
import { createMocks } from "node-mocks-http";

describe("/api/photos", () => {
  describe("/curated", () => {
    test("returns a message with the specified animal", async () => {
      const { req, res } = createMocks({
        method: "GET",
      });
      const firstPhoto = mockPexelsCuratedPhotosResponse.photos[0];
      const secondPhoto = mockPexelsCuratedPhotosResponse.photos[1];
      fetchMock.once(JSON.stringify(mockPexelsCuratedPhotosResponse));

      await photosHandler(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual(
        expect.objectContaining({
          page: mockPexelsCuratedPhotosResponse.page,
          perPage: mockPexelsCuratedPhotosResponse.per_page,
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
  });
});
