import React, { useRef, useState } from "react";
import Field from "./Field";
import { useHistory } from "react-router-dom";
import { renderValidationErrors } from "../shared/utils";
import api from "../shared/fetch";
import { userActions } from "../user/user-actions";
import { connect } from "react-redux";

let Login = ({ setUser }) => {
  const [errors, setErrors] = useState({});
  const history = useHistory();
  const usernameRef = useRef();
  const passwordRef = useRef();

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
        <div className="submit-button">
          <button type="submit">Login</button>
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

Login = connect(null, mapDispatchToProps)(Login);

export default Login;
