<style>
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
    width:100%;
    /* height:200px; */
  }
  .left {
      width:auto;
      /* height:200px; */
      background:#282828;
      overflow:hidden;
  }
  .right {
      /* height:200px; */
      width:auto;
      background:transparent;
      float:left;
      padding-right: 5px
  }
</style>

# Syntax

All commands should follow this template:

<!-- ```js
const Discord = require("discord.js");

module.exports.execute = async (bot, message, args) => {

}

module.exports.executeInteraction = async (bot, interaction) => {

}

module.exports.command = {
    name: "",
    description: {
        short: "",
        get long() { return this.short }
    },
    arguments: [
        {
            type: 'TYPE_OF_ARGUMENT', 
            name: "NAME_OF_ARGUMENT", 
            description: "DESCRIPTION_OF_ARGUMENT", 
            required: true,
            messageOnly: false
        }
    ],
    category: "",
    permlevel: 1
}
``` -->

```js
const Command = bot.bases.commands

class command extends Command {
    constructor() {
        super()
        this.command.name = ""
        this.command.description = {
            short: "",
            long: ""
        }
        this.command.category = ""
        this.command.arguments = [
          {
            type: 'TYPE_OF_ARGUMENT', 
            name: "NAME_OF_ARGUMENT", 
            description: "DESCRIPTION_OF_ARGUMENT", 
            required: true,
            messageOnly: false
          }
        ]
        this.command.aliases = []
        this.command.permlevel = 0
    }

    async execute(bot, message, args) {
        message.reply({ content: "test reply" })
    }

    async executeInteraction(bot, interaction) {
      interaction.reply({ content: "test interaction reply" })
    }
}

module.exports = command
```

Where:
  - `name`: The name of the command. Must be all lowercase.
  - `description`: The description of the command, where:
    - `short`: The description to show on the interaction's description. (100 characters maximum)
    - `long`: The complete description, shown on the help command. (Default: Same as short description.)
  - `category`: The category of this command. Must be all lowercase. It is recommended to not redefine this parameter, as it is automatically calculated based on the name of the folder where the command is inserted.
  - `arguments`: The arguments for the function. [(Discord.js Docs)](https://discord.js.org/#/docs/main/stable/typedef/ApplicationCommandOptionType), where:
    - `type`: The argument type. Must be one of the following:
        | Type              | Explanation                                                                                       |
        |-------------------|---------------------------------------------------------------------------------------------------|
        | SUB_COMMAND       | A Subcommand. See [Special Cases](#special-cases).                                                |
        | SUB_COMMAND_GROUP | A way to group subcommands together. (Ex.: SCG `test` -> /`command` <ins>test</ins> `subcommand`).|
        | STRING            | A string option. Can have [Choices](#choices).                                                    |
        | INTEGER           | An integer option. Can have [Choices](#choices).                                                  |
        | NUMBER            | A floating-point option.                                                                          |
        | BOOLEAN           | A Boolean option.                                                                                 |
        | USER              | An user mention or id.                                                                            |
        | CHANNEL           | A channel mention or id.                                                                          |
        | ROLE              | A role mention or id.                                                                             |
        | MENTIONABLE       | Any of the three above.                                                                           |
    - `name`: The name of the argument. Serves as unique id for this argument within this command. Is displayed to user.
    - `description`: The description for this argument.
    - <div class="container"><div class="right"><code>required</code>: Whenever this argument is required. </div><div class="left"><span class="inline-quote" style="border-color: orange; color: orange;">WARNING: If an argument is required, the ones before also need to be required.</span></div></div>
    - `messageOnly`: Whenever this command can only be executed via normal message.
  - `aliases`: The additional names this command can be invoked with.
  - <div class="container"><div class="right"><code>permlevel</code>: The minimum permlevel for this command.</div><div class="left"><span class="inline-quote" style="border-color: orange; color: orange;">WARNING: This feature will be replaced in a future update.</span></div></div>

## Special Cases
### SubCommands
SubCommands have an `arguments` property of their own, which follows the exact same rules as the normal arguments.

### SubCommand Groups
SubCommand Groups do not possess the `required` property, as they are mandatorily required as per Discord API Interactions.
SubCommand Groups possess a `subCommands` property that allow you to add subcommands. They follow the same rules as the normal arguments.

### Unlimited Arguments
**MESSAGE MODE ONLY**  
If a command needs an unknown or dynamic number of options, leaving the `arguments` property empty will allow the command to accept any arguments provided.  
The Argument Map will contain every argument as a numbered list, starting at index 0 up to the number of arguments.  

To fetch those arguments, use `args.get("INDEX")`.

## Choices

The choice system allows you to set a restricted set of options for an argument of type `STRING` / `INTEGER`.  
Every choice is defined as an object as following:
```js
{
    name: "TITLE HERE",
    content: "CONTENT_HERE"
}
```

Where:
 - `name` is the name of the choice.
 - `content` is the content of the choice.

To use a choice, when defining a `STRING` / `INTEGER` argument, add the following property to it:
```js
choices: [
  {
    name: "TITLE HERE",
    content: "CONTENT_HERE"
  }
]
```

## Notes

`exports.execute` is fired when the command is fired through a normal message with the bot's defined command prefix.  
`exports.executeInteraction` is fired when the command is fired through an interaction.  

The system automatically detects which ones exist and inform the user if the command can't be executed on a specific mode.  
If none of the execute options exist, an error will be thrown at initialization.