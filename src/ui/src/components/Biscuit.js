import React from "react";

export default function Biscuit({ isStatic, y, speed }) {
  let styles = {};
  let className = "biscuit static-biscuit";

  if (!isStatic) {
    styles = {
      left: `${y}%`,
      transition: `left ${speed}s linear, opacity 1s linear ${speed / 2}s`,
    };

    if (y >= 70) {
      styles.transform = "scale(1)";
      styles.opacity = 0;
    }

    className = "biscuit moving-biscuit";
  }

  return <div className={className} style={styles}></div>;
}
