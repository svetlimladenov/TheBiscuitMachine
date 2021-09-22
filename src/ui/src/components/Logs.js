export default function Logs({ logs }) {
  const renderLogs = () => {
    return logs.map((log, idx) => {
      return (
        <div key={idx}>
          <span>{log.text}</span>
        </div>
      );
    });
  };

  return (
    <div className="logs">
      <h2>All messages:</h2>
      {renderLogs()}
    </div>
  );
}
