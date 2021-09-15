import "./App.css";
import React from "react";

class Conveyor extends React.Component {
  constructor() {
    super();
    this.state = {
      conveyor: [{ name: "🍪" }, null, null, null],
      isRunning: false,
      step: 0,
    };

    this.handleStartConveyor = this.handleStartConveyor.bind(this);
  }

  handleStartConveyor() {
    this.setState({ isRunning: true });

    let interval = setInterval(() => {
      console.log(this.state.step);
      if (this.state.step === 4) {
        clearInterval(interval);
        return;
      }

      this.setState(({ step, conveyor }) => {
        let updateConveyor = Array(4).fill(null);
        updateConveyor[step] = { name: "🍪" };

        return {
          step: step + 1,
          conveyor: updateConveyor,
        };
      });
    }, 1000);
  }

  render() {
    const { conveyor } = this.state;
    return (
      <div>
        <div className="conveyor-wrapper">
          {conveyor.map((element, idx) => {
            const displayElement = element ? element.name : "";

            return (
              <div className={`${element} element`} key={idx}>
                {displayElement}
              </div>
            );
          })}
        </div>
        <button onClick={this.handleStartConveyor}>Start Conveyor</button>
      </div>
    );
  }
}

export default Conveyor;
