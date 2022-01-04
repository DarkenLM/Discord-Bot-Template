/*
*   MODULE
*       Embed
*       By: DarkenLM
*       First Version: 23/08/2021 | Last Update: 24/08/2021
*       Documentation Page: modules/embed
*/

const Discord = require('discord.js');
const _Module = bot.bases.modules
class Module extends _Module {
    constructor() {
        super();
        this.declarations.name = 'embed'
    }

    create(message, description, type, overrides) {
        let emb = new Discord.MessageEmbed()
        .setTitle((overrides && overrides.title) ? overrides.title : (bot.constants.titles[type] ?  bot.constants.titles[type] : type))
        .setColor((overrides && overrides.color) ? overrides.color : (bot.constants.colors[type] || ''))
        .setDescription(description)
        .setFooter((overrides && overrides.footer) ? overrides.footer : `Executed by ${message?.member?.displayName || message.author.username}`, message.author.displayAvatarURL())
        if (overrides && overrides.thumbnail) emb.setThumbnail(overrides.thumbnail)
        if (overrides && overrides.image) emb.setImage(overrides.image)

        return emb
    }
}

module.exports = Module