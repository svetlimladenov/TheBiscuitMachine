import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import api from "../shared/fetch";
import NumberControl from "./NumberControl";
import TimeInput from "./TimeInput";

let MachineSpecifications = ({ userId }) => {
  const [machineSpecs, setMachineSpecs] = useState({
    pulse: 1,
    ovenHeatingDuration: "00:00:00",
    ovenOverheatingDuration: "00:00:00",
    ovenColdDuration: "00:00:00",
  });

  const [savedText, setSavedText] = useState(false);

  const heatinRef = useRef();
  const overheatingRef = useRef();
  const ovenColdRef = useRef();

  useEffect(() => {
    api.get(`/Machine?userId=${userId}`).then(({ data }) => {
      setMachineSpecs({
        pulse: data.pulse,
        ovenHeatingDuration: data.ovenHeatingDuration,
        ovenOverheatingDuration: data.ovenOverheatingDuration,
        ovenColdDuration: data.ovenColdDuration,
      });
    });
  }, [userId]);

  const saveMachineSpecifications = () => {
    const body = {
      userId: userId,
      pulse: machineSpecs.pulse,
      ovenHeatingDuration: heatinRef.current.value,
      ovenOverheatingDuration: overheatingRef.current.value,
      ovenColdDuration: ovenColdRef.current.value,
    };

    api.put("/Machine", body).then((response) => {
      setSavedText(true);
      setTimeout(() => {
        setSavedText(false);
      }, 2000);
    });
  };

  const handlePulseIncrement = () => {
    setMachineSpecs((specs) =>
      Object.assign({}, specs, { pulse: specs.pulse + 1 })
    );
  };

  const handlePulseDecrement = () => {
    setMachineSpecs((specs) => {
      if (specs.pulse - 1 < 0) {
        return specs;
      }
      return Object.assign({}, specs, { pulse: specs.pulse - 1 });
    });
  };

  return (
    <div>
      <h2>Machine Specification</h2>
      <NumberControl
        label="Pulse: "
        number={machineSpecs.pulse}
        handleIncrement={handlePulseIncrement}
        handleDecrement={handlePulseDecrement}
      ></NumberControl>
      <TimeInput
        ref={heatinRef}
        label={"Heating time:"}
        time={machineSpecs.ovenHeatingDuration}
      />
      <TimeInput
        ref={overheatingRef}
        label={"Overheating time:"}
        time={machineSpecs.ovenOverheatingDuration}
      />
      <TimeInput
        ref={ovenColdRef}
        label={"Oven Cold time :"}
        time={machineSpecs.ovenColdDuration}
      />
      <div className="save-specs">
        <span className="save-info">
          You need to restart the machine for the changes to take effect
        </span>
        {
          <span
            className="saved-text"
            style={{ opacity: savedText ? "100%" : "0%" }}
          >
            Saved
          </span>
        }
        <button onClick={saveMachineSpecifications}>Save</button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userId: state.user.userId,
  };
};

MachineSpecifications = connect(mapStateToProps)(MachineSpecifications);

export default MachineSpecifications;
