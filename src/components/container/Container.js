import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";
// import clsx from "clsx";
// import Clock from "react-live-clock";
import Modal from "../modal";
import firebase from "firebase";
import { Button, Toolbar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import Loader from "../Loader/Loader";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  block: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    margin: "10px 5px",
    padding: "10px 0",
    borderRadius: "10px",
    overflow: "hidden",
  },
  descriptBlock: {
    width: "40%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  descript: {
    width: "100%",
    margin: 0,
    fontSize: "16px",
    textAlign: "end",
    overflow: "scroll",
  },
  mainBlock: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "30px",
    position: "fixed",
    height: "100%",
  },
  menuBlock: {
    display: "flex",
    width: "85%",
    height: "100%",
    overflow: "scroll",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginBottom: "15px",
    marginTop: "12px",
  },
}));

export const Container = ({ user, data, isData, isOpen, setIsOpen, open }) => {
  const [selected, setSelected] = useState([]);
  const [priceArr, setPriceArr] = useState([]);
  const [block, isBlock] = useState();
  const [day, setDay] = useState();
  const [counter, setCounter] = useState();
  const [data1, setData] = useState();
  const classes = useStyles();

  const handleDay = (i) => {
    let newTemplate = firebase.database().ref(`/day`);
    newTemplate.update({ i });
  };

  const handleClick = (name, price) => {
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
    setSelected([]);
    setPriceArr([]);
    setSelected(newSelected);

    setPriceArr(selectedPrice);
  };

  // const isSelected = (name) => selected.indexOf(name) !== -1;
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

  const useToolbarStyles = makeStyles((theme) => ({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === "light"
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: "black",
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: "1 1 100%",
    },
  }));

  const EnhancedTableToolbar = () => {
    const classes = useToolbarStyles();
    const [day, setDay] = useState("");
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
      <Toolbar>
        <Typography
          style={{ display: "flex", flexFlow: "column" }}
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          <span
            style={{
              color: "#94C571",
              fontFamily: "Roboto",
              marginTop: "10px",
            }}
          >
            {(day === "monday" && " ПОНЕДЕЛЬНИК") ||
              (day === "tuesday" && " ВТОРНИК") ||
              (day === "wednesday" && " СРЕДА") ||
              (day === "thursday" && " ЧЕТВЕРГ") ||
              (day === "friday" && " ПЯТНИЦА")}
          </span>
          {data && data.admin === true && (
            <div style={{ height: "10px" }}>
              {/* <h2 className="main-menu">Меню</h2> */}
              <select
                // className="today-day"
                style={{
                  select: "focus",
                  textarea: "focus",
                  input: "focus",
                  fontSize: "16px",
                }}
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

          {!block ? (
            <span className="time-is-over" style={{ marginTop: "15px" }}>
              Время вышло, попробуйте завтра до 9-30 утра
            </span>
          ) : (
            <>
              {/* // Clock
              // format={"HH:mm:ss"}
              // ticking={false}
              // timezone={"Europe/Moscow"} */}
            </>
          )}
        </Typography>
      </Toolbar>
    );
  };

  // EnhancedTableToolbar.propTypes = {
  //   numSelected: PropTypes.number.isRequired,
  // };

  return (
    <div className={classes.mainBlock}>
      {isData ? (
        <>
          <div style={{ marginTop: "15px" }}>
            <EnhancedTableToolbar numSelected={selected.length} block={block} />
          </div>
          <p>version: 1.00101</p>
          <div className={classes.menuBlock}>
            {data1 &&
              data1.selected.map((item, index) => (
                <div
                  className={classes.block}
                  style={{
                    boxShadow:
                      selected.includes(item.name) &&
                      "0px 0px 10px 5px #EEEEEE",
                    border:
                      selected.includes(item.name) &&
                      "1px solid rgba(148, 197, 113, 0.5)",
                  }}
                  key={`data1-${index}`}
                  onClick={() => handleClick(item.name, item.price)}
                >
                  <div style={{ width: "40%" }}>
                    <img src={item.img} alt="logo"></img>
                  </div>
                  <div className={classes.descriptBlock}>
                    <div style={{ marginRight: "10px", width: "100%" }}>
                      <p className={classes.descript}>{item.name}</p>
                      <p className={classes.descript}>{item.gr} грамм</p>
                      <p className={classes.descript}>{item.cal} ккал</p>
                      <p className={classes.descript}>{item.price} рублей</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div style={{ marginBottom: "15%" }}>
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
              <Button
                style={{ marginBottom: "50px" }}
                variant="contained"
                disabled
              >
                Заказать
              </Button>
            )}
          </div>
        </>
      ) : (
        <Loader />
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
    </div>
  );
};
