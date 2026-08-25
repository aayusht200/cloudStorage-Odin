import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NavigateFunction, useNavigate } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ErrorPage from "../../../src/pages/ErrorPage";
vi.mock("@lottiefiles/dotlottie-react", () => ({
  DotLottieReact: () => <div data-testid="error-animation" />,
}));
vi.mock("react-router", () => ({
  useNavigate: vi.fn(),
}));
describe("ErrorPage", () => {
  let navigate: NavigateFunction;
  beforeEach(() => {
    vi.clearAllMocks();
    navigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigate);
  });
  describe("Initial render", () => {
    it("should render error page with error animation & button to home", () => {
      //Arrange
      //Act
      render(<ErrorPage />);
      //Assert
      expect(
        screen.getByRole("heading", { name: "Something went wrong" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Go to Home" }),
      ).toBeInTheDocument();
    });
  });
  describe("Navigation", () => {
    it("should navigate to / on button click", async () => {
      //Arrange
      const event = userEvent.setup();
      //Act
      render(<ErrorPage />);
      await event.click(screen.getByRole("button", { name: "Go to Home" }));
      //Assert
      expect(navigate).toHaveBeenCalledWith("/", { replace: true });
    });
  });
});
