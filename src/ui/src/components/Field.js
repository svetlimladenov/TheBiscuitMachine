import React from "react";

const Field = React.forwardRef(({ label, type }, ref) => {
  return (
    <div className="input-field">
      <label>{label}</label>
      <input ref={ref} type={type} />
    </div>
  );
});

export default Field;
