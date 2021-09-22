import { useState } from "react";
import { useEffect } from "react";
import api from "../shared/fetch";

import NumberControl from "./NumberControl";

export default function User({ userId }) {
  const [userData, setData] = useState({ username: "Loading" });
  const [pulse, setPulse] = useState(1);
  const [heatingTime, setHeatingTime] = useState(1);
  const [overHeatingTime, setOverHeatingTime] = useState(1);
  const [ovenColdTime, setOvenColdTime] = useState(1);

  useEffect(() => {
    api.get(`/Users/${userId}`).then((user) => {
      console.log(user);
      setData(user.data);
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

  return (
    <div>
      <h2>Machine Specification</h2>
      <p>{userData.username}</p>
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
    </div>
  );
}
