## Classes

<dl>
<dt><a href="#Client">Client</a></dt>
<dd></dd>
<dt><a href="#Event">Event</a></dt>
<dd><p>The Event class contains methods for creating and managing event handlers.</p>
</dd>
<dt><a href="#EventService">EventService</a></dt>
<dd><p>Service that handles the creation and management of events.</p>
</dd>
<dt><a href="#Server">Server</a></dt>
<dd></dd>
</dl>

<a name="Client"></a>

## Client
**Kind**: global class  

* [Client](#Client)
    * [.run(port, serviceName, ip)](#Client+run)
    * [.send(message)](#Client+send)
    * [.stop()](#Client+stop)

<a name="Client+run"></a>

### client.run(port, serviceName, ip)
Initializes the EventService Client.

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| port | <code>number</code> | The port number to connect to. |
| serviceName | <code>string</code> | The name of the service. Must be unique, and must be registered with the server. |
| ip | <code>string</code> | If provided, the IP address of the WebSocket Server. If this is left null, then the Client will assume the WebSocket Server is hosted at localhost. |

<a name="Client+send"></a>

### client.send(message)
Sends a [Message](Message) to the
Server, which will route the message to its destination.

**Kind**: instance method of [<code>Client</code>](#Client)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Message</code> | The message object which contains the parameters needed to handle the message, as well as the message itself. |

<a name="Client+stop"></a>

### client.stop()
Stops the client

**Kind**: instance method of [<code>Client</code>](#Client)  
<a name="Event"></a>

## Event
The Event class contains methods for creating and managing event handlers.

**Kind**: global class  

* [Event](#Event)
    * [.addListener(callback, id)](#Event+addListener) ⇒ <code>string</code>
    * [.removeListener(id)](#Event+removeListener)
    * [.raise(data, destination)](#Event+raise)
    * [.listListeners()](#Event+listListeners) ⇒ <code>Array.&lt;string&gt;</code>

<a name="Event+addListener"></a>

### event.addListener(callback, id) ⇒ <code>string</code>
Adds a listener to the [Event](#Event). If the [Event](#Event) is [raise](raise)d,
then any registered listeners will be called.

**Kind**: instance method of [<code>Event</code>](#Event)  
**Returns**: <code>string</code> - Returns the unique identifier of the event handler, which
can be used to remove the listener.  
**Throws**:

- Invalid Identifier error if id is not unique


| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | The function to call when the [Event](#Event) is [raise](raise)d. |
| id | <code>string</code> | If provided, will act as the identifier for this event handler. The id _must_ be uniquem or an error will be thrown. |

<a name="Event+removeListener"></a>

### event.removeListener(id)
Removes a litener using its unique identifier

**Kind**: instance method of [<code>Event</code>](#Event)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The unique identifier of the event to be removed. |

<a name="Event+raise"></a>

### event.raise(data, destination)
Raises the [Event](#Event). When an [Event](#Event) is raised, all of its event handlers
are called.

**Kind**: instance method of [<code>Event</code>](#Event)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>any</code> | The data that is sent along to an event handler as an argument |
| destination | <code>string</code> | If a destination is specified _and_ the service has been initalized as either a server or a client, then this will direct the server to forward this event to the correct service, given that the service is registered with the server. |

<a name="Event+listListeners"></a>

### event.listListeners() ⇒ <code>Array.&lt;string&gt;</code>
Lists the unique identifiers of the current listeners.

**Kind**: instance method of [<code>Event</code>](#Event)  
<a name="EventService"></a>

## EventService
Service that handles the creation and management of events.

**Kind**: global class  
<a name="EventService.Event"></a>

### EventService.Event(id) ⇒ [<code>Event</code>](#Event)
Event factory.

If called with the id of an existing [Event](#Event), will
return that [Event](#Event). Otherwise, will create and return a
new [Event](#Event). If the service has been initalized as either a client
or server, this will also add an event handler for pushing event data
to the appropriate WebSockets.

**Kind**: static method of [<code>EventService</code>](#EventService)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The unique identifier for the event. |

<a name="Server"></a>

## Server
**Kind**: global class  

* [Server](#Server)
    * [.run(port)](#Server+run)
    * [.registerService(serviceName)](#Server+registerService)
    * [.send(message)](#Server+send)
    * [.stop()](#Server+stop)

<a name="Server+run"></a>

### server.run(port)
Runs the WebSocket Server, which listens for, processes, and emits the events that makes all the different
services communicate. In order for the EventService to function between applications, exactly one _must_
be functioning as a server.

**Kind**: instance method of [<code>Server</code>](#Server)  

| Param | Type | Description |
| --- | --- | --- |
| port | <code>number</code> | The port to host the Server on. |

<a name="Server+registerService"></a>

### server.registerService(serviceName)
Adds the given service name to the list of registered services.

**Kind**: instance method of [<code>Server</code>](#Server)  
**Throws**:

- "Invalid Identifier" if the entry already exists.


| Param | Type | Description |
| --- | --- | --- |
| serviceName | <code>string</code> | The name of the service being added. |

<a name="Server+send"></a>

### server.send(message)
Sends a [Message](Message) to the appropriate service, based on the
[Message.destination](Message.destination).

**Kind**: instance method of [<code>Server</code>](#Server)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>Message</code> | The message object which contains the parameters needed to handle the message, as well as the message itself. |

<a name="Server+stop"></a>

### server.stop()
Stops the server

**Kind**: instance method of [<code>Server</code>](#Server)  
