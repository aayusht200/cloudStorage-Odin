import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NavigateFunction, useLoaderData, useNavigate } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { User, UserContext, UserContextProps } from "../../../src/context/User";
import DrivePage from "../../../src/pages/DrivePage";
import { deleteFolder } from "../../../src/service/deleteFolder";
vi.mock("react-router", () => ({
  useNavigate: vi.fn(),
  useLoaderData: vi.fn(),
}));

vi.mock("../../../src/service/deleteFolder.ts", () => ({
  deleteFolder: vi.fn(),
}));

describe("DrivePage", () => {
  let navigate: NavigateFunction;
  type FilesItem = {
    id: string;
    originalName: string;
    mimeType: string;
  };
  type Folder = {
    id: string;
    folderName: string;
  };
  let drive: {
    id: string;
    path: string[];
    files: FilesItem[];
    children: Folder[];
  };
  let contextValue: UserContextProps;
  let user: User;
  beforeEach(() => {
    vi.clearAllMocks();
    navigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigate);
    drive = {
      id: crypto.randomUUID(),
      path: ["root"],
      files: [
        {
          id: crypto.randomUUID(),
          originalName: "testFile",
          mimeType: "image/png",
        },
      ],
      children: [{ id: crypto.randomUUID(), folderName: "photos" }],
    };
    user = {
      id: crypto.randomUUID(),
      email: "test.user@gmail.com",
      firstName: "test",
      lastName: "user",
      role: "USER",
      rootFolderId: crypto.randomUUID(),
    };
    contextValue = {
      user: user,
      loginUser: vi.fn(),
      logoutUser: vi.fn(),
      signupUser: vi.fn(),
      isLoggedIn: true,
    };
    vi.mocked(useLoaderData).mockReturnValue(drive);
  });
  describe("render", () => {
    it("should display folders and files", () => {
      // Arrange
      render(
        <UserContext.Provider value={contextValue}>
          <DrivePage />
        </UserContext.Provider>,
      );
      // Act
      // Assert
      expect(
        screen.getByRole("button", { name: "Logout" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Upload" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Delete" }),
      ).toBeInTheDocument();
      expect(screen.getByText("photos")).toBeInTheDocument();
      expect(screen.getByText("testFile")).toBeInTheDocument();
    });
  });
  describe("actions", () => {
    describe("navigation", () => {
      it("should navigate to a folder", async () => {
        //Arrange
        render(
          <UserContext.Provider value={contextValue}>
            <DrivePage />
          </UserContext.Provider>,
        );
        const event = userEvent.setup();
        //Act
        await event.click(screen.getByRole("button", { name: "photos" }));
        //Assert
        expect(navigate).toHaveBeenCalledWith(`/drive/${drive.children[0].id}`);
      });
      it("should navigate to a file", async () => {
        //Arrange
        render(
          <UserContext.Provider value={contextValue}>
            <DrivePage />
          </UserContext.Provider>,
        );
        const event = userEvent.setup();
        //Act
        await event.click(
          screen.getByRole("button", { name: drive.files[0].originalName }),
        );
        //Assert
        expect(navigate).toHaveBeenCalledWith(`/file/${drive.files[0].id}`);
      });
    });

    describe("delete folder", () => {
      it("should confirm and delete a folder", async () => {
        //Arrange
        render(
          <UserContext.Provider value={contextValue}>
            <DrivePage />
          </UserContext.Provider>,
        );
        vi.mocked(deleteFolder).mockResolvedValue({});
        const event = userEvent.setup();
        //Act + Assert
        expect(
          screen.getByRole("button", { name: "photos" }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: "Delete" }),
        ).toBeInTheDocument();
        await event.click(screen.getByRole("button", { name: "Delete" }));
        expect(
          screen.getByRole("button", { name: "Confirm" }),
        ).toBeInTheDocument();
        await event.click(screen.getByRole("button", { name: "Confirm" }));
        expect(deleteFolder).toHaveBeenCalledWith({
          id: drive.children[0].id,
          folderName: drive.children[0].folderName,
          parentId: drive.id,
        });
        expect(navigate).toHaveBeenCalledWith(0);
      });
      it("should display an error when deletion fails", async () => {
        // Arrange
        render(
          <UserContext.Provider value={contextValue}>
            <DrivePage />
          </UserContext.Provider>,
        );

        const error = new Error("Error");
        vi.mocked(deleteFolder).mockRejectedValue(error);

        const event = userEvent.setup();

        // Act
        await event.click(screen.getByRole("button", { name: "Delete" }));

        expect(
          screen.getByRole("button", { name: "Confirm" }),
        ).toBeInTheDocument();

        await event.click(screen.getByRole("button", { name: "Confirm" }));

        // Assert
        expect(deleteFolder).toHaveBeenCalledWith({
          id: drive.children[0].id,
          folderName: drive.children[0].folderName,
          parentId: drive.id,
        });

        expect(navigate).not.toHaveBeenCalled();

        expect(screen.getByText("Delete failed!")).toBeInTheDocument();
      });
    });
    describe("empty state", () => {
      it("should display the empty state when drive has no folders or files", () => {
        // Arrange
        vi.mocked(useLoaderData).mockReturnValue({
          ...drive,
          children: [],
          files: [],
        });
        render(
          <UserContext.Provider value={contextValue}>
            <DrivePage />
          </UserContext.Provider>,
        );
        // Assert
        expect(screen.getByText("Cloud Storage Empty")).toBeInTheDocument();

        expect(
          screen.getByRole("button", { name: "Upload Files" }),
        ).toBeInTheDocument();
      });
      it("should navigate to upload from empty state", async () => {
        vi.mocked(useLoaderData).mockReturnValue({
          ...drive,
          children: [],
          files: [],
        });

        render(
          <UserContext.Provider value={contextValue}>
            <DrivePage />
          </UserContext.Provider>,
        );

        const event = userEvent.setup();

        await event.click(screen.getByRole("button", { name: "Upload Files" }));

        expect(navigate).toHaveBeenCalledWith(`/upload/${drive.id}`);
      });
    });
  });
});
