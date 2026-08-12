import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../../../src/service/api";
import { logout } from "../../../src/service/logout";
vi.mock("../../../src/service/api", () => ({
  api: {
    post: vi.fn(),
  },
}));
describe("logout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("success", () => {
    it("should send the logout request and return the response data", async () => {
      // Arrange
      vi.mocked(api.post).mockResolvedValue({
        data: { message: "Logged out" },
      });
      // Act
      const response = await logout();
      // Assert
      expect(response).toEqual({ message: "Logged out" });
    });
  });

  describe("failure", () => {
    it("should propagate an API error", async () => {
      // Arrange
      const error = new Error("Endpoint Unreachable");
      vi.mocked(api.post).mockRejectedValue(error);
      // Act
      // Assert
      await expect(logout()).rejects.toBe(error);
    });
  });
});
