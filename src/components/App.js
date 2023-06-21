import React, { useEffect, useState } from "react";
import { authService } from "fbase";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AppRouter from "components/Router";
import DetailPage from "routes/DetailPage";
import Admin from "routes/Admin";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if(user){
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  };
  return (
    <Router>
      {init ? (
        <Switch>
          <Route exact path="/detail/:id">
            <DetailPage />
          </Route>
          <Route exact path="/admin">
            <Admin />
          </Route>
          <Route path="/">
            <AppRouter
              refreshUser={refreshUser}
              isLoggedIn={Boolean(userObj)}
              userObj={userObj}
            />
          </Route>
        </Switch>
      ) : (
        "Initializing..."
      )}
    </Router>
  );
}

export default App;
