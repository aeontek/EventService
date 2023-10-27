/**
 * @class Message
 * @template T
 * Creates a Message object. This object is the expected
 * input and output of all Events that are passed through
 * the event service. If the EventService is initialized as
 * either a Client or Server, {@link EventService.generateNewEvent}
 * generates an event handler this message and adds it to all events.
 */
export interface Message<T> {
    /**
     * The unique identifier for this message. This may be valuable
     * for distinguising between iterations of a single event that
     * it called multiple times.
     */
    id: string;
    /**
     * Optional. The intended recipient service of this message.
     * If the service is not registered with the Server, the
     * message will be ignored. If this argument is omitted, it
     * is assumed that the {@link Event} is meant to be handled locally.
     */
    destination?: string;
    /**
     * The service that the {@link Event} originated from.
     */
    origin: string;
    /**
     * An identifier for the {@link Event}. While the identifier must
     * be unique for Events on a service, different services may share
     * Event identifiers. It is also possible for a single event to
     * be raised multiple times.
     */
    eventId: string;
    /**
     * Optional. If provided, this generic ({@link T}) object will
     * be passed to events at the destination service as the data
     * for event handlers.
     */
    payload?: T;
}

//For Docs:

/**
 * @interface Message
 * @template T
 * Creates a Message object. This object is the expected
 * input and output of all Events that are passed through
 * the event service. If the EventService is initialized as
 * either a Client or Server, {@link EventService.generateNewEvent}
 * generates an event handler this message and adds it to all events.
 * @property {string} id
 * The unique identifier for this message. This may be valuable
 * for distinguising between iterations of a single event that
 * it called multiple times.
 * @property {string | undefined} destination
 * Optional. The intended recipient service of this message.
 * If the service is not registered with the Server, the
 * message will be ignored. If this argument is omitted, it
 * is assumed that the {@link Event} is meant to be handled locally.
 * @property {string} origin
 * The service that the {@link Event} originated from.
 * @property {string} eventId
 * An identifier for the {@link Event}. While the identifier must
 * be unique for Events on a service, different services may share
 * Event identifiers. It is also possible for a single event to
 * be raised multiple times.
 * @property {T} payload
 * Optional. If provided, this generic ({@link T}) object will
 * be passed to events at the destination service as the data
 * for event handlers.
 */
