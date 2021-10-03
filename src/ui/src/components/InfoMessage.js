export default function InfoMessage({ message }) {
  return (
    <h1 className="info-message" style={{ color: message.color }}>
      {message.text}
    </h1>
  );
}
