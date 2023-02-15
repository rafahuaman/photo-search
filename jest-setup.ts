import { queryClient, setMobileScreen } from "@/test-utils";
import "@testing-library/jest-dom";
import { enableFetchMocks } from "jest-fetch-mock";
import mockMatchMedia from "mock-match-media";

// Mock calls to fetch()
enableFetchMocks();

beforeEach(() => {
  // Clear TanStack Query cache
  queryClient.clear();

  // Mobile-first: all tests are run on a mobile screen by default
  mockMatchMedia.cleanup();
  setMobileScreen();
});
