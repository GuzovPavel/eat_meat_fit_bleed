import React from "react";
import firebase from "firebase";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { DialogContent, DialogContentText } from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CheckPayment({
  setPaid,
  paid,
  setIsPaid,
  checkPaid,
  ind,
  user,
}) {
  const testF = (checkPaid, ind) => {
    firebase
      .database()
      .ref(`/orders/history/${user.uid}/${ind}`)
      .update({ checkPaid: true });
  };
  const handleClose = () => {
    setPaid(false);
  };
  const getPaid = () => {
    setPaid(false);
    testF(checkPaid, ind);
    console.log(ind);
  };

  return (
    <div>
      <Dialog
        open={paid}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle
          style={{ textAlign: "center" }}
          id="alert-dialog-slide-title"
        >
          {"Оплатили заказ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            style={{ color: "black" }}
            id="alert-dialog-slide-description"
          >
            Нажимая 'да' вы подтверждаете, что оплатили заказ и понимаете, что у
            нас есть ваш адрес.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              marginBottom: "10px",
            }}
          >
            <Button
              style={{
                width: "35%",
                fontSize: "10px",
                backgroundColor: "#94C571",
                color: "white",
              }}
              onClick={() => {
                getPaid();
              }}
              color="primary"
            >
              ДА
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}
