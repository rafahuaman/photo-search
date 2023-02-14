import { queryClient, setMobileScreen } from "@/test-utils";
import "@testing-library/jest-dom";
import mockMatchMedia from "mock-match-media";

beforeEach(() => {
  // Clear TanStack Query cache
  queryClient.clear();

  // Mobile-first: all tests are run on a mobile screen by default
  mockMatchMedia.cleanup();
  setMobileScreen();
});
