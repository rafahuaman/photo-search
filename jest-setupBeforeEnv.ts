import { defaultFallbackInView } from "react-intersection-observer";

// Mock IntersectionObserver to remove act warnings caused when using jest-axe
// Reference: https://www.benmvp.com/blog/avoiding-react-act-warning-when-accessibility-testing-next-link-jest-axe
global.IntersectionObserver = jest.fn();
defaultFallbackInView(false);
