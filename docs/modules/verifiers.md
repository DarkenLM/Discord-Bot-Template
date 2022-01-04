# General
This Module contains functions to verify Permission Levels, Permission Tokens and Registry Command Arguments.

## Use Cases
Verification purposes.

# Usage
This module is accessible via `bot.modules.verifiers`.

- `permLevel(message)`: <span style="color:lightblue">(Internal System Call)</span> Gets the Permission Level from the user, where:
  - `message`: The user's message.
- `permToken(userID)`: Checks whenever the Permission Token of the user if valid (if any), where:
  - `userID`: The user's ID.
- `rcArguments(command)`: <span style="color:lightblue">(Internal System Call)</span> Checks whenever the arguments for a Message Command are valid, where:
  - `command`: The command to verify the arguments against.