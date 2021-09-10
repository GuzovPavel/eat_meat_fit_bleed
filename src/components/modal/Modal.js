import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Modal, Button } from "@material-ui/core";
import firebase from "firebase";
import moment from "moment";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import SwitchBox from "../SwitchBox/SwitchBox";
import Bread from "../../Bread/Bread";

function getModalStyle() {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    border: "none",
    width: "250px",
  };
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: "75%",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    alignItems: "center",
    margin: "20px 0 0",
  },
  ulStyles: {
    paddingLeft: 0,
    overflow: "auto",
    maxHeight: 300,
  },
  choiseFood: {
    marginTop: "1%",
    display: "flex",
    justifyContent: "space-between",
    padding: "5px",
    borderRadius: "5px",
  },
  switchButton: {
    display: "flex",
    justifycontent: "space-around",
    flexDirection: "row",
    width: "100%",
  },
  snackBar: {
    display: "flex",
    alignItems: "flex-start",
    top: "45px",
    bottom: 0,
  },
}));

export const SimpleModal = ({
  isOpen,
  setIsOpen,
  selected,
  selectedPrice,
  setSelected,
  setPriceArr,
  user,
  data,
  counter,
}) => {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [preOrder, setPreOrder] = useState();
  const [preSum, setPreSum] = useState();
  const [turn, isTurn] = useState(true);
  const [open, setOpen] = useState(false);
  const [cutleryCheck, setCutleryCheck] = useState(false);
  const [cutlery, setCutlery] = useState("");
  const [breadCheck, setBreadCheck] = useState(false);
  const [bread, setBread] = useState("");
  const [checkForm, setCheckForm] = useState(true);
  const [startHour, setStartHour] =  useState();
  const hour = moment(new Date()).format("DD-MM-YYYY HH:mm:ss");

  const handleClose = (answer) => {
    setIsOpen(false);
  };

  useEffect(() => {
    firebase.database().ref(`/menu`).on("value", (snapshot) => {
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
      setStartHour(arrayDay[0].activeFrom)
    })
  }, [hour])

  const save = (e) => {
    e.preventDefault();
    isTurn(true);
    const form = new FormData(e.target);
    const order = [];
    const sum = [];
    for (let item in selected) {
      const a = form.get(selected[item]);
      for (let i = 0; i < a; i++) {
        order.push(`${selected[item]} ${cutlery} ${bread}`);
        sum.push(selectedPrice[item]);
      }
      setPreOrder(order);
      setPreSum(sum);
      setCheckForm(false);
    }
  };

  const test = (key) => {
    var date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    if (moment(date).format("HH:mm:ss") > startHour &&  moment(date).format("HH:mm:ss") < "23:59:59") {
      firebase
      .database()
      .ref(`/orders/history/${user.uid}`)
      .push({
        id: counter,
        idOrder: key,
        name: data.name,
        checkPaid: false,
        office: data.office,
        date: moment(date).add(1, "day").format("YYYY-MM-DD"),
        time: new Date().toLocaleTimeString(),
        selected: preOrder,
        selectedPrice: preSum.reduce((partial_sum, a) => partial_sum + a, 0),
      })
      .then((data) => {
        let key = data.key;
        firebase
          .database()
          .ref(`counter/`)
          .update({ i: ++counter });
        firebase.database().ref(`orders/history/${user.uid}/${key}`).update({
          ind: key,
        });
      });
    } else {
      firebase
      .database()
      .ref(`/orders/history/${user.uid}`)
      .push({
        id: counter,
        idOrder: key,
        name: data.name,
        checkPaid: false,
        office: data.office,
        date: moment(date).format("YYYY-MM-DD"),
        time: new Date().toLocaleTimeString(),
        selected: preOrder,
        selectedPrice: preSum.reduce((partial_sum, a) => partial_sum + a, 0),
      })
      .then((data) => {
        let key = data.key;
        firebase
          .database()
          .ref(`counter/`)
          .update({ i: ++counter });
        firebase.database().ref(`orders/history/${user.uid}/${key}`).update({
          ind: key,
        });
      });
    }
   
  };
  const go = async () => {
    let newTemplate = firebase.database().ref(`/orders/${data.office}`);
    await newTemplate
      .push(
        preOrder.map((item, index) => {
          return { name: item, id: counter };
        })
      )
      .then((data) => {
        let key = data.key;

        test(key);
      });

    firebase
      .database()
      .ref(`/orders/sum`)
      .push(preSum.reduce((partial_sum, a) => partial_sum + a, 0))
      .then((res) => {
        setIsOpen(false);
      });
    setOpen(true);
    setPriceArr([]);
    setSelected([]);
    setCheckForm(true);
  };

  const handleClose1 = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const body = (
    <form onSubmit={(e) => save(e)}>
      <div style={modalStyle} className={classes.paper}>
        <h2 id="simple-modal-title">Оформить заказ?</h2>
        <ul className={classes.ulStyles}>
          {!selected.length ? (
            <li>НИЧЕГО</li>
          ) : (
            selected?.map((item, index) => (
              <li className={classes.choiseFood} key={`selected-${index}`}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                  {item}
                </span>

                <select
                  onChange={() => setCheckForm(true)}
                  name={item}
                  style={{
                    select: "focus",
                    textarea: "focus",
                    input: "focus",
                    fontSize: "16px",
                    height: "10%",
                  }}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                </select>
              </li>
            ))
          )}
        </ul>
        <div className={classes.switchButton}>
          <SwitchBox
            cutleryCheck={cutleryCheck}
            setCutleryCheck={setCutleryCheck}
            setCutlery={setCutlery}
            setCheckForm={setCheckForm}
          />
          <Bread
            breadCheck={breadCheck}
            setBreadCheck={setBreadCheck}
            bread={bread}
            setBread={setBread}
            setCheckForm={setCheckForm}
          />
        </div>

        <footer className={classes.footer}>
          {checkForm ? (
            <Button
              style={{
                width: "35%",
                fontSize: "10px",
                backgroundColor: "#94C571",
              }}
              type="submit"
              variant="contained"
              color="primary"
            >
              Рассчитать
            </Button>
          ) : (
            selected.length &&
            turn && (
              <>
                Сумма:
                {preSum &&
                  preSum.reduce((partial_sum, a) => partial_sum + a, 0)}
                <Button
                  style={{
                    width: "35%",
                    fontSize: "10px",
                    backgroundColor: "#94C571",
                  }}
                  onClick={() => go()}
                  variant="contained"
                  color="primary"
                >
                  Заказать
                </Button>
              </>
            )
          )}
        </footer>
      </div>
    </form>
  );

  return (
    <div>
      <Snackbar
        className={classes.snackBar}
        open={open}
        autoHideDuration={4500}
        onClose={handleClose1}
      >
        <Alert onClose={handleClose1} severity="success">
          Номер заказа {counter - 1}
        </Alert>
      </Snackbar>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
};
