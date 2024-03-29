import React from "react";
import ovenSrc from "../assets/oven.png";
import extruderSrc from "../assets/extruder.png";
import stamperSrc from "../assets/stamper.png";
import { connect } from "react-redux";

let MachineComponents = ({ scale, pulse }) => {
  const elements = [
    { name: "extruder", src: extruderSrc, maxWidth: 100, shouldElement: true },
    { name: "stamper", src: stamperSrc, maxWidth: 100, shouldElement: true },
    { name: "oven", src: ovenSrc, maxWidth: 200, shouldElement: false },
  ];

  return (
    <div className="belt">
      {elements.map((element, idx) => {
        return (
          <div className="machine-component" key={idx}>
            <h5 className="machine-component-name">{element.name}</h5>
            <div
              className="image-wrapper"
              style={{ maxWidth: `${element.maxWidth}px` }}
            >
              <img
                style={{
                  transform:
                    element.shouldElement && scale ? `scale(1.50)` : "scale(1)",
                  transition: `all ${pulse * 500}ms ease-in-out`,
                }}
                src={element.src}
                alt={element.name}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    scale: state.machine.scale,
    pulse: state.machine.pulse,
  };
};

MachineComponents = connect(mapStateToProps)(MachineComponents);

export default MachineComponents;
