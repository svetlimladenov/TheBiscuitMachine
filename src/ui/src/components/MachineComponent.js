import React from "react";
import ovenSrc from "../assets/oven.png";

export default function MachineComponent({ name }) {
  return (
    <div className="machine-component">
      <h5>{name}</h5>
      <img src={ovenSrc} alt="" />
    </div>
  );
}
