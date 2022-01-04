const Discord = require("discord.js");
const Command = bot.bases.commands
class command extends Command {
    constructor() {
        super()
        this.command.name = "help"
        this.command.description = {
            short: "Get the list of commands.",
            long: "Get the list of commands or information about a specific command."
        }
        //this.command.category = ""
        this.command.arguments = [
            {
                type: "STRING", 
                name: "command", 
                description: "The command to get info from", 
                required: false,
                messageOnly: false
            }
        ]
    }

    async execute(bot, message, args) {
        if (args.getString("command")) {
            let command = bot.commands.get(args.getString("command")) || bot.commands.get(bot.aliases.get(args.getString("command")));
    
            if (command) {
                let parser = {
                    true: 'Yes',
                    false: 'No'
                }
    
                let isEnabled = await bot.modules.parsers.ecl.get(command.command)
                let level = await bot.modules.verifiers.permLevel(message);
    
                if (command.command.permlevel > level) {
                    return message.reply({
                        embeds: [
                            bot.modules.embed.create(message, `Unauthorized.`, "ERROR")
                        ],
                        ephemeral: true
                    })
                } else {
                    message.reply({
                        embeds: [
                            bot.modules.embed.create(
                                message, 
                                `❯ **Command Name:** ${command.command.name.slice(0, 1).toUpperCase() + command.command.name.slice(1)}
                                ❯ **Aliases:** ${command.command.aliases ? command.command.aliases.join(", ") : "None"}
                                ❯ **Category:** ${command.command.category || "None"}
                                ❯ **Description:** ${command.command.description.long || "No description provided"}
                                ❯ **Usage:** ${command.command.arguments.map(a => {
                                    if (a.required) return `[${a.name}]`
                                    else return `<${a.name}>`
                                }).join(' ')}
                                ❯ **Permission Level Required:** ${command.command.permlevel || 0} (${bot.modules.parsers.permLevels(command.command.permlevel || 0)})
                                ❯ **Enabled:** ${parser[isEnabled]}
        
                                * Arguments displayed as [argument] are required and <argument> are optional.`, 
                                "SUCCESS", {title: `Command Info for ${args[0]}:`})
                        ],
                        ephemeral: true
                    })
                } 
            } else return message.reply({
                embeds: [
                    bot.modules.embed.create(message, `No command found with name or alias \`${args.getString("command")}\``, "ERROR")
                ],
                ephemeral: true
            })
        } else {
            let level = await bot.modules.verifiers.permLevel(message);
            let commandStorage = {}
            
            bot.commands.forEach(c => {
    
                if (!commandStorage[c.command.category]) commandStorage[c.command.category] = []
                if (level >= c.command.permlevel) commandStorage[c.command.category].push(c.command.name)
            })
    
            let embed = new Discord.MessageEmbed()
                .setColor(bot.constants.colors["SYSTEM"])
                .setAuthor("Command List", bot.user.avatarURL())
                .setDescription(`Current command count: \`${bot.commands.filter(c => c.command.permlevel <= level).size}\`\n`)
                .addFields(
                    Object.entries(commandStorage).map(([key, value]) => { return { name: key, value: value.map(c => `[\`${c}\`](https://www.example.com)`).join(" "), inline: true } })
                )
                .setThumbnail("https://cdn.discordapp.com/attachments/736163626934861845/742671714386968576/help_animated_x4_1.gif")
                .setFooter(`Use ${bot.config.messageCommands.prefix}help [command] for help in a specific command.`)
    
            return message.channel.send({
                embeds: [
                    embed
                ]
            })
        }
    }

    async executeInteraction(bot, interaction) {
        let pseudoMessage = {
            member: interaction.member,
            author: interaction.user
        },
        cmdName = interaction.options.getString('command')
    
        if (cmdName) {
            let command = bot.commands.get(cmdName) || bot.commands.get(bot.aliases.get(cmdName));
    
            if (command) {
                let parser = {
                    true: 'Yes',
                    false: 'No'
                }
    
                let isEnabled = await bot.modules.parsers.ecl.get(command.command)
                let level = await bot.modules.verifiers.permLevel(pseudoMessage);
    
                if (command.command.permlevel > level) {
                    return interaction.reply({
                        embeds: [
                            bot.modules.embed.create(pseudoMessage, `Unauthorized.`, "ERROR")
                        ],
                        ephemeral: true
                    })
                } else {
                    interaction.reply({
                        embeds: [
                            bot.modules.embed.create(
                                pseudoMessage, 
                                `❯ **Command Name:** ${command.command.name.slice(0, 1).toUpperCase() + command.command.name.slice(1)}
                                ❯ **Aliases:** ${command.command.aliases ? command.command.aliases.join(", ") : "None"}
                                ❯ **Category:** ${command.command.category || "None"}
                                ❯ **Description:** ${command.command.description.long || "No description provided"}
                                ❯ **Usage:** ${command.command.arguments.map(a => {
                                    if (a.required) return `[${a.name}]`
                                    else return `<${a.name}>`
                                }).join(' ')}
                                ❯ **Permission Level Required:** ${command.command.permlevel || 0} (${bot.modules.parsers.permLevels(command.command.permlevel || 0)})
                                ❯ **Enabled:** ${parser[isEnabled]}
        
                                * Arguments displayed as [argument] are required and <argument> are optional.`, 
                                "SUCCESS", {title: `Command Info for ${cmdName}:`})
                        ],
                        ephemeral: true
                    })
                } 
            } else return interaction.reply({
                embeds: [
                    bot.modules.embed.create(pseudoMessage, `No command found with name or alias \`${cmdName}\``, "ERROR")
                ],
                ephemeral: true
            })
        } else {
            let level = await bot.modules.verifiers.permLevel(pseudoMessage);
            let commandStorage = {}
            
            bot.commands.forEach(c => {
    
                if (!commandStorage[c.command.category]) commandStorage[c.command.category] = []
                if (level >= c.command.permlevel) commandStorage[c.command.category].push(c.command.name)
            })
    
            let embed = new Discord.MessageEmbed()
                .setColor(bot.constants.colors["SYSTEM"])
                .setAuthor("Command List", bot.user.avatarURL())
                .setDescription(`Current command count: \`${bot.commands.filter(c => c.command.permlevel <= level).size}\`\n`)
                .addFields(
                    Object.entries(commandStorage).map(([key, value]) => { return { name: key, value: value.map(c => `[\`${c}\`](https://www.example.com)`).join(" "), inline: true } })
                )
                .setThumbnail("https://cdn.discordapp.com/attachments/736163626934861845/742671714386968576/help_animated_x4_1.gif")
                .setFooter(`Use /help [command] for help in a specific command.`)
            
            interaction.reply({
                embeds: [
                    embed
                ]
            })
        }
    }
}

module.exports = command