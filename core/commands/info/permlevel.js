const Command = bot.bases.commands

class command extends Command {
    constructor() {
        super()
        this.command.name = "permlevel"
        this.command.description = {
            short: "Get the user's current Permission Level."
        }
        this.command.permlevel = 0
    }

    async execute(bot, message, args) {
        const level = await bot.modules.verifiers.permLevel(message);

        return message.reply({ 
            embeds: [
                bot.modules.embed.create(message, `Your current Permission Level is: \`${level} (${bot.modules.parsers.permLevels(level)})\``, 'WARN', { title: "Permission Level" })
            ],
            ephemeral: true
        })
    }

    async executeInteraction(bot, interaction) {
        let pseudoMessage = {
            member: interaction.member,
            author: interaction.user
        }
    
        const level = await bot.modules.verifiers.permLevel(pseudoMessage);
    
        interaction.followUp({ 
            embeds: [
                bot.modules.embed.create(pseudoMessage, `Your current Permission Level is: \`${level} (${bot.modules.parsers.permLevels(level)})\``, 'WARN', { title: "Permission Level" })
            ],
            ephemeral: true
        })
    }
}

module.exports = command