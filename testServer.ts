import { Message } from "./src/message";
import { Server } from "./dist/EventService";

(async () => {
    const server = new Server();
    server.registerService("ApplicationService");
    server.run(5001);

    await new Promise((done) => setTimeout(done, 10000));

    const message: Message<any> = {
        id: "TEST",
        origin: "Server",
        eventId: "Launch",
        destination: "ApplicationService",
        payload: {
            command: "notepad.exe",
        },
    };

    console.log("sending message!");
    server.send(message);
    console.log("message sent!");
})();
