import axios from "axios";
import { redirect, type LoaderFunctionArgs } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { driveLoader } from "../../../src/loaders/driveLoader";
import { getFolder } from "../../../src/service/getFolder";
vi.mock("../../../src/service/getFolder", () => ({
  getFolder: vi.fn(),
}));
vi.mock("axios", () => ({
  default: {
    isAxiosError: vi.fn(),
  },
}));
vi.mock("react-router", () => ({
  redirect: vi.fn(),
}));

describe("driveLoader", () => {
  let params: LoaderFunctionArgs;
  beforeEach(() => {
    vi.clearAllMocks();
    params = {
      params: {
        id: crypto.randomUUID(),
      },
    } as unknown as LoaderFunctionArgs;
  });
  describe("sucess", () => {
    it("should return the folder info on sucess", async () => {
      //Arrange
      vi.mocked(getFolder).mockResolvedValue(params.params.id);
      //Act
      const response = await driveLoader(params);
      //Assert
      expect(getFolder).toHaveBeenCalledWith(params.params.id);
      expect(response).toBe(params.params.id);
    });
  });
  describe("failure", () => {
    it("should throw on missing id", async () => {
      //Assert
      await expect(
        driveLoader({
          ...params,
          params: {
            id: "",
          },
        }),
      ).rejects.toBeInstanceOf(Response);
    });
    it("should redirect to /login on 401 axios error", async () => {
      //Arrange
      const res = new Response(null, {
        status: 301,
        headers: {
          location: "/login",
        },
      });
      const error = new Error("Axios error");
      Object.assign(error, {
        response: {
          status: 401,
        },
      });
      vi.mocked(axios.isAxiosError).mockReturnValue(true);
      vi.mocked(getFolder).mockRejectedValue(error);
      vi.mocked(redirect).mockReturnValue(res);
      //Act
      //Assert
      await expect(driveLoader(params)).rejects.toBe(res);
    });
    it("should throw on non axios error", async () => {
      //Arrange
      const error = new Error("non axios error");
      vi.mocked(axios.isAxiosError).mockResolvedValue(false);
      vi.mocked(getFolder).mockRejectedValue(error);
      //Act
      //Assert
      await expect(driveLoader(params)).rejects.toBe(error);
    });
  });
});
