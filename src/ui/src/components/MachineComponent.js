import React from "react";
import ovenSrc from "../assets/oven.png";
import extruderSrc from "../assets/extruder.png";
import stamperSrc from "../assets/stamper.png";

export default function MachineComponents() {
  const elements = [
    { name: "extruder", src: extruderSrc, maxWidth: 100 },
    { name: "stamper", src: stamperSrc, maxWidth: 100 },
    { name: "oven", src: ovenSrc, maxWidth: 500 },
  ];

  return elements.map((element, idx) => {
    return (
      <div className="machine-component" key={idx}>
        <h5 className="machine-component-name">{element.name}</h5>
        <div
          className="image-wrapper"
          style={{ maxWidth: `${element.maxWidth}px` }}
        >
          <img src={element.src} alt={element.name} />
        </div>
      </div>
    );
  });
}
