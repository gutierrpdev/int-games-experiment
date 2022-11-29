import React, { useEffect, useState } from "react";

/**
 * Representation of a Promise state machine.
 * A request is set to idle if hook was declared with the triggerOnStart
 * parameter set to false, and will remain in that state until triggerRequest
 * is called on the hook's consumer side.
 */
export type AsyncProgress<ResultType = any, ErrorType = any> =
  | { kind: "idle" }
  | { kind: "running" }
  | { kind: "success"; result: ResultType }
  | { kind: "failure"; reason: ErrorType };

/**
 * Helper React Hook to wrap around the process of running an async function and
 * switching based on whether it's running, has succeeded, or has failed.
 *
 * @param promiseProducer - A function which can be called to kick-off the async
 *                          process and provide the resulting Promise.
 * @param triggerOnStart - A parameter specifying whether request should be triggered
 *                          at the beginning of this hook's lifecycle. Further requests
 *                          to provided promise producer may be retriggered via a helper
 *                          triggerRequest callback. @default true
 * @param deps - A list of dependencies whose changes will retrigger request. If deps has
 *               at least one element, triggerOnStart will be ignored.
 */
export function useAsyncRequest<ResultType, ErrorType>(
  promiseProducer: () => Promise<ResultType>,
  deps: React.DependencyList = [],
  triggerOnStart: boolean = true
): [AsyncProgress<ResultType, ErrorType | Error>, () => void] {
  const [state, setState] = useState<
    AsyncProgress<ResultType, ErrorType | Error>
  >({ kind: triggerOnStart ? "running" : "idle" });

  useEffect(() => {
    if (triggerOnStart || deps.length > 0) {
      triggerRequest();
    }
  }, deps);

  const triggerRequest = async () => {
    setState({ kind: "running" });
    try {
      promiseProducer()
        .then((result) => {
          setState({ kind: "success", result });
        })
        .catch((reason: ErrorType) => {
          setState({ kind: "failure", reason });
        });

      if (state.kind !== "running") {
        setState({ kind: "running" });
      }
    } catch (err) {
      setState({ kind: "failure", reason: err as Error });
    }
  };

  return [state, triggerRequest];
}
