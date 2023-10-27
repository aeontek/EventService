import Dictionary from "@aeontek/dictionary";
import WebSocketServer, { RawData } from "ws";
import { Message } from "./message";
import { EventService } from "./EventService";

interface WebSocketClient extends WebSocketServer.WebSocket {
    id?: string;
    service?: string;
}

/**
 * @class Server
 * Creates a WebSocket Server for the managing of events across multiple applications. Allows connections only from {@link Client}s that have been registered using server.registerService(serviceName).
 */
export class Server implements EventService {
    private _wsServer: WebSocketServer.Server;
    private _clients: Dictionary<WebSocketClient>;
    private _registeredServices: Dictionary<string>;
    isRunning: boolean = false;
    static ServerName = "Server";

    constructor() {
        this._clients = new Dictionary<WebSocketClient>();
        this._registeredServices = new Dictionary<string>();
        this.registerService(Server.ServerName);
    }

    /**
     * Runs the WebSocket Server, which listens for, processes, and emits the events that makes all the different
     * services communicate. In order for the EventService to function between applications, exactly one _must_
     * be functioning as a server.
     * @param {number} port The port to host the Server on.
     */
    run = (port: number) => {
        try {
            const http = require("http");
            const httpServer = http.createServer();
            this._wsServer = new WebSocketServer.Server({
                server: httpServer,
            });
            this._wsServer.on("connection", (ws, req) => this.handleConnection(ws, req));
            httpServer.listen(port, () => {
                console.log(`WebSocket server started on port ${port}`);
            });
            this.isRunning = true;
        } catch (err) {
            console.error(err);
        }
    };

    /**
     * Adds the given service name to the list of registered services.
     * @param {string} serviceName - The name of the service being added.
     * @throws "Invalid Identifier" if the entry already exists.
     */
    registerService = (serviceName: string) => {
        this._registeredServices.add(serviceName, serviceName);
    };

    /**
     * @private
     * If the EventService is initialized as a Server, this handles the connection of Clients,
     * and ensures that they are valid.
     */
    private handleConnection = (ws: WebSocketClient, req: any) => {
        ws.on("message", (rawMessage: RawData) => this.handleServerMessage(rawMessage));
        const parse = require("url").parse;
        let identifiers = parse(req.url!, true).query;
        if (!this.ValidateClientIdentifiers(identifiers)) return;
        ws.id = identifiers.id as string;
        ws.service = identifiers.service as string;
        this.RegisterClient(ws);
    };

    /**
     * @private
     * If the EventService is initialized as a Server, this handles messages from Clients,
     * and ensures that they are routed appropriately.
     */
    private handleServerMessage = (rawMessage: RawData) => {
        try {
            let message: Message<any> = JSON.parse(rawMessage.toString());
            if (message.destination && message.destination !== this._registeredServices.Server) {
                this.send(message);
            } else if (message.destination === this._registeredServices.Server) {
                message.destination = undefined;
                EventService.Event(message.eventId).raise(message.payload);
            }
        } catch (err) {
            console.error(err);
            console.log("Above error occurred while trying to process the following message:", rawMessage.toString());
        }
    };

    /**
     * @private
     * If the EventService is initialized as a Server, this checks to ensure that Clients
     * are configured properly, and that they have been registered to the Server.
     */
    private ValidateClientIdentifiers = (identifiers: { id?: string; service?: string }): boolean => {
        if (!identifiers.service || !identifiers.id) {
            return false;
        }

        let match = false;
        Object.getOwnPropertyNames(this._registeredServices).map((name) => {
            if (this._registeredServices[name] === (identifiers.service as string)) {
                match = true;
            }
        });

        if (!match) {
            throw `${identifiers.service} is not a registered service.`;
        }
        return true;
    };

    /**
     * @private
     *If the EventService is initialized as a Server, this registers the Client connection and ensures that it is using a unique identifier.
     */
    private RegisterClient = (ws: WebSocketClient) => {
        let service = this._clients.getById(ws.service!);
        if (service) {
            ws.close(409, "A service is already registered under this name. Services must have a unique identifier.");
            return;
        }
        this._clients.add(ws.service!, ws);
        ws.onclose = (ev) => {
            console.log(`${ws.service!} connection closed with error code ${ev.code} and reason ${ev.reason}.`);
            this._clients.remove(ws.service!);
        };
        console.log("Connected to ", ws.service);
    };

    /**
     * Sends a {@link Message} to the appropriate service, based on the
     * {@link Message.destination}.
     * @param {Message} message The message object which contains the parameters
     * needed to handle the message, as well as the message itself.
     */
    public send = (message: Message<any>) => {
        let messageString = JSON.stringify(message);
        if (message.destination) {
            let service = this._clients.getById(message.destination);
            if (service) {
                service.send(messageString, (err) => err && console.error(err));
            }
        } else if (message.destination === "all") {
            this._clients.forEach((service) => service.send(messageString, (err) => err && console.error(err)));
        }
    };

    /**
     * Stops the server
     */
    public stop = () => {
        this._wsServer.close((err) => (err ? console.error(err) : true));
    };
}
