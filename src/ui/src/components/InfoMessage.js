export default function InfoMessage({ text, color }) {
  return (
    <h1 className="info-message" style={{ color: color }}>
      {text}
    </h1>
  );
}
