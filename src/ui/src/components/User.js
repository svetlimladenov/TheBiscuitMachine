import { useState } from "react";
import { useEffect } from "react";
import api from "../shared/fetch";

export default function User({ userId }) {
  const [userData, setData] = useState({ username: "Loading" });

  useEffect(() => {
    api.get(`/Users/${userId}`).then((user) => {
      console.log(user);
      setData(user.data);
    });
  }, [userId]);

  return <h1>{userData.username}</h1>;
}
