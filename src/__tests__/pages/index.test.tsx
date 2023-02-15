import Home from "@/pages/index";
import { render, screen } from "@testing-library/react";

describe("Home", () => {
  it("renders home", () => {
    render(<Home />);

    expect(screen.getByText(/hello world/i)).toBeInTheDocument();
  });
});
