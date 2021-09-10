import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import { IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useHistory } from "react-router-dom";

export default function SnackbarPass({ isBar, setIsBar }) {
    const history = useHistory();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    history.push("/");
    setIsBar(false);
   
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "top",
        }}
        open={isBar}
        autoHideDuration={3000}
        onClose={handleClose}
        message="Ссылка на сброс пароля отправлена на указанный вами адрес, не благодарите"
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
