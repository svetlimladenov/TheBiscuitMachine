import React, { useEffect, useState } from "react";
import "./normalize.css";
import "./App.css";

import Navigation from "./components/Navigation";
import UserContext from "./shared/UserContext";

export default function App() {
  const [user, setUser] = useState({
    isLoggedIn: localStorage.getItem("userId") && true,
    id: localStorage.getItem("userId"),
    setCurrentUser(id) {
      let isLoggedIn = false;
      if (id) {
        isLoggedIn = true;
      }
      setUser({
        isLoggedIn: isLoggedIn,
        id: id,
        setCurrentUser: this.setCurrentUser,
      });
      localStorage.setItem("userId", id);
    },
  });

  return (
    <UserContext.Provider value={user}>
      <Navigation />
    </UserContext.Provider>
  );
}
