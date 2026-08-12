import axios from "axios";
import { redirect } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { authRedirectLoader } from "../../../src/loaders/authRedirectLoader";
import { authenticate } from "../../../src/service/authenticate";
vi.mock("../../../src/service/authenticate", () => ({
  authenticate: vi.fn(),
}));
vi.mock("react-router", () => ({
  redirect: vi.fn(),
}));
vi.mock("axios", () => ({
  default: {
    isAxiosError: vi.fn(),
  },
}));
describe("authRedirectLoader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("success", () => {
    it("should redirect authenticated users", async () => {
      // Arrange
      const redirectResponse = new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
      vi.mocked(authenticate).mockResolvedValue(null);
      vi.mocked(redirect).mockReturnValue(redirectResponse);
      // Act
      // Assert
      await expect(authRedirectLoader()).rejects.toBe(redirectResponse);
      expect(redirect).toHaveBeenCalledWith("/");
    });
  });

  describe("failure", () => {
    it("should return null for a 401 Axios error", async () => {
      // Arrange
      const error = new Error("Axios error");
      Object.assign(error, {
        response: {
          status: 401,
        },
      });
      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      vi.mocked(authenticate).mockRejectedValue(error);
      //Act + Assert
      await expect(authRedirectLoader()).resolves.toBeNull();
    });

    it("should rethrow non-401 errors", async () => {
      // Arrange
      const error = new Error("Non axios error");
      // Act
      vi.mocked(axios.isAxiosError).mockReturnValue(false);
      vi.mocked(authenticate).mockRejectedValue(error);
      // Assert
      await expect(authRedirectLoader()).rejects.toBe(error);
    });
  });
});
