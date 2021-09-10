import React, { useEffect, useState } from "react";
import firebase from "firebase";
import moment from "moment";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const CostsList = () => {
  const [total, setTotal] = useState();
  const [total1, setTotal1] = useState();
  const [total2, setTotal2] = useState();
  const [total3, setTotal3] = useState();
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);

  useEffect(() => {
    firebase
      .database()
      .ref(`/orders/history/`)
      .on(`value`, (snapshot) => {
        const data = snapshot.val();

        const temp1 = [];
        data &&
          Object.keys(data).map((room, index) => {
            Object.keys(data[room]).map((elem, index) => {
              if (data[room][elem].office === "grech") {
                temp1.push(data[room][elem]);
              }
              return data[room][elem].selectedPrice;
            });
            return data[room];
          });

        const reducer = temp1
          .filter((e) =>
            moment(e.date, "YYYY-MM-DD").isBetween(
              moment(state[0].startDate)
                .subtract(1, "day")
                .format("YYYY-MM-DD"),
              moment(state[0].endDate).add(1, "day").format("YYYY-MM-DD")
            )
          )
          .reduce((prev, curr) => {
            return prev + curr.selectedPrice;
          }, 0);

        setTotal(reducer);

        const temp2 = [];
        data &&
          Object.keys(data).map((room, index) => {
            Object.keys(data[room]).map((elem, index) => {
              if (data[room][elem].office === "alex") {
                temp2.push(data[room][elem]);
              }
              return data[room][elem].selectedPrice;
            });
            return data[room];
          });

        const reducer2 = temp2
          ?.filter((e) =>
            moment(e.date, "YYYY-MM-DD").isBetween(
              moment(state[0].startDate)
                .subtract(1, "day")
                .format("YYYY-MM-DD"),
              moment(state[0].endDate).add(1, "day").format("YYYY-MM-DD")
            )
          )
          .reduce((prev, curr) => {
            return prev + curr.selectedPrice;
          }, 0);
        setTotal1(reducer2);

        const temp3 = [];
        data &&
          Object.keys(data).map((room, index) => {
            Object.keys(data[room]).map((elem, index) => {
              if (data[room][elem].office === "cheh") {
                temp3.push(data[room][elem]);
              }
              return data[room][elem];
            });
            return data[room];
          });

        const reducer3 = temp3
          ?.filter((e) =>
            moment(e.date, "YYYY-MM-DD").isBetween(
              moment(state[0].startDate)
                .subtract(1, "day")
                .format("YYYY-MM-DD"),
              moment(state[0].endDate).add(1, "day").format("YYYY-MM-DD")
            )
          )
          .reduce((prev, curr) => {
            return prev + curr.selectedPrice;
          }, 0);
        setTotal2(reducer3);

        const temp4 = [];
        data &&
          Object.keys(data).map((room, index) => {
            Object.keys(data[room]).map((elem, index) => {
              if (data[room][elem].office === "petr") {
                temp4.push(data[room][elem]);
              }
              return data[room][elem];
            });
            return data[room];
          });

        const reducer4 = temp4
          ?.filter((e) =>
            moment(e.date, "YYYY-MM-DD").isBetween(
              moment(state[0].startDate)
                .subtract(1, "day")
                .format("YYYY-MM-DD"),
              moment(state[0].endDate).add(1, "day").format("YYYY-MM-DD")
            )
          )
          .reduce((prev, curr) => {
            return prev + curr.selectedPrice;
          }, 0);
        setTotal3(reducer4);
      });
  }, [state, total]);

  return (
    <div style={{ height: "1000px" }}>
      <div style={{ marginTop: "15%" }}>
        <DateRange
          editableDateInputs={true}
          onChange={(item) => setState([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={state}
        />
      </div>
      <div style={{ marginTop: 0 }}>
        <h2 style={{ marginTop: 0 }}>Греческая</h2>
        <p>{total} руб.</p>
        <h2 style={{ marginTop: 0 }}>Петровская</h2>
        <p>{total3} руб.</p>

        <h2 style={{ marginTop: 0 }}>Чехова</h2>
        <p>{total2} руб.</p>

        <h2 style={{ marginTop: 0 }}>Александровская</h2>
        <p>{total1} руб.</p>
      </div>
    </div>
  );
};

export default CostsList;
