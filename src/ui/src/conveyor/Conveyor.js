import "../App.css";
import React from "react";

function Conveyor(props) {
  const renderMachineComponents = () => {
    const { conveyor } = props;
    return conveyor.map((element, idx) => {
      return (
        <div key={idx}>
          <span>{element}</span>
          <div className={`${element} element`}></div>
        </div>
      );
    });
  };

  const renderBiscuits = () => {
    const { biscuits } = props;
    return biscuits.map((biscuit) => {
      return (
        <div key={biscuit.id} className="biscuit" style={{ left: biscuit.y }}>
          🍪
        </div>
      );
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
