import React from "react";
import { Link } from "react-router-dom";
// import { auth } from "../../firebase";
import Icon1 from "../../Images/Icon1.svg";
import Icon2 from "../../Images/Icon2.svg";
import Icon02 from "../../Images/Icon.2.svg";
import Icon from "../../Images/icon.svg";
import Icon0 from "../../Images/icon..svg";
import Icon01 from "../../Images/Icon.1.svg";
import LogoutModal from "../../components/LogoutModal/LogoutModal";
// import { SettingsPowerRounded } from "@material-ui/icons";

export const Footer = ({ user, data, isOpen, setIsOpen, open, setOpen }) => {
  // const [open, setOpen] = React.useState(false);

  // const signOut = () => {
  //   auth
  //     .signOut()
  //     .then(function (res) {
  //       localStorage.clear();
  //     })
  //     .catch(function (error) {});

  // };

  return (
    <div
      style={
        isOpen || open
          ? {
              backgroundColor: "rgba(91, 233, 202, 0.15)",
              width: "100%",
              display: "flex",
              alignItems: "center",
            }
          : {
              backgroundColor: "#CA748B",
              width: "100%",
              display: "flex",
              alignItems: "center",
            }
      }
      id="footer"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          width: "100%",
        }}
      >
        {user ? (
          <Link to="/" style={{ width: "calc(100% / 3)" }}>
            {isOpen || open ? (
              <img
                style={{ width: "40px", height: "40px" }}
                src={Icon0}
                alt="menu"
              ></img>
            ) : (
              <img
                style={{ width: "40px", height: "40px" }}
                src={Icon}
                alt="menu"
              ></img>
            )}
          </Link>
        ) : (
          <Link to="/reg">
            <div style={{ color: "#94C571", fontSize: "18px", width: "100%" }}>
              REG-IN
            </div>
          </Link>
        )}

        {user && (
          <Link to="/orders-history" style={{ width: "calc(100% / 3)" }}>
            {isOpen || open ? (
              <img
                style={{ width: "25px", height: "25px" }}
                src={Icon02}
                alt="orders"
              ></img>
            ) : (
              <img
                style={{ width: "25px", height: "25px" }}
                src={Icon2}
                alt="orders"
              ></img>
            )}
          </Link>
        )}
        {user ? (
          <div
            style={{
              width: "calc(100% / 3)",
              display: "flex",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onClick={() => {
              // signOut();
              // window.location.href = "/";
              setOpen(true);
            }}
          >
            {isOpen || open ? (
              <img
                style={{ width: "25px", height: "25px" }}
                src={Icon01}
                alt="orders"
              ></img>
            ) : (
              <img
                style={{ width: "25px", height: "25px" }}
                src={Icon1}
                alt="orders"
              ></img>
            )}
          </div>
        ) : (
          <Link to="/login">
            <div style={{ color: "#94C571", fontSize: "18px", width: "100%" }}>
              LOG-IN
            </div>
          </Link>
        )}
      </div>
      <LogoutModal open={open} setOpen={setOpen} setIsOpen={setIsOpen} />
    </div>
  );
};
