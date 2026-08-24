import "@testing-library/jest-dom";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NavigateFunction, useLoaderData, useNavigate } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { User, UserContext, UserContextProps } from "../../../src/context/User";
import { CreateFolder } from "../../../src/pages/CreateFolderPage";
import { type CreateFolderPayload } from "../../../src/schema/folder";
import { createFolder } from "../../../src/service/createFolder";
vi.mock("react-router", () => ({
  useNavigate: vi.fn(),
  useLoaderData: vi.fn(),
}));
vi.mock("../../../src/service/createFolder", () => ({
  createFolder: vi.fn(),
}));
describe("CreateFolderPage", () => {
  let navigate: NavigateFunction;
  let drive: {
    id: string;
    path: string[];
    folderName: string;
  };
  let contextValue: UserContextProps;
  let user: User;
  let payload: CreateFolderPayload;
  beforeEach(() => {
    vi.clearAllMocks();
    navigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigate);
    payload = { folderName: "testFolderName" };
    drive = {
      id: crypto.randomUUID(),
      path: ["root", "photos"],
      folderName: "photos",
    };
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
      isLoggedIn: true,
    };
  });
  describe("Initial Render", () => {
    describe("Success", () => {
      it("should render the create folder form", () => {
        // Arrange
        render(
          <UserContext.Provider value={contextValue}>
            <CreateFolder />
          </UserContext.Provider>,
        );
        // Act
        const form = screen.getByRole("form", { name: "Create Folder" });
        // Assert
        expect(
          screen.getByRole("button", { name: "Logout" }),
        ).toBeInTheDocument();
        expect(within(form).getByText("Folder Name")).toBeInTheDocument();
        expect(
          within(form).getByRole("textbox", { name: "Folder Name" }),
        ).toHaveValue("");
      });
    });
  });

  describe("Create Folder", () => {
    describe("Success", () => {
      it("should create a folder and navigate to the current folder", async () => {
        // Arrange
        render(
          <UserContext.Provider value={contextValue}>
            <CreateFolder />
          </UserContext.Provider>,
        );
        const e = userEvent.setup();
        const folderNameInput = screen.getByRole("textbox", {
          name: "Folder Name",
        });
        vi.mocked(createFolder).mockResolvedValue({});
        // Act
        await e.type(folderNameInput, payload.folderName);
        await e.click(screen.getByRole("button", { name: "Create" }));
        // Assert
        expect(folderNameInput).toHaveValue(payload.folderName);
        expect(createFolder).toHaveBeenCalledWith({
          folderName: payload.folderName,
          parentId: drive.id,
        });
        expect(navigate).toHaveBeenCalledWith(`/drive/${drive.id}`, {
          replace: true,
        });
      });
    });

    describe("Failure", () => {
      it("should display an error when folder creation fails", async () => {
        // Arrange
        const error = new Error("folder creation failed");
        render(
          <UserContext.Provider value={contextValue}>
            <CreateFolder />
          </UserContext.Provider>,
        );
        vi.mocked(createFolder).mockRejectedValue(error);
        const e = userEvent.setup();
        // Act
        await e.type(
          screen.getByRole("textbox", { name: "Folder Name" }),
          payload.folderName,
        );
        await e.click(screen.getByRole("button", { name: "Create" }));
        // Assert
        expect(createFolder).toHaveBeenCalled();
        expect(navigate).not.toHaveBeenCalled();
        expect(
          screen.getByRole("paragraph", { name: "form-error" }),
        ).toHaveTextContent("Folder with same name exists as this location.");
      });
    });
  });

  describe("Form Errors", () => {
    it("should display validation errors for invalid input", async () => {
      // Arrange
      render(
        <UserContext.Provider value={contextValue}>
          <CreateFolder />
        </UserContext.Provider>,
      );
      const e = userEvent.setup();
      // Act
      await e.click(screen.getByRole("button", { name: "Create" }));
      // Assert
      expect(createFolder).not.toHaveBeenCalled();
      expect(
        screen.getByRole("textbox", { name: "Folder Name" }),
      ).toHaveAttribute("aria-describedby", "error-folderName");
    });
  });
});
