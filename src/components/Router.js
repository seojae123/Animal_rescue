// import React, { useEffect, useState } from "react";
// import { HashRouter as Router, Route, Switch, Redirect } from "react-router-dom";
// import Auth from "../routes/Auth";
// import Home from "../routes/Home";
// import Profile from "../routes/Profile";
// import { FOCUSABLE_SELECTOR } from '@testing-library/user-event/dist/utils';
// import Navigation from "components/Navigation";
// import DetailPage from "../routes/DetailPage";

// const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
//     return (
//         <Router>
//             {isLoggedIn && <Navigation userObj={userObj}/>}
//             <Switch>
//                 {isLoggedIn ? (
//                     <div
//                         style={{
//                             maxWidth: 890,
//                             width: "100%",
//                             margin: "0 auto",
//                             marginTop: 80,
//                             display: "flex",
//                             justifyContent: "center",
//                         }}
//                     >
//                         <Route exact path="/">
//                             <Home userObj={userObj} />
//                         </Route>
//                         <Route exact path="/profile">
//                             <Profile userObj={userObj} refreshUser={refreshUser}/>
//                         </Route>
//                         <Route path="/detail/:id">
//                         <DetailPage />
//                         </Route>
//                     </div>
//                 ) : (
//                     <>
//                         <Route exact path="/">
//                             <Auth />
//                         </Route>
//                     </>
//                 )}
//             </Switch>
//         </Router>

//     );
// };

// export default AppRouter;

//글쓰기 창

import React from "react";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import { FOCUSABLE_SELECTOR } from "@testing-library/user-event/dist/utils";
import Navigation from "components/Navigation";
import DetailPage from "../routes/DetailPage";
import Write from "../routes/Write";
import Admin from "../routes/Admin";

const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
  return (
    <Router>
      {isLoggedIn && <Navigation userObj={userObj} />}
      <Switch>
        {isLoggedIn ? (
          <div
            style={{
              maxWidth: 890,
              width: "100%",
              margin: "0 auto",
              marginTop: 80,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Route exact path="/">
              <Home userObj={userObj} />
            </Route>
            <Route exact path="/profile">
              <Profile userObj={userObj} refreshUser={refreshUser} />
            </Route>
            <Route path="/detail/:id">
              <DetailPage />
            </Route>
            <Route exact path="/write">
              <Write userObj={userObj} />
            </Route>
            <Route exact path="/admin">
              <Admin userObj={userObj} />
            </Route>
          </div>
        ) : (
          <>
            <Route exact path="/">
              <Auth />
            </Route>
          </>
        )}
      </Switch>
    </Router>
  );
};

export default AppRouter;
