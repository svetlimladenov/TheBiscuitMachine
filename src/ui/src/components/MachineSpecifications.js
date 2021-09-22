import { useState } from "react";

import NumberControl from "./NumberControl";

export default function User({
  ovenHeatingDuration,
  ovenOverheatingDuration,
  ovenColdDuration,
}) {
  const [pulse, setPulse] = useState(1);
  const [heatingTime, setHeatingTime] = useState(1);
  const [overHeatingTime, setOverHeatingTime] = useState(1);
  const [ovenColdTime, setOvenColdTime] = useState(1);

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

  return (
    <div>
      <h2>Machine Specification</h2>
      <NumberControl number={pulse} {...incrementDecrement(pulse, setPulse)}>
        Pulse:
      </NumberControl>
      <NumberControl
        number={heatingTime}
        {...incrementDecrement(heatingTime, setHeatingTime)}
      >
        Heating time:
      </NumberControl>
      <NumberControl
        number={overHeatingTime}
        {...incrementDecrement(overHeatingTime, setOverHeatingTime)}
      >
        Overheating time:
      </NumberControl>
      <NumberControl
        number={ovenColdTime}
        {...incrementDecrement(ovenColdTime, setOvenColdTime)}
      >
        Oven too cold time:
      </NumberControl>
      <div className="save-specs">
        <span>
          You need to restart the machine for the changes to take effect
        </span>
        <button>Save</button>
      </div>
    </div>
  );
}
