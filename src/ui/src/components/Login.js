import React, { useRef } from "react";
import Field from "./Field";
import { useHistory } from "react-router-dom";
import { renderValidationErrors } from "../shared/utils";

export default function Login({ onSubmit, errors }) {
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
      <div className="validation-errors-wrapper">
        {renderValidationErrors(errors)}
      </div>
      <form onSubmit={handleSubmit}>
        <Field ref={usernameRef} label="Username: " type="text" />
        <Field ref={passwordRef} label="Password: " type="password" />
        <div className="submit-button">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}
