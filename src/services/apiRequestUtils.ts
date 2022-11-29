import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export type ApiResult<T> = { kind: "ok"; data: T } | ApiError; // ApiResult

export type ApiError =
  | { kind: "axios-error"; error: Error }
  | { kind: "http-error"; response: Response }
  | { kind: "parse-error"; errors: ParseError }
  | { kind: "unhandled-error"; error: Error }; // ApiError

export type ParseError = "InvalidJson" | string; // ParseError

/**
 * Run the given request and (TODO) parse the response according to a given schema
 */
export async function getApiResult<T>(
  url: string,
  config: AxiosRequestConfig = {}
): Promise<ApiResult<T>> {
  let response: AxiosResponse<T>;
  try {
    // we attempt to perform a GET request to the specified url and save the
    // corresponding response within the response variable.
    response = await axios.get<T>(url, config);
  } catch (error: any) {
    if (error.response) {
      // if the error has a response, then this means that server responded
      // with an error status (4xx, 5xx), which leads us to categorize it
      // as an http error
      return { kind: "http-error", response: error.response };
    } else if (error.request) {
      // if an error were to happen where we have a request but no response,
      // we can categorize it as an axios error (the request wasn't performed
      // correctly or the server did not respond at all).
      return { kind: "axios-error", error: error };
    } else {
      // in any other case, we categorize this as an unhandled error
      return { kind: "unhandled-error", error: error };
    }
  }

  // TODO: we should validate the data object here against our schema
  // As it is now, this is an unsafe type coercion
  return { kind: "ok", data: response.data as T };
}

/**
 * Run the given request and (TODO) parse the response according to a given schema.
 * T refers to data type for the payload, whereas R refers to expected response type
 */
export async function postApiResult<T, R>(
  url: string,
  payload: T,
  config: AxiosRequestConfig = {}
): Promise<ApiResult<R>> {
  let response: any;
  try {
    // we attempt to perform a POST request to the specified url and save the
    // corresponding response within the response variable.
    response = await axios.post<T, any>(url, payload, config);
    if ("data" in response) {
      response = response["data"];
    } else {
      return { kind: "parse-error", errors: "No data found" };
    }
  } catch (error: any) {
    if (error.response) {
      // if the error has a response, then this means that server responded
      // with an error status (4xx, 5xx), which leads us to categorize it
      // as an http error
      return { kind: "http-error", response: error.response };
    } else if (error.request) {
      // if an error were to happen where we have a request but no response,
      // we can categorize it as an axios error (the request wasn't performed
      // correctly or the server did not respond at all).
      return { kind: "axios-error", error: error };
    } else {
      // in any other case, we categorize this as an unhandled error
      return { kind: "unhandled-error", error: error };
    }
  }

  // TODO: we should validate the data object here against our schema
  // As it is now, this is an unsafe type coercion
  return { kind: "ok", data: response };
} // postApiResult

/**
 * Run the given request and (TODO) parse the response according to a given schema.
 * T refers to data type for the payload, whereas R refers to expected response type
 */
export async function putApiResult<T, R>(
  url: string,
  payload: T,
  config: AxiosRequestConfig = {}
): Promise<ApiResult<R>> {
  let response: any;
  try {
    // we attempt to perform a PUT request to the specified url and save the
    // corresponding response within the response variable.
    response = await axios.put<T, any>(url, payload, config);
    if ("data" in response) {
      response = response["data"];
    } else {
      return { kind: "parse-error", errors: "No data found" };
    }
  } catch (error: any) {
    if (error.response) {
      // if the error has a response, then this means that server responded
      // with an error status (4xx, 5xx), which leads us to categorize it
      // as an http error
      return { kind: "http-error", response: error.response };
    } else if (error.request) {
      // if an error were to happen where we have a request but no response,
      // we can categorize it as an axios error (the request wasn't performed
      // correctly or the server did not respond at all).
      return { kind: "axios-error", error: error };
    } else {
      // in any other case, we categorize this as an unhandled error
      return { kind: "unhandled-error", error: error };
    }
  }

  // TODO: we should validate the data object here against our schema
  // As it is now, this is an unsafe type coercion
  return { kind: "ok", data: response };
} // putApiResult

/**
 * Run the given request and (TODO) parse the response according to a given schema
 */
export async function deleteApiResult<T>(
  url: string,
  config: AxiosRequestConfig = {}
): Promise<ApiResult<T>> {
  let response: AxiosResponse<T>;
  try {
    // we attempt to perform a DELETE request to the specified url and save the
    // corresponding response within the response variable.
    response = await axios.delete<T>(url, config);
  } catch (error: any) {
    if (error.response) {
      // if the error has a response, then this means that server responded
      // with an error status (4xx, 5xx), which leads us to categorize it
      // as an http error
      return { kind: "http-error", response: error.response };
    } else if (error.request) {
      // if an error were to happen where we have a request but no response,
      // we can categorize it as an axios error (the request wasn't performed
      // correctly or the server did not respond at all).
      return { kind: "axios-error", error: error };
    } else {
      // in any other case, we categorize this as an unhandled error
      return { kind: "unhandled-error", error: error };
    }
  }

  // TODO: we should validate the data object here against our schema
  // As it is now, this is an unsafe type coercion
  return { kind: "ok", data: response.data as T };
}
