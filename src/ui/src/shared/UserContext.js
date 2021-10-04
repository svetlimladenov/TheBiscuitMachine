import React from "react";

const UserContext = React.createContext({
  id: null,
  isLoggedIn: false,
  setCurrentUser(id) {},
});

export default UserContext;
