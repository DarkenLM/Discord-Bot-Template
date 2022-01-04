const Command = bot.bases.commands
const Discord = require("discord.js");

class command extends Command {
    constructor() {
        super()
        this.command.name = "ping"
        this.command.description = {
            short: "Fetch the current ping of the bot.",
            long: ""
        }
        this.command.permlevel = 0
    }

    async execute(bot, message, args) {
        let heart = (Date.now() - message.createdTimestamp)
        const m = await message.reply({ content: "Calculating..." });
        let ping = Math.round(m.createdTimestamp - message.createdTimestamp);

        const embed = new Discord.MessageEmbed()
            .setTitle(':ping_pong: Pong!')
            .setColor('#0fdbb6')
            .addField('🤖 Ping', `**${ping}**ms`)
            .addField('💓 HeartBeat', `**${heart}**ms`)
            .addField('📟 API Ping', `**${Math.round(bot.ws.ping)}**ms`)
            .setFooter(`Executed by ${message.author.tag}`, message.author.displayAvatarURL())
            .setTimestamp();
        m.edit({ embeds: [embed] });
    }

    async executeInteraction(bot, interaction) {
        let heart = (Date.now() - interaction.createdTimestamp)
        interaction.editReply({ content: "Calculating..." })
        let m = await interaction.fetchReply()
        let ping = Math.round(m.createdTimestamp - interaction.createdTimestamp);
      
        const embed = new Discord.MessageEmbed()
            .setTitle(':ping_pong: Pong!')
            .setColor('#0fdbb6')
            .addField('🤖 Ping', `**${ping}**ms`)
            .addField('💓 HeartBeat', `**${heart}**ms`)
            .addField('📟 API Ping', `**${Math.round(bot.ws.ping)}**ms`)
            .setFooter(`Executed by ${interaction.user.tag}`, interaction.user.displayAvatarURL())
            .setTimestamp();
        
        interaction.editReply({
            content: '** **',
            embeds: [embed]
        });
    }
}

module.exports = command