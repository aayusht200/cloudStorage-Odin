import "@testing-library/jest-dom/vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NavigateFunction, useNavigate } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  defaultUser,
  UserContext,
  UserContextProps,
} from "../../../src/context/User";
import SignupPage from "../../../src/pages/SignupPage";
import { SignupPayload } from "../../../src/schema/auth";

vi.mock("react-router", () => ({
  useNavigate: vi.fn(),
}));

describe("signup page", () => {
  let navigate: NavigateFunction;
  let contextValue: UserContextProps;
  let payload: SignupPayload;
  const signupUser = vi.fn<(payload: SignupPayload) => Promise<void>>();
  beforeEach(() => {
    vi.clearAllMocks();
    navigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigate);
    contextValue = {
      user: defaultUser,
      loginUser: vi.fn(),
      logoutUser: vi.fn(),
      signupUser,
      isLoggedIn: false,
    };
    payload = {
      email: "test.user@gmail.com",
      password: "Test@123",
      lastName: "Test",
      firstName: "User",
    };
  });
  describe("Initial state", () => {
    it("should render empty form & defaultUser", async () => {
      //Arrange
      render(
        <UserContext.Provider value={contextValue}>
          <SignupPage />
        </UserContext.Provider>,
      );
      //Act
      //Assert
      expect(screen.getByRole("textbox", { name: "First Name" })).toHaveValue(
        "",
      );
      expect(screen.getByRole("textbox", { name: "Last Name" })).toHaveValue(
        "",
      );
      expect(screen.getByRole("textbox", { name: "Email" })).toHaveValue("");
      expect(screen.getByLabelText("Password")).toHaveValue("");
      expect(contextValue.user).toEqual(defaultUser);
    });
  });
  describe("Signup", () => {
    let firstNameInput: HTMLElement;
    let lastNameInput: HTMLElement;
    let emailInput: HTMLElement;
    let passwordInput: HTMLElement;
    let submitButton: HTMLElement;

    beforeEach(() => {
      render(
        <UserContext.Provider value={contextValue}>
          <SignupPage />
        </UserContext.Provider>,
      );

      firstNameInput = screen.getByRole("textbox", { name: "First Name" });
      lastNameInput = screen.getByRole("textbox", { name: "Last Name" });
      emailInput = screen.getByRole("textbox", { name: "Email" });
      passwordInput = screen.getByLabelText("Password");
      submitButton = screen.getByRole("button", { name: "Signup" });
    });
    describe("Success", () => {
      it("should redirect to /login on succesful signup", async () => {
        //Arrange
        const e = userEvent.setup();
        vi.mocked(signupUser).mockResolvedValue();
        //Act
        await e.type(firstNameInput, payload.firstName);
        await e.type(lastNameInput, payload.lastName);
        await e.type(emailInput, payload.email);
        await e.type(passwordInput, payload.password);
        await e.click(submitButton);
        //Assert
        expect(signupUser).toHaveBeenCalledWith(payload);
        expect(navigate).toHaveBeenCalledWith("/login");
      });
    });
    describe("Failure", () => {
      it("should set form error on signup failure", async () => {
        //Arrange
        const e = userEvent.setup();
        const error = new Error("signup failed");
        vi.mocked(signupUser).mockRejectedValue(error);
        //Act
        await e.type(firstNameInput, payload.firstName);
        await e.type(lastNameInput, payload.lastName);
        await e.type(emailInput, payload.email);
        await e.type(passwordInput, payload.password);
        await e.click(submitButton);
        //Assert
        expect(signupUser).toHaveBeenCalledWith(payload);
        expect(navigate).not.toHaveBeenCalled();
        expect(
          screen.getByRole("paragraph", { name: "form-error" }),
        ).toHaveTextContent("User already exists");
      });
    });
  });
  describe("login button", () => {
    beforeEach(() => {
      render(
        <UserContext.Provider value={contextValue}>
          <SignupPage />
        </UserContext.Provider>,
      );
    });
    describe("default render login click", () => {
      it("should navigate to /login on button click", async () => {
        //Arrange
        const loginButton = screen.getByRole("button", { name: "Login" });
        const e = userEvent.setup();
        //Act
        await e.click(loginButton);
        //Assert
        expect(navigate).toHaveBeenCalledWith("/login");
      });
    });
    describe("signup failed login click", () => {
      it("should display the form error and navigate to /login", async () => {
        //Arrange
        const firstNameInput = screen.getByRole("textbox", {
          name: "First Name",
        });
        const lastNameInput = screen.getByRole("textbox", {
          name: "Last Name",
        });
        const emailInput = screen.getByRole("textbox", { name: "Email" });
        const passwordInput = screen.getByLabelText("Password");
        const submitButton = screen.getByRole("button", { name: "Signup" });
        const e = userEvent.setup();
        const error = new Error("signup failed");
        vi.mocked(signupUser).mockRejectedValue(error);
        //Act
        await e.type(firstNameInput, payload.firstName);
        await e.type(lastNameInput, payload.lastName);
        await e.type(emailInput, payload.email);
        await e.type(passwordInput, payload.password);
        await e.click(submitButton);
        //Assert
        const formError = screen.getByRole("paragraph", { name: "form-error" });
        expect(formError).toHaveTextContent("User already exists");
        const errorLoginButton = within(formError).getByRole("button", {
          name: "Login",
        });
        await e.click(errorLoginButton);
        expect(navigate).toHaveBeenCalledWith("/login");
      });
    });
  });
  describe("Input field error", () => {
    it("should provide appropriate errors on incorrect input", async () => {
      //Arrange
      render(
        <UserContext.Provider value={contextValue}>
          <SignupPage />
        </UserContext.Provider>,
      );
      const firstNameInput = screen.getByRole("textbox", {
        name: "First Name",
      });
      const lastNameInput = screen.getByRole("textbox", {
        name: "Last Name",
      });
      const emailInput = screen.getByRole("textbox", { name: "Email" });
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button", { name: "Signup" });

      const e = userEvent.setup();

      //Act
      await e.type(emailInput, "user.email");
      await e.type(passwordInput, "password");
      await e.click(submitButton);
      // Assert
      expect(firstNameInput).toHaveAttribute(
        "aria-describedby",
        "error-firstName",
      );
      expect(lastNameInput).toHaveAttribute(
        "aria-describedby",
        "error-lastName",
      );
      expect(emailInput).toHaveAttribute("aria-describedby", "error-email");
      expect(passwordInput).toHaveAttribute(
        "aria-describedby",
        "error-password",
      );
      expect(screen.getAllByText("Required field")).toHaveLength(2);
      expect(
        screen.getByText(
          "Must contain uppercase, lowercase, number and special character",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Please enter a valid email address"),
      ).toBeInTheDocument();
    });
  });
});
