import { describe, expect, it } from "vitest";
import { uploadFormSchema } from "../../../src/schema/file.ts";
describe("uploadFormSchema", () => {
  describe("success", () => {
    it("should accept a valid file", () => {
      // Arrange
      const file = new File(["test image content"], "fileName.png", {
        type: "image/png",
      });

      // Act
      const response = uploadFormSchema.safeParse({
        file,
      });

      // Assert
      expect(response.success).toBe(true);
      expect(response.data).toEqual({
        file,
      });
    });

    it("should accept a file at the maximum allowed size", () => {
      // Arrange
      const content = new Uint8Array(10 * 1024 * 1024);
      const file = new File([content], "fileName.png", {
        type: "image/png",
      });
      // Act
      const response = uploadFormSchema.safeParse({
        file,
      });

      // Assert
      expect(response.success).toBe(true);
      expect(response.data!.file).toBe(file);
    });
  });

  describe("failure", () => {
    it("should reject when file is missing", () => {
      // Act
      const response = uploadFormSchema.safeParse(null);
      // Assert
      expect(response.success).toBe(false);
      expect(response.error!.issues[0].message).toBe(
        "Invalid input: expected object, received null",
      );
    });

    it("should reject a file larger than 10 MB", () => {
      // Arrange
      const content = new Uint32Array(11 * 1024 * 1024);
      const file = new File([content], "fileName.png", {
        type: "image/png",
      });

      // Act
      const response = uploadFormSchema.safeParse({
        file,
      });

      // Assert
      expect(response.success).toBe(false);

      if (!response.success) {
        expect(response.error.issues[0].code).toBe("too_big");
        expect(response.error.issues[0].message).toBe(
          "Too big: expected file to have <=10485760 bytes",
        );
      }
    });
  });
});
