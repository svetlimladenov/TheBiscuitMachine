import { useEffect, useRef, useState } from "react";
import api from "../shared/fetch";
import NumberControl from "./NumberControl";
import TimeInput from "./TimeInput";

export default function MachineSpecifications({ userId }) {
  const [pulse, setPulse] = useState(1);
  const [ovenHeatingDuration, setOvenHeatingDuration] = useState("00:00:00");
  const [ovenOverheatingDuration, setOvenOvereatingDuration] =
    useState("00:00:00");
  const [ovenColdDuration, setOvenColdDuration] = useState("00:00:00");
  const [savedText, setSavedText] = useState(false);

  const heatinRef = useRef();
  const overheatingRef = useRef();
  const ovenColdRef = useRef();

  useEffect(() => {
    api.get(`/Machine?userId=${userId}`).then(({ data }) => {
      setPulse(data.pulse);
      setOvenHeatingDuration(data.ovenHeatingDuration);
      setOvenOvereatingDuration(data.ovenOverheatingDuration);
      setOvenColdDuration(data.ovenColdDuration);
    });
  }, [userId]);

  const incrementDecrement = (state, hook) => {
    return {
      handleIncrement() {
        hook(state + 1);
      },
      handleDecrement() {
        if (state - 1 > 0) {
          hook(state - 1);
        }
      },
    };
  };

  const saveMachineSpecifications = () => {
    const body = {
      userId: userId,
      pulse: pulse,
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

  return (
    <div>
      <h2>Machine Specification</h2>
      <NumberControl number={pulse} {...incrementDecrement(pulse, setPulse)}>
        Pulse:
      </NumberControl>
      <TimeInput
        ref={heatinRef}
        label={"Heating time:"}
        time={ovenHeatingDuration}
      />
      <TimeInput
        ref={overheatingRef}
        label={"Overheating time:"}
        time={ovenOverheatingDuration}
      />
      <TimeInput
        ref={ovenColdRef}
        label={"Oven Cold time :"}
        time={ovenColdDuration}
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
}
