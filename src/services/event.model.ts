export interface IEvent {
  name: string;
  gameName: string;
  timestamp: number;
  userId: string;
  orderInSequence: number;
  buildName: string;
  parameters: [
    {
      name: string;
      value: string;
    }
  ];
}
