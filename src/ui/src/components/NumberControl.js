export default function NumberControl({
  children,
  number,
  handleIncrement,
  handleDecrement,
}) {
  return (
    <div className="number-control horizontal-row">
      <label>{children}</label>
      <div style={{ display: "flex" }}>
        <button onClick={handleDecrement}>-</button>
        <div className="number">{number}</div>
        <button onClick={handleIncrement}>+</button>
      </div>
    </div>
  );
}
