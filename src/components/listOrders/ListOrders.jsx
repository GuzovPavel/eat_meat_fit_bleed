import React, { useEffect, useState } from "react";
import firebase from "firebase";

const ListOrders = () => {
  const [dataGrech, setDataGrech] = useState();
  const [dataAlex, setDataAlex] = useState();
  const [dataCheh, setDataCheh] = useState();
  const [dataPetr, setDataPetr] = useState();

  useEffect(() => {
    firebase
      .database()
      .ref(`orders/`)
      .on("value", (snapshot) => {
        const data = snapshot.val();
        const arrayGrech =
          data.grech &&
          Object.keys(data.grech).map((room, index) => {
            return { item: data.grech[room] };
          });

        const arrayAlex =
          data.alex &&
          Object.keys(data.alex).map((room) => {
            return { item: data.alex[room] };
          });

        const arrayCheh =
          data.cheh &&
          Object.keys(data.cheh).map((room) => {
            return { item: data.cheh[room] };
          });
        const arrayPetr =
          data.petr &&
          Object.keys(data.petr).map((room) => {
            return { item: data.petr[room] };
          });

        const tmp1 = [];
        data.grech &&
          arrayGrech.forEach((e) => {
            Array.isArray(e.item) &&
              e.item.forEach((elem) => {
                tmp1.push(elem);
              });
            let obj1 = {};
            let arr1 = [];
            tmp1.forEach((item) => {
              if (!obj1[item.id]) obj1[item.id] = "";
              obj1[item.id] += `${item.name};`;
            });
            for (const id in obj1) {
              let str1 = obj1[id].substr(0, obj1[id].length - 1);
              let newArr1 = str1.split(";");
              let v,
                freqs = {};

              for (let i = newArr1 && newArr1.length; i--; ) {
                v = newArr1[i];
                if (freqs[v]) freqs[v] += 1;
                else freqs[v] = 1;
              }
              const arrayGrech2 = Object.keys(freqs).map((room) => {
                return { name: room, num: freqs[room] };
              });

              arr1.push({
                id: id,
                name: arrayGrech2,
              });
            }
            setDataGrech(arr1);
          });

        const tmp2 = [];
        data.alex &&
          arrayAlex.forEach((e) => {
            Array.isArray(e.item) &&
              e.item.forEach((elem) => {
                tmp2.push(elem);
              });
            let obj2 = {};
            let arr2 = [];
            tmp2.forEach((item) => {
              if (!obj2[item.id]) obj2[item.id] = "";
              obj2[item.id] += `${item.name};`;
            });
            for (const id in obj2) {
              let str2 = obj2[id].substr(0, obj2[id].length - 1);
              let newArr2 = str2.split(";");
              let v,
                freqs = {};

              for (let i = newArr2 && newArr2.length; i--; ) {
                v = newArr2[i];
                if (freqs[v]) freqs[v] += 1;
                else freqs[v] = 1;
              }
              const arrayAlex2 = Object.keys(freqs).map((room) => {
                return { name: room, num: freqs[room] };
              });
              arr2.push({
                id: id,
                name: arrayAlex2,
              });
            }
            setDataAlex(arr2);
          });

        const tmp3 = [];
        data.cheh &&
          arrayCheh.forEach((e) => {
            Array.isArray(e.item) &&
              e.item.forEach((elem) => {
                tmp3.push(elem);
              });
            let obj3 = {};
            let arr3 = [];
            tmp3.forEach((item) => {
              if (!obj3[item.id]) obj3[item.id] = "";
              obj3[item.id] += `${item.name};`;
            });
            for (const id in obj3) {
              let str3 = obj3[id].substr(0, obj3[id].length - 1);
              let newArr3 = str3.split(";");
              let v,
                freqs = {};

              for (let i = newArr3 && newArr3.length; i--; ) {
                v = newArr3[i];
                if (freqs[v]) freqs[v] += 1;
                else freqs[v] = 1;
              }
              const arrayCheh2 = Object.keys(freqs).map((room) => {
                return { name: room, num: freqs[room] };
              });
              arr3.push({
                id: id,
                name: arrayCheh2,
              });
            }
            setDataCheh(arr3);
          });

        const tmp4 = [];
        data.petr &&
          arrayPetr.forEach((e) => {
            Array.isArray(e.item) &&
              e.item.forEach((elem) => {
                tmp4.push(elem);
              });
            let obj4 = {};
            let arr4 = [];
            tmp4.forEach((item) => {
              if (!obj4[item.id]) obj4[item.id] = "";
              obj4[item.id] += `${item.name};`;
            });
            for (const id in obj4) {
              let str4 = obj4[id].substr(0, obj4[id].length - 1);
              let newArr4 = str4.split(";");
              let v,
                freqs = {};

              for (let i = newArr4 && newArr4.length; i--; ) {
                v = newArr4[i];
                if (freqs[v]) freqs[v] += 1;
                else freqs[v] = 1;
              }
              const arrayPetr2 = Object.keys(freqs).map((room) => {
                return { name: room, num: freqs[room] };
              });
              arr4.push({
                id: id,
                name: arrayPetr2,
              });
            }
            setDataPetr(arr4);
          });
      });
  }, []);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
        marginTop: "10%",
        marginBottom: "10%",
      }}
    >
      <div>
        <h2>Греческая</h2>
        {dataGrech &&
          dataGrech.map((item, index) => (
            <div>
              <p style={{ color: "red" }}>Номер Заказа: {item.id}</p>
              <div>
                {item.name.map((elem, i) => (
                  <p>
                    {elem.name} - {elem.num}
                  </p>
                ))}
              </div>
            </div>
          ))}
        <h2>Чехова</h2>
        {dataCheh &&
          dataCheh.map((item, index) => (
            <div>
              <p style={{ color: "red" }}>Номер Заказа: {item.id}</p>
              <div>
                {item.name.map((elem, i) => (
                  <p>
                    {elem.name} - {elem.num}
                  </p>
                ))}
              </div>
            </div>
          ))}
        <h2>Александровская</h2>
        {dataAlex &&
          dataAlex.map((item, index) => (
            <div>
              <p style={{ color: "red" }}>Номер Заказа: {item.id}</p>
              <div>
                {item.name.map((elem, i) => (
                  <p>
                    {elem.name} - {elem.num}
                  </p>
                ))}
              </div>
            </div>
          ))}
        <h2>Петровская</h2>
        {dataPetr &&
          dataPetr.map((item, index) => (
            <div>
              <p style={{ color: "red" }}>Номер Заказа: {item.id}</p>
              <div>
                {item.name.map((elem, i) => (
                  <p>
                    {elem.name} - {elem.num}
                  </p>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ListOrders;
