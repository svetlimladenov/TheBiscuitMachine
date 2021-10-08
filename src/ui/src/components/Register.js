import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

import api from "../shared/fetch";
import { userActions } from "../user/user-actions";

import { renderValidationErrors } from "../shared/utils";
import Field from "./Field";

let Register = ({ setUser }) => {
  const history = useHistory();

  const usernameRef = useRef();
  const passwordRef = useRef();
  const configrmPasswordRef = useRef();
  const emailRef = useRef();

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
        setUser(data);
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
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (data) => {
      dispatch(userActions.setUser(data));
    },
  };
};

Register = connect(null, mapDispatchToProps)(Register);

export default Register;
