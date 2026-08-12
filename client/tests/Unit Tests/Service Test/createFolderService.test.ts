import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../../../src/service/api";
import { createFolder } from "../../../src/service/createFolder.ts";
vi.mock("../../../src/service/api", () => ({
  api: {
    post: vi.fn(),
  },
}));

describe("createFolder", () => {
  const payload = {
    folderName: "Test Folder",
    parentId: crypto.randomUUID(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("success", () => {
    it("should send the folder creation request and return the response data", async () => {
      // Arrange
      vi.mocked(api.post).mockResolvedValue({
        data: { message: "Folder Created" },
      });
      // Act
      const response = await createFolder(payload);
      // Assert
      expect(api.post).toHaveBeenCalledWith("/folders/create", payload);
      expect(response).toEqual({ message: "Folder Created" });
    });
  });

  describe("failure", () => {
    it("should propagate an API error", async () => {
      // Arrange
      const error = new Error("Unauthorized");
      vi.mocked(api.post).mockRejectedValue(error);
      // Act
      // Assert
      await expect(createFolder(payload)).rejects.toBe(error);
    });
  });
});
