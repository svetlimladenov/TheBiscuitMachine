import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Field from "./Field";
import { renderValidationErrors } from "../shared/utils";

export default function Login({ onSubmit, errors }) {
  const history = useHistory();

  const usernameRef = useRef();
  const passwordRef = useRef();
  const configrmPasswordRef = useRef();
  const emailRef = useRef();

  const changeRoute = () => {
    history.push("/conveyor");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
      confirmPassword: configrmPasswordRef.current.value,
      email: emailRef.current.value,
    };

    onSubmit(data, changeRoute);
  };

  return (
    <div className="form-wrapper">
      <div className="validation-errors-wrapper">
        {renderValidationErrors(errors)}
      </div>
      <form onSubmit={handleSubmit}>
        <Field ref={usernameRef} label="Username: " type="text" />
        <Field ref={passwordRef} label="Password: " type="password" />
        <Field
          ref={configrmPasswordRef}
          label="Confirm Password: "
          type="password"
        />
        <Field ref={emailRef} label="Email: " type="email" />
        <div className="submit-button">
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
}
