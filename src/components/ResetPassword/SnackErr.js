import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import { IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";


export default function SnackErr({ isErr, setIsErr }) {


  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsErr(false);
   
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "top",
        }}
        open={isErr}
        autoHideDuration={3000}
        onClose={handleClose}
        message="Пользователь с таким email не найден, введите email на который зарегестрирован аккаунт"
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
}
