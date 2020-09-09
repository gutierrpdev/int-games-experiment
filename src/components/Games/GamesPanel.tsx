import React from 'react';
import { Grid, Image, Button, Message} from 'semantic-ui-react';
import './styles.css';

interface GamesPanelProps {
  blekPlayed: boolean;
  edgePlayed: boolean;
  unpossiblePlayed: boolean;
  onGameSelect: (gameName: string) => void;
}

export const GamesPanel: React.FC<GamesPanelProps> = 
  ({ blekPlayed, edgePlayed, unpossiblePlayed, onGameSelect }) => 
{
  const information =[
    'Pulsa sobre "Empezar Juego!" bajo cada imagen para lanzarlo en tu navegador.',
    'Una vez abierto un juego, este debe ser completado "del tirón", evitando salir del mismo durante la partida. Cada actividad no debería llevar más de 15 minutos en ser completada.',
    'Al principio de cada juego aparecerá una sección de tutorial para familiarizarte con las mecánicas del mismo. Una vez terminado el tutorial, podrás continuar con el juego en sí y tendrás un tiempo límite para completar todos los niveles que puedas. Se registrarán datos relativos a tu interacción con el juego.',
    'Es necesario completar las tres pruebas para que los resultados sean válidos.',
    'No olvides hacer click en la sección de Preguntas del menú cuando acabes con los juegos. ¡Muchas gracias por tu colaboración!'
  ];
  return (
    <div>
      <Message
        icon='gamepad' size='big'
        header='Portal de juegos para la medida de la inteligencia'
        content='Bienvenidos. En esta página encontraréis una serie de juegos desarrollados por alumnos de la facultad de informática de la
        UCM como parte de un TFG sobre el estudio de la inteligencia por medio de videojuegos.'
      />

      <Message>
        <Message.Header>Instrucciones e Indicaciones</Message.Header>
        <Message.List items={information}/>
      </Message>

      <Grid celled centered columns={3}>
        <Grid.Column attached>
          <Image src='/img/edge.jpg' size='large' rounded centered/>
          <Button onClick={() => onGameSelect('edge')} 
            attached='bottom'
            color={edgePlayed?'green':'blue'}
          >
          {edgePlayed? 'Completado': 'Empezar juego!'}
          </Button>
        </Grid.Column>
        <Grid.Column attached>
          <Image src='/img/blek.jpg' size='large' rounded centered/>
          <Button onClick={() => onGameSelect('blek')} 
            attached='bottom'
            color={blekPlayed?'green':'blue'}
          >
          {blekPlayed?'Completado':'Empezar juego!'}
          </Button>
        </Grid.Column>
        <Grid.Column>
          <Image src='/img/unpossible.png' size='large' rounded centered/>
          <Button onClick={() => onGameSelect('unpossible')} 
            attached='bottom'
            color={unpossiblePlayed?'green':'blue'}
          >
          {unpossiblePlayed?'Completado':'Empezar juego!'}
          </Button>
        </Grid.Column>
      </Grid>
    </div>
  );

}