import { render } from "@/test-utils";
import { axe } from "jest-axe";
import Layout from "./Layout";

describe("Layout", () => {
  it("renders without axe violations", async () => {
    const { container } = render(<Layout>Test</Layout>);

    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
