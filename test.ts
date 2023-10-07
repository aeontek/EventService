import { it } from "node:test";
import { EventService } from "./src/EventService";
import assert from "node:assert";

it("Can create an event handler", () => {
    assert.doesNotThrow(() => EventService.Event("test"));
});

it("Can add and call an eventhandler", async () => {
    let val = "It worked!";
    EventService.Event("test").addListener((x) => {
        assert.deepEqual(x, val);
    });
    EventService.Event("test").raise(val);
});
