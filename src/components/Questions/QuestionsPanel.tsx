import React, { useState } from 'react';
import { Form, Message, Grid, Image, Button, Checkbox, CheckboxProps, ButtonProps, Input, Dropdown, DropdownProps } from 'semantic-ui-react'
import { API_BASE_URL } from '../../constants/apiConstants';

interface QuestionsPanelProps {
  onQuestionsSubmitted: () => void;
};

export const QuestionsPanel: React.FC<QuestionsPanelProps> = ({ onQuestionsSubmitted }) => {
  const [knowsBlek, setKnowsBlek] = useState<number>(0);
  const [knowsEdge, setKnowsEdge] = useState<number>(0);
  const [knowsUnpossible, setKnowsUnpossible] = useState<number>(0);
  const [videogameHoursPerWeek, setVideogameHoursPerWeek] = useState<number>(0);
  const [videogameExpertise, setVideogameExpertise] = useState<number>(0);

  const values = [0, 1, 2, 3, 4, 5, 6, 7];
  const hoursPerWeekValues = Array.from({ length: 41 }, (_, i) => i);

  function handleChange(e: React.FormEvent<HTMLInputElement>, data: CheckboxProps) {
    switch (data.name) {
      case 'knowsBlek': setKnowsBlek(data.value as number); break;
      case 'knowsEdge': setKnowsEdge(data.value as number); break;
      case 'knowsUnpossible': setKnowsUnpossible(data.value as number); break;
      case 'videogameExpertise': setVideogameExpertise(data.value as number); break;
    }
  }

  function handleHoursPerWeekChange(event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) {
    setVideogameHoursPerWeek(data.value as number);
  }

  function sendForm(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ButtonProps) {
    e.preventDefault();

    const body = {
      payload: {
        knowsBlek,
        knowsEdge,
        knowsUnpossible,
        videogameExpertise,
        videogameHoursPerWeek,
        questionsCompleted: true
      },
      token: localStorage.getItem('token')
    };

    // TODO: move to api
    fetch(API_BASE_URL + 'users/me', {
      method: 'PATCH',
      body: JSON.stringify(body),
      /*credentials: 'include',*/
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        onQuestionsSubmitted();
      })
      .catch(err => {
        console.log(err);
      });
  }

  return (
    <div>
      <Message
        icon='question circle outline' size='large'
        header='Preguntas Iniciales'
      />

      <div style={{ margin: 'auto', width: '57.5%', minWidth: '800px' }}>
        <Grid celled centered columns={1}>
          <Grid.Row>
            <Grid.Column>
              <label>¿Podrías por favor, decirme a lo largo del último año cuántas horas a la semana juegas a videojuegos?:</label>
              <p></p>
              <Form.Group inline>
                <Form.Field key='videogameHoursPerWeek'>
                  <Dropdown
                    label={'videogameHoursPerWeek'}
                    placeholder='Número de horas por semana...'
                    name='videogameHoursPerWeek'
                    value={videogameHoursPerWeek}
                    selection={true}
                    options={hoursPerWeekValues.map(elem => ({
                      key: elem,
                      text: elem,
                      value: elem
                    }))}
                    onChange={handleHoursPerWeekChange}
                  />
                </Form.Field>
              </Form.Group>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <label>¿Cuán experto/a te consideras?:</label>
              <p></p>
              <Form.Group inline>
                {
                  values.map(val =>
                    <Form.Field key={val}>
                      <Checkbox
                        radio
                        label={val}
                        name='videogameExpertise'
                        value={val}
                        checked={videogameExpertise === val}
                        onChange={handleChange}
                      />
                    </Form.Field>
                  )
                }
              </Form.Group>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column attached>
              <Image src='/img/blek.jpg' size="large" rounded floated='right' />
              <label>Valora tu nivel de experiencia con BLEK:</label>
              <p></p>
              <Form.Group inline>
                {
                  values.map(val =>
                    <Form.Field key={val}>
                      <Checkbox
                        radio
                        label={val}
                        name='knowsBlek'
                        value={val}
                        checked={knowsBlek === val}
                        onChange={handleChange}
                      />
                    </Form.Field>
                  )
                }
              </Form.Group>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column attached>
              <Image src='/img/edge.jpg' size="large" rounded floated='right' />
              <label>Valora tu nivel de experiencia con EDGE:</label>
              <p></p>
              <Form.Group inline>
                {
                  values.map(val =>
                    <Form.Field key={val}>
                      <Checkbox
                        radio
                        label={val}
                        name='knowsEdge'
                        value={val}
                        checked={knowsEdge === val}
                        onChange={handleChange}
                      />
                    </Form.Field>
                  )
                }
              </Form.Group>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column attached>
              <Image src='/img/unpossible.png' size="large" rounded floated='right' />
              <label>Valora tu nivel de experiencia con UNPOSSIBLE:</label>
              <p></p>
              <Form.Group inline>
                {
                  values.map(val =>
                    <Form.Field key={val}>
                      <Checkbox
                        radio
                        label={val}
                        name='knowsUnpossible'
                        value={val}
                        checked={knowsUnpossible === val}
                        onChange={handleChange}
                      />
                    </Form.Field>
                  )
                }
              </Form.Group>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Button
              attached='bottom'
              onClick={sendForm}
              color='blue'>
              Enviar
            </Button>
          </Grid.Row>
        </Grid>
      </div>
    </div >
  );
}