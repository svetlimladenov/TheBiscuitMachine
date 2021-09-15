import "./App.css";
import React from "react";

class Conveyor extends React.Component {
  constructor() {
    super();
    this.state = {
      conveyor: ["extruder", "stamper", "oven", "box"],
    };
  }

  render() {
    const { conveyor } = this.state;
    return (
      <div className="conveyor-wrapper">
        {conveyor.map((element, idx) => {
          return (
            <div className={`${element} element`} key={idx}>
              {element}
            </div>
          );
        })}
      </div>
    );
  }
}

export default Conveyor;
