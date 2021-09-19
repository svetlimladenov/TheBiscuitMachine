import "../App.css";
import React from "react";
import Biscuit from "./Biscuit";
import BiscuitBox from "./BiscuitBox";
import MachineComponent from "./MachineComponent";

function Conveyor(props) {
  const renderMachineComponents = () => {
    return (
      <React.Fragment>
        <div className="belt">
          <MachineComponent name="extruder" />
          <MachineComponent name="stamper" />
          <MachineComponent name="oven" />
        </div>
        <BiscuitBox biscuitBox={props.biscuitBox} />
      </React.Fragment>
    );
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
    </div>
  );
}

export default Conveyor;
