import React from "react";
import Biscuit from "./Biscuit";
import { connect } from "react-redux";

let BiscuitBox = ({ box }) => (
  <div className="box">
    <h5>Box</h5>
    <div>
      {box.map((biscuit, idx) => (
        <Biscuit key={idx} isStatic={true} />
      ))}
    </div>
  </div>
);

const mapStateToProps = ({ machine }) => {
  return {
    box: machine.box,
  };
};

let hoc = connect(mapStateToProps);

BiscuitBox = hoc(BiscuitBox);

export default BiscuitBox;
