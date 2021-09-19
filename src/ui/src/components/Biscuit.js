import React from "react";

export default function Biscuit({ isStatic, y, speed }) {
  let styles = {};
  let className = "biscuit static-biscuit";

  if (!isStatic) {
    styles = {
      left: `${y}%`,
      transition: `left ${speed}s linear`,
    };
    className = "biscuit moving-biscuit";
  }

  return <div className={className} style={styles}></div>;
}
