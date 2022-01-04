# Utils
Utilities, or Utils for short, are code collections that are invoked by system calls without the Bot class as middleware.  
All user-defined code should be defined using the Bot class as a middleware, to avoid conflicts throughout the system.

As of v2.0.3 there are 4 utils:

## Error Handler
The Error Handler contains two handlers, used to catch any `uncaughtExceptions` and `unhandledRejections`, preventing the process from crashing if an error is not caught.

## Initializer
The Initializer is called at startup and is responsible to load the utils and other required data and boot up the bot.

## Loader
The Loader is called by the [`Initializer`](#initializer) and is responsible for the Bot's Boot sequence, loading the Configuration, the Bases, the Modules, the Database, the Events, the Commands and registering the Interactions, in that order.

## Logger
The Logger is the Logging utility of the bot. It's the only Util exposed to the user, and can be accessed through the global namespace by simply calling `logger`.  
It exposes the following methods:
- `success(message, obj?)`: Logs a success message.
- `info(message, obj?)`: Logs an information message.
- `warn(message, obj)`: Logs a warning message.
- `error(message, obj)`: Logs an error message.
- `debug(message, obj?)`: Logs a debug message. (Only available if `bot.config.environment` is set to `dev`)

All methods have the same parameters:
- `message`: The message to be logged.
- `obj`: Optional. Provides an object to be logged after the string.