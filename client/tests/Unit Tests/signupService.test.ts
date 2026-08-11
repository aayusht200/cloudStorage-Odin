import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../../src/service/api";
import { signup } from "../../src/service/signup";
vi.mock("../../src/service/api", () => ({
  api: {
    post: vi.fn(),
  },
}));

describe("signup", () => {
  const payload = {
    email: "testuser@gmail.com",
    password: "Test@123",
    firstName: "Test",
    lastName: "User",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("success", () => {
    it("should send the signup request and return the response data", async () => {
      // Arrange
      vi.mocked(api.post).mockResolvedValue({
        data: { message: "signup successful" },
      });
      // Act
      const response = await signup(payload);
      // Assert
      expect(api.post).toHaveBeenCalledWith("/users/signup", payload);
      expect(response).toEqual({ message: "signup successful" });
    });
  });

  describe("failure", () => {
    it("should propagate an API error", async () => {
      // Arrange
      const error = new Error("Endpoint unreachable");
      vi.mocked(api.post).mockRejectedValue(error);
      // Act
      // Assert
      await expect(signup(payload)).rejects.toBe(error);
    });
  });
});
