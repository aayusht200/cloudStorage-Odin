import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NavigateFunction, useLoaderData, useNavigate } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { User, UserContext, UserContextProps } from "../../../src/context/User";
import FilesPage from "../../../src/pages/FilesPage";
import { deleteFile } from "../../../src/service/deleteFile";
vi.mock("react-router", () => ({
  useNavigate: vi.fn(),
  useLoaderData: vi.fn(),
}));
vi.mock("../../../src/service/deleteFile.ts", () => ({
  deleteFile: vi.fn(),
}));
describe("FilesPage", () => {
  let navigate: NavigateFunction;
  type Parent = {
    name: string;
    id: string;
  };
  let file: {
    id: string;
    name: string;
    type: string;
    updatedAt: string;
    size: number;
    url: string;
    path: Parent[];
  };
  let contextValue: UserContextProps;
  let user: User;
  beforeEach(() => {
    vi.clearAllMocks();
    navigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigate);
    file = {
      id: crypto.randomUUID(),
      name: "testFile",
      type: "image/png",
      updatedAt: new Date().toISOString(),
      size: 3318151,
      url: "https://example.com/testFile.png",
      path: [
        { name: "root", id: crypto.randomUUID() },
        { name: "testFile", id: crypto.randomUUID() },
      ],
    };
    user = {
      id: crypto.randomUUID(),
      email: "test.user@gmail.com",
      firstName: "Test",
      lastName: "User",
      role: "USER",
      rootFolderId: crypto.randomUUID(),
    };
    vi.mocked(useLoaderData).mockReturnValue(file);
    contextValue = {
      user: user,
      loginUser: vi.fn(),
      logoutUser: vi.fn(),
      signupUser: vi.fn(),
      isLoggedIn: true,
    };
  });
  describe("FilesPage", () => {
    describe("Regular", () => {
      it("should show file with all the details and actions", () => {
        // Arrange
        render(
          <UserContext.Provider value={contextValue}>
            <FilesPage />
          </UserContext.Provider>,
        );
        // Act
        // Assert
        expect(
          screen.getByRole("button", { name: "Logout" }),
        ).toBeInTheDocument();
        expect(screen.getByText(`Type: ${file.type}`)).toBeInTheDocument();
        expect(screen.getByText(`Name: ${file.name}`)).toBeInTheDocument();
        expect(
          screen.getByText(`Updated At: ${file.updatedAt.split("T")[0]}`),
        ).toBeInTheDocument();

        expect(
          screen.getByText(`Size: ${(file.size / 1000000).toFixed(2)} MB`),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: "Copy file link" }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: "Delete file" }),
        ).toBeInTheDocument();
      });
    });
    describe("Delete", () => {
      it("should delete the file successfully", async () => {
        // Arrange
        render(
          <UserContext.Provider value={contextValue}>
            <FilesPage />
          </UserContext.Provider>,
        );
        const parent = file.path.at(-1)!;

        vi.mocked(deleteFile).mockResolvedValue({});
        const e = userEvent.setup();
        // Act
        await e.click(screen.getByRole("button", { name: "Delete file" }));
        // Assert
        expect(deleteFile).toHaveBeenCalledWith(file.id);
        expect(navigate).toHaveBeenCalledWith(`/drive/${parent.id}`, {
          replace: true,
        });
      });

      it("should display an error when file deletion fails", async () => {
        // Arrange
        render(
          <UserContext.Provider value={contextValue}>
            <FilesPage />
          </UserContext.Provider>,
        );

        const alertMock = vi
          .spyOn(window, "alert")
          .mockImplementation(() => {});

        const error = "Delete failed";

        vi.mocked(deleteFile).mockRejectedValue(error);

        const e = userEvent.setup();
        // Act
        await e.click(screen.getByRole("button", { name: "Delete file" }));
        // Assert
        expect(deleteFile).toHaveBeenCalledWith(file.id);
        expect(navigate).not.toHaveBeenCalled();
        expect(alertMock).toHaveBeenCalledWith(error);
      });
    });
    describe("Copy", () => {
      it("should copy the file link successfully", async () => {
        // Arrange
        render(
          <UserContext.Provider value={contextValue}>
            <FilesPage />
          </UserContext.Provider>,
        );
        const e = userEvent.setup();
        const aleartMock = vi
          .spyOn(navigator.clipboard, "writeText")
          .mockResolvedValue();
        // Act
        await e.click(screen.getByRole("button", { name: "Copy file link" }));
        // Assert
        expect(aleartMock).toHaveBeenCalledWith(file.url);
      });

      it("should display an error when link copy fails", async () => {
        // Arrange
        render(
          <UserContext.Provider value={contextValue}>
            <FilesPage />
          </UserContext.Provider>,
        );
        const e = userEvent.setup();
        const writeTextMock = vi
          .spyOn(navigator.clipboard, "writeText")
          .mockRejectedValue({});
        const alertMock = vi
          .spyOn(window, "alert")
          .mockImplementation(() => {});
        // Act
        await e.click(screen.getByRole("button", { name: "Copy file link" }));
        // Assert
        expect(writeTextMock).toHaveBeenCalledWith(file.url);
        expect(alertMock).toHaveBeenCalledWith("Copy failed try again!");
      });
    });
  });
});
