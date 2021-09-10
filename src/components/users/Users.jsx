import React, { useEffect, useState } from "react";
import { 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  makeStyles, 
  Table } from "@material-ui/core";
import firebase from "firebase";
import { useDispatch } from "react-redux";
import { setId } from "../../redux/actions/mainActions";
import { Link } from "react-router-dom";
import theme from "../../Theme";

const useStyles = makeStyles({
  align: {
    align: "center",
    fontSize: "16px",
    [theme.breakpoints.down('600')]: {
      fontSize: "9px",
      fontWeight: 600,
      padding: "6px 0px 6px 12px",
    }
  },
  dishName: {
    display: "flex",
    flexDirection: "column",
    margin: "10px 0",
    [theme.breakpoints.down("600")]: {
      width: "95%"
    }
  }
});
const Users = () => {
  const dispatch = useDispatch();

  const classes = useStyles();
  const [data1, setData] = useState();
  useEffect(() => {
    firebase
      .database()
      .ref(`users/`)
      .on("value", (snapshot) => {
        const data = snapshot.val();
        const history =
          data &&
          Object.keys(data).map((room) => {
            return data[room];
          });
        setData(history);
      });
  }, []);
  return (
    <div
      style={{
        marginTop: "120px",
        marginBottom: "120px",
        display: "flex",
        justifyContent: "center",
        width: "90%"
      }}
    >
      <TableContainer component={Paper}>
        <Table
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell className={classes.align}>Фамилия</TableCell>
              <TableCell className={classes.align}>Имя</TableCell>
              <TableCell className={classes.align}>Оффис</TableCell>
              <TableCell className={classes.align}>Почта</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data1 &&
              data1.map((row) => (
                <TableRow key={row.name}>
                  <TableCell className={classes.align} component="th" scope="row">
                    <Link
                      to="/user-history"
                      onClick={() => dispatch(setId(row.uid))}
                    >
                      <span>{row.name}</span>
                    </Link>
                  </TableCell>
                  <TableCell className={classes.align}>{row.lastName}</TableCell>
                  <TableCell className={classes.align}>
                    {(row.office === "alex" && "Александровская") ||
                      (row.office === "cheh" && "Чехова") ||
                      (row.office === "grech" && "Греческая") ||
                      (row.office === "petr" && "Петровская")}
                  </TableCell>
                  <TableCell className={classes.align}>{row.email}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Users;
