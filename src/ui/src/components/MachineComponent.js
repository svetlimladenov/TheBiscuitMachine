import React from "react";

export default function MachineComponent({ name }) {
  return (
    <div className={`${name}-wrapper`}>
      <h5>{name}</h5>
      <div className={`element ${name}`}></div>
    </div>
  );
}
