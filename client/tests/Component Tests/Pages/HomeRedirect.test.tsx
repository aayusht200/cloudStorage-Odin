import { render } from "@testing-library/react";
import { Navigate, useRouteLoaderData } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { User } from "../../../src/context/User";
import HomeRedirect from "../../../src/pages/HomeRedirect";
vi.mock("react-router", () => ({
  useRouteLoaderData: vi.fn(),
  Navigate: vi.fn(),
}));

describe("HomeRedirect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("should redirect to drive page when a valid user is present", () => {
    //Arrange
    const user: User = {
      id: crypto.randomUUID(),
      email: "test.user@gmail.com",
      firstName: "test",
      lastName: "user",
      role: "USER",
      rootFolderId: crypto.randomUUID(),
    };
    vi.mocked(useRouteLoaderData).mockReturnValue(user);
    //Act
    render(<HomeRedirect />);
    //Assert
    expect(Navigate).toHaveBeenCalledWith(
      {
        to: `/drive/${user.rootFolderId}`,
        replace: true,
      },
      undefined,
    );
  });
  it("should redirect to /login when no user is present", () => {
    //Arrange
    vi.mocked(useRouteLoaderData).mockReturnValue(null);
    //Act
    render(<HomeRedirect />);
    //Assert
    expect(Navigate).toHaveBeenCalledWith(
      {
        to: `/login`,
        replace: true,
      },
      undefined,
    );
  });
});
