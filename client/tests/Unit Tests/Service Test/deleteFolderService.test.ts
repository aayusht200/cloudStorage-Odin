import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../../../src/service/api";
import {
  deleteFolder,
  deleteFolderPayload,
} from "../../../src/service/deleteFolder.ts";
vi.mock("../../../src/service/api", () => ({ api: { delete: vi.fn() } }));
describe("deleteFolder", () => {
  let payload: deleteFolderPayload;
  beforeEach(() => {
    vi.clearAllMocks();
    payload = {
      id: crypto.randomUUID(),
      parentId: crypto.randomUUID(),
      folderName: "TempName",
    };
  });
  describe("success", () => {
    it("should pass while returning the folder id", async () => {
      //Arrange

      vi.mocked(api.delete).mockResolvedValue({ data: { id: payload.id } });
      //Act
      const response = await deleteFolder(payload);
      //Assert
      expect(api.delete).toHaveBeenCalledWith(`/folders/${payload.id}`, {
        data: { parentId: payload.parentId, folderName: payload.folderName },
      });
      expect(response).toEqual({ id: payload.id });
    });
  });
  describe("failure", () => {
    it("should fail on missing data", async () => {
      //Arrange
      const error = new Error("Missing data");
      vi.mocked(api.delete).mockRejectedValue(error);
      //Act + Assert
      await expect(deleteFolder({ ...payload, id: "" })).rejects.toBe(error);
    });
  });
});
