import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { auth } from "../../firebase";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({ setOpen, open }) {
  const signOut = () => {
    auth
      .signOut()
      .then(function (res) {
        localStorage.clear();
      })
      .catch(function (error) {});
    window.location.href = "/";
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
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
          {"Вы действительно собираетесь выйти?"}
        </DialogTitle>
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
              onClick={handleClose}
              color="primary"
            >
              Отменить
            </Button>
            <Button
              style={{
                width: "35%",
                fontSize: "10px",
                backgroundColor: "#94C571",
                color: "white",
              }}
              onClick={() => {
                signOut();
              }}
              color="primary"
            >
              Выйти
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}
