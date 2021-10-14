import Biscuit from "./Biscuit";
import { connect } from "react-redux";

let MovingBiscuits = ({ biscuits, pulse }) => {
  return biscuits.map((biscuit) => {
    return (
      <Biscuit
        key={biscuit.id}
        y={biscuit.y}
        speed={pulse}
        step={biscuit.step}
      />
    );
  });
};

const mapStateToProps = ({ machine }) => {
  return {
    biscuits: machine.biscuits,
    pulse: machine.pulse,
  };
};

MovingBiscuits = connect(mapStateToProps)(MovingBiscuits);

export default MovingBiscuits;
