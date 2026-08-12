import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../../../src/service/api";
import { getFolder } from "../../../src/service/getFolder";
vi.mock("../../../src/service/api.ts", () => ({
  api: {
    get: vi.fn(),
  },
}));

describe("getFolder", () => {
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
      const response = await getFolder(id);
      //Assert
      expect(api.get).toHaveBeenCalledWith(`/folders/${id}`);
      expect(response).toEqual({ id: id });
    });
  });
  describe("failure", () => {
    it("should fail on incorrect data provided", async () => {
      //Arrange
      const error = new Error("Missing/invalid id");
      vi.mocked(api.get).mockRejectedValue(error);
      //Act + Assert
      await expect(getFolder("")).rejects.toBe(error);
    });
  });
});
