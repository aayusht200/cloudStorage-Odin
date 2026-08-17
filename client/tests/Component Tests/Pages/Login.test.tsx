import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NavigateFunction, useNavigate } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  defaultUser,
  UserContext,
  UserContextProps,
} from "../../../src/context/User";
import { Login } from "../../../src/pages/Login";
import { LoginPayload } from "../../../src/schema/auth";

vi.mock("react-router", () => ({
  useNavigate: vi.fn(),
}));

describe("Login Page", () => {
  let navigate: NavigateFunction;
  let contextValue: UserContextProps;
  const loginUser = vi.fn<(payload: LoginPayload) => Promise<void>>();
  let payload: LoginPayload;

  beforeEach(() => {
    vi.clearAllMocks();
    navigate = vi.fn() as NavigateFunction;
    vi.mocked(useNavigate).mockReturnValue(navigate);
    contextValue = {
      user: defaultUser,
      loginUser,
      logoutUser: vi.fn(),
      signupUser: vi.fn(),
      isLoggedIn: false,
    };
    payload = {
      email: "testuser@gmail.com",
      password: "Test@123",
    };
  });
  describe("Initial State", () => {
    describe("Sucess", () => {
      it("should render with and empty form", async () => {
        //Arrange
        render(
          <UserContext.Provider value={contextValue}>
            <Login />
          </UserContext.Provider>,
        );
        //Act
        const emailInput = screen.getByRole("textbox", { name: "Email" });
        const passwordInput = screen.getByLabelText("Password");
        //Assert
        expect(emailInput).toHaveValue("");
        expect(passwordInput).toHaveValue("");
      });
    });
  });
  describe("Login", () => {
    describe("Sucess", () => {
      it("should login the user and navigate to home", async () => {
        //Arrange
        render(
          <UserContext.Provider value={contextValue}>
            <Login />
          </UserContext.Provider>,
        );
        vi.mocked(loginUser).mockResolvedValue();
        const emailInput = screen.getByRole("textbox", { name: "Email" });
        const passwordInput = screen.getByLabelText("Password");
        const event = userEvent.setup();
        const loginButton = screen.getByRole("button", { name: "Login" });
        //Act
        await event.type(emailInput, payload.email);
        await event.type(passwordInput, payload.password);
        await event.click(loginButton);
        //Assert
        expect(emailInput).toHaveValue(payload.email);
        expect(passwordInput).toHaveValue(payload.password);
        expect(loginUser).toHaveBeenCalledWith(payload);
        expect(navigate).toHaveBeenCalledWith("/", { replace: true });
      });
    });
    describe("Failure", () => {
      it("should display an error when login fails", async () => {
        //Arrange
        const error = new Error("Invalid credentials");
        render(
          <UserContext.Provider value={contextValue}>
            <Login />
          </UserContext.Provider>,
        );
        vi.mocked(loginUser).mockRejectedValue(error);
        const emailInput = screen.getByRole("textbox", { name: "Email" });
        const passwordInput = screen.getByLabelText("Password");
        const loginButton = screen.getByRole("button", { name: "Login" });
        const event = userEvent.setup();
        //Act
        await event.type(emailInput, payload.email);
        await event.type(passwordInput, payload.password);
        await event.click(loginButton);
        //Assert
        expect(loginUser).toHaveBeenCalledWith(payload);
        expect(navigate).not.toHaveBeenCalled();
        const errorMessage = screen.getByRole("paragraph", {
          name: "form-error",
        });
        expect(errorMessage).toHaveTextContent("Invalid email or password");
      });
    });
  });
  describe("Signup", () => {
    describe("Success", () => {
      it("should navigate to the signup page", async () => {
        // Arrange
        render(
          <UserContext.Provider value={contextValue}>
            <Login />
          </UserContext.Provider>,
        );
        const event = userEvent.setup();
        const signupButton = screen.getByRole("button", {
          name: "signup-button",
        });
        // Act
        await event.click(signupButton);
        // Assert
        expect(navigate).toHaveBeenCalledWith("/signup");
      });
    });
  });
  describe("Input Errors", () => {
    describe("Failure", () => {
      it("should display validation errors for invalid input", async () => {
        // Arrange
        render(
          <UserContext.Provider value={contextValue}>
            <Login />
          </UserContext.Provider>,
        );
        const emailInput = screen.getByRole("textbox", { name: "Email" });
        const passwordInput = screen.getByLabelText("Password");
        const event = userEvent.setup();
        //Act
        await event.type(emailInput, "test.test.com");
        await event.type(passwordInput, "test123");
        await event.click(screen.getByRole("button", { name: "Login" }));
        // Assert
        expect(emailInput).toHaveAttribute("aria-describedby", "email-error");
        expect(
          screen.getByText("Please enter a valid email address"),
        ).toBeInTheDocument();
        expect(passwordInput).toHaveAttribute(
          "aria-describedby",
          "password-error",
        );
        expect(screen.getByText("Minimum length is 8")).toBeInTheDocument();
      });
    });
  });
});
