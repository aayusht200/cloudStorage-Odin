import { beforeEach, describe, expect, it } from "vitest";
import {
  LoginPayload,
  loginSchema,
  SignupPayload,
  signupSchema,
} from "../../src/schema/auth";

describe("loginSchema", () => {
  let payload: LoginPayload;
  beforeEach(() => {
    payload = {
      email: "testuser@gmail.com",
      password: "Test@123",
    };
  });
  describe("success", () => {
    it("should accept valid login data", () => {
      // Act
      const response = loginSchema.safeParse(payload);
      // Assert
      expect(response.success).toBe(true);
      expect(response.data).toEqual(payload);
    });
  });

  describe("failure", () => {
    it("should reject an invalid email", () => {
      // Act
      const response = loginSchema.safeParse({
        ...payload,
        email: "testuser.gmail.com",
      });
      // Assert
      expect(response.success).toBe(false);
      expect(response.error!.issues[0].message).toBe(
        "Please enter a valid email address",
      );
    });

    it("should reject a password shorter than 8 characters", () => {
      // Act
      const response = loginSchema.safeParse({
        ...payload,
        password: "Testu",
      });
      // Assert
      expect(response.success).toBe(false);
      if (!response.success)
        expect(response.error.issues[0].message).toBe("Minimum length is 8");
    });

    it("should reject a password longer than 64 characters", () => {
      // Act
      const response = loginSchema.safeParse({
        ...payload,
        password:
          "Testuerarearearearaeraereareajrjaernjeanrjazraeraerasdasdas@fasdfasdsadasd",
      });
      // Assert
      expect(response.success).toBe(false);
      expect(response.error!.issues[0].message).toBe("Maximum length is 64");
    });

    it("should reject a password without required character types", () => {
      // Act
      const response = loginSchema.safeParse({
        ...payload,
        password: "Testuser123",
      });
      // Assert
      expect(response.success).toBe(false);
      expect(response.error!.issues[0].message).toBe(
        "Must contain uppercase, lowercase, number and special character",
      );
    });
  });
});

describe("signupSchema", () => {
  let payload: SignupPayload;
  beforeEach(() => {
    payload = {
      email: "testuser@gmail.com",
      password: "Test@123",
      firstName: "Test",
      lastName: "User",
    };
  });
  describe("success", () => {
    it("should accept valid signup data", () => {
      // Act
      const response = signupSchema.safeParse(payload);
      // Assert
      expect(response.success).toBe(true);
      expect(response.data).toEqual(payload);
    });
  });

  describe("failure", () => {
    it("should reject an invalid email", () => {
      //Act
      const response = signupSchema.safeParse({
        ...payload,
        email: "testuser.gmail.com",
      });
      // Assert
      expect(response.success).toBe(false);
      expect(response.error!.issues[0].message).toBe(
        "Please enter a valid email address",
      );
    });

    it("should reject a password that does not meet requirements", () => {
      // Act
      const response = signupSchema.safeParse({
        ...payload,
        password: "Testuser123",
      });
      // Assert
      expect(response.success).toBe(false);
      expect(response.error!.issues[0].message).toBe(
        "Must contain uppercase, lowercase, number and special character",
      );
    });

    it("should reject a missing first name", () => {
      // Act
      const response = signupSchema.safeParse({
        ...payload,
        firstName: "",
      });
      // Assert
      expect(response.success).toBe(false);
      if (!response.success) {
        expect(response.error.issues[0].path[0]).toBe("firstName");
        expect(response.error.issues[0].message).toBe("Required field");
      }
    });

    it("should reject a missing last name", () => {
      // Act
      const response = signupSchema.safeParse({
        ...payload,
        lastName: "",
      });
      // Assert
      expect(response.success).toBe(false);
      if (!response.success) {
        expect(response.error.issues[0].path[0]).toBe("lastName");
        expect(response.error.issues[0].message).toBe("Required field");
      }
    });
  });
});