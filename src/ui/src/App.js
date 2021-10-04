import React, { useState } from "react";
import "./normalize.css";
import "./App.css";

import Navigation from "./components/Navigation";

import api from "./shared/fetch";
import UserContext from "./shared/UserContext";

export default function App() {
  const [user, setUser] = useState({
    isLoggedIn: false,
    id: "",
    handleLogin(id) {
      setUser({
        isLoggedIn: true,
        id: id,
      });
    },
  });

  return (
    <UserContext.Provider value={user}>
      <Navigation />
    </UserContext.Provider>
  );
}
