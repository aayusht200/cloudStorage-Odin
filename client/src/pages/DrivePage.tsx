import { Fragment, useContext } from "react";
import { useLoaderData, useNavigate } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import { Button } from "../components/ui/button";
import { UserContext } from "../context/UserContext";
function DrivePage() {
  const { logoutUser, user } = useContext(UserContext);
  const drive = useLoaderData();
  const logo = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  const navigate = useNavigate();
  return (
    <div className="flex h-dvh flex-col">
      <header>
        <nav className="flex h-fit w-dvw items-center justify-between px-3 pt-1">
          <div className="left">
            <Breadcrumb>
              <BreadcrumbList>
                {drive.path.map(
                  (current: { id: string; name: string }, index: number) => (
                    <Fragment key={current.id}>
                      <BreadcrumbItem>
                        <BreadcrumbLink
                          href={`/drive/${current.id}`}
                          className="font-heading text-2xl leading-snug font-medium group-data-[size=sm]/card:text-sm"
                        >
                          {current.name !== "root" ? current.name : logo}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      {index < drive.path.length - 1 && <BreadcrumbSeparator />}
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
      <main>placeholder</main>
    </div>
  );
}

export default DrivePage;
