import React from "react";

export default function Controls({
  handleStartButtonClick,
  handlePauseButtonClick,
  handleStopButtonClick,
  handleToggleHeatingElement,
  heatingElementOn,
  isPaused,
}) {
  return (
    <div className="controls-wrapper">
      <button onClick={handleStartButtonClick}>Start</button>
      <button onClick={handlePauseButtonClick}>
        {isPaused ? "Resume" : "Pause"}
      </button>
      <button onClick={handleStopButtonClick}>Stop</button>

      <button onClick={handleToggleHeatingElement}>
        Heating Element {heatingElementOn ? "On" : "Off"}
      </button>
    </div>
  );
}
