import React, { useRef } from "react";
import Field from "./Field";

export default function Login({ onSubmit }) {
  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Field ref={usernameRef} label="Username: " type="text" />
      <Field ref={passwordRef} label="Password: " type="password" />
      <div>
        <button type="submit">Login</button>
      </div>
    </form>
  );
}
