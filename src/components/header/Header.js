import { Link } from "react-router-dom";
import React from "react";
import "./Header.scss";

export const Header = ({ user, data, isOpen, open }) => {
  return (
    <div
      id="header"
      style={
        isOpen || open
          ? {
              backgroundColor: "rgba(91, 233, 202, 0.15)",
            }
          : {
              backgroundColor: "#CA748B",
            }
      }
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        {
          <Link to="/">
            {" "}
            <div
              style={
                isOpen || open
                  ? { color: "black", fontSize: "18px" }
                  : { color: "#94C571", fontSize: "18px" }
              }
            >
              LUNCH TIME
            </div>
          </Link>
        }

        {data && data.admin === true && (
          <Link to="/admin-menu">
            {" "}
            <div
              style={
                isOpen || open
                  ? { color: "black", fontSize: "18px" }
                  : { color: "#94C571", fontSize: "18px" }
              }
            >
              admin menu
            </div>
          </Link>
        )}
        {data && data.admin === true && (
          <Link to="/orders">
            {" "}
            <div
              style={
                isOpen || open
                  ? { color: "black", fontSize: "18px" }
                  : { color: "#94C571", fontSize: "18px" }
              }
            >
              Orders
            </div>
          </Link>
        )}
        {data && data.admin === true && (
          <Link to="/costs">
            {" "}
            <div
              style={
                isOpen || open
                  ? { color: "black", fontSize: "18px" }
                  : { color: "#94C571", fontSize: "18px" }
              }
            >
              Costs
            </div>
          </Link>
        )}

        {data && data.admin === true && (
          <Link to="/users">
            <div
              style={
                isOpen || open
                  ? { color: "black", fontSize: "18px" }
                  : { color: "#94C571", fontSize: "18px" }
              }
            >
              Users
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};
