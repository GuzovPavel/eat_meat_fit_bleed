import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  Checkbox,
  Paper,
  TableSortLabel,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Button,
} from "@material-ui/core";
import ModalAdmin from "../modalAdmin";
import firebase from "firebase";
import { storage } from "../../firebase";
import AddProduct from "../AddProduct.js/AddProduct";
import DeleteIcon from "@material-ui/icons/Delete";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Блюдо",
  },
  { id: "gr", numeric: true, disablePadding: false, label: "Грамм" },

  { id: "cal", numeric: true, disablePadding: false, label: "ккал" },
  { id: "img", numeric: false, disablePadding: false, label: "Фото" },

  { id: "price", numeric: true, disablePadding: false, label: "Цена(р)" },
  { numeric: true, label: "Удаление" },
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell className={classes.align} padding="checkbox">
          <Checkbox
            className={classes.align}
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCells.map((headCell, i) => (
          <TableCell className={classes.align} key={headCell.id}>
            <TableSortLabel
              className={classes.align}
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  align: {
    align: "right",
    [theme.breakpoints.down("600")]: {
      fontSize: "8px",
      fontWeight: 600,
      padding: "6px 2px 6px 12px",
    },
  },
  dishName: {
    marginTop: "8%",
    width: "98%",
    height: "85vh",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down("700")]: {
      width: "95%",
      marginTop: "10%",
    },
    [theme.breakpoints.down("600")]: {
      width: "95%",
      marginTop: "20%",
    },
  },
  tableBlock: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "scroll",
  },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "5px",
    marginBottom: "4%",
    [theme.breakpoints.down("600")]: {
      marginBottom: "9%",
    },
  },
}));

