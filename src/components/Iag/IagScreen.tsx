import React, { useContext } from "react";
import { Menu, Icon } from "semantic-ui-react";
import { Helmet } from "react-helmet";
import { GamesPanel } from "../Games/GamesPanel";

import { QuestionsPanel } from "../Questions/QuestionsPanel";
import { UnityLoader } from "../UnityLoader/UnityLoader";
import { YoutubeVideo } from "../YoutubeVideo/YoutubeVideo";
import {
  Route,
  useNavigate,
  Link,
  useLocation,
  Navigate,
  Routes,
} from "react-router-dom";

import { About } from "./About";
import { AuthContext } from "../Auth/AuthStore";

export const Iag = (): JSX.Element => {
  const { userData, setTokenAndUpdateData, updateUserData } =
    useContext(AuthContext);

  // use history
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (!userData) {
    return <Navigate replace to={"/login"} />;
  } else if (userData.questionsCompleted && pathname.includes("/questions")) {
    return <Navigate replace to={"./games"} />;
  } else if (!userData.questionsCompleted && !pathname.includes("/questions")) {
    return <Navigate replace to={"./questions"} />;
  }

  function handleLogout() {
    setTokenAndUpdateData(undefined);
  }

  function onGameSelect(gameName: string) {
    gameName === "blek" ? navigate("./blek-video") : navigate("./" + gameName);
  }

  function onGameOver(gameName: string) {
    if (!userData) return;

    updateUserData({
      ...userData,
      blekCompleted: userData?.blekCompleted || gameName === "blek",
      unpossibleCompleted:
        userData?.unpossibleCompleted || gameName === "unpossible",
      edgeCompleted: userData?.edgeCompleted || gameName === "edge",
    });
    navigate("./games");
  }

  return (
    <div>
      <Helmet>
        <title>Juegos TFG</title>
      </Helmet>

      <Menu>
        {/* Only display games link if not in questions screen */}
        {!pathname.includes("/questions") && (
          <>
            <Link to="./games">
              <Menu.Item name="games">
                <Icon name="gamepad" />
                Juegos
              </Menu.Item>
            </Link>

            <Link to="./about">
              <Menu.Item name="Contacto">
                <Icon name="question" />
                Contacto
              </Menu.Item>
            </Link>
          </>
        )}

        <Menu.Menu position="right">
          <Menu.Item name="logout" onClick={() => handleLogout()}>
            <Icon name="power" />
            Cerrar Sesión
          </Menu.Item>
        </Menu.Menu>
      </Menu>

      <Routes>
        <Route
          path="/games"
          element={
            <GamesPanel
              blekCompleted={userData.blekCompleted}
              unpossibleCompleted={userData.unpossibleCompleted}
              edgeCompleted={userData.edgeCompleted}
              onGameSelect={onGameSelect}
            />
          }
        />
        <Route
          path="/blek-video"
          element={
            <YoutubeVideo
              videoId="N5pWe61TzPA"
              onVideoEnd={() => navigate("./blek")}
            />
          }
        />
        <Route
          path="/blek"
          element={
            <UnityLoader
              buildName="BlekWeb"
              gameName="Blek"
              onGameOver={() => onGameOver("blek")}
            />
          }
        />
        <Route
          path="/edge"
          element={
            <UnityLoader
              buildName="Edge Web"
              gameName="Edge"
              onGameOver={() => onGameOver("edge")}
            />
          }
        />
        <Route
          path="/unpossible"
          element={
            <UnityLoader
              buildName="Build"
              gameName="Unpossible"
              onGameOver={() => onGameOver("unpossible")}
            />
          }
        />
        <Route
          path="/questions"
          element={
            <QuestionsPanel
              userData={userData}
              updateUserData={updateUserData}
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate replace to={"./games"} />} />
      </Routes>
    </div>
  );
};
