import React, { useContext, useState } from "react";
import Unity, { UnityContent } from "react-unity-webgl";
import { Progress, Container, Message } from "semantic-ui-react";
import { AuthContext } from "../Auth/AuthStore";
import { IEvent } from "../../services/event.model";
import { eventService } from "../../services";

interface UnityLoaderProps {
  gameName: string;
  buildName: string;
  onGameOver: () => void;
}

export const UnityLoader: React.FC<UnityLoaderProps> = ({
  gameName,
  buildName,
  onGameOver,
}) => {
  const { userData } = useContext(AuthContext);
  const [progression, setProgression] = useState<number>(0);

  const unityContent = new UnityContent(
    `${process.env.PUBLIC_URL}/builds/${gameName}/${process.env.REACT_APP_GAMES_MODE}/${buildName}.json`,
    `${process.env.PUBLIC_URL}/builds/${gameName}/${process.env.REACT_APP_GAMES_MODE}/UnityLoader.js`
  );

  unityContent.on("progress", (progress: number) => {
    setProgression(progress);
  });

  unityContent.on("LogEvent", async (eventJSON: string) => {
    const event: IEvent = JSON.parse(eventJSON);
    event.userId = userData?.userId ?? "";
    event.buildName = process.env.REACT_APP_GAMES_MODE ?? "regular";

    const res = await eventService.sendEvent(event);
    console.log(res);
  });

  unityContent.on("GameOver", () => {
    onGameOver();
  });

  unityContent.setFullscreen(false);

  return (
    <div>
      {progression < 0.95 && (
        <Progress
          percent={progression * 100}
          indicating={progression < 1}
          label={progression < 1 ? "Cargando juego" : "Carga Completada!"}
          progress="percent"
        />
      )}
      {progression > 0.85 && progression < 0.95 && (
        <Message
          icon="exclamation circle"
          size="small"
          header="Carga interrumpida"
          content="Si la carga del juego se queda congelada en 90% durante demasiado tiempo, recarga la página y vuelve a hacer click sobre este juego. Perdón por las molestias."
        />
      )}
      <Container height="auto">
        <Unity unityContent={unityContent} />
      </Container>
    </div>
  );
};
