import React, { useRef } from "react";
import Field from "./Field";

const Login = ({ onSubmit }) => {
  const usernameRef = useRef();
  const emailRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Field ref={usernameRef} label="Username: " type="text" />
      <Field ref={emailRef} label="Email: " type="email" />
      <div>
        <button type="submit">Login</button>
      </div>
    </form>
  );
};

export default Login;
