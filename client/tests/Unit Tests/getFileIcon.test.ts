import { describe, expect, it } from "vitest";
import { getFileIcon } from "../../src/helperFunction/getFileIcon";

describe("getFileIcon", () => {
  describe("success", () => {
    it("should return an image icon for image MIME types", () => {
      // Act
      const response = getFileIcon("image/png");
      // Assert
      expect(response.type.render.displayName).toBe("FileImage");
    });

    it("should return a video icon for video MIME types", () => {
      // Act
      const response = getFileIcon("video/mp4");
      // Assert
      expect(response.type.render.displayName).toBe("FilePlay");
    });

    it("should return an audio icon for audio MIME types", () => {
      // Act
      const response = getFileIcon("audio/mp3");
      // Assert
      expect(response.type.render.displayName).toBe("FileHeadphone");
    });

    it("should return a text icon for text MIME types", () => {
      // Act
      const response = getFileIcon("text/txt");
      // Assert
      expect(response.type.render.displayName).toBe("FileText");
    });

    it("should return a text icon for PDF files", () => {
      // Act
      const response = getFileIcon("application/pdf");
      // Assert
      expect(response.type.render.displayName).toBe("FileText");
    });

    it("should return an archive icon for ZIP files", () => {
      // Act
      const response = getFileIcon("application/zip");
      // Assert
      expect(response.type.render.displayName).toBe("FileArchive");
    });

    it("should return the default file icon for unsupported MIME types", () => {
      // Act
      const response = getFileIcon("folder/name");
      // Assert
      expect(response.type.render.displayName).toBe("File");
    });
  });
});
