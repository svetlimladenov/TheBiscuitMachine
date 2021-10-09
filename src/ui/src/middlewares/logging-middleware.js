// monkey patching

export const patchStoreToAddLogging = (store) => {
  const next = store.dispatch;
  store.dispatch = function dispatchAndLog(action) {
    console.log("Dispatching", action);
    next(action);
    console.log("Next state", store.getState());
  };
};

export const patchStoreToAddCrashRepoting = (store) => {
  const next = store.dispatch;
  store.dispatch = function dispatchAndReportErrors(action) {
    try {
      next(action);
    } catch (err) {
      console.error(err);
      // Report to some server...

      throw err;
    }
  };
};

// hiding monkeypatching

export const logging = (store) => {
  const next = store.dispatch;

  return function dispatchAndLog(action) {
    console.log("Dispatching", action);
    let result = next(action);
    console.log("Next state", store.getState());
    return result;
  };
};

export const crashReporter = (store) => {
  const next = store.dispatch;
  return function dispatchAndReportCrashes(action) {
    try {
      let result = next(action);
      return result;
    } catch (err) {
      console.error(err);
      // Report to some server...

      throw err;
    }
  };
};

// hiding monkey patching
export const applyMiddlewareByMonkeypatching = (store, middlewares) => {
  middlewares = middlewares.slice();
  middlewares.reverse();

  middlewares.forEach((middleware) => (store.dispatch = middleware(store)));
};

export const loggingMiddleware = (store) => (next) => (action) => {
  console.log("Dispatching", action);
  let result = next(action);
  console.log("next state", store.getState());
  return result;
};

function loggerMiddleware2(store) {
  return function wrapDispatchToAddLogging(next) {
    return function dispatchAndLog(action) {
      console.log("dispatching", action);
      let result = next(action);
      console.log("next state", store.getState());
      return result;
    };
  };
}

// That's *not* Redux API.
export const applyMiddlewareFake = (store, middlewares) => {
  middlewares = middlewares.slice();
  middlewares.reverse();
  let dispatch = store.dispatch;
  middlewares.forEach((middleware) => {
    dispatch = middleware(store)(dispatch);
  });
  return Object.assign({}, store, { dispatch });
};

export const crashReporterMiddleware = (store) => (next) => (action) => {
  try {
    return next(action);
  } catch (err) {
    console.error("Caught an exception!", err);
    // Send to some log server
    throw err;
  }
};
