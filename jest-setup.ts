import { queryClient } from "@/test-utils";
import "@testing-library/jest-dom";

beforeEach(() => {
  // Clear TanStack Query cache
  queryClient.clear();
});
