const Command = bot.bases.commands

class command extends Command {
    constructor() {
        super()
        this.command.name = "ecl"
        this.command.description = {
            short: "Activate or Deactivate Commands",
            long: ""
        }
        this.command.arguments = [
            { 
                type: 'STRING', 
                name: "command", 
                description: "The command whose enabled state will be updated.", 
                required: true
            },
            { 
                type: 'BOOLEAN', 
                name: "enabled", 
                description: "The enabled state for the command.", 
                required: true
            }
        ],
        this.command.permlevel = 100
    }

    async execute(bot, message, args) {
        try {
            let cmd = bot.commands.get(args.getString("command")) || bot.commands.get(bot.aliases.get(args.getString("command")))
    
            if (cmd) {
                let set = await bot.modules.parsers.ecl.set(cmd.command, args.getBoolean("enabled"))
                if (set) message.reply({ embeds: [bot.modules.embed.create(message, `Successfully updated the enabled state of ${args.getString("command")} to ${args.getBoolean("enabled")}.`, 'SUCCESS')], ephemeral: true })
                else message.reply({ embeds: [bot.modules.embed.create(message, `An unexpected error happened while attempting to update the enabled state of ${args.getBoolean("command")}.`, 'ERROR')], ephemeral: true })
            } else message.reply({ embeds: [bot.modules.embed.create(message, `Unexistent command: ${args.getString("command")}.`, 'ERROR')], ephemeral: true })
        } catch (e) {
            logger.error(`[CMD] [ADMIN] [ECL] Error while running command:`, e)
            message.reply({ embeds: [bot.modules.embed.create(message, `An unexpected error happened while attempting to update the enabled state of ${args.getString("command")}.`, 'ERROR')], ephemeral: true })
        }
    }

    async executeInteraction(bot, interaction) {
        try {
            let command = interaction.options.getString('command'),
                value = interaction.options.getBoolean('enabled'),
                pseudoMessage = {
                    member: interaction.member,
                    author: interaction.user
                },
                cmd = bot.commands.get(command) || bot.commands.get(bot.aliases.get(command))
    
            if (cmd) {
                let set = await bot.modules.parsers.ecl.set(cmd.command, value)
                if (set) interaction.followUp({ embeds: [bot.modules.embed.create(pseudoMessage, `Successfully updated the enabled state of ${command} to ${value}.`, 'SUCCESS')], ephemeral: true })
                else interaction.followUp({ embeds: [bot.modules.embed.create(pseudoMessage, `An unexpected error happened while attempting to update the enabled state of ${command}.`, 'ERROR')], ephemeral: true })
            } else interaction.followUp({ embeds: [bot.modules.embed.create(pseudoMessage, `Unexistent command: ${command}.`, 'ERROR')], ephemeral: true })
        } catch (e) {
            logger.error(`[CMD] [ADMIN] [ECL] Error while running interaction:`, e)
            interaction.followUp({ embeds: [bot.modules.embed.create(pseudoMessage, `An unexpected error happened while attempting to update the enabled state of ${command}.`, 'ERROR')], ephemeral: true })
        }
    }
}

module.exports = command