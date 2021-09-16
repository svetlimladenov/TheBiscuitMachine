import "../App.css";
import React from "react";

class Conveyor extends React.Component {
  renderMachineComponents = () => {
    const { conveyor } = this.props;
    return conveyor.map((element, idx) => {
      return (
        <div key={idx}>
          <span>{element}</span>
          <div className={`${element} element`}></div>
        </div>
      );
    });
  };

  renderBiscuits = () => {
    const { biscuits } = this.props;
    return biscuits.map((biscuit) => {
      return (
        <div key={biscuit.id} className="biscuit" style={{ left: biscuit.y }}>
          🍪
        </div>
      );
    });
  };

  render() {
    return (
      <div>
        <h1>{this.props.message}</h1>
        <div className="conveyor-wrapper">
          {this.renderMachineComponents()}
          {this.renderBiscuits()}
        </div>
        <button onClick={this.props.handleStart}>Start</button>
        <button onClick={this.props.handlePause}>Pause</button>
        <button onClick={this.props.handeStop}>Stop</button>
        <div>
          <h3>Box</h3>
          {this.props.box.map((biscuit, idx) => {
            return <span key={idx}>🍪</span>;
          })}
        </div>
      </div>
    );
  }
}

export default Conveyor;
