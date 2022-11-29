import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Message, InputOnChangeData } from "semantic-ui-react";

import { authService } from "../../services";
import { useAsyncRequest } from "../../services/useAsyncRequest";
import { AuthContext } from "../Auth/AuthStore";

interface LoginState {
  username_login: string;
  password_login: string;
  error_login: string;
  login_loading: boolean;
}

const defaultLoginState: LoginState = {
  username_login: "",
  password_login: "",
  error_login: "",
  login_loading: false,
};

export const LoginPanel = (): JSX.Element => {
  const [loginState, setLoginState] = useState<LoginState>(defaultLoginState);

  const { setTokenAndUpdateData } = useContext(AuthContext);

  const performLogin = async () => {
    return await authService.performUserLogin(
      loginState.username_login,
      loginState.password_login
    );
  }; // performLogin

  const [performLoginRequest, triggerRequest] = useAsyncRequest(
    performLogin,
    [],
    false
  );

  useEffect(() => {
    if (performLoginRequest.kind === "success") {
      if (performLoginRequest.result.kind === "http-error") {
        setLoginState((prevState) => ({
          ...prevState,
          error_login: "Incorrect password. Please try again.",
          login_loading: false,
        }));
      } else if (
        performLoginRequest.result.kind === "ok" &&
        performLoginRequest.result.data.accessToken
      ) {
        setLoginState((prevState) => ({
          ...prevState,
          error_login: "",
        }));
        setTokenAndUpdateData(performLoginRequest.result.data.accessToken);
        console.log(
          `Your token: ${performLoginRequest.result.data.accessToken}`
        );
      }
    } else if (performLoginRequest.kind === "running") {
      setLoginState((prev) => ({
        ...prev,
        error_login: "",
        login_loading: true,
      }));
    } else if (performLoginRequest.kind === "failure") {
      setLoginState((prev) => ({
        ...prev,
        error_login: performLoginRequest.reason as string,
        login_loading: false,
      }));
    } else {
      setLoginState((prev) => ({
        ...prev,
        login_loading: false,
      }));
    }
  }, [performLoginRequest]);

  function onSubmitLogin(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    // show error message if no username or password are provided.
    if (
      loginState.username_login.length < 1 ||
      loginState.password_login.length < 1
    ) {
      setLoginState((prevState) => ({
        ...prevState,
        error_login: "Must include a valid username and password",
      }));
      return;
    }

    triggerRequest();
  }

  function handleLoginChange(
    e: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) {
    if (data.name in loginState) {
      setLoginState((prevState) => ({
        ...prevState,
        [data.name]: data.value,
      }));
    }
  }

  return (
    <div>
      {loginState.error_login.length >= 1 && (
        <Message negative>
          <p>{loginState.error_login}</p>
        </Message>
      )}

      <Form loading={loginState.login_loading}>
        <Form.Input
          icon="user"
          iconPosition="left"
          label="Nombre de usuario"
          placeholder="Nombre de Usuario..."
          name="username_login"
          onChange={handleLoginChange}
          required
        />
        <Form.Input
          icon="lock"
          iconPosition="left"
          label="Contraseña"
          type="password"
          placeholder="Contraseña..."
          name="password_login"
          onChange={handleLoginChange}
          required
        />

        <Button content="Iniciar Sesión" primary onClick={onSubmitLogin} />
      </Form>
    </div>
  );
};
