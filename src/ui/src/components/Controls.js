import React from "react";

export default function Controls({
  handleStartButtonClick,
  handlePauseButtonClick,
  handleStopButtonClick,
  handleToggleHeatingElement,
  heatingElementOn,
}) {
  return (
    <div className="controls-wrapper">
      <button onClick={handleStartButtonClick}>Start</button>
      <button onClick={handlePauseButtonClick}>Pause</button>
      <button onClick={handleStopButtonClick}>Stop</button>

      <button onClick={handleToggleHeatingElement}>
        Heating Element {heatingElementOn ? "On" : "Off"}
      </button>
    </div>
  );
}
