import { useState } from "react";
import api from "../shared/fetch";
import NumberControl from "./NumberControl";

export default function MachineSpecifications({
  userId,
  ovenHeatingDuration,
  ovenOverheatingDuration,
  ovenColdDurationASAASDFASDFASD,
}) {
  const [pulse, setPulse] = useState(1);
  const [heatingDuration, setHeatingDuration] = useState(1);
  const [overHeatingDuration, setOverHeatingDuration] = useState(1);
  const [ovenColdDuration, setOvenColdDuration] = useState(1);

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
      ovenHeatingDuration: "00:20:00",
      ovenOverheatingDuration: "00:20:00",
      ovenColdDuration: "00:20:00",
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
        number={heatingDuration}
        {...incrementDecrement(heatingDuration, setHeatingDuration)}
      >
        Heating time:
      </NumberControl>
      <NumberControl
        number={overHeatingDuration}
        {...incrementDecrement(overHeatingDuration, setOverHeatingDuration)}
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
