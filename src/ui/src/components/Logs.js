import { connect } from "react-redux";
import { machineActions } from "../machine/machine-actions";

let Logs = ({ logs, clearLogs }) => {
  const renderLogs = () => {
    return logs.map(({ message, timestamp }, idx) => {
      return (
        <div key={idx}>
          <span>
            {timestamp} : {message.text}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="logs">
      <h2>Logs :</h2>
      <button className="clear-logs" onClick={clearLogs}>
        Clear logs
      </button>
      {renderLogs()}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    logs: state.machine.logs,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearLogs: () => {
      dispatch(machineActions.clearLogs());
    },
  };
};

Logs = connect(mapStateToProps, mapDispatchToProps)(Logs);

export default Logs;
