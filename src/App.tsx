import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  HashRouter,
} from "react-router-dom";
import {
  Center,
  ChakraProvider,
  extendTheme,
  Flex,
  Text,
} from "@chakra-ui/react";
import { ThemeProvider } from "styled-components";
import { Layout } from "./layout";
import Markets from "./views/Markets";
// import ReserveOverview from './views/ReserveOverview';
// import Dashboard from './views/Dashboard';
import Deposit from "./views/Deposit";
import DepositDetail from "./views/Deposit/DepositDetail";
import DepositConfirm from "./views/Deposit/DepositConfirm";
import Borrow from "./views/Borrow";
import BorrowDetail from "./views/Borrow/BorrowDetail";
import BorrowConfirm from "./views/Borrow/BorrowConfirm";
import WithdrawDetail from "./views/Withdraw/WithdrawDetail";
import WithdrawConfirm from "./views/Withdraw/WithdrawConfirm";
// import RepayDetail from './views/Repay/RepayDetail';
// import RepayConfirm from './views/Repay/RepayConfirm';
// import Collateral from './views/Collateral';
// import InterestSwap from './views/InterestSwap';
import { Staking } from "./views/Staking";
import "react-notifications-component/dist/theme.css";
import "./App.css";
//import "animate.css/animate.min.css";
import "react-notifications-component/dist/theme.css";
import ReactNotification from "react-notifications-component";
import { useReduxWeb3Updater } from "./hooks/reduxWeb3";

import BaseTheme from "./theme";

const theme = extendTheme({
  colors: {
    primary: {
      100: "#eefef7",
      300: "#00a490",
      500: "#019d8b",
      900: "#007c6e",
    },
    secondary: {
      100: "#019d8b",
      500: "#007c6e",
      900: "#044D44",
    },
  },
  fonts: {
    body: "Lato",
  },
});

interface IAppProps {}

const App: React.FC<IAppProps> = props => {
  const notifications = React.useMemo(() => <ReactNotification />, []);
  // TODO: Change this as real time ..
  const TOTAL_VALUE_LOCKED = (1782531.59).toLocaleString();

  useReduxWeb3Updater();
  return (
    <ChakraProvider theme={theme}>
      <ThemeProvider theme={BaseTheme}>
        {notifications}
        <HashRouter>
          <Layout
            header={
              // prettier-ignore
              <Switch>
                <Route path="/stake">
                  <Flex px="4.7rem" basis="100%" justifyContent="space-between">
                    <Text fontWeight="bold" color="white" fontSize="2.4rem">
                      Staking
                    </Text>
                    <Center>
                      <Text color="white" fontSize="1.6rem" mr="1.2rem">
                        Funds in the Safety Module
                      </Text>
                      <Text
                        fontSize="2.4rem"
                        fontWeight="bold"
                        bg="linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);"
                        backgroundClip="text"
                      >
                        $ {TOTAL_VALUE_LOCKED}
                      </Text>
                    </Center>
                  </Flex>
                </Route>
                <Route path="/markets">Welcome!</Route>
              </Switch>
            }
          >
            {/* prettier-ignore */}
            <Switch>
              <Route path="/markets" component={Markets} exact />
              {/* <Route path="/reserve-overview/:assetName" component={ReserveOverview} exact /> */}
              {/* <Route path="/dashboard" component={Dashboard} exact /> */}
              <Route path="/deposit" component={Deposit} exact />
              <Route path="/deposit/:assetName" component={DepositDetail} exact />
              <Route path="/deposit/confirm/:assetName/:amount" component={DepositConfirm} exact />
              <Route path="/borrow" component={Borrow} exact />
              <Route path="/borrow/:assetName" component={BorrowDetail} exact />
              <Route path="/borrow/confirm/:assetName/:amount" component={BorrowConfirm} exact />
              <Route path="/withdraw/:assetName" component={WithdrawDetail} exact />
              <Route path="/withdraw/confirm/:assetName/:amount" component={WithdrawConfirm} exact />
              {/* <Route path="/repay/:assetName" component={RepayDetail} exact /> */}
              {/* <Route path="/repay/confirm/:assetName/:amount" component={RepayConfirm} exact /> */}
              {/* <Route path="/collateral/:assetName" component={Collateral} exact /> */}
              {/* <Route path="/interest-swap/:assetName" component={InterestSwap} exact /> */}
              <Route path="/stake" component={Staking} />
              <Redirect from="/" to="/markets" />
          </Switch>
          </Layout>
        </HashRouter>
      </ThemeProvider>
    </ChakraProvider>
  );
};

export default App;
