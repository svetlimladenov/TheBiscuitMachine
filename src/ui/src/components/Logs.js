export default function Logs({ logs }) {
  const renderLogs = () => {
    return logs.map((log) => {
      return <span>{log.text}</span>;
    });
  };

  return (
    <div className="logs">
      <h2>All messages:</h2>
      {renderLogs()}
    </div>
  );
}
