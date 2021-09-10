import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import CustomInput from "../customInput";
import { auth } from "../../firebase";
import { useHistory } from "react-router-dom";

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

export const Login = () => {
  const history = useHistory();
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [valid, setValid] = useState("");
  const [password, setPassword] = useState("");

  const signUp = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        history.push("/");
      })
      .catch((error) => {
        setValid(error.message);
      });
  };
  const forgotPassword = (e) => {
        history.push("/forgotPassword");
  };
  const signOut = () => {
    auth
      .signOut()
      .then(function (res) {
      })
      .catch(function (error) {});
  };

  return (
    <div className={classes.paper}>
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

        <CustomInput
          labelText="Password"
          id="password"
          value={password}
          formControlProps={{
            fullWidth: true,
          }}
          handleChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        {valid && <span style={{ color: "red" }}>{valid}</span>}

        <Button onClick={signUp} type="button" color="primary">
          Log in
        </Button>
        <span onClick={signOut}>exit</span>
        <Button onClick={forgotPassword} type="button" color="primary">forgot password</Button>
      </form>
    </div>
  );
};
