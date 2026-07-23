import { useContext } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { UserContext } from "../context/UserContext";
import { getFolder } from "../service/getFolder";

function DrivePage() {
  const { logoutUser, user } = useContext(UserContext);
  const root = {
    logo: `${user.firstName[0]}${user.lastName[0]}`.toUpperCase(),
    rootId: user.rootFolderId,
  };
  const navigate = useNavigate();
  return (
    <div>
      <nav>
        <div className="left">
          <Button
            className="hover:bg-destructive right-15 h-10 cursor-pointer"
            variant="default"
            onClick={async () => {
              const data = await getFolder(root.rootId);
              console.log(data);
            }}
          >
            getfolder
          </Button>
        </div>
        <div className="right">
          <Button
            className="hover:bg-destructive right-15 h-10 cursor-pointer"
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
    </div>
  );
}

export default DrivePage;
