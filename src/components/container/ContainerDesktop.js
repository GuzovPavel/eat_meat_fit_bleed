import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import {
  Table,
  Checkbox,
  Paper,
  Typography,
  Toolbar,
  TableSortLabel,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Button,
} from "@material-ui/core";
import Clock from "react-live-clock";
import Modal from "../modal";
import firebase from "firebase";
import Loader from "../Loader/Loader";
import moment from "moment";

function createData(name, price) {
  return { name, price };
}

const rows = [createData("loading", 0)];

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

  { id: "price", numeric: true, disablePadding: false, label: "Цена(р)" },
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
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell className={classes.align} key={headCell.id}>
            <TableSortLabel
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

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const [day, setDay] = useState("");
  const { numSelected, block } = props;
  const hour = moment(new Date()).format("DD-MM-YYYY HH:mm:ss");

  useEffect(() => {
    firebase
      .database()
      .ref(`day/i`)
      .on("value", (snapshot) => {
        const data1 = snapshot.val();
        setDay(data1);
      });
    firebase
      .database()
      .ref(`/menu`)
      .on("value", (snapshot) => {
        const day = snapshot.val();
        const dayToday = Object.keys(day).map((el) => day[el]);
        const arrayDay = [];
        Object.keys(dayToday).map((elem) => {
          if (
            hour < dayToday[elem].activeTo &&
            hour > dayToday[elem].activeFrom
          ) {
            arrayDay.push(dayToday[elem]);
          }
          return dayToday[elem];
        });
        if (arrayDay.length) {
          let newTemplate = firebase.database().ref(`/block`);
          newTemplate.update({ i: true });
        } else {
          let newTemplate = firebase.database().ref(`/block`);
          newTemplate.update({ i: false });
        }
      });
  }, [hour]);

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          style={{ display: "flex", flexFlow: "column" }}
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          <span className="today-menu">
            Меню на:
            {(day === "monday" && " понедельник") ||
              (day === "tuesday" && " вторник") ||
              (day === "wednesday" && " среду") ||
              (day === "thursday" && " четверг") ||
              (day === "friday" && " пятницу")}
          </span>
          {!block ? (
            <span className="time-is-over">
              Время вышло, попробуйте завтра до 9-30 утра
            </span>
          ) : (
            <Clock
              format={"HH:mm:ss"}
              ticking={false}
              timezone={"Europe/Moscow"}
            />
          )}
        </Typography>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "98%",
    margin: "0px auto",
    maxWidth: "1024px",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    marginTop: "15%",
  },
  paper: {
    width: "100%",
    borderRadius: "10px",
    marginBottom: theme.spacing(2),
  },
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
      padding: "2px 2px 4px 12px",
    },
  },

  a: {
    [theme.breakpoints.down("sm")]: {
      textAlign: "center",
      fontSize: "8px",
      fontWeight: 600,
    },
  },
  dishName: {
    display: "flex",
    flexDirection: "column",
    margin: "5px 0",
  },
  img: {
    marginTop: "20px",
    width: "50%",
    height: "50%",
  },
}));

export const ContainerDesktop = ({
  user,
  data,
  isData,
  isOpen,
  setIsOpen,
  open,
}) => {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("price");
  const [selected, setSelected] = useState([]);
  const [priceArr, setPriceArr] = useState([]);
  const [counter, setCounter] = useState();
  const [block, isBlock] = useState();

  const [day, setDay] = useState();

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const [data1, setData] = useState();
  let arr2 = data1 ? data1.selected : rows;
  const handleDay = (i) => {
    let newTemplate = firebase.database().ref(`/day`);
    newTemplate.update({ i });
  };
  useEffect(() => {
    firebase
      .database()
      .ref(`day/i`)
      .on("value", (snapshot) => {
        const data1 = snapshot.val();
        setDay(data1);
        firebase
          .database()
          .ref(`menu/`)
          .on("value", (snapshot) => {
            const data = snapshot.val();
            setData(data[data1]);
          });
        firebase
          .database()
          .ref(`block/`)
          .on("value", (snapshot) => {
            const data = snapshot.val();
            isBlock(data.i);
          });
        firebase
          .database()
          .ref(`counter/`)
          .on("value", (snapshot) => {
            const data = snapshot.val();
            setCounter(data.i);
          });
      });
  }, [day]);
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = arr2.map((n) => n.name);
      const newSelectedsPrice = arr2.map((n) => n.price);
      setSelected(newSelecteds);
      setPriceArr(newSelectedsPrice);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name, price) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    let selectedPrice = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
      selectedPrice = selectedPrice.concat(priceArr, price);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
      selectedPrice = selectedPrice.concat(priceArr.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
      selectedPrice = selectedPrice.concat(priceArr.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
      selectedPrice = selectedPrice.concat(
        priceArr.slice(0, selectedIndex),

        priceArr.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);

    setPriceArr(selectedPrice);
  };
  const isSelected = (name) => selected.indexOf(name) !== -1;

  return (
    <div className={classes.root}>
      <p style={{ position: "absolute", top: "50px" }}>version: 1.02</p>
      {isData ? (
        <>
          {" "}
          {data && data.admin === true && (
            <div>
              <h2 className="main-menu">Меню</h2>
              <select
                className="today-day"
                onChange={(e) => {
                  setDay(e.target.value);
                  handleDay(e.target.value);
                }}
                name="select"
                value={day}
              >
                <option value="monday">Понедельник</option>
                <option value="tuesday">Вторник</option>
                <option value="wednesday">Среда</option>
                <option value="thursday">Четверг</option>
                <option value="friday">Пятница</option>
              </select>
            </div>
          )}
          <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            selected={selected}
            selectedPrice={priceArr}
            setSelected={setSelected}
            setPriceArr={setPriceArr}
            user={user}
            data={data}
            counter={counter}
          />
          <Paper className={classes.paper}>
            <EnhancedTableToolbar numSelected={selected.length} block={block} />
            <TableContainer>
              <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                size="small"
                aria-label="enhanced table"
              >
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
                          className="choise"
                          hover
                          onClick={(event) =>
                            handleClick(event, row.name, row.price)
                          }
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.name}
                          selected={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              inputProps={{ "aria-labelledby": labelId }}
                            />
                          </TableCell>
                          <TableCell
                            className={classes.align}
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                          >
                            <div className={classes.dishName}>{row.name}</div>
                          </TableCell>
                          <TableCell className={classes.align}>
                            {row.gr}
                          </TableCell>
                          <TableCell className={classes.align}>
                            {row.cal}
                          </TableCell>

                          <TableCell className={classes.align}>
                            {row.price}
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          {block ? (
            <Button
              style={
                isOpen || open
                  ? {
                      backgroundColor: "#CA748B",
                      marginBottom: "50px",
                    }
                  : {
                      backgroundColor: "#94C571",
                      marginBottom: "50px",
                    }
              }
              onClick={() => {
                block && setIsOpen(true);
              }}
              variant="contained"
              color="primary"
            >
              Заказать
            </Button>
          ) : (
            <Button variant="contained" disabled>
              Заказать
            </Button>
          )}
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};
