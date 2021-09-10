import React from "react";
import firebase from "firebase";
import { useState, useEffect } from "react";
import moment from "moment";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  makeStyles,
  TextField,
  Switch,
  Checkbox,
} from "@material-ui/core/";
import theme from "../../Theme";
import CheckPayment from "../CheckPayment/CheckPayment";

const useStyles = makeStyles({
  align: {
    align: "right",
    [theme.breakpoints.down("600")]: {
      fontSize: "12px",
      fontWeight: 600,
      padding: "6px 2px 6px 12px",
    },
    [theme.breakpoints.down("350")]: {
      textAlign: "center",
      fontSize: "10px",
      fontWeight: 500,
      padding: "6px 0px 6px 0px",
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
const OrderHistory = ({ user, data, paid, setPaid }) => {
  const classes = useStyles();
  const [data1, setData1] = useState();
  const [total, setTotal] = useState();
  const [date, setDate] = useState(moment(new Date()).format("YYYY-MM-DD"));
  const [check, setCheck] = React.useState({
    checkedA: true,
  });
  const [isPaid, setIsPaid] = useState(false);
  const [newCheckPaid, setNewCheckPaid] = useState();
  const [newInd, setNewInd] = useState();
  const style1 = {
    fontSize: "23px",
    fontWeight: 600,
    margin: "15px 0",
  };

  const date2 = moment(new Date()).add(1, "day").format("YYYY-MM-DD");
  console.log(date, "date");
  console.log(date2, "date2");

  useEffect(() => {
    user &&
      firebase
        .database()
        .ref(`orders/history/${user.uid}/`)
        .on("value", (snapshot) => {
          const data = snapshot.val();
          const history =
            data &&
            Object.keys(data).map((room, index) => {
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
              (e) => e && (e.date === date || e.date === date2)
            ).length
              ? setTotal(0)
              : history?.filter(
                  (e) => e && (e.date === date || e.date === date2)
                ).length === 1
              ? history?.filter((e) => e.date === date || e.date === date2)[0]
                  .selectedPrice
              : history
                  ?.filter((e) => e && (e.date === date || e.date === date2))
                  .reduce((prev, curr) => {
                    return prev + curr.selectedPrice;
                  }, 0);
            setTotal(reducer);
           
          }
        });

    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, date, check]);
  const handleChange = (event) => {
    setCheck({ ...check, [event.target.name]: event.target.checked });
  };
  const handleDelete = (ind, idOrder) => {
    firebase.database().ref(`/orders/${data.office}/${idOrder}`).remove();
    firebase.database().ref(`/orders/history/${user.uid}/${ind}`).remove();
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
            className={classes.align}
            id="date"
            type="date"
            defaultValue={moment(new Date()).format("YYYY-MM-DD")}
            onChange={(e) => setDate(e.target.value.replace(/-/g, "-"))}
            InputLabelProps={{
              shrink: true,
            }}
          />
        )}
        {check.checkedA ? (
          <span style={style1}>История по дате</span>
        ) : (
          <span style={style1}>Вся история</span>
        )}
      </div>
      <TableContainer component={Paper} style={{ height: "1300px" }}>
        <Table
          className={classes.align}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              {check.checkedA ? (
                <>
                  <TableCell className={classes.align}>Номер заказа</TableCell>
                  <TableCell className={classes.align}>Products</TableCell>
                  <TableCell className={classes.align}>Руб.</TableCell>
                  <TableCell className={classes.align}>
                    Отмена заказа.
                  </TableCell>
                  <TableCell className={classes.align}>Оплата</TableCell>
                </>
              ) : (
                <>
                  <TableCell className={classes.align}>Номер заказа</TableCell>
                  <TableCell className={classes.align}>Products</TableCell>
                  <TableCell className={classes.align}>Руб.</TableCell>
                  <TableCell className={classes.align}>Оплата</TableCell>
                </>
              )}
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
                    .map((e, i) => (
                      <TableRow key={e.name + i}>
                        <TableCell className={classes.align}>
                          {e.id}
                          <p>{e.date}</p>
                        </TableCell>
                        <TableCell className={classes.align}>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                            }}
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
                        <TableCell className={classes.align}>
                          {e.ind && e.id && (
                            <DeleteForeverIcon
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                e.ind && e.id && handleDelete(e.ind, e.idOrder)
                              }
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {e.checkPaid ? (
                            <Checkbox disabled checked />
                          ) : (
                            <Checkbox
                              checked={e.checkPaid}
                              onClick={() => {
                                setNewInd(e.ind);
                                setNewCheckPaid(e.checkPaid);
                                setPaid(true);
                              }}
                            />
                          )}

                          <CheckPayment
                            paid={paid}
                            setPaid={setPaid}
                            isPaid={isPaid}
                            setIsPaid={setIsPaid}
                            checkPaid={newCheckPaid}
                            ind={newInd}
                            user={user}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
              </>
            ) : (
              <>
                {data1 &&
                  data1.map((e, i) => (
                    <TableRow key={i + e.name}>
                      <TableCell className={classes.align}>
                        {e.id} <p>{e.date}</p>
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
                                width: "150px",
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
                      <TableCell>
                        {e.checkPaid ? (
                          <Checkbox disabled checked />
                        ) : (
                          <Checkbox
                            checked={e.checkPaid}
                            onClick={() => {
                              setNewInd(e.ind);
                              setNewCheckPaid(e.checkPaid);
                              setPaid(true);
                            }}
                          />
                        )}
                        <CheckPayment
                          paid={paid}
                          setPaid={setPaid}
                          isPaid={isPaid}
                          setIsPaid={setIsPaid}
                          checkPaid={newCheckPaid}
                          ind={newInd}
                          user={user}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div></div>
    </div>
  );
};
export default OrderHistory;
