import { Checkbox } from "@material-ui/core";
import React from "react";
import "./SwitchBox.scss";

const SwitchBox = ({
  cutleryCheck,
  setCutleryCheck,
  setCutlery,
  setCheckForm,
}) => {
  const handleChange = () => {
    setCutleryCheck(!cutleryCheck);
    if (!cutleryCheck) {
      setCutlery("без приборов");
      setCheckForm(true);
    } else {
      setCutlery("");
      setCheckForm(true);
    }
  };
  return (
    <div>
      <span>Убрать приборы</span>
      <Checkbox style={{ color: "#94C571" }} onChange={handleChange} />
    </div>
  );
};

export default SwitchBox;
