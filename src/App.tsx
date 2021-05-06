import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { ThemeProvider } from "styled-components";
import Layout from "./layout";
import Markets from "./views/Markets";
// import ReserveOverview from './views/ReserveOverview';
// import Dashboard from './views/Dashboard';
import Deposit from './views/Deposit';
import Borrow from './views/Borrow';
import BorrowDetail from './views/Borrow/BorrowDetail';
import BorrowConfirm from './views/Borrow/BorrowConfirm';
import DepositWithdrawDetail from './views/DepositWithdraw/DepositWithdrawDetail';
// import RepayDetail from './views/Repay/RepayDetail';
// import RepayConfirm from './views/Repay/RepayConfirm';
// import Collateral from './views/Collateral';
// import InterestSwap from './views/InterestSwap';
import { Staking } from "./views/Staking";
import "react-notifications-component/dist/theme.css";
import BaseTheme from "./theme";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
//import "animate.css/animate.min.css";
import "react-notifications-component/dist/theme.css";
import ReactNotification from "react-notifications-component";
import { useReduxWeb3Updater } from "./hooks/reduxWeb3";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { DepositWithdrawConfirm } from "./views/DepositWithdraw/DepositWithdrawConfirm";

interface IAppProps {}

const App: React.FC<IAppProps> = (props) => {
  const notifications = React.useMemo(() => <ReactNotification />, []);
  // TODO: Proper theming interop a la https://material-ui.com/guides/interoperability/#styled-components
  const appTheme = React.useMemo(() => createMuiTheme({
    palette: {
      primary: {
        main: "#019d8b",
        light: "#eefef7",
        dark: "#007c6e",
      },
      secondary: {
        main: "#007c6e",
        light: "#019d8b",
        dark: "#044D44",
      },
      text: {
        // primary: "#00cdB9",
        // secondary: "#ffffff",
        hint: "red"
      },
      // type: "dark",
      // primary: {
      //   main: "#007c6e",
      //   light: "#019d8b",
      //   dark: "#044D44",
      //   contrastText: "purple"
      // },
      // secondary: {
      //   main: "#dcfff1",
      //   light: "#F3FFF7",
      //   dark: "#044D44",
      // },
      // text: {
      //   primary: "#ffffff",
      //   // secondary: "#007c6e",
      //   secondary: "#00cdB9",
      //   hint: "red"
      // },
      // tonalOffset: {
      //   dark: 0,
      //   light: 0.5,
      // },
      // background: {
      //   paper: "#007c6e",
      //   default: "#044D44",
      // }
    }
  }), []);
  useReduxWeb3Updater();
  return (
    <MuiThemeProvider theme={appTheme}>
      <CssBaseline/>
      <ThemeProvider theme={BaseTheme}>
        {notifications}
        <Router>
          <Layout>
            {/* prettier-ignore */}
            <Switch>
              <Route path="/markets" component={Markets} exact />
              {/* <Route path="/reserve-overview/:assetName" component={ReserveOverview} exact /> */}
              {/* <Route path="/dashboard" component={Dashboard} exact /> */}
              <Route path="/borrow" component={Borrow} exact />
              <Route path="/borrow/:assetName" component={BorrowDetail} exact />
              <Route path="/borrow/confirm/:assetName/:amount/:step" component={BorrowConfirm} exact />
              <Route path="/deposit" component={Deposit} exact />
              <Route path="/:action/:assetName" component={DepositWithdrawDetail} exact />
              <Route path="/:action/:assetName/:amount/:stepName?" component={DepositWithdrawConfirm} exact />
              {/* <Route path="/repay/:assetName" component={RepayDetail} exact /> */}
              {/* <Route path="/repay/confirm/:assetName/:amount" component={RepayConfirm} exact /> */}
              {/* <Route path="/collateral/:assetName" component={Collateral} exact /> */}
              {/* <Route path="/interest-swap/:assetName" component={InterestSwap} exact /> */}
              <Route path="/stake" component={Staking} />
              <Redirect from="/" to="/markets" />
            </Switch>
          </Layout>
        </Router>
      </ThemeProvider>
    </MuiThemeProvider>
  );
};

export default App;
