import React, { useRef, useState } from "react";
import Field from "./Field";

export default function Login({ onSubmit, error }) {
  const [validationMessage, setValidationMessage] = useState(error);

  const usernameRef = useRef();
  const passwordRef = useRef();
  const configrmPasswordRef = useRef();
  const emailRef = useRef();

  const validateInput = (data) => {
    if (data.password !== data.confirmPassword) {
      setValidationMessage("Passwords do not match");
      return;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
      confirmPassword: configrmPasswordRef.current.value,
      email: emailRef.current.value,
    };

    if (validateInput(data)) {
      console.log("valid");
      onSubmit(data);
    }
  };

  return (
    <div>
      <h3>{error ? error : validationMessage}</h3>
      <form onSubmit={handleSubmit}>
        <Field ref={usernameRef} label="Username: " type="text" />
        <Field ref={passwordRef} label="Password: " type="password" />
        <Field
          ref={configrmPasswordRef}
          label="Confirm Password"
          type="password"
        />
        <Field ref={emailRef} label="Email: " type="email" />
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}
