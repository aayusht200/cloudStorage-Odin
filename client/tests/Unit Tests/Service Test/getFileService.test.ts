import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../../../src/service/api";
import { getFile } from "../../../src/service/getFile";
vi.mock("../../../src/service/api.ts", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("getFile", () => {
  let id: string;
  beforeEach(() => {
    id = crypto.randomUUID();
    vi.clearAllMocks();
  });
  describe("success", () => {
    it("should return data on succesful request", async () => {
      //Arrange
      vi.mocked(api.get).mockResolvedValue({ data: { id: id } });
      //Act
      const response = await getFile(id);
      //Assert
      expect(api.get).toHaveBeenCalledWith(`/files/${id}`);
      expect(response).toEqual({ id: id });
    });
  });
  describe("failure", () => {
    it("should fail on incorrect data provided", async () => {
      //Arrange
      const error = new Error("Missing/invalid id");
      vi.mocked(api.get).mockRejectedValue(error);
      //Act + Assert
      await expect(getFile("")).rejects.toBe(error);
    });
  });
});
