import { ApiResult, postApiResult } from "./apiRequestUtils";
import { IEvent } from "./event.model";

/**
 * The Api is responsible for all communication with the Project's Apis and Backends. (GamGame)
 * Ideally, we should incorporate a schema validator to all requests to ensure that
 * the data that gets fetched from the endpoints strictly matches the structures defined
 * in the specification (which ought to be included as a JSON schema elsewhere in every
 * frontend/ backend side).
 */
export class EventService {
  public constructor(
    private apiUrl: string,
    private modelType: "regular" | "short"
  ) {} // constructor

  /**
   * @description Request the creation of a new event.
   * @param eventData object containing the event's data
   */
  public async sendEvent(eventData: IEvent): Promise<ApiResult<IEvent>> {
    const url = `${this.apiUrl}/events/event?modelType=${this.modelType}`;
    return postApiResult<IEvent, IEvent>(url, eventData);
  } // sendEvent
} // EventService
