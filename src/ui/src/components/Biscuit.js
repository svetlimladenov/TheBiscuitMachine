import React from "react";

export default function Biscuit({ y, speed }) {
  const styles = {
    left: `${y}%`,
    transition: `left ${speed}s linear`,
  };

  return <div className="biscuit" style={styles}></div>;
}
