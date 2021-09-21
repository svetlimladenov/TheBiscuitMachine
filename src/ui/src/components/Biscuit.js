import React from "react";

export default function Biscuit({ isStatic, y, speed, step }) {
  let styles = {};
  let className = "biscuit static-biscuit";

  if (!isStatic) {
    styles = {
      left: `${y}%`,
      transition: `all ${speed}s linear, top ${speed}s linear, opacity 1s linear`,
    };

    if (step === 0) {
      styles.opacity = 0;
    }

    if (step === 1) {
      styles.opacity = 1;
    }

    if (step === 4) {
      styles.opacity = 0;
    }

    className = "biscuit moving-biscuit";
  }

  return <div className={className} style={styles}></div>;
}
