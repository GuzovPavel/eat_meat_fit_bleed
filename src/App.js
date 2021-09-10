import "./App.scss";
import Header from "./components/header";
import Container from "./components/container";
import firebase from "firebase";
import Login from "./components/login";
import Reg from "./components/reg";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import AdminMenu from "./components/AdminMenu";
import ListOrders from "./components/listOrders/ListOrders";
import OrderHistory from "./components/orderHistory/OrderHistory";
import Users from "./components/users/Users";
import OrderHistoryUser from "./components/orderHistoryUser/OrderHistoryUser";
import { Offline, Online } from "react-detect-offline";
import { Footer } from "./components/footer/Footer";
import OffImg from "./OffImg.png";
import PropTypes from "prop-types";
import { Hidden, withWidth } from "@material-ui/core";
import { ContainerDesktop } from "./components/container/ContainerDesktop";
import CostsList from "./components/CostsList/CostsList";
import ResetPassword from "./components/ResetPassword/ResetPassword";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

function App() {
  const [user, setUser] = useState();
  const [data1, setData1] = useState();
  const [isData, setIsData] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [paid, setPaid] = useState(false);

  const onLoad = (data1) => {
    if (data1) {
      setIsData(true);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      const user = {
        uid: userAuth.uid,
        email: userAuth.email,
      };

      if (userAuth) {
        setUser(user);
        firebase
          .database()
          .ref(`users/${user.uid}`)
          .on("value", (snapshot) => {
            const data = snapshot.val();
            setData1(data);
            onLoad(data);
            // setData1([data])
          });
        // var starCountRef = firebase.database().ref(`/users`);
        // starCountRef.on("value", (snapshot) => {
        //   const data = snapshot.val();
        //   // data.includes(user.uid);
        //   setData1(data);
        // });
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <div>
      <Online>
        <Router>
          <div className="App">
            <Header user={user} data={data1} isOpen={isOpen} open={open} />
            <Switch>
              {user && (
                <Route path="/orders-history">
                  <OrderHistory
                    user={user}
                    data={data1}
                    paid={paid}
                    setPaid={setPaid}
                  ></OrderHistory>
                </Route>
              )}

              {data1 && data1.admin === true && (
                <Route path="/users">
                  <Users user={user} data={data1}></Users>
                </Route>
              )}
              {data1 && data1.admin === true && (
                <Route path="/user-history">
                  <OrderHistoryUser></OrderHistoryUser>
                </Route>
              )}
              {data1 && data1.admin === true && (
                <Route path="/orders">
                  <ListOrders user={user} data={data1}></ListOrders>
                </Route>
              )}
              {data1 && data1.admin === true && (
                <Route path="/costs">
                  <CostsList user={user} data={data1}></CostsList>
                </Route>
              )}

              {user ? (
                <Route exact path="/">
                  <Hidden smUp>
                    <Container
                      user={user}
                      data={data1}
                      isData={isData}
                      setIsOpen={setIsOpen}
                      isOpen={isOpen}
                      open={open}
                      setOpen={setOpen}
                    ></Container>
                  </Hidden>

                  <Hidden xsDown>
                    <ContainerDesktop
                      user={user}
                      data={data1}
                      isData={isData}
                      setIsOpen={setIsOpen}
                      isOpen={isOpen}
                      open={open}
                      setOpen={setOpen}
                    />
                  </Hidden>
                </Route>
              ) : (
                <Route exact path="/">
                  <Login></Login>
                </Route>
              )}

              {data1 && data1.admin === true && (
                <Route path="/admin-menu">
                  <AdminMenu user={user} data={data1}></AdminMenu>
                </Route>
              )}
              {user && (
                <>
                  <Redirect from="/login" to="/"></Redirect>
                  <Redirect from="/reg" to="/"></Redirect>
                </>
              )}

              {data1 && data1.admin !== true && (
                <>
                  <Redirect from="/admin-menu" to="/"></Redirect>
                </>
              )}

              <Route path="/login" component={Login}></Route>
              <Route path="/reg" component={Reg}></Route>
              <Route path="/forgotPassword" component={ResetPassword}></Route>
            </Switch>
            <Footer
              user={user}
              data={data1}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              open={open}
              setOpen={setOpen}
            ></Footer>
          </div>
        </Router>
      </Online>
      <Offline>
        <img src={OffImg} alt="Not Internet Connection"></img>
      </Offline>
    </div>
  );
}
withWidth.propTypes = {
  width: PropTypes.oneOf(["lg", "md", "sm", "xl", "xs"]).isRequired,
};
export default withWidth()(App);
