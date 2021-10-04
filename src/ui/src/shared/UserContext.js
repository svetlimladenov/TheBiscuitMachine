import React from "react";

const UserContext = React.createContext({
  id: null,
  isLoggedIn: false,
  handleLogin(id) {},
});

export default UserContext;
