import React from "react";
import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthStore";

/**
 * Wrapper guard for a react router outlet to allow for automatic redirection to login
 * page whenever current authentication context becomes undefined.
 */
export const GuardedRoute = (): JSX.Element => {
  const { userData, accessToken, setTokenAndUpdateData } =
    useContext(AuthContext);

  // To know where to redirect the user to after successful logins.
  // This also acts as a state, meaning that this component will be rerendered
  // after every internal route change. We can use this to check the validity of
  // our current jwt token (expiration-wise) and perform a logout if it has expired already.
  const location = useLocation();

  if (userData && accessToken) {
    // we have a user and its access token, verify if it is still valid and, if so,
    // allow for the router outlet to be rendered. Otherwise, logout.

    // decoded token; atob decodes data stored in Base64. First part is always jwt payload.
    const decodedJwt = JSON.parse(atob(accessToken.split(".")[1]));

    console.log(decodedJwt);
    if (decodedJwt.exp * 1000 < Date.now()) {
      // token expired, logout and redirect to login page.
      setTokenAndUpdateData(undefined); // TODO: Encapsulate this in an action.
      return <Navigate to="/login" state={location.pathname} />;
    }

    // token is still valid, render outlet.
    return <Outlet />;
  }

  // no token to begin with, redirect to login with current state
  return <Navigate to="/login" state={location.pathname} />;
};

export default GuardedRoute;
