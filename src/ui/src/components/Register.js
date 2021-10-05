import React, { useContext, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Field from "./Field";
import { renderValidationErrors } from "../shared/utils";
import api from "../shared/fetch";
import { StoreContext } from "../shared/StoreContext";

export default function Login() {
  const history = useHistory();

  const usernameRef = useRef();
  const passwordRef = useRef();
  const configrmPasswordRef = useRef();
  const emailRef = useRef();

  const store = useContext(StoreContext);

  const [errors, setErrors] = useState([]);

  const changeRoute = () => {
    history.push("/conveyor");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
      confirmPassword: configrmPasswordRef.current.value,
      email: emailRef.current.value,
    };

    api
      .post("/Users/Register", body)
      .then(({ data }) => {
        store.dispatch({
          type: "SET_USER",
          userId: data,
        });
        changeRoute();
      })
      .catch((errors) => {
        setErrors(errors);
      });
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
