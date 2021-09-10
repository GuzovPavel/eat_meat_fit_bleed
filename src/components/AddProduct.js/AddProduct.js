import React from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";

const AddProduct = ({
  name,
  setName,
  gr,
  setGr,
  cal,
  setCal,
  price,
  setPrice,
  onClickAdd,
  open,
  setOpen,
}) => {
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPrice("");
    setName("");
    setGr("");
    setCal("");
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        +
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Добавить новую позицию меню
        </DialogTitle>
        <DialogContent>
          <span>Название продукта</span>
          <TextField
            margin="dense"
            id="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            fullWidth
          />
          <span>Грамм</span>
          <TextField
            margin="dense"
            id="name"
            value={gr}
            onChange={(e) => {
              setGr(e.target.value);
            }}
            type="text"
            fullWidth
          />
          <span>Ккал</span>
          <TextField
            margin="dense"
            id="name"
            value={cal}
            onChange={(e) => {
              setCal(e.target.value);
            }}
            type="text"
            fullWidth
          />
          <span>Цена руб.</span>
          <TextField
            margin="dense"
            id="name"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
            }}
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClickAdd} color="primary">
            Add
          </Button>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddProduct;
