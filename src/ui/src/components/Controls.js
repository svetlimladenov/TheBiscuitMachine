import React from "react";

export default function Controls({
  handleStartButtonClick,
  handlePauseButtonClick,
  handleStopButtonClick,
  handleToggleHeatingElement,
  heatingElementOn,
}) {
  return (
    <div>
      <button onClick={handleStartButtonClick}>Start</button>
      <button onClick={handlePauseButtonClick}>Pause</button>
      <button onClick={handleStopButtonClick}>Stop</button>
      Heating element:
      <button onClick={handleToggleHeatingElement}>
        {heatingElementOn ? "On" : "Off"}
      </button>
    </div>
  );
}
