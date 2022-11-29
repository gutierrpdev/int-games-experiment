import { UserService } from "./user.service";
import { AuthService } from "./auth.service";
import { EventService } from "./event.service";

export let userService: UserService;
export let authService: AuthService;
export let eventService: EventService;

/**
 * For the time being we fetch the relevant fields from the initialize services function provided here.
 * create-react-app enforces that all fields within the .env file start with REACT_APP_ (otheriwise
 * they are not included in process.env).
 */
export const initializeServices = () => {
  const apiUrl =
    process.env.REACT_APP_SERVER_API_URL ||
    "http://testinspice.padaonegames.com/api";

  const gamesMode = process.env.REACT_APP_GAMES_MODE;
  const modelType =
    gamesMode !== "regular" && gamesMode !== "short" ? "regular" : gamesMode;

  userService = new UserService(apiUrl, modelType);
  authService = new AuthService(apiUrl, modelType);
  eventService = new EventService(apiUrl, modelType);
}; // initializeServices
