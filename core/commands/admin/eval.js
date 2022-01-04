const Command = bot.bases.commands
const Discord = require("discord.js");
const db = require('quick.db')
const util = require("util");

class command extends Command {
    constructor() {
        super()
        this.command.name = "eval"
        this.command.description = {
            short: "Manually execute code on the bot's process.",
            long: "Manually execute code on the bot's process.\n**WARNING:** This command runs arbitrary code. Any changes the code does are ***FINAL***."
        }

        this.command.arguments = []
        this.command.aliases = ["evaluate"]
        this.command.permlevel = 100
    }

    async execute(bot, message, args) {
        let code = args.join(" ");
        if (!code) return message.channel.send(bot.modules.embed.create(message, 'Code not found', 'ERROR'))
        try {
            let ev = eval(code)
            let str = util.inspect(ev, {
                depth: 1
            })
            str = `${str.replace(new RegExp(`${bot.config.token}`, "g"), "Nice try dickhead.")}`;
            if (str.length > 1800) {
                str = str.substring(0, 1800)
                str = str + "[...]"
            }
            message.react("✅");
            message.channel.send({
                embeds: [
                    {
                        color: 0x7289da,
                        fields: [{
                                name: '📥 **Input**',
                                value: `\`\`\`js\n${code}\n\`\`\``    
                            },
                            {
                                name: '📤 **Output**',
                                value: `\`\`\`js\n${str}\n\`\`\``
                            }
                        ]
                    }
                ]
            });
        } catch (err) {
            message.react("❌");
            message.channel.send({
                embeds: [
                    {
                        color: 0x7289da,
                        fields: [{
                                name: '📥 **Input**',
                                value: `\`\`\`js\n${code}\n\`\`\``      
                            },
                            {
                                name: '📤 **Output**',
                                value: `\`\`\`js\n${err}\n\`\`\``
                            }
                        ]
                    }
                ]
            });
        }
    }
}

module.exports = command