import React from "react";
import TimeField from "react-simple-timefield";

const TimeInput = React.forwardRef(({ label, time }, ref) => {
  return (
    <div className="time-input horizontal-row">
      <label>{label}</label>
      <TimeField
        showSeconds
        value={time}
        inputRef={ref}
        style={{
          border: "2px solid #666",
          width: "100px",
          padding: "5px 8px",
          borderRadius: "3px",
          backgroundColor: "#140f0f36",
          color: "white",
          outline: "none",
        }}
      />
    </div>
  );
});

export default TimeInput;
