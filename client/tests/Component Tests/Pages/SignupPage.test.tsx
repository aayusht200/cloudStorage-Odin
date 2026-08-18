import { NavigateFunction, useNavigate } from "react-router";
import { beforeEach, describe, vi } from "vitest";
import { defaultUser, UserContextProps } from "../../../src/context/User";
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
    describe('Initial state', () => {
        
    });
    describe('Signup', () => {
        
    });
    describe('login redirect', () => {
        
    });
});
