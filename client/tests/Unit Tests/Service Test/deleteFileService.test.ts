import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../../../src/service/api.ts";
import { deleteFile } from "../../../src/service/deleteFile.ts";
vi.mock("../../../src/service/api.ts", () => ({
  api: {
    delete: vi.fn(),
  },
}));
describe("deleteFile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe("success", () => {
    it("Succesfull deletion returns the folder id", async () => {
      //Arrange
      const id = crypto.randomUUID();
      vi.mocked(api.delete).mockResolvedValue({ data: { id: id } });
      //Act
      const response = await deleteFile(id);
      //Assert
      expect(api.delete).toHaveBeenCalledWith(`/files/${id}`);
      expect(response).toEqual({ id: id });
    });
  });
  describe("failure", () => {
    it("should reject if id is not provided", async () => {
      //Arrange
      const id = "";
      const error = new Error("ID missing");
      vi.mocked(api.delete).mockRejectedValue(error);
      //Act + Assert
      await expect(deleteFile(id)).rejects.toBe(error);
    });
  });
});
