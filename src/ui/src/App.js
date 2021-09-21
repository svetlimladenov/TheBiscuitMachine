import React, { useState } from "react";
import "./normalize.css";
import "./App.css";

import Navigation from "./components/Navigation";

import api from "./shared/fetch";

export default function App() {
  const [user, setUser] = useState({ isLoggedIn: false, id: "" });

  const login = ({ data }, changeRoute) => {
    setUser({
      id: data,
      isLoggedIn: true,
    });

    changeRoute();
  };

  const handleLoginSubmit = (body, changeRoute) => {
    api.post("/Users/Login", body).then((response) => {
      login(response, changeRoute);
    });
  };

  const handleRegisterSubmit = (body, changeRoute) => {
    api.post("/Users/Register", body).then((response) => {
      login(response, changeRoute);
    });
  };

  return (
    <Navigation
      user={user}
      handleLoginSubmit={handleLoginSubmit}
      handleRegisterSubmit={handleRegisterSubmit}
    />
  );
}
