import { Client } from "./Client";
import { Server } from "./Server";
import { v4 } from "uuid";
import { Message } from "./message";
import Event from "./Event";
import Dictionary from "@aeontek/dictionary";

export { Server, Client, Message };

/**
 * Service that handles the creation and management of events.
 */
export abstract class EventService {
    private static _events = new Dictionary<Event>();
    private static _serviceName: string;
    static _implementation?: EventService;

    constructor() {
        EventService._implementation = this;
    }

    abstract isRunning: boolean;
    abstract run(port: number, serviceName?: string, ip?: string): void;
    abstract send(message: Message<any>): void;
    abstract stop(): void;

    /**
     * Event factory.
     *
     * If called with the id of an existing {@link Event}, will
     * return that {@link Event}. Otherwise, will create and return a
     * new {@link Event}. If the service has been initalized as either a client
     * or server, this will also add an event handler for pushing event data
     * to the appropriate WebSockets.
     *
     * @param {string} id The unique identifier for the event.
     * @returns {Event}
     */
    public static Event = (id: string): Event => {
        let event = this._events.getById(id);
        if (!event) {
            EventService.generateNewEvent(id);
            event = this._events.getById(id);
        }
        return event;
    };

    /**
     * @private
     * Generates a new event. If the service has been initialized as either a client
     * or a server, then this also creates a default event handler to bounce events
     * to the appropriate WebSockets
     * @param {string} id The unique identifier for this event.
     */
    private static generateNewEvent = (id: string) => {
        let newEvent = new Event();
        if (this._implementation) {
            newEvent.addListener((data?: any, destination?: string) => {
                if (destination && destination !== EventService._serviceName) {
                    let message: Message<any> = {
                        id: v4(),
                        origin: EventService._serviceName,
                        eventId: id,
                        destination: destination,
                        payload: data,
                    };
                    EventService._implementation.send(message);
                }
            });
        }
        EventService._events.add(id, newEvent);
    };
}
