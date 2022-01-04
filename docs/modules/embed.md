<style>
.square {
  position: relative;
  height: 20px;
  width: 20px;
  overflow: auto;
  right:-7px
}
</style>

# General
This module was created with the intent of simplifying the embed creation, by providing a single embed creation method (as of v2.0.1).

## Use cases
Any operation that requires a Discord Message Embed.

# Usage
This module is accessible via `bot.modules.embed`.  

To create an embed use:
- `create(message, description, type, overrides)`, where
  - `message`: The message object (for interactions, provide an object with `{author: interaction.user, member: interaction.member}`)
  - `description`: The description of the embed.
  - `type`: one of the types defined in `bot.constants`. Default ones (as of v2.0.1):
    | Type           | Color                                                      | Title                  |
    |:--------------:|:----------------------------------------------------------:|:----------------------:|
    |`SUCCESS`       |<div class="square" style="background-color: #00FF0D"></div>|`🔰 SUCCESS`            |
    |`WARN`          |<div class="square" style="background-color: #fff700"></div>|`⚠️ WARNING`           |
    |`PARTIAL_ERROR` |<div class="square" style="background-color: #ff7300"></div>|`⛔ NON-CRITICAL ERROR`|
    |`ERROR`         |<div class="square" style="background-color: #ff0000"></div>|`🛑 ERROR`             |
    |`CRITICAL`      |<div class="square" style="background-color: #940000"></div>|`☠️ CRITICAL ERROR`    |
    |`UNAUTHORIZED`  |<div class="square" style="background-color: #940000"></div>|`🚨 UNAUTHORIZED`      |
    |`SYSTEM`        |<div class="square" style="background-color: #7265AD"></div>|`📟 SYSTEM`            |
  - `overrides`: an object containing overrides for parts of the embed:
    - `title`: Overrides the title of the embed.
    - `color`: Overrides the color of the embed.
    - `footer`: Overrides the footer of the embed.
    - `thumbnail`: Adds a thumbnail to the embed.
    - `image`: Adds an image to the embed.