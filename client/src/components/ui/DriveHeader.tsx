import { Fragment, useContext } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../../context/UserContext";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./breadcrumb";
import { Button } from "./button";
type DriveHeaderProps = {
  path: {
    id: string;
    name: string;
  }[];
};

function DriveHeader({ path }: DriveHeaderProps) {
  const { logoutUser, user } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <header>
      <nav className="flex h-fit w-dvw items-center justify-between px-3 pt-1">
        <div className="left">
          <Breadcrumb>
            <BreadcrumbList>
              {path.map(
                (current: { id: string; name: string }, index: number) => (
                  <Fragment key={current.id}>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href={`/drive/${current.id}`}
                        className="font-heading text-2xl leading-snug font-medium group-data-[size=sm]/card:text-sm"
                      >
                        {current.name !== "root"
                          ? current.name
                          : `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {index < path.length - 1 && <BreadcrumbSeparator />}
                  </Fragment>
                ),
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="right">
          <Button
            className="hover:bg-destructive mr-12 h-10 cursor-pointer"
            variant="default"
            onClick={async () => {
              await logoutUser();
              navigate("/");
            }}
          >
            Logout
          </Button>
        </div>
      </nav>
    </header>
  );
}

export default DriveHeader;
