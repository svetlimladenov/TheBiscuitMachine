function now() {
  const now = new Date();
  return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
}

function addLogs(logs, message) {
  return {
    infoMessage: message,
    logs: [{ message, timestamp: now() }, ...logs],
  };
}

export { now, addLogs };
