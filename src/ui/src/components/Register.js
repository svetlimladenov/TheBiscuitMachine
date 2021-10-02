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

  const [localErrors, setLocalErrors] = useState([]);

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

    if (validateData(data)) {
      onSubmit(data, changeRoute);
    }
  };

  const validateData = (data) => {
    let isValid = true;
    if (data.password.length < 3) {
      setLocalErrors({
        ...localErrors,
        Password: [
          "The field ConfirmPassword must be a string or array type with a minimum length of '6'.",
        ],
      });
      isValid = false;
    } else {
      setLocalErrors({});
    }
    return isValid;
  };

  let allErrors = {};
  if (Object.keys(localErrors).length > 0) {
    allErrors = localErrors;
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
