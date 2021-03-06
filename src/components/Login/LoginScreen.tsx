import React from 'react';
import { Divider, Grid, Segment, Header, Icon, Message } from 'semantic-ui-react'
import { Helmet } from 'react-helmet';
import './styles.css';

import { LoginPanel } from './LoginPanel';
import { RegisterPanel } from './RegisterPanel';
import { useHistory } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

export const Login: React.FC = () => {

  let history = useHistory();

  // what to do when user completes login/register
  function onActionComplete(userData: any) {
    localStorage.setItem('user', JSON.stringify(userData.user));
    localStorage.setItem('token', userData.token);
    localStorage.setItem('iagSession', 'ongoing');
    history.push('/profile');
  }

  if (isLoggedIn()) {
    history.push('/profile');
  }

  return (
    <div className="login">
      <Helmet>
        <title>Juegos TFG | Login</title>
      </Helmet>

      <Header as='h2' icon textAlign='center'>
        <Icon name='chess' circular />
        <Header.Content>Juegos TFG</Header.Content>
      </Header>

      <Message size='large' warning>
        <Message.Header>
        Compatibilidad de los juegos
        </Message.Header>
        Esta plataforma está diseñada para ser usada SÓLO desde los siguientes navegadores web de PC:
        <Message.List>
          <Message.Item>
            En Windows/ Linux: Microsoft Edge, Chrome, Firefox
          </Message.Item>
          <Message.Item>
            En Mac: únicamente Firefox
          </Message.Item>
        </Message.List>
        Los juegos no funcionarán adecuadamente desde dispositivos móviles.
      </Message>

      <Segment placeholder className="login-body">
        <Grid columns={2} relaxed='very' stackable verticalAlign='middle' className="padded-login">
          <Grid.Column >
            <LoginPanel onLoginComplete={onActionComplete} />
          </Grid.Column>

          <Grid.Column>
            <RegisterPanel onRegisterComplete={onActionComplete} />
          </Grid.Column>
        </Grid>

        <Divider vertical>Ó</Divider>
      </Segment>
    </div>
  );
}

const isLoggedIn = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  const decoded = jwt_decode(token) as any;
  const current_time = new Date().getTime() / 1000;
  if (current_time > decoded.exp) {
    /* expired */
    return false;
  }
  return true;
};

export default Login;