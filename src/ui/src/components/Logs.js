export default function Logs({ logs }) {
  const renderLogs = () => {
    return logs.map(({ message, timestamp }, idx) => {
      return (
        <div key={idx}>
          <span>
            {timestamp} : {message.text}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="logs">
      <h2>Logs :</h2>
      {renderLogs()}
    </div>
  );
}
