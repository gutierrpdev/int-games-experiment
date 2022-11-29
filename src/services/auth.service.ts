import { ApiResult, getApiResult, postApiResult } from "./apiRequestUtils";
import {
  NewUser,
  SigninResponse,
  UserCredentials,
  UserData,
} from "./user.model";

/**
 * The Api is responsible for all communication with the Project's Apis and Backends. (GamGame)
 * Ideally, we should incorporate a schema validator to all requests to ensure that
 * the data that gets fetched from the endpoints strictly matches the structures defined
 * in the specification (which ought to be included as a JSON schema elsewhere in every
 * frontend/ backend side).
 */
export class AuthService {
  public constructor(
    private apiUrl: string,
    private modelType: "regular" | "short"
  ) {} // constructor

  /**
   * @description Request a JWT Token for a given user to perform further API calls to protected endpoints
   * @param userId user's username
   * @param password user's personal password
   */
  public async performUserLogin(
    userId: string,
    password: string
  ): Promise<ApiResult<SigninResponse>> {
    const url = `${this.apiUrl}/auth/signin?modelType=${this.modelType}`;
    const payload: UserCredentials = {
      userId,
      password,
    };
    return postApiResult<UserCredentials, SigninResponse>(url, payload);
  } // performUserLogin

  /**
   * @description Request the creation of a new user.
   * @param userData minimum information required to create a new user
   */
  public async performUserRegistration(
    userData: NewUser
  ): Promise<ApiResult<SigninResponse>> {
    const url = `${this.apiUrl}/auth/signup?modelType=${this.modelType}`;
    return postApiResult<UserCredentials, SigninResponse>(url, userData);
  } // performUserLogin

  public async retrieveCurrentUserData(): Promise<ApiResult<UserData>> {
    const url = `${this.apiUrl}/auth/me?modelType=${this.modelType}`;
    return getApiResult<UserData>(url);
  } // retrieveCurrentUserData
} // AuthService
