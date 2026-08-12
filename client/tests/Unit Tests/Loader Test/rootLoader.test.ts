import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { rootLoader } from "../../../src/loaders/rootLoader";
import { authenticate } from "../../../src/service/authenticate";
vi.mock("../../../src/service/authenticate", () => ({
  authenticate: vi.fn(),
}));
vi.mock("axios", () => ({
  default: {
    isAxiosError: vi.fn(),
  },
}));
describe("rootLoader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe("success", () => {
    it("should return user data", async () => {
      //Arrange
      vi.mocked(authenticate).mockResolvedValue("user");
      //Act
      const response = await rootLoader();
      //Assert
      expect(response).toEqual("user");
    });
  });
  describe("failure", () => {
    it("should return null on 401 axios error", async () => {
      //Arrange
      const error = new Error("Axios 401 error");
      Object.assign(error, {
        response: {
          status: 401,
        },
      });
      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      vi.mocked(authenticate).mockRejectedValue(error);
      //Act
      //Assert
      await expect(rootLoader()).resolves.toBeNull();
    });
    it("should throw error on non 401 error", async () => {
      //Arrange
      const error = new Error("Non axios error");
      vi.mocked(axios.isAxiosError).mockReturnValue(false);
      vi.mocked(authenticate).mockRejectedValue(error);
      //Act
      //Assert
      await expect(rootLoader()).rejects.toBe(error);
    });
  });
});
