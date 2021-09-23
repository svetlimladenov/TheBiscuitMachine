import { useEffect, useState } from "react";
import api from "../shared/fetch";
import NumberControl from "./NumberControl";

export default function MachineSpecifications({ userId }) {
  const [pulse, setPulse] = useState(1);
  const [ovenHeatingDuration, setOvenHeatingDuration] = useState("00:00:00");
  const [ovenOverheatingDuration, setOvenOvereatingDuration] =
    useState("00:00:00");
  const [ovenColdDuration, setOvenColdDuration] = useState("00:00:00");

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
      ovenHeatingDuration,
      ovenOverheatingDuration,
      ovenColdDuration,
    };

    api.put("/Machine", body).then((response) => {
      console.log(response);
    });
  };

  return (
    <div>
      <h2>Machine Specification</h2>
      <NumberControl number={pulse} {...incrementDecrement(pulse, setPulse)}>
        Pulse:
      </NumberControl>
      <NumberControl
        number={ovenHeatingDuration}
        {...incrementDecrement(ovenHeatingDuration, setOvenHeatingDuration)}
      >
        Heating time:
      </NumberControl>
      <NumberControl
        number={ovenOverheatingDuration}
        {...incrementDecrement(
          ovenOverheatingDuration,
          setOvenOvereatingDuration
        )}
      >
        Overheating time:
      </NumberControl>
      <NumberControl
        number={ovenColdDuration}
        {...incrementDecrement(ovenColdDuration, setOvenColdDuration)}
      >
        Oven too cold time:
      </NumberControl>
      <div className="save-specs">
        <span>
          You need to restart the machine for the changes to take effect
        </span>
        <button onClick={saveMachineSpecifications}>Save</button>
      </div>
    </div>
  );
}
