import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../../../src/service/api";
import { authenticate } from "../../../src/service/authenticate.ts";

vi.mock("../../../src/service/api", () => ({
  api: {
    get: vi.fn(),
  },
  setCsrfToken: vi.fn(),
}));

describe("authenticate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("success", () => {
    it("should send the authentication request and return the response data", async () => {
      // Arrange
      const id = crypto.randomUUID();
      vi.mocked(api.get).mockResolvedValue({ data: { id: id } });
      // Act
      const response = await authenticate();
      // Assert
      expect(api.get).toHaveBeenCalledWith("/users/me");
      expect(response).toEqual({ id: id });
    });
  });

  describe("failure", () => {
    it("should propagate an API error", async () => {
      // Arrange
      const error = new Error("Not authorized");
      vi.mocked(api.get).mockRejectedValue(error);
      // Act
      // Assert
      await expect(authenticate()).rejects.toEqual(error);
    });
  });
});
