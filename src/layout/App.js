import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider } from "@material-ui/core/styles";

import theme from "../config/theme";
import FirebaseUserAuthenticated from "../components/FirebaseUserAuthenticated";
import FirebaseUserButton from "../components/FirebaseUserButton";
import { MessagePopupContext } from "../elements/MessagePopup";
import SimpleLayout from "../elements/SimpleLayout";
import QuestionListPage from "./QuestionListPage";
import QuestionDetailPage from "./QuestionDetailPage";
import QuestionUpdatePage from "./QuestionUpdatePage";


const titleRef = React.createRef();

const Content = () => (
  <div>
    <FirebaseUserAuthenticated>
      <Switch>
        <Route exact path="/questions" render={routeProps =>
          <QuestionListPage {...routeProps} titleRef={titleRef}/>
        }/>
        <Route exact path="/questions/new" render={routeProps =>
          <QuestionUpdatePage {...routeProps} titleRef={titleRef}/>
        }/>
        <Route exact path="/questions/:questionId" render={routeProps =>
          <QuestionDetailPage {...routeProps} titleRef={titleRef}/>
        }/>
        <Route exact path="/questions/:questionId/edit" render={routeProps =>
          <QuestionUpdatePage {...routeProps} titleRef={titleRef}/>
        }/>
        <Redirect from="/questions/:questionId" to="/questions/:questionId"/>
        <Redirect to="/questions"/>
      </Switch>
    </FirebaseUserAuthenticated>
  </div>
);

const App = () => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline/>
    <BrowserRouter>
      <MessagePopupContext>
        <SimpleLayout
          title={<div ref={titleRef}/>}
          topbarButtons={<FirebaseUserButton/>}
          content={<Content/>}
        />
      </MessagePopupContext>
    </BrowserRouter>
  </MuiThemeProvider>
);

export default App;
