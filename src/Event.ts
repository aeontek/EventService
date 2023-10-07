import { v4 } from "uuid";
import Dictionary from "@aeontek/dictionary";

/**
 * @class
 * The Event class contains methods for creating and managing event handlers.
 */
export default class Event {
    private listeners: Dictionary<{
        raise: (data?: any, destination?: string) => any;
    }> = new Dictionary<{
        raise: (data?: any, destination?: string) => any;
    }>();

    /**
     * Adds a listener to the {@link Event}. If the {@link Event} is {@link raise}d,
     * then any registered listeners will be called.
     * @param {Function} callback The function to call when the {@link Event} is {@link raise}d.
     * @param {?string} id If provided, will act as the identifier for this event handler.
     * The id _must_ be uniquem or an error will be thrown.
     * @returns {string} Returns the unique identifier of the event handler, which
     * can be used to remove the listener.
     * @throws Invalid Identifier error if id is not unique
     */
    addListener = (
        callback: (data?: any, destination?: string) => any,
        id?: string
    ): string => {
        if (!id) {
            id = v4();
        }
        this.listeners.add(id, { raise: callback });
        return id;
    };

    /**
     * Removes a litener using its unique identifier
     * @param {string} id The unique identifier of the event to be removed.
     */
    removeListener = (id: string) => {
        this.listeners.remove(id);
    };

    /**
     * Raises the {@link Event}. When an {@link Event} is raised, all of its event handlers
     * are called.
     * @param {?any} data The data that is sent along to an event handler as an argument
     * @param {?string} destination If a destination is specified _and_ the service has been initalized
     * as either a server or a client, then this will direct the server to
     * forward this event to the correct service, given that the service is registered with the server.
     */
    raise = (data?: any, destination?: string) => {
        this.listeners.forEach((listener) => listener.raise(data, destination));
    };

    /**
     * Lists the unique identifiers of the current listeners.
     * @returns {string[]}
     */
    listListeners = () => {
        return this.listeners.getKeys();
    };
}
