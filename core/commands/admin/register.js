const Command = bot.bases.commands
const fs = require("fs")
const path = require("path")

class command extends Command {
    constructor() {
        super()
        this.command.name = "register"
        this.command.description = {
            short: "Register data on the bot.",
            long: "Registers data on the bot's cache without rebooting.\nCOMMAND [command_path] - Register a new command ***ONLY AS MESSAGE MODE***\n    - command_path: CATEGORY/COMMAND (.js is optional)"
        }
        this.command.category = ""
        this.command.arguments = [
          {
            type: 'SUB_COMMAND', 
            name: "command", 
            description: "Registers a command",
            arguments: [
                {
                    type: 'STRING', 
                    name: "command_path", 
                    description: "The command path. (Format: CATEGORY/COMMAND)", 
                    required: true
                }
            ],
            required: true
          }
        ]
        this.command.aliases = []
        this.command.permlevel = 0
    }

    async execute(bot, message, args) {
        console.log(args)
        let subCommand = args.getSubcommand()

        switch (subCommand) {
            case "command": {
                let commandPath = args.getString("command_path").endsWith(".js") ? args.getString("command_path") : args.getString("command_path") + ".js"
                let cmdPath = path.join(bot.constants.paths.root, "core/commands", commandPath)

                if (fs.existsSync(cmdPath)) {
                    const filePull = require(cmdPath);
                    let pull = new filePull()
                    pull._setFilePath(cmdPath)

                    if (pull.validateStructure()) {
                        if (bot.commands.get(pull.command.name)) return message.reply({
                            embeds: [bot.modules.embed.create(message, `Multiple commands have the same name: \`${pull.command.name.toUpperCase()}\``, 'ERROR')]
                        });
                        bot.commands.set(pull.command.name, pull);
                        logger.info(`[COMMAND] [REGISTER] [COMMAND] Loaded ${pull.command.name}.`);
                    }

                    if (Array.isArray(pull.command?.aliases)) {
                        pull.command.aliases.forEach(alias => {
                            if (bot.aliases.get(alias)) return message.reply({
                                embeds: [bot.modules.embed.create(message, `Multiple commands have the same alias: \`${alias.toUpperCase()}\``, 'ERROR')]
                            });
                            bot.aliases.set(alias, pull.command.name);
                        });
                    }

                    let isValid = (pull.command.arguments?.length > 0) ? await bot.modules.verifiers.rcArguments(pull.command) : true
                    if (isValid) {
                        return message.reply({
                            embeds: [bot.modules.embed.create(message, `Successfully reloaded command \`${command.command.name.toUpperCase()}\``, 'SUCCESS')]
                        });
                    } else {
                        return message.reply({
                            embeds: [bot.modules.embed.create(message, `Could not register command \`${command.command.name.toUpperCase()}\`:\n\`Invalid Arguments\``, 'ERROR')]
                        });
                    }
                } else {
                    cmdPath = path.join(bot.constants.paths.root, "plugins/commands", commandPath)
                    if (fs.existsSync(cmdPath)) {
                        const filePull = require(cmdPath);
                        let pull = new filePull()
                        pull._setFilePath(cmdPath)

                        if (pull.validateStructure()) {
                            if (bot.commands.get(pull.command.name)) return message.reply({
                                embeds: [bot.modules.embed.create(message, `Multiple commands have the same name: \`${pull.command.name.toUpperCase()}\``, 'ERROR')]
                            });
                            bot.commands.set(pull.command.name, pull);
                            logger.info(`[COMMAND] [REGISTER] [COMMAND] Loaded ${pull.command.name}.`);
                        }

                        if (Array.isArray(pull.command?.aliases)) {
                            pull.command.aliases.forEach(alias => {
                                if (bot.aliases.get(alias)) return message.reply({
                                    embeds: [bot.modules.embed.create(message, `Multiple commands have the same alias: \`${alias.toUpperCase()}\``, 'ERROR')]
                                });
                                bot.aliases.set(alias, pull.command.name);
                            });
                        }

                        let isValid = (pull.command.arguments?.length > 0) ? await bot.modules.verifiers.rcArguments(pull.command) : true
                        if (isValid) {
                            return message.reply({
                                embeds: [bot.modules.embed.create(message, `Successfully registered command \`${pull.command.name.toUpperCase()}\``, 'SUCCESS')]
                            });
                        } else {
                            return message.reply({
                                embeds: [bot.modules.embed.create(message, `Could not register command \`${pull.command.name.toUpperCase()}\`:\n\`Invalid Arguments\``, 'ERROR')]
                            });
                        }
                    } else {
                        let parts = commandPath.split("/")
                        parts[1].replace(".js", "")
                        message.reply({
                            embeds: [
                                bot.modules.embed.create(message, `Could not find a command named \`${parts[1]}\` in the category \`${parts[0]}\``, "ERROR")
                            ]
                        })
                    }
                }
                break;
            }
            default:
                return message.reply({
                    embeds: [
                        bot.modules.embed.create(message, `Invalid option: \`${subCommand}\``, "ERROR")
                    ]
                })
        }
    }

    async executeInteraction(bot, interaction) {
      interaction.reply({ content: "test interaction reply" })
    }
}

module.exports = command