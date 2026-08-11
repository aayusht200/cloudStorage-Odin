import { describe, expect, it } from "vitest";
import { createFolderSchema } from "../../src/schema/folder";

describe("createFolderSchema", () => {
  describe("success", () => {
    it("should accept a valid folder name", () => {
      // Act
      const response = createFolderSchema.safeParse({ folderName: "testName" });
      // Assert
      expect(response.success).toBe(true);
      expect(response.data).toEqual({ folderName: "testName" });
    });
  });

  describe("failure", () => {
    it("should reject an empty folder name", () => {
      // Act
      const response = createFolderSchema.safeParse({ folderName: null });
      // Assert
      expect(response.success).toBe(false);
      expect(response.error!.issues[0].message).toBe(
        "Invalid input: expected string, received null",
      );
    });
  });
});
