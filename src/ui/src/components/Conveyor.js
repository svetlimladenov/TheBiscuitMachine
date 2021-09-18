import "../App.css";
import React from "react";
import Biscuit from "./Biscuit";
import MachineComponent from "./MachineComponent";

function Conveyor(props) {
  const renderMachineComponents = () => {
    return [
      <MachineComponent name="extruder" />,
      <MachineComponent name="stamper" />,
      <MachineComponent name="oven" />,
      <MachineComponent name="box" />,
    ];
  };

  const renderBiscuits = () => {
    const { biscuits, speed } = props;
    return biscuits.map((biscuit) => {
      return <Biscuit key={biscuit.id} y={biscuit.y} speed={speed} />;
    });
  };

  return (
    <div>
      <h1>{props.message}</h1>
      <div className="conveyor-wrapper">
        {renderMachineComponents()}
        {renderBiscuits()}
      </div>
      <button onClick={props.handleStart}>Start</button>
      <button onClick={props.handlePause}>Pause</button>
      <button onClick={props.handeStop}>Stop</button>
      <div>
        <h3>Box</h3>
        {props.box.map((biscuit, idx) => {
          return <span key={idx}>🍪</span>;
        })}
      </div>
    </div>
  );
}

export default Conveyor;
