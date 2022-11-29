import React, { useContext } from "react";
import {
  Divider,
  Grid,
  Segment,
  Header,
  Icon,
  Message,
} from "semantic-ui-react";
import { Helmet } from "react-helmet";
import "./styles.css";

import { LoginPanel } from "./LoginPanel";
import { RegisterPanel } from "./RegisterPanel";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Auth/AuthStore";

export const Login = (): JSX.Element => {
  const { userData } = useContext(AuthContext);

  if (userData) {
    return <Navigate replace to={"/profile"} />;
  }

  return <LoginScreen />;
};

const LoginScreen = (): JSX.Element => {
  return (
    <div className="login">
      <Helmet>
        <title>Juegos TFG | Login</title>
      </Helmet>

      <Header as="h2" icon textAlign="center">
        <Icon name="chess" circular />
        <Header.Content>Juegos TFG</Header.Content>
      </Header>

      <Message size="large" warning>
        <Message.Header>Compatibilidad de los juegos</Message.Header>
        Esta plataforma está diseñada para ser usada SÓLO desde los siguientes
        navegadores web de PC:
        <Message.List>
          <Message.Item>
            En Windows/ Linux: Microsoft Edge, Chrome, Firefox
          </Message.Item>
          <Message.Item>En Mac: únicamente Firefox</Message.Item>
        </Message.List>
        Los juegos no funcionarán adecuadamente desde dispositivos móviles.
      </Message>

      <Segment placeholder className="login-body">
        <Grid
          columns={2}
          relaxed="very"
          stackable
          verticalAlign="middle"
          className="padded-login"
        >
          <Grid.Column>
            <LoginPanel />
          </Grid.Column>

          <Grid.Column>
            <RegisterPanel />
          </Grid.Column>
        </Grid>

        <Divider vertical>Ó</Divider>
      </Segment>
    </div>
  );
}; // LoginScreen
export default Login;
