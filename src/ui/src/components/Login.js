import React, { useRef } from "react";
import Field from "./Field";
import { useHistory } from "react-router-dom";

export default function Login({ onSubmit }) {
  const history = useHistory();
  const usernameRef = useRef();
  const passwordRef = useRef();

  const changeRoute = () => {
    history.push("/conveyor");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };

    onSubmit(data, changeRoute);
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit}>
        <Field ref={usernameRef} label="Username: " type="text" />
        <Field ref={passwordRef} label="Password: " type="password" />
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}
