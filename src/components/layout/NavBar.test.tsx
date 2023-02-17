import { render, screen, userEvent, waitFor } from "@/test-utils";
import mockRouter from "next-router-mock";
import NavBar from "./NavBar";

describe("NavBar", () => {
  describe("Search", () => {
    it("renders a search input", () => {
      render(<NavBar />);

      expect(screen.getByPlaceholderText(/search/i)).toBeVisible();
    });

    it("navigates to the search page when the user submits the search form", async () => {
      const user = userEvent.setup();
      render(<NavBar />);

      user.type(screen.getByPlaceholderText(/search/i), "search term{enter}");

      await waitFor(() =>
        expect(mockRouter).toMatchObject({
          asPath: "/search?query=search%20term",
        })
      );
    });

    it("does nothing when submitting the search form without an input", async () => {
      const user = userEvent.setup();
      render(<NavBar />);

      user.type(screen.getByPlaceholderText(/search/i), "{enter}");

      const errorMessage = await screen.findByText(
        /a search term is required/i
      );
      expect(errorMessage).toBeInTheDocument();
      expect(mockRouter).toMatchObject({
        asPath: "/",
      });
    });

    it("does nothing when submitting the search form with white spaces", async () => {
      const user = userEvent.setup();
      render(<NavBar />);

      user.type(screen.getByPlaceholderText(/search/i), "   {enter}");

      const errorMessage = await screen.findByText(
        /a search term is required/i
      );
      expect(errorMessage).toBeInTheDocument();
      expect(mockRouter).toMatchObject({
        asPath: "/",
      });
    });

    it("renders the search parameter when there is one", () => {
      mockRouter.setCurrentUrl("/search?query=test&page=2");
      render(<NavBar />);

      expect(screen.getByPlaceholderText(/search/i)).toHaveValue("test");
    });
  });

  describe("Color mode toggle", () => {
    it("toggles the color mode", async () => {
      const user = userEvent.setup();
      render(<NavBar />);

      expect(screen.getByTestId("moon-icon")).toBeVisible();
      expect(screen.queryByTestId("sun-icon")).not.toBeInTheDocument();

      user.click(screen.getByRole("button", { name: "Toggle Dark Mode" }));

      expect(await screen.findByTestId("sun-icon")).toBeVisible();
      expect(screen.queryByTestId("moon-icon")).not.toBeInTheDocument();
    });
  });
});
