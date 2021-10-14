import { connect } from "react-redux";
import messages from "../shared/messages";

let InfoMessage = ({ message }) => (
  <h1 className="info-message" style={{ color: message.color }}>
    {message.text}
  </h1>
);

const mapStateToProps = (state) => {
  const lastMessage = state.machine.logs[0];
  return {
    message: lastMessage?.message || messages.notStarted,
  };
};

InfoMessage = connect(mapStateToProps, null)(InfoMessage);

export default InfoMessage;
