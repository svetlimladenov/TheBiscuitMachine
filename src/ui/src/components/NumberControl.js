export default function NumberControl({
  label,
  number,
  handleIncrement,
  handleDecrement,
}) {
  return (
    <div className="number-control horizontal-row">
      <label>{label}</label>
      <div style={{ display: "flex" }}>
        <button onClick={handleDecrement}>-</button>
        <div className="number">{number}</div>
        <button onClick={handleIncrement}>+</button>
      </div>
    </div>
  );
}
