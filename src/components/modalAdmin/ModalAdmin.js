import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Modal, Button } from "@material-ui/core";

import firebase from "firebase";
import moment from "moment";
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    width: "60%",
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    margin: "20px 0 0",
  },
  ulStyles: {
    overflow: "auto",
    maxHeight: 300,
  },
}));

export const ModalAdmin = ({ isOpen, setIsOpen, selected }) => {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [day, setDay] = useState(
    // new Date()
    //   .toLocaleString("eng", {
    //     weekday: "long",
    //   })
    //   .toLowerCase()
    "monday"
  );
  const handleClose = (answer) => {
    sendMenu();
    handleDel();
    firebase.database().ref(`/block`).update({ i: true });
    setIsOpen(false);
  };

  const sendMenu = () => {
    let newTemplate = firebase.database().ref(`/menu/${day}`);
    newTemplate.update({
      activeFrom: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),
      activeTo: moment(new Date()).add(1, "day").format("DD-MM-YYYY 09:29:00"),
      selected,
    });
  };
  const handleDel = () => {
    firebase.database().ref(`/orders/alex/`).remove();
    firebase.database().ref(`/orders/grech/`).remove();
    firebase.database().ref(`/orders/petr/`).remove();
    firebase.database().ref(`/orders/cheh/`).remove();
    firebase
      .database()
      .ref(`/orders/sum/`)
      .remove()
      .then(() => {
        firebase.database().ref(`/orders/sum/`).push(0);
      });
  };
  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">Подвердить меню?</h2>
      <ul className={classes.ulStyles}>
        {!selected.length ? (
          <li>НИЧЕГО</li>
        ) : (
          selected?.map((item) => {
            return <li>{item.name}</li>;
          })
        )}
      </ul>
      <select
        style={{ fontSize: "16px" }}
        onChange={(e) => {
          setDay(e.target.value);
        }}
        name="select"
        defaultValue={day}
      >
        <option value="monday">Понедельник</option>
        <option value="tuesday">Вторник</option>
        <option value="wednesday">Среда</option>
        <option value="thursday">Четверг</option>
        <option value="friday">Пятница</option>
      </select>
      <footer className={classes.footer}>
        <Button
          onClick={() => handleClose("DA")}
          variant="contained"
          color="primary"
        >
          Подтвердить
        </Button>
      </footer>
    </div>
  );

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
};
