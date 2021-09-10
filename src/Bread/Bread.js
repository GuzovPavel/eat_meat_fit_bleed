import { Checkbox } from "@material-ui/core";
import React from "react";
import "./Bread.scss";

const Bread = ({ breadCheck, setBreadCheck, setBread, setCheckForm }) => {
  const handleChange = () => {
    setBreadCheck(!breadCheck);
    if (!breadCheck) {
      setCheckForm(true);
      setBread("без хлеба");
    } else {
      setCheckForm(true);
      setBread("");
    }
  };

  return (
    <div>
      <span>Убрать хлеб</span>
      <Checkbox style={{ color: "#94C571" }} onChange={handleChange} />
    </div>
  );
};

export default Bread;
