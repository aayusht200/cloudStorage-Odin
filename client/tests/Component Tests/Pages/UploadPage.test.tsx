import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import { NavigateFunction, useLoaderData, useNavigate } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { User, UserContext, UserContextProps } from "../../../src/context/User";

import userEvent from "@testing-library/user-event";
import UploadPage from "../../../src/pages/UploadPage";
import { upload } from "../../../src/service/upload";
vi.mock("react-router", () => ({
  useNavigate: vi.fn(),
  useLoaderData: vi.fn(),
}));
vi.mock("../../../src/service/upload", () => ({
  upload: vi.fn(),
}));
describe("UploadPage", () => {
  let navigate: NavigateFunction;
  let drive: {
    id: string;
    path: string[];
    folderName: string;
  };
  let file: File;
  let contextValue: UserContextProps;
  let user: User;
  beforeEach(() => {
    vi.clearAllMocks();
    navigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigate);
    drive = {
      id: crypto.randomUUID(),
      path: ["root", "photos"],
      folderName: "photos",
    };
    file = new File(["test image content"], "fileName.png", {
      type: "image/png",
    });
    user = {
      id: crypto.randomUUID(),
      email: "test.user@gmail.com",
      firstName: "Test",
      lastName: "User",
      role: "USER",
      rootFolderId: crypto.randomUUID(),
    };
    vi.mocked(useLoaderData).mockReturnValue(drive);
    contextValue = {
      user: user,
      loginUser: vi.fn(),
      logoutUser: vi.fn(),
      signupUser: vi.fn(),
      isLoggedIn: false,
    };
  });
  describe("initial render", () => {
    it("should render an upload form", () => {
      //Arrange
      render(
        <UserContext.Provider value={contextValue}>
          <UploadPage />
        </UserContext.Provider>,
      );
      //Act
      const form = screen.getByRole("form", { name: "Upload form" });
      //Assert
      expect(form).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Logout" }),
      ).toBeInTheDocument();
      expect(screen.getByText("CloudDrive")).toBeInTheDocument();
      expect(screen.getByLabelText("Chose File")).toBeInTheDocument();
      expect(
        within(form).getByRole("button", { name: "Upload" }),
      ).toBeInTheDocument();
    });
  });
  describe("upload", () => {
    describe("Success", () => {
      it("should navigate to current folder on succesful upload", async () => {
        //Arrange
        vi.mocked(upload).mockResolvedValue(null);
        render(
          <UserContext.Provider value={contextValue}>
            <UploadPage />
          </UserContext.Provider>,
        );
        const form = screen.getByRole("form", { name: "Upload form" });
        const uploadButton = within(form).getByRole("button", {
          name: "Upload",
        });
        const fileInput = screen.getByLabelText("Chose File");
        const e = userEvent.setup();
        //Act
        await e.upload(fileInput, file);
        await e.click(uploadButton);
        //Assert
        expect(upload).toHaveBeenCalledWith({
          folderId: drive.id,
          file,
        });
        expect(navigate).toHaveBeenCalledWith(`/drive/${drive.id}`);
      });
    });
    describe("Failure", () => {
      it("should show form error on failed upload", async () => {
        //Arrange
        const error = new Error("upload failed");
        vi.mocked(upload).mockRejectedValue(error);
        render(
          <UserContext.Provider value={contextValue}>
            <UploadPage />
          </UserContext.Provider>,
        );
        const form = screen.getByRole("form", { name: "Upload form" });
        const uploadButton = within(form).getByRole("button", {
          name: "Upload",
        });
        const fileInput = screen.getByLabelText("Chose File");
        const e = userEvent.setup();
        //Act
        await e.upload(fileInput, file);
        await e.click(uploadButton);
        //Assert
        expect(upload).toHaveBeenCalledWith({
          folderId: drive.id,
          file,
        });
        expect(navigate).not.toHaveBeenCalled();
        expect(
          within(form).getByRole("paragraph", { name: "form-error" }),
        ).toBeInTheDocument();
      });
    });
  });
  describe("form-errors", () => {
    it("should show error on incorrect type upload", async () => {
      //Arrange
      const file = new File(["test image content"], "fileName.png", {
        type: "image/test",
      });
      render(
        <UserContext.Provider value={contextValue}>
          <UploadPage />
        </UserContext.Provider>,
      );
      const form = screen.getByRole("form", { name: "Upload form" });
      const uploadButton = within(form).getByRole("button", {
        name: "Upload",
      });
      const fileInput = screen.getByLabelText("Chose File");
      const e = userEvent.setup();
      //Act
      await e.upload(fileInput, file);
      await e.click(uploadButton);
      //Assert
      expect(
        screen.getByRole("paragraph", { name: "form-error" }),
      ).toBeInTheDocument();
    });
  });
});
