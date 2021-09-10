import React from "react";
import firebase from "firebase";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Switch,
} from "@material-ui/core";
import theme from "../../Theme";

const useStyles = makeStyles({
  align: {
    align: "right",
    [theme.breakpoints.down("600")]: {
      fontSize: "12px",
      fontWeight: 600,
      padding: "6px 2px 6px 12px",
    },
  },
  dishName: {
    display: "flex",
    flexDirection: "column",
    marginTop: "60px",
    marginBottom: "10%",
    [theme.breakpoints.down("600")]: {
      width: "95%",
    },
  },
});

const OrderHistoryUser = () => {
  const classes = useStyles();
  const [data1, setData1] = useState();
  const [total, setTotal] = useState();
  const [date, setDate] = useState(moment(new Date()).format("YYYY-MM-DD"));
  const [check, setCheck] = React.useState({
    checkedA: true,
  });
  const id = useSelector((state) => state.main.id);
  const style = {
    fontSize: "23px",
    fontWeight: 600,
    margin: "15px 0",
  };
  console.log("date", date);

  const date2 = moment(new Date()).add(1, "day").format("YYYY-MM-DD");

  useEffect(() => {
    firebase
      .database()
      .ref(`orders/history/${id}`)
      .on("value", (snapshot) => {
        const data = snapshot.val();
        const history =
          data &&
          Object.keys(data).map((room) => {
            return data[room];
          });

        setData1(history);

        if (!check.checkedA) {
          const reducer2 =
            data1 &&
            data1.reduce((prev, curr) => {
              return prev + curr.selectedPrice;
            }, 0);
          setTotal(reducer2);
          setDate(moment(new Date()).format("YYYY-MM-DD"))
        } else {
          const reducer = !history?.filter(
            (e) => e.date === date || e.date === date2
          ).length
            ? setTotal(0)
            : history?.filter((e) => e.date === date || e.date === date2)
                .length === 1
            ? history?.filter((e) => e.date === date || e.date === date2)[0]
                .selectedPrice
            : history
                ?.filter((e) => e.date === date || e.date === date2)
                .reduce((prev, curr) => {
                  return prev + curr.selectedPrice;
                }, 0);
          setTotal(reducer);
        }
      });
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, check, id]);

  const handleChange = (event) => {
    setCheck({ ...check, [event.target.name]: event.target.checked });
  };
  return (
    <div className={classes.dishName}>
      <h2>Total:{total} руб</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Switch
          checked={check.checkedA}
          onChange={handleChange}
          name="checkedA"
          inputProps={{ "aria-label": "secondary checkbox" }}
        />

        {check.checkedA && (
          <TextField
            id="date"
            label="Дата"
            type="date"
            defaultValue={moment(new Date()).format("YYYY-MM-DD")}
            onChange={(e) => setDate(e.target.value.replace(/-/g, "-"))}
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
          />
        )}
        {check.checkedA ? (
          <span style={style}>История по дате</span>
        ) : (
          <span style={style}>Вся история</span>
        )}
      </div>

      <TableContainer component={Paper}>
        <Table
          className={classes.table}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell className={classes.align}>Номер заказа</TableCell>
              <TableCell className={classes.align}>Time</TableCell>
              <TableCell className={classes.align}>Products</TableCell>
              <TableCell className={classes.align}>Руб.</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {check.checkedA ? (
              <>
                {data1 &&
                  data1
                    .filter(
                      (e) =>
                        date ===
                          moment(e.date)
                            .subtract(1, "day")
                            .format("YYYY-MM-DD") ||
                        date === moment(e.date).format("YYYY-MM-DD")
                    )
                    .map((e) => (
                      <TableRow key={e.name}>
                        <TableCell className={classes.align}>
                          {e.id}
                          <p>{e.date}</p>
                        </TableCell>
                        <TableCell className={classes.align}>
                          {e.time}
                        </TableCell>
                        <TableCell className={classes.align}>
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            {e.selected.map((item, index) => (
                              <span
                                style={{
                                  fontSize: "12px",
                                  overflow: "scroll",
                                  width: "120px",
                                }}
                                key={`selected-${index}`}
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className={classes.align}>
                          {e.selectedPrice}
                        </TableCell>
                      </TableRow>
                    ))}
              </>
            ) : (
              <>
                {data1 &&
                  data1.map((e) => (
                    <TableRow key={e.name}>
                      <TableCell className={classes.align}>
                        {e.id}
                        <p>{e.date}</p>
                      </TableCell>
                      <TableCell className={classes.align}>{e.time}</TableCell>
                      <TableCell className={classes.align}>
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          {e.selected.map((item, index) => (
                            <span
                              style={{
                                fontSize: "12px",
                                overflow: "scroll",
                                width: "120px",
                              }}
                              key={`selected-${index}`}
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className={classes.align}>
                        {e.selectedPrice}
                      </TableCell>
                    </TableRow>
                  ))}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default OrderHistoryUser;
