import React, { useContext, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Field from "./Field";
import { renderValidationErrors } from "../shared/utils";
import api from "../shared/fetch";
import UserContext from "../shared/UserContext";

export default function Login() {
  const history = useHistory();

  const usernameRef = useRef();
  const passwordRef = useRef();
  const configrmPasswordRef = useRef();
  const emailRef = useRef();

  const user = useContext(UserContext);

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

    if (validateData(body)) {
      api
        .post("/Users/Register", body)
        .then(({ data }) => {
          user.handleLogin(data);
          changeRoute();
        })
        .catch((errors) => {
          setErrors(errors);
        });
    }
  };

  const validateData = (data) => {
    let isValid = true;
    if (data.password.length < 3) {
      setErrors({
        ...errors,
        Password: [
          "The field ConfirmPassword must be a string or array type with a minimum length of '6'.",
        ],
      });
      isValid = false;
    } else {
      setErrors({});
    }
    return isValid;
  };

  let allErrors = {};
  if (Object.keys(errors).length > 0) {
    allErrors = errors;
  } else {
    allErrors = errors;
  }

  return (
    <div className="form-wrapper">
      <div className="validation-errors-wrapper">
        {renderValidationErrors(allErrors)}
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
