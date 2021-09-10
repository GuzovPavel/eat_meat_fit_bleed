import { Button, makeStyles } from "@material-ui/core";
import React, { useState } from "react";

import firebase from "firebase";

import CustomInput from "../customInput";
import SnackbarPass from "./SnackbarPass";
import SnackErr from "./SnackErr";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: "40%",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    transform: "translate(-50%, -50%)",
    top: "50%",
    left: "50%",
  },
}));

const ResetPassword = () => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [isBar, setIsBar] = useState(false);
  const [isErr, setIsErr] = useState(false)

  const resetPassword = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        setEmail('');
        setIsBar(true)
      })
      .catch((error) => {
        setIsErr(true)
      });
     
  };
  return (
    <div className={classes.paper}>
          <SnackbarPass isBar={isBar} setIsBar={setIsBar} />
          <SnackErr isErr={isErr} setIsErr={setIsErr} />
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        className="form"
      >
        <CustomInput
          labelText="Email"
          value={email}
          id="email"
          formControlProps={{
            fullWidth: true,
          }}
          handleChange={(e) => setEmail(e.target.value)}
          type="text"
        />
        <Button onClick={resetPassword} type="button" color="primary">
          Reset Passowrd
        </Button>
      </form>
    
    </div>
  );
};

export default ResetPassword;
