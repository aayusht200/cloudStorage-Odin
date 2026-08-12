import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../../../src/service/api";
import { upload } from "../../../src/service/upload";
vi.mock("../../../src/service/api.ts", () => ({
  api: {
    post: vi.fn(),
  },
}));

describe("upload", () => {
  let id: string;
  let file: File;
  beforeEach(() => {
    id = crypto.randomUUID();
    file = new File(["Test Data"], "fileName", { type: "image/png" });
    vi.clearAllMocks();
  });
  describe("success", () => {
    it("should return data on succesful request", async () => {
      //Arrange
      vi.mocked(api.post).mockResolvedValue({
        data: { message: "Upload succesful" },
      });
      const formData = new FormData();
      formData.append("folderId", id);
      formData.append("file", file);
      //Act
      const response = await upload({ folderId: id, file });
      //Assert
      expect(api.post).toHaveBeenCalledWith("/files/create", formData);
      expect(response).toEqual({ message: "Upload succesful" });
    });
  });
  describe("failure", () => {
    it("should fail on incorrect data provided", async () => {
      //Arrange
      const error = new Error("Missing/invalid data");
      vi.mocked(api.post).mockRejectedValue(error);
      //Act + Assert
      await expect(upload({ folderId: "", file })).rejects.toBe(error);
    });
  });
});