export const AdminMenu = ({ user, data }) => {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("price");
  const [selected, setSelected] = React.useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const [menu, setMenu] = useState();
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState();
  const [name, setName] = useState();
  const [cal, setCal] = useState();
  const [gr, setGr] = useState();
  const [change, setChange] = useState();
  const [changeC, setChangeC] = useState();
  const [changeP, setChangeP] = useState();
  const [changeG, setChangeG] = useState();
  const [imageAsFile, setImageAsFile] = useState("");

  useEffect(() => {
    firebase
      .database()
      .ref(`allmenu/`)
      .on("value", (snapshot) => {
        const data = snapshot.val();
        let arr =
          data &&
          Object.keys(data).map((room) => {
            return data[room];
          });
        setMenu(arr);
      });
  }, []);
  let arr2 = menu ? menu : [{ name: "1", price: "1" }];

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = arr2.map((n) => ({
        name: n.name ? n.name : "1",
        price: n.price ? n.price : 0,
        cal: n.cal ? n.cal : 0,
        img: n.img
          ? n.img
          : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAKlBMVEXg4OD////j4+Pd3d36+vri4uLw8PDs7Oz29vb09PTa2tr5+fnm5ubx8fF4aKZkAAABUUlEQVR4nO3Z246CMBRAUWjBgQ78/+8OeMVR4E0TzlovJpUY3DnBglUFAAAAAAAAAAAAAAAAAAAAAAAAAMAh5DZtq/K3T/HTclfv6YNFyf1ukro+ffssPyvX9bg9BtMg/cYalKnJz06TU93EazK/tENa+eJRm+Rxump0K0cEbXI6X0q7t189aJN8/X1p3x4Ru8nwWO7uQxO0Sbk2eax2j51a0CbVcNma3UejW2xfozbJqZley22tW+7pozapcinleUruUcI2Wa4sbgrnKLGbpPPC033yFCV0k2ben/x/dNDnwE1yM2/aXp+mlMBN5iR18/qAKW6T85S8FbfJapKwTdanJHCT9SSaaDLT5NWlSWrXpMh7tpW3g97v9CkN61LqwjUZN64lNzv/AB1O2f+/eCz7H3MspeRtJVwSAAAAAAAAAAAAAAAAAAAAAAAAAICj+gOmbQmv8zyqjAAAAABJRU5ErkJggg==",
        gr: n.gr ? n.gr : 0,
      }));
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const onClickAdd = () => {
    name &&
      price &&
      firebase
        .database()
        .ref(`/allmenu`)
        .push({
          name: name,
          price: parseInt(price),
          gr: parseInt(gr),
          cal: parseInt(cal),
          edit: false,
        })
        .then((data) => {
          setGr("");
          setCal("");
          setPrice("");
          setName("");

          let key = data.key;
          firebase.database().ref(`/allmenu/${key}`).update({
            id: key,
          });
        });
    setOpen(false);
  };

  const params = {
    name: name,
    setName: setName,
    gr: gr,
    setGr: setGr,
    cal: cal,
    setCal: setCal,
    price: price,
    setPrice: setPrice,
    onClickAdd: onClickAdd,
    open: open,
    setOpen: setOpen,
  };

  const handleClick = (event, name, price, cal, img, gr) => {
    const selectedIndex = selected.findIndex((e) => e.name === name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(...selected, {
        name: name ? name : "1",
        price: price ? price : 0,
        img: img
          ? img
          : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAKlBMVEXg4OD////j4+Pd3d36+vri4uLw8PDs7Oz29vb09PTa2tr5+fnm5ubx8fF4aKZkAAABUUlEQVR4nO3Z246CMBRAUWjBgQ78/+8OeMVR4E0TzlovJpUY3DnBglUFAAAAAAAAAAAAAAAAAAAAAAAAAMAh5DZtq/K3T/HTclfv6YNFyf1ukro+ffssPyvX9bg9BtMg/cYalKnJz06TU93EazK/tENa+eJRm+Rxump0K0cEbXI6X0q7t189aJN8/X1p3x4Ru8nwWO7uQxO0Sbk2eax2j51a0CbVcNma3UejW2xfozbJqZley22tW+7pozapcinleUruUcI2Wa4sbgrnKLGbpPPC033yFCV0k2ben/x/dNDnwE1yM2/aXp+mlMBN5iR18/qAKW6T85S8FbfJapKwTdanJHCT9SSaaDLT5NWlSWrXpMh7tpW3g97v9CkN61LqwjUZN64lNzv/AB1O2f+/eCz7H3MspeRtJVwSAAAAAAAAAAAAAAAAAAAAAAAAAICj+gOmbQmv8zyqjAAAAABJRU5ErkJggg==",
        gr: gr ? gr : 0,
        cal: cal ? cal : 0,
      });
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };
  const isSelected = (name) =>
    selected.findIndex((e) => e.name === name) !== -1;
  const handleImageAsFile = (e) => {
    const image = e.target.files[0];
    setImageAsFile((imageFile) => image);
  };
  const handleFireBaseUpload = (e, id) => {
    e.preventDefault();
    if (imageAsFile) {
      const uploadTask = storage
        .ref(`/images/${imageAsFile.name}`)
        .put(imageAsFile);
      uploadTask.on(
        "state_changed",
        (snapShot) => {},
        (err) => {
          console.log(err);
        },
        () => {
          storage
            .ref("images")
            .child(imageAsFile.name)
            .getDownloadURL()
            .then((fireBaseUrl) => {
              firebase.database().ref(`/allmenu/${id}`).update({
                img: fireBaseUrl,
              });
            });
        }
      );
    }
  };

  return (
    <div className={classes.dishName}>
      <Paper className={classes.tableBlock}>
        <TableContainer style={{ height: "93%" }}>
          <Table>
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={arr2.length}
            />
            <TableBody>
              {stableSort(arr2, getComparator(order, orderBy)).map(
                (row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      <TableCell className={classes.align} padding="checkbox">
                        <Checkbox
                          onClick={(event) =>
                            handleClick(
                              event,
                              row.name,
                              row.price,
                              row.cal,
                              row.img,
                              row.gr
                            )
                          }
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                      <TableCell className={classes.align}>
                        {!row.editName && row.name}
                        <span
                          style={{ color: "green", cursor: "pointer" }}
                          onClick={() => {
                            firebase
                              .database()
                              .ref(`/allmenu/${row.id}`)
                              .update({
                                editName: true,
                              });
                            setChange(row.name);
                          }}
                        >
                          {!row.editName && " edit"}
                        </span>
                        {row.editName && (
                          <>
                            <input
                              value={change}
                              onChange={(e) => setChange(e.target.value)}
                            ></input>
                            <span
                              style={{
                                color: "green",
                                marginLeft: "5px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                change &&
                                  firebase
                                    .database()
                                    .ref(`/allmenu/${row.id}`)
                                    .update({
                                      name: change,
                                      editName: false,
                                    });
                                setChange("");
                              }}
                            >
                              ok
                            </span>
                            <span
                              style={{
                                color: "red",
                                marginLeft: "5px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                firebase
                                  .database()
                                  .ref(`/allmenu/${row.id}`)
                                  .update({
                                    editName: false,
                                  });
                                setChange("");
                              }}
                            >
                              cancel
                            </span>
                          </>
                        )}
                      </TableCell>
                      <TableCell className={classes.align}>
                        {!row.editGr && row.gr}
                        <span
                          style={{ color: "green", cursor: "pointer" }}
                          onClick={() => {
                            firebase
                              .database()
                              .ref(`/allmenu/${row.id}`)
                              .update({
                                editGr: true,
                              });
                            setChangeG(row.gr);
                          }}
                        >
                          {!row.editGr && " edit"}
                        </span>
                        {row.editGr && (
                          <>
                            <input
                              value={changeG}
                              onChange={(e) => setChangeG(e.target.value)}
                            ></input>
                            <span
                              style={{
                                color: "green",
                                marginLeft: "5px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                changeG &&
                                  firebase
                                    .database()
                                    .ref(`/allmenu/${row.id}`)
                                    .update({
                                      gr: parseInt(changeG),
                                      editGr: false,
                                    });
                                setChangeG("");
                              }}
                            >
                              ok
                            </span>
                            <span
                              style={{
                                color: "red",
                                marginLeft: "5px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                firebase
                                  .database()
                                  .ref(`/allmenu/${row.id}`)
                                  .update({
                                    editGr: false,
                                  });
                                setChangeG("");
                              }}
                            >
                              cancel
                            </span>
                          </>
                        )}
                      </TableCell>

                      <TableCell className={classes.align}>
                        {!row.editCal && row.cal}
                        <span
                          style={{ color: "green", cursor: "pointer" }}
                          onClick={() => {
                            firebase
                              .database()
                              .ref(`/allmenu/${row.id}`)
                              .update({
                                editCal: true,
                              });
                            setChangeC(row.cal);
                          }}
                        >
                          {!row.editCal && " edit"}
                        </span>
                        {row.editCal && (
                          <>
                            <input
                              value={changeC}
                              onChange={(e) => setChangeC(e.target.value)}
                            ></input>
                            <span
                              style={{
                                color: "green",
                                marginLeft: "5px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                changeC &&
                                  firebase
                                    .database()
                                    .ref(`/allmenu/${row.id}`)
                                    .update({
                                      cal: parseInt(changeC),
                                      editCal: false,
                                    });
                                setChangeC("");
                              }}
                            >
                              ok
                            </span>
                            <span
                              style={{
                                color: "red",
                                marginLeft: "5px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                firebase
                                  .database()
                                  .ref(`/allmenu/${row.id}`)
                                  .update({
                                    editCal: false,
                                  });
                                setChangeC("");
                              }}
                            >
                              cancel
                            </span>
                          </>
                        )}
                      </TableCell>

                      <TableCell className={classes.align}>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <img
                            style={{ width: 50 }}
                            src={row.img}
                            alt={row.img}
                          ></img>
                          <form
                            style={{ display: "flex", flexDirection: "column" }}
                            onSubmit={(e) => handleFireBaseUpload(e, row.id)}
                          >
                            <input type="file" onChange={handleImageAsFile} />
                            <button style={{ width: "100px" }}>
                              upload to firebase
                            </button>
                          </form>
                        </div>
                      </TableCell>
                      <TableCell className={classes.align}>
                        <div>
                          {!row.editPrice && row.price}
                          <span
                            style={{ color: "green", cursor: "pointer" }}
                            onClick={() => {
                              firebase
                                .database()
                                .ref(`/allmenu/${row.id}`)
                                .update({
                                  editPrice: true,
                                });
                              setChangeP(row.price);
                            }}
                          >
                            {!row.editPrice && " edit"}
                          </span>
                          {row.editPrice && (
                            <>
                              <input
                                value={changeP}
                                onChange={(e) =>
                                  setChangeP(parseInt(e.target.value))
                                }
                              ></input>
                              <span
                                style={{
                                  color: "green",
                                  marginLeft: "5px",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  changeP &&
                                    firebase
                                      .database()
                                      .ref(`/allmenu/${row.id}`)
                                      .update({
                                        price: changeP,
                                        editPrice: false,
                                      });
                                  setChangeP("");
                                }}
                              >
                                ok
                              </span>
                              <span
                                style={{
                                  color: "red",
                                  marginLeft: "5px",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  firebase
                                    .database()
                                    .ref(`/allmenu/${row.id}`)
                                    .update({
                                      editPrice: false,
                                    });
                                  setChange("");
                                }}
                              >
                                cancel
                              </span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className={classes.align}>
                        <DeleteIcon
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            let key = row.id;
                            firebase.database().ref(`/allmenu/${key}`).remove();
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <AddProduct {...params} />
      </Paper>
      <div className={classes.button}>
        <Button
          style={{ width: "fit-content", textAlign: "center" }}
          onClick={() => {
            setIsOpen(true);
          }}
          variant="contained"
          color="primary"
        >
          Опубликовать
        </Button>
      </div>
      <ModalAdmin
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        selected={selected}
        user={user}
        data={data}
      />
    </div>
  );
};
