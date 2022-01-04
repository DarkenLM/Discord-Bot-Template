const Command = bot.bases.commands
const db = bot.modules.db
let dbTable;
db.tables.get('Tokens').then(_t => dbTable = _t)

class command extends Command {
    constructor() {
        super()
        this.command.name = "permtoken"
        this.command.description = {
            short: "Activate a Permission Token.",
            long: "Activate a Permission Token to provide access to a higher permission on the bot."
        }
        this.command.arguments = [
            { 
                type: 'SUB_COMMAND', 
                name: "set", 
                description: "Bind a Permission Token to your account.", 
                required: true, 
                arguments: [
                    { type: 'STRING', name: "permtoken", description: "The Permission Token.", required: true }
                ]
            }
        ]
        this.command.aliases = []
        this.command.permlevel = 0
    }

    async executeInteraction(bot, interaction) {
        let pseudoMessage = {
            member: interaction.member,
            author: interaction.user
        }
        try {
            let tokenVer = bot.modules.parsers.permToken(interaction.options.getString('permtoken'))
            if (tokenVer.success) {
                let obj = { token: interaction.options.getString('permtoken'), type: tokenVer.data.type }
                switch (tokenVer.data.type) {
                    case 'UBOT':
                        obj.uses = 0
                        break;
                }
                await dbTable.set(`${interaction.user.id}.global`, obj)
                return interaction.followUp({ embeds: [bot.modules.embed.create(pseudoMessage, `Permission Token bound to your account.\n- Token Type: ${tokenVer.data.type}\n${tokenVer.data.type === 'UBOT' ? `- Permission Level: ${tokenVer.data.level}\n- Uses: ${tokenVer.data.uses}` : `- Permission Level: ${tokenVer.data.level}\n- Expiration Date: <t:${Math.floor( (parseInt(tokenVer.data.iat) + parseInt(tokenVer.data.exp)) / 1000 )}>`}`, 'SUCCESS')], ephemeral: true })//${bot.modules.parsers.formatTime(parseInt(tokenVer.data.iat) + parseInt(tokenVer.data.exp), 'pt', 'LLLL')}
            } else {
                return interaction.followUp({ embeds: [bot.modules.embed.create(pseudoMessage, `Invalid Permission Token.`, 'ERROR')], ephemeral: true })
            }
        } catch (e) {
            logger.error(`[CMD] [ADMIN] [ECL] Error while running command:`, e)
            interaction.followUp({ embeds: [bot.modules.embed.create(pseudoMessage, `An unexpected error happened while attempting to activate the Permission Token.`, 'ERROR')], ephemeral: true })
        }
    }
}

module.exports = command