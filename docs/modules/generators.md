# General
This Module adds 4 generators (as of v.2.0.1):
- `uuid`:
  - `v4`: Generates an UUID v4.
- `makeID`: Generates an alphanumeric string with the desired length.
- `permissions`:
  - `ubot`: Generates a Use-Based One-Time Token for permissions within the bot.
  - `topt`: Generates a Time-Based One-Time Token for permissions within the bot.

## Use cases
Any system that requires an uuid, an alphanumeric ID or a permission token.
<span style="color:red">**WARNING:** Permission Tokens grant it's bearer the permission within the token. Do not use the permission generator unless it is really required.</span>

# Usage
This module is accessible via `bot.modules.generators`.  

- `uuid`:
  - `v4()`: Generates an uuid v4. No arguments required.
- `makeID(length)`: Generates an alphanumeric string with the desired length, where:
  - `length`: The length of the ID to be generated.
- `permissions`:
  - `ubot(level, uses, command)`: Generates a Use-Based One-Time Token for permissions within the bot, where:
    - `level`: The permission level (Integer) to grant to the bearer of the token.
    - `uses`: The number of uses before the token expires.
    - `command` (OPTIONAL): The command to restrict the token to.
  - `topt(level, time, command)`: Generates a Time-Based One-Time Token for permissions within the bot, where:
    - `level`: The permission level (Integer) to grant to the bearer of the token.
    - `time`: The time to count from the issuing date before the token expires.
    - `command` (OPTIONAL): The command to restrict the token to.