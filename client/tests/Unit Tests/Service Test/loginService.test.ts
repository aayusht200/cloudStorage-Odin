import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../../../src/service/api";
import { login } from "../../../src/service/login";
vi.mock("../../../src/service/api", () => ({
  api: {
    post: vi.fn(),
  },
  setCsrfToken: vi.fn(),
}));

describe("login", () => {
  const payload = {
    email: "testuser@gmail.com",
    password: "Test@123",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("success", () => {
    it("should send the login request and return the response data", async () => {
      //Arrange
      vi.mocked(api.post).mockResolvedValue({ data: payload });
      // Act
      const response = await login(payload);
      // Assert
      expect(api.post).toHaveBeenCalledWith("/users/login", payload);
      expect(response).toEqual(payload);
    });
  });

  describe("failure", () => {
    it("should propagate an API error", async () => {
      // Arrange
      const error = new Error("Endpoint unreachable");
      vi.mocked(api.post).mockRejectedValue(error);
      // Act
      // Assert
      await expect(login(payload)).rejects.toBe(error);
    });
  });
});
