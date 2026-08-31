import { act, render } from "@testing-library/react";
import { createRef, forwardRef, useContext, useImperativeHandle } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  defaultUser,
  User,
  UserContext,
  UserContextProps,
} from "../../../src/context/User";
import { UserProvider } from "../../../src/context/UserProvider";
import { login } from "../../../src/service/login";
import { logout } from "../../../src/service/logout";
import { signup } from "../../../src/service/signup";

const revalidate = vi.fn().mockResolvedValue(undefined);
const navigate = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: vi.fn(() => navigate),
  useRevalidator: vi.fn(() => ({
    revalidate,
    state: "idle",
  })),
}));

vi.mock("../../../src/service/login", () => ({ login: vi.fn() }));
vi.mock("../../../src/service/logout", () => ({ logout: vi.fn() }));
vi.mock("../../../src/service/signup", () => ({ signup: vi.fn() }));

const TestConsumer = forwardRef<UserContextProps>((_, ref) => {
  const context = useContext(UserContext);

  useImperativeHandle(ref, () => context, [context]);

  return null;
});

describe("UserProvider", () => {
  let user: User;

  beforeEach(() => {
    vi.clearAllMocks();

    user = {
      id: crypto.randomUUID(),
      email: "test.user@gmail.com",
      firstName: "test",
      lastName: "user",
      role: "USER",
      rootFolderId: crypto.randomUUID(),
    };
  });

  describe("Initial state", () => {
    describe("success", () => {
      it("should return default user on initial render", () => {
        // Arrange
        const contextRef = createRef<UserContextProps>();

        render(
          <UserProvider initialUser={null}>
            <TestConsumer ref={contextRef} />
          </UserProvider>,
        );

        // Assert
        expect(contextRef.current?.user).toEqual(defaultUser);
        expect(contextRef.current?.isLoggedIn).toBe(false);
      });

      it("should return the initial user when one is provided", () => {
        // Arrange
        const contextRef = createRef<UserContextProps>();

        render(
          <UserProvider initialUser={user}>
            <TestConsumer ref={contextRef} />
          </UserProvider>,
        );

        // Assert
        expect(contextRef.current?.user).toEqual(user);
        expect(contextRef.current?.isLoggedIn).toBe(true);
      });
    });
  });

  describe("loginUser", () => {
    describe("success", () => {
      it("should set the user on successful login", async () => {
        // Arrange
        const contextRef = createRef<UserContextProps>();

        vi.mocked(login).mockResolvedValue({
          user,
        });

        render(
          <UserProvider initialUser={null}>
            <TestConsumer ref={contextRef} />
          </UserProvider>,
        );

        // Act
        await act(async () => {
          await contextRef.current?.loginUser({
            email: user.email,
            password: "test",
          });
        });

        // Assert
        expect(login).toHaveBeenCalledWith({
          email: user.email,
          password: "test",
        });
        expect(contextRef.current?.user).toEqual(user);
      });
    });

    describe("failed", () => {
      it("should preserve default user on failure", async () => {
        // Arrange
        const contextRef = createRef<UserContextProps>();
        const error = new Error("Invalid credentials");

        vi.mocked(login).mockRejectedValue(error);

        render(
          <UserProvider initialUser={null}>
            <TestConsumer ref={contextRef} />
          </UserProvider>,
        );

        // Act + Assert
        await expect(
          contextRef.current?.loginUser({
            email: user.email,
            password: "",
          }),
        ).rejects.toBe(error);

        expect(contextRef.current?.user).toEqual(defaultUser);
        expect(revalidate).not.toHaveBeenCalled();
      });
    });
  });

  describe("logoutUser", () => {
    describe("success", () => {
      it("should logout and set user to default user", async () => {
        // Arrange
        const contextRef = createRef<UserContextProps>();

        render(
          <UserProvider initialUser={user}>
            <TestConsumer ref={contextRef} />
          </UserProvider>,
        );

        // Act
        await act(async () => {
          await contextRef.current?.logoutUser();
        });

        // Assert
        expect(logout).toHaveBeenCalledTimes(1);
        expect(contextRef.current?.user).toEqual(defaultUser);
        expect(revalidate).toHaveBeenCalledTimes(1);
        expect(navigate).toHaveBeenCalledWith("/", { replace: true });
      });
    });

    describe("failure", () => {
      it("should clear user and set to default user even on logout failure", async () => {
        // Arrange
        const contextRef = createRef<UserContextProps>();
        const error = new Error("logout failed");

        vi.mocked(logout).mockRejectedValue(error);

        render(
          <UserProvider initialUser={user}>
            <TestConsumer ref={contextRef} />
          </UserProvider>,
        );

        // Act + Assert
        await act(async () => {
          await expect(contextRef.current?.logoutUser()).rejects.toBe(error);
        });

        expect(contextRef.current?.user).toEqual(defaultUser);
        expect(revalidate).toHaveBeenCalled();
        expect(navigate).toHaveBeenCalledWith("/", { replace: true });
      });
    });
  });

  describe("signupUser", () => {
    describe("success", () => {
      it("should call signup with data payload", async () => {
        // Arrange
        const contextRef = createRef<UserContextProps>();

        render(
          <UserProvider initialUser={null}>
            <TestConsumer ref={contextRef} />
          </UserProvider>,
        );

        // Act
        await contextRef.current?.signupUser({
          email: user.email,
          password: "test",
          firstName: user.firstName,
          lastName: user.lastName,
        });

        // Assert
        expect(signup).toHaveBeenCalledWith({
          email: user.email,
          password: "test",
          firstName: user.firstName,
          lastName: user.lastName,
        });
        expect(contextRef.current?.isLoggedIn).toBe(false);
      });
    });

    describe("failure", () => {
      it("should preserve default user if signup failed", async () => {
        // Arrange
        const contextRef = createRef<UserContextProps>();
        const error = new Error("signup failed");

        vi.mocked(signup).mockRejectedValue(error);

        render(
          <UserProvider initialUser={null}>
            <TestConsumer ref={contextRef} />
          </UserProvider>,
        );

        // Act + Assert
        await act(async () => {
          await expect(
            contextRef.current?.signupUser({
              email: user.email,
              password: "test",
              firstName: user.firstName,
              lastName: user.lastName,
            }),
          ).rejects.toEqual(error);
        });

        // Assert
        expect(contextRef.current?.user).toEqual(defaultUser);
        expect(contextRef.current?.isLoggedIn).toBe(false);
      });
    });
  });
});
