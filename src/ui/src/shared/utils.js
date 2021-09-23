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

function renderValidationErrors(errors) {
  return Object.keys(errors).map((key, idx) => {
    return (
      <div key={key}>
        {errors[key].map((innerError, idx) => {
          return (
            <p className="validation-error" key={idx}>
              {innerError}
            </p>
          );
        })}
      </div>
    );
  });
}

export { now, addLogs, renderValidationErrors };
