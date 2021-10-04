import React, { useContext, useRef, useState } from "react";
import Field from "./Field";
import { useHistory } from "react-router-dom";
import { renderValidationErrors } from "../shared/utils";
import UserContext from "../shared/UserContext";
import api from "../shared/fetch";

export default function Login({ onSubmit }) {
  const [errors, setErrors] = useState({});
  const history = useHistory();
  const usernameRef = useRef();
  const passwordRef = useRef();

  const user = useContext(UserContext);

  const changeRoute = () => {
    history.push("/conveyor");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };

    api
      .post("/Users/Login", body)
      .then(({ data }) => {
        user.setCurrentUser(data);
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
        <div className="submit-button">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}
