export default function NumberControl({
  children,
  number,
  handleIncrement,
  handleDecrement,
}) {
  return (
    <div className="number-control">
      <label>{children}</label>
      <button onClick={handleDecrement}>-</button>
      <div className="number">{number}</div>
      <button onClick={handleIncrement}>+</button>
    </div>
  );
}
