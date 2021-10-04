import React, { useState } from "react";
import "./normalize.css";
import "./App.css";

import Navigation from "./components/Navigation";

import api from "./shared/fetch";
import UserContext from "./shared/UserContext";

export default function App() {
  const [user, setUser] = useState({ isLoggedIn: false, id: "" });
  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});
  const login = ({ data }, changeRoute) => {
    setUser({
      id: data,
      isLoggedIn: true,
    });

    changeRoute();
  };

  const handleLoginSubmit = (body, changeRoute) => {
    api
      .post("/Users/Login", body)
      .then((response) => {
        login(response, changeRoute);
      })
      .catch((errors) => {
        setLoginErrors(errors);
      });
  };

  const handleRegisterSubmit = (body, changeRoute) => {
    api
      .post("/Users/Register", body)
      .then((response) => {
        login(response, changeRoute);
      })
      .catch((errors) => {
        setRegisterErrors(errors);
      });
  };

  return (
    <UserContext.Provider value={user}>
      <Navigation
        handleLoginSubmit={handleLoginSubmit}
        handleRegisterSubmit={handleRegisterSubmit}
        loginErrors={loginErrors}
        registerErrors={registerErrors}
      />
    </UserContext.Provider>
  );
}
