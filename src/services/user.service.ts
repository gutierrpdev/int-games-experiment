import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { UserData } from "./user.model";

export type ApiResult<T> = { kind: "ok"; data: T } | ApiError;

export type ApiError =
  | { kind: "axios-error"; error: Error }
  | { kind: "http-error"; response: Response }
  | { kind: "parse-error"; errors: ParseError }
  | { kind: "unhandled-error"; error: Error };

export type ParseError = "InvalidJson";

/**
 * The Api is responsible for all communication with the Project's Apis and Backends. (GamGame)
 * Ideally, we should incorporate a schema validator to all requests to ensure that
 * the data that gets fetched from the endpoints strictly matches the structures defined
 * in the specification (which ought to be included as a JSON schema elsewhere in every
 * frontend/ backend side).
 */
export class UserService {
  public constructor(
    private apiUrl: string,
    private modelType: "regular" | "short"
  ) {} // constructor

  /**
   * @description Check whether a given username is already in use
   * @param username user's username
   */
  public async checkUsernameInUse(
    username: string
  ): Promise<ApiResult<boolean>> {
    const url = `${this.apiUrl}/user/inuse/${username}?modelType=${this.modelType}`;
    return getApiResult<boolean>(url);
  } // checkUsernameInUse

  public async updateUser(userData: UserData): Promise<ApiResult<UserData>> {
    const url = `${this.apiUrl}/user/update-user?modelType=${this.modelType}`;
    console.log("updating user");
    return patchApiResult<UserData, UserData>(url, userData);
  } // updateUser
}

/**
 * Run the given request and (TODO) parse the response according to a given schema
 */
async function getApiResult<T>(
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
async function patchApiResult<T, R>(
  url: string,
  payload: T,
  config: AxiosRequestConfig = {}
): Promise<ApiResult<R>> {
  let response: AxiosResponse<R>;
  try {
    // we attempt to perform a PATCH request to the specified url and save the
    // corresponding response within the response variable.
    response = await axios.patch<T, AxiosResponse<R>>(url, payload, config);
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
  return { kind: "ok", data: response.data };
}
