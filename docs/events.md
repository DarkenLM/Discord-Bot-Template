# Events
Events are a collection of functions that are triggered once a specific event is called. As of v2.0.3, all events are tied to the Client class.
Current class list:
| Event             | Explanation                                            |
|:-----------------:|:------------------------------------------------------:|
| interactionCreate | Handles recieving and processing a Discord Interaction |
| messageCreate     | Handles recieving and processing a Discord Message     |
| ratelimit         | Handles Discord Ratelimits                             |
| ready             | Handles code after successfully logging in             |

## Defining an Event
To create an event, create a file withing the folder `plugins/events` with the name of the event to listen to and write the following template on it:  
```js
module.exports = async (bot, args...) => {

}
```

Where:
- `bot`: The bot instance.
- `args`: Any other parameters passed to the function on the event call.

## Event List
Any event added follows Node's [EventEmmiter Specifictation](https://nodejs.org/api/events.html), so a single event can have multiple listeners, and will be executed by the registration order.  
Overriding events is currently not possible and is not recommended.  
The usage of various listeners for the same event is also discouraged. A future Hook system is being considered on a future update, which will facilitate the addition of features to an already registered event.

## Custom message processing
As of v2.0.3, no Hook system is implemented, so if it is required to add message processing before a command is executed, the event on `core/events/mesageCreate.js` should be modified. No other core file should be modified unless absolutely necessary.