import React from "react";
import Biscuit from "./Biscuit";

export default function BiscuitBox({ box }) {
  return (
    <div className="box">
      <h5>Box</h5>
      <div>
        {box.map((biscuit, idx) => (
          <Biscuit key={idx} isStatic={true} />
        ))}
      </div>
    </div>
  );
}
