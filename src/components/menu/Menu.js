import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Modal, Button } from "@material-ui/core";
import firebase from "firebase";
import CustomInput from "../customInput";
const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    transform: "translate(-50%, -50%)",
    top: "50%",
    left: "50%",
  },
}));

export const Menu = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [myCustomArray, setMyCustomArray] = useState([{}]);
  const handleClose = () => {
    setOpen(false);
  };
  const handleMenu = (i, e) => {
    const arr = [...myCustomArray];
    arr[i] = { name: e.target.value };
    setMyCustomArray(arr);
  };
  const sendMenu = () => {
    let newTemplate = firebase.database().ref(`/menu/tuesday`);
    newTemplate.update({
      myCustomArray,
    });
    window.location.reload();
  };
  const body = (
    <div className={classes.paper}>
      <form className="form">
        <CustomInput
          labelText="Первая позиция"
          value={menu.name}
          id="0"
          formControlProps={{
            fullWidth: true,
          }}
          handleChange={(e) => handleMenu(0, e)}
          type="text"
        />
        <CustomInput
          labelText="Вторая позиция"
          value={menu.name}
          id="1"
          formControlProps={{
            fullWidth: true,
          }}
          handleChange={(e) => handleMenu(1, e)}
          type="text"
        />
        <CustomInput
          labelText="Третья позиция"
          id="3"
          formControlProps={{
            fullWidth: true,
          }}
          handleChange={(e) => handleMenu(2, e)}
          type="text"
        />
        <CustomInput
          labelText="Четвертая позиция"
          id="4"
          formControlProps={{
            fullWidth: true,
          }}
          handleChange={(e) => handleMenu(3, e)}
          type="text"
        />
        <CustomInput
          labelText="Пятая позиция"
          id="5"
          formControlProps={{
            fullWidth: true,
          }}
          handleChange={(e) => handleMenu(4, e)}
          type="text"
        />
        <CustomInput
          labelText="Шестая позиция"
          id="6"
          formControlProps={{
            fullWidth: true,
          }}
          handleChange={(e) => handleMenu(5, e)}
          type="text"
        />
        <CustomInput
          labelText="Седьмая позиция"
          id="7"
          formControlProps={{
            fullWidth: true,
          }}
          handleChange={(e) => handleMenu(6, e)}
          type="text"
        />

        <Button onClick={() => sendMenu()}>START</Button>
      </form>
    </div>
  );

  return (
    <div>
      <button type="button">Open Modal</button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
};
