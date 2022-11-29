import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { authService, userService } from "../../services";
import { UserData } from "../../services/user.model";

/**
 * This component provides access to a wrapping context that
 * contains information relative to the currently authenticated
 * user as well as a helper method to access and modify this information
 * dynamically from any child by using the useContext hook from a child component.
 */
interface IAuthContext {
  /** Data object for currently authenticated user (or undefined if not authenticated) */
  userData: UserData | undefined;
  /** API JWT token for current session */
  accessToken: string | undefined;
  /** Helper method to modify currently authenticated user token (data and access token) from useContext hook */
  setTokenAndUpdateData: (token: string | undefined | null) => void;
  /** Helper method to request an update on the currently authenticated user data from useContext hook */
  updateUserData: (data: UserData) => void;
} // IAuthContext

const AuthContext = React.createContext<IAuthContext>({
  userData: undefined,
  accessToken: undefined,
  setTokenAndUpdateData: (_) => {},
  updateUserData: (_) => {},
}); // AuthContext

interface AuthStoreState {
  /** Data object for currently authenticated user (or undefined if not authenticated) */
  userData: UserData | undefined;
  /** API JWT token for current session */
  accessToken: string | undefined;
} // AuthStoreState

/**
 * Wrapper over an AuthContext provider to provide helper methods and state management for user handling operations to children.
 * Preserves authentication data between sessions by keeping it within a localStorage variable.
 */
const AuthStore: React.FC = ({ children }) => {
  // Store State (user data and access token)
  const [state, setState] = useState<AuthStoreState>({
    userData: undefined,
    accessToken: undefined,
  });

  // We wrap this function in a useCallback so that it doesn't trigger
  // a re-render every time that the useEffect is triggered.
  /**
   * Validate provided token by performing a ```retrieveCurrentUserData``` request
   * against the corresponding authentication endpoint on server. If token is valid,
   * then this call will result in the default axios' Authorization header being set
   * to the token in Bearer-scheme format and the state of the store being updated with
   * both the provided token and the user data retrieved from server. In any other case,
   * state will be reverted to ```userData``` and ```accessToken``` being set to ```undefined``` and
   * the default axios' Authorization header being set to ```null```.
   *
   * @param token Token to use to retrieve current user's data.
   */
  const validateTokenAndUpdateUserData = useCallback(
    async (token: string | null | undefined) => {
      if (!token) {
        // remove axios default Authorization header and reset state to undefined fields.
        axios.defaults.headers.common["Authorization"] = null;
        setAuthState({ userData: undefined, accessToken: undefined });
        return;
      }

      // assign token to axios default header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // try to retrieve current user from assigned token
      try {
        const response = await authService.retrieveCurrentUserData();

        // Only set full user data if a successful response is received from server.
        if (response.kind === "ok" && response.data) {
          console.log(response.data);
          setAuthState({
            userData: response.data,
            accessToken: token, // token was valid
          });
        } else {
          // request was successful, but there wasn't a proper user,
          // meaning that our token was not valid. Remove authorization headers
          // and any previous user Data
          setAuthState({ userData: undefined, accessToken: undefined });
          axios.defaults.headers.common["Authorization"] = null;
        }
      } catch (err) {
        // There was an error while fetching user data.
        // remove all user data, tokens, and authorization headers.
        setAuthState({ userData: undefined, accessToken: undefined });
        axios.defaults.headers.common["Authorization"] = null;
      }
    },
    []
  ); // validateTokenAndUpdateUserData;

  const updateUserData = useCallback(
    async (data: UserData) => {
      if (!data || !state.accessToken) return;

      // try to perform an update request to server
      try {
        const response = await userService.updateUser(data);

        // Only set full user data if a successful response is received from server.
        if (response.kind === "ok" && response.data) {
          setAuthState({
            userData: response.data,
            accessToken: state.accessToken,
          });
        } else {
          // request was successful, but something seems to have gone wrong.
          // Remove authorization headers and any previous user Data
          setAuthState({ userData: undefined, accessToken: undefined });
          axios.defaults.headers.common["Authorization"] = null;
        }
      } catch (err) {
        // There was an error while fetching user data.
        // remove all user data, tokens, and authorization headers.
        setAuthState({ userData: undefined, accessToken: undefined });
        axios.defaults.headers.common["Authorization"] = null;
      }
    },
    [state]
  ); // updateUserData;

  useEffect(() => {
    // Look for previously existing tokens in local storage and attempt to fetch
    // current user data from them.
    const prevToken = localStorage.getItem("accessToken");
    validateTokenAndUpdateUserData(prevToken);
  }, [validateTokenAndUpdateUserData]);

  /**
   * Set a session token/data in authentication context and save it to browser's localStorage.
   * If token is set to undefined, remove access token from localStorage entries.
   * @param token
   */
  const setAuthState = (newState: AuthStoreState) => {
    const { accessToken } = newState;

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    } else {
      localStorage.removeItem("accessToken");
    }
    setState(newState);
  }; // setAuthState

  return (
    <AuthContext.Provider
      value={{
        userData: state.userData,
        accessToken: state.accessToken,
        setTokenAndUpdateData: validateTokenAndUpdateUserData,
        updateUserData: updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; // AuthStore

export { AuthStore, AuthContext };
