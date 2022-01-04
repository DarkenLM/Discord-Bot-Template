<style>
.square {
  position: relative;
  height: 20px;
  width: 20px;
  overflow: auto;
  right: -7px
}

.inline-quote {
  border-left: 4px solid #D1D7DD;
  padding: 0 5px;
  background-color: #282828;
  width: 100%;
  /* display: inline;
    width: 100%;
    height: 100%; */
}

.container {
  width: 100%;
  /* height:200px; */
}

.left {
  width: auto;
  /* height:200px; */
  background: #282828;
  overflow: hidden;
}

.right {
  /* height:200px; */
  width: auto;
  background: transparent;
  float: left;
  padding-right: 5px
}
</style>

# General
This file contains various constants used throught the system, all stored in a constants file for consistency on possible edits, making them being rolled out to the entire bot without the risk of compromising the functionality of a function.

As of version v2.0.3 there are X collections of constants:

## Colors
The Colors collection contains various colors as a hex code, mainly used in the [`Embed Module`](../modules/embed.md#General).  
As of v2.0.3, the color list is:
| Reference      | Color                                                      | HEX Code     |
|:--------------:|:----------------------------------------------------------:|:------------:|
|`SUCCESS`       |<div class="square" style="background-color: #00FF0D"></div>|`0x00ff0d`    |
|`WARN`          |<div class="square" style="background-color: #fff700"></div>|`0xfff700`    |
|`PARTIAL_ERROR` |<div class="square" style="background-color: #ff7300"></div>|`0xff7300`    |
|`ERROR`         |<div class="square" style="background-color: #ff0000"></div>|`0xff0000`    |
|`CRITICAL`      |<div class="square" style="background-color: #940000"></div>|`0x940000`    |
|`UNAUTHORIZED`  |<div class="square" style="background-color: #940000"></div>|`0x940000`    |
|`SYSTEM`        |<div class="square" style="background-color: #7265AD"></div>|`0x7265AD`    |

## Titles
The titles collection contains titles only used on the [`Embed Module`](../modules/embed.md#General)
As of v2.0.3, the tittle list is:
| Title          | Title                  |
|:--------------:|:----------------------:|
|`SUCCESS`       |`🔰 SUCCESS`            |
|`WARN`          |`⚠️ WARNING`           |
|`PARTIAL_ERROR` |`⛔ NON-CRITICAL ERROR`|
|`ERROR`         |`🛑 ERROR`             |
|`CRITICAL`      |`☠️ CRITICAL ERROR`    |
|`UNAUTHORIZED`  |`🚨 UNAUTHORIZED`      |
|`SYSTEM`        |`📟 SYSTEM`            |

## Commands
The commands collection contains command-related constants.  
As of v2.0.5, the command constant list is:
| Constant                | Value |
|:-----------------------:|:-----:|
| OVERRIDE_MIN_PERM_LEVEL | 2     |

## Regex
The regex collection contains various useful Regular Expressions.  
As of v2.0.5, the regex list is:

### Mention
| Regex      | Value                        | Explanation                                                                          |
|:----------:|:----------------------------:|:------------------------------------------------------------------------------------:|
| user       | `/^(?:<@!?)?(\d{17,19})>?$/` | Matches a Discord User mention (<@{17 to 19 digits}>, without the curly brackets)    |
| channel    | `/^(?:<#)?(\d{17,19})>?$/`   | Matches a Discord Channel mention (<#{17 to 19 digits}>, without the curly brackets) |
| role       | `/^(?:<@&)?(\d{17,19})>?$/`  | Matches a Discord Role mention (<@{17 to 19 digits}>, without the curly brackets)    |
| snowflake  | `/^(\d{17,19})$/`            | Matches a Discord Snowflake (<{17 to 19 digits}>, without the curly brackets)        |
### Miscelaneous
| Regex         | Value                                                                           | Explanation                                                                 |
|:-------------:|:-------------------------------------------------------------------------------:|:---------------------------------------------------------------------------:|
| emoji         | `/^(?:<a?:\w{2,32}:)?(\d{17,19})>?$/`                                                                     | Matches a unicode emoji                           |
| username      | `/.{2,32}/`                                                                                               | Matches a valid Discord Username                  |
| invite        | <code>/(http(s)?:\/\/)?(www\.)?(discord\.(gg&#124;li&#124;me&#124;io)&#124;discordapp\.com\/invite&#124;invite\.gg)\/.\w+/</code>  | Matches a Discord Invite |
| discriminator | `/(#)\d{4}/`                                                                                              | Matches a Discord Discriminator (#0000)           |
| tag           | `/.{2,32}(#)\d{4}/`                                                                                       | Matches a Discord Tag (Username#0000)             |
| token         | `/[\w]{24}\.[\w]{6}\.[\w-_]{27}/`                                                                         | Matches a Discord Token                           |

## Classes
The Classes collection contains classes that are used in multiple modules and require consistency between all of them.  

### **Argument Map**
The Argument Map is an argument collection for Message Commands created to provide consistency between the arguments on Interaction Mode and Message Mode.  
All arguments are saved with the structure `{ type: "ARGUMENT_TYPE", value: ARGUMENT_VALUE }`, where:
  - `ARGUMENT_TYPE`: The [Argument Type](../commands) (See `arguments`)
  - `ARGUMENT_VALUE`: The value of the argument.

It has the following methods:
  - `get(argName, required?)`: Fetches the argument named `argName`.
    - <div class="container"><div class="right"><code>argName</code>: The name of the argument. Same name as defined on the command's definition. </div><div class="left"><span class="inline-quote" style="border-color: orange; color: orange;">WARNING: Always check the SubCommand used, as the argument's name follow the Command Arguments structure, and different subcommands have arguments with different names.</span></div></div>
    - `required`: Optional. If set to `true`, will throw an error if the argument was not found.
  - The following methods perform the same operation as `get` with the same arguments and behavior, except they verify the type of the variable beforehand:
    - `getString`
    - `getInteger`
    - `getNumber`
    - `getBoolean`
    - `getUser`
    - `getChannel`
    - `getRole`
    - `getMentionable`
  - `getSubcommandGroup(required?)`: Gets the SubCommand Group selected by the user.
    - `required`: Optional. If set to `true`, will throw an error if the argument was not found.
  - `getSubcommand(required?)`: Gets the SubCommand selected by the user.
    - `required`: Optional. If set to `true`, will throw an error if the argument was not found.
  - `join(separator)`: Joins the values of all arguments, separating them with the `separator` string.
  - <div class="container"><div class="right"><code>_dump()</code>: Dumps the entire Argument List.</div><div class="left"><span class="inline-quote" style="border-color: purple; color: gray;">WARNING: Should be used for debugging only.</span></div></div>

## Messages
The Messages collection contains various pre-formatted messages. The current format used is:
```js
{
  type: "TYPE",
  content: function (...args) {
    `TEMPLATE_STING`
  },
  ...
}
```

Where:
  - `TYPE`: the type of the message, currently `MESSAGE` or `EMBED`, used for indexing.
  - `STRING`: The string to be formatted. (`content` can be a normal string if needed.)
  - `args`: The arguments. Should be inputted as normal function parameters, and due to the deconstructor operator they get parsed into an array.

## Paths
The Paths collection contains various paths that require to be constant thoughout the bot.  
As of v2.0.3, the path list is:
  - `root`: The path of the index.js file. <span style="color:red">**WARNING:** This path should not be modified, as it may be used by various critical modules.</span>