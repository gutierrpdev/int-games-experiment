export interface UserCredentials {
  /** Unique user name */
  userId: string;
  /** Password to be used by the user when authenticating. */
  password: string;
}

export interface NewUser extends UserCredentials {
  gender: string;
  age: number;
} // NewUser

export interface UserData {
  blekCompleted: boolean;
  edgeCompleted: boolean;
  unpossibleCompleted: boolean;
  knowsBlek: number;
  knowsEdge: number;
  knowsUnpossible: number;
  videogameExpertise: number;
  videogameHoursPerWeek: number;
  questionsCompleted: boolean;
  userId: string;
  age: number;
  gender: string;
}

export type SigninResponse =
  | (UserData & {
      /** JWT Token to be used by user in further requests to the API. */
      accessToken: string;
      /** Unique identifier of this activity in the collection where it is hosted. */
      _id: string;
    })
  | {
      accessToken: null;
      message?: string;
    };
