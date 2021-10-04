import React, { useState } from "react";
import "./normalize.css";
import "./App.css";

import Navigation from "./components/Navigation";
import UserContext from "./shared/UserContext";

export default function App() {
  const [user, setUser] = useState({
    isLoggedIn: false,
    id: "",
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
    },
  });

  return (
    <UserContext.Provider value={user}>
      <Navigation />
    </UserContext.Provider>
  );
}
