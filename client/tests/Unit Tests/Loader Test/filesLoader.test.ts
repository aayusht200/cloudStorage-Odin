import axios from "axios";
import { LoaderFunctionArgs, redirect } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { filesLoader } from "../../../src/loaders/filesLoader";
import { getFile } from "../../../src/service/getFile";
vi.mock("../../../src/service/getFile", () => ({
  getFile: vi.fn(),
}));
vi.mock("axios", () => ({
  default: {
    isAxiosError: vi.fn(),
  },
}));
vi.mock("react-router", () => ({
  redirect: vi.fn(),
}));

describe("filesLoader", () => {
  let params: LoaderFunctionArgs;

  beforeEach(() => {
    vi.clearAllMocks();
    params = {
      params: {
        id: crypto.randomUUID(),
      },
    } as unknown as LoaderFunctionArgs;
  });
  describe("success", () => {
    it("should return file", async () => {
      // Arrange
      vi.mocked(getFile).mockResolvedValue("file");

      // Act
      const response = await filesLoader(params);

      // Assert
      expect(getFile).toHaveBeenCalledWith(params.params.id);
      expect(response).toEqual("file");
    });
  });
  describe("failure", () => {
    it("should throw response with 400 when params.id is missing", async () => {
      //Act
      //Assert
      await expect(
        filesLoader({ ...params, params: { id: "" } }),
      ).rejects.toBeInstanceOf(Response);
    });
    it("should redirect to /login on axios 401 error", async () => {
      //Arrange
      const error = new Error("Axios error");
      Object.assign(error, {
        response: {
          status: 401,
        },
      });
      const res = new Response(null, {
        status: 301,
        headers: { Location: "/login" },
      });
      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      vi.mocked(getFile).mockRejectedValue(error);
      vi.mocked(redirect).mockReturnValue(res);
      //Act
      //Assert
      await expect(filesLoader(params)).rejects.toBe(res);
      expect(redirect).toHaveBeenCalledWith("/login");
    });
    it("should throw error on non 401 error", async () => {
      //Arrange
      const error = new Error("Non axios error");
      vi.mocked(getFile).mockRejectedValue(error);
      //Act
      //Assert
      await expect(filesLoader(params)).rejects.toBe(error);
    });
  });
});
