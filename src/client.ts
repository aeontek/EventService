import { v4 } from "uuid";
import { Message } from "./message";
import { EventService } from "./EventService";

/**
 * @class Client
 * Creates a WebSocket Client for handling events across different applications. Requires a running {@link Server}.
 */
export class Client implements EventService {
    private _client: WebSocket;
    isRunning: boolean = true;

    /**
     * Initializes the EventService Client.
     * @param {number} port The port number to connect to.
     * @param {string} serviceName The name of the service. Must be unique, and must be registered with the server.
     * @param {?string} ip If provided, the IP address of the WebSocket Server. If this is left null, then
     * the Client will assume the WebSocket Server is hosted at localhost.
     */
    run = (port: number, serviceName?: string, ip?: string) => {
        try {
            const id = v4();
            serviceName = serviceName ?? v4();
            //ToDo: Add a method to automatically register new services with certificte matching.
            const WebSocket = this.isNode() ? require("ws") : globalThis.WebSocket;
            this._client = new WebSocket(`ws://${ip ?? "localhost"}:${port}?service=${serviceName}&id=${id}`);
            this._client.onopen = () => console.log("Connected to", `${ip ?? "localhost"}:${port}`);
            this._client.onerror = (err) => console.error;
            this._client.onclose = (ev) => console.log(ev.reason);
            this._client.onmessage = (message) => {
                try {
                    let msg: Message<any> = JSON.parse(message.data);
                    if (msg.destination === serviceName) {
                        EventService.Event(msg.eventId).raise(msg.payload);
                    }
                } catch (err) {
                    console.error(err);
                    console.log("Above error occurred while trying to process the following message:", message.data);
                }
            };
            setTimeout(() => {
                if (this._client.readyState !== 1) {
                    console.log(
                        "Failed to connect to WebSocket Server. Please ensure server is running and port number/ip address is correct."
                    );
                }
            }, 5000);
            this.isRunning = true;
        } catch (err) {
            console.error(err);
        }
    };

    private isNode = () => {
        return typeof process === "object" && typeof require === "function";
    };

    /**
     * Sends a {@link Message} to the
     * Server, which will route the message to its destination.
     * @param {Message} message The message object which contains the parameters
     * needed to handle the message, as well as the message itself.
     */
    public send = (message: Message<any>) => {
        let messageString = JSON.stringify(message);
        this._client.send(messageString);
    };

    /**
     * Stops the client
     */
    public stop = () => {
        this._client.close();
    };
}
