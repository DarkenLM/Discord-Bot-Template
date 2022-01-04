const Command = bot.bases.commands
const path = require('path')
const db = require('quick.db')
const { readdirSync } = require("fs");

class command extends Command {
    constructor() {
        super()
        this.command.name = "reload"
        this.command.description = {
            short: "Reload a command by resetting it's cache.",
            long: ""
        }
        this.command.arguments = [
            { 
                type: 'SUB_COMMAND', 
                name: "command", 
                description: "Reload a command.", 
                required: true, 
                arguments: [
                    { type: 'STRING', name: "command_name", description: "The command to reload.", required: true }
                ]
            },
            { 
                type: 'SUB_COMMAND', 
                name: "category", 
                description: "Reload all commands on a specific category.", 
                required: true, 
                arguments: [
                    { type: 'STRING', name: "category_name", description: "The category to reload.", required: true }
                ]
            },
            { 
                type: 'SUB_COMMAND', 
                name: "last", 
                description: "Reuse last configurations.", 
                required: true
            }
        ]
        this.command.permlevel = 99
    }

    async execute(bot, message, args) {
        //console.log(args)
        let command = args.getSubcommand(),
            value   = args.getString('command_name') || args.getString('category_name'),
            last    = await db.fetch('SYSTEM:last_reload')
        async function reload(type, value) {
            switch (type) {
                case 'command': {
                    const commandName = value.toLowerCase()
                    let command = bot.commands.get(commandName) || bot.commands.get(bot.aliases.get(commandName));
                    if (!command) return message.reply({
                        embeds: [bot.modules.embed.create(message, `Unexistent command: \`${value}\`.`, 'ERROR')]
                    });
                    for (const [key, value] of bot.aliases.entries()) {
                        if (value === command.command.name) bot.aliases.delete(key)
                    }

                    delete require.cache[require.resolve(command.getFilePath())];
                    bot.commands.delete(command.command.name);

                    const filePull = require(command.getFilePath());
                    let pull = new filePull()
                    pull._setFilePath(command.getFilePath())

                    if (pull.validateStructure()) {
                        if (bot.commands.get(pull.command.name)) return message.reply({
                            embeds: [bot.modules.embed.create(message, `Multiple commands have the same name: \`${pull.command.name.toUpperCase()}\``, 'ERROR')]
                        });
                        bot.commands.set(pull.command.name, pull);
                        logger.info(`[COMMAND] [RELOAD] Loaded ${pull.command.name}.`);
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
                        await db.set('SYSTEM:last_reload', {
                            type: 'command',
                            value: value
                        })
                        return message.reply({
                            embeds: [bot.modules.embed.create(message, `Successfully reloaded command \`${command.command.name.toUpperCase()}\``, 'SUCCESS')]
                        });
                    } else {
                        return message.reply({
                            embeds: [bot.modules.embed.create(message, `Could not reload command \`${command.command.name.toUpperCase()}\`:\n\`Invalid Arguments\``, 'ERROR')]
                        });
                    }
                    break;
                }
                case 'category': {
                    let categories = readdirSync(path.join(__dirname, '../'))
                    if (!categories.includes(value)) return message.reply({
                        embeds: [bot.modules.embed.create(message, `Unexistent category: \`${value}\`.`, 'ERROR')]
                    });

                    let categoryCmds = bot.commands.filter(c => c.command.category === value),
                        reloaded = []

                    for (let categoryCmd of categoryCmds) {
                        let cmd = categoryCmd[1]
                        // let file = `../${value.toLowerCase()}/${cmd.command.name}.js`
                        // delete require.cache[require.resolve(file)];
                        // bot.commands.delete(cmd.command.name);
                        // const pull = require(file);
                        // bot.commands.set(cmd.command.name, pull);
                        // reloaded.push(cmd.command.name)
                        for (const [key, value] of bot.aliases.entries()) {
                            if (value === cmd.command.name) bot.aliases.delete(key)
                        }

                        delete require.cache[require.resolve(cmd.getFilePath())];
                        bot.commands.delete(cmd.command.name);

                        const filePull = require(cmd.getFilePath());
                        let pull = new filePull()
                        pull._setFilePath(cmd.getFilePath())

                        if (pull.validateStructure()) {
                            if (bot.commands.get(pull.command.name)) return message.reply({
                                embeds: [bot.modules.embed.create(message, `Multiple commands have the same name: \`${pull.command.name.toUpperCase()}\``, 'ERROR')]
                            });
                            bot.commands.set(pull.command.name, pull);
                            logger.info(`[COMMAND] [RELOAD] Loaded ${pull.command.name}.`);
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
                            reloaded.push(cmd.command.name)
                        } else {
                            return message.reply({
                                embeds: [bot.modules.embed.create(message, `Could not reload command \`${command.command.name.toUpperCase()}\`:\n\`Invalid Arguments\``, 'ERROR')]
                            });
                        }
                    }
                    await db.set('SYSTEM:last_reload', {
                        type: 'category',
                        value: value
                    })
                    return message.reply({
                        embeds: [bot.modules.embed.create(message, `Successfully reloaded category \`${value.toUpperCase()}\`.\nReloaded commands \`(${reloaded.length})\`: \`${reloaded.map(c => c.toUpperCase()).join(', ')}\``, 'SUCCESS')]
                    });
                    break;
                }
                case 'last': {
                    if (!last) return message.reply({
                        embeds: [bot.modules.embed.create(message, `No data stored on cache from last reload.`, 'ERROR')]
                    })
                    await reload(last.type, last.value)
                    break;
                }
            }
        }

        await reload(command, value)
    }

    async executeInteraction(bot, interaction) {
        let command = interaction.options.getSubcommand(),
            value = interaction.options.getString('command_name') || interaction.options.getString('category_name'),
            pseudoMessage = {
                member: interaction.member,
                author: interaction.user
            },
            last = await db.fetch('SYSTEM:last_reload')
        async function reload(type, value) {
            switch (type) {
                case 'command': {
                    const commandName = value.toLowerCase()
                    let command = bot.commands.get(commandName) || bot.commands.get(bot.aliases.get(commandName));
                    if (!command) return interaction.followUp({
                        embeds: [bot.modules.embed.create(pseudoMessage, `Unexistent command: \`${value}\`.`, 'ERROR')],
                        ephemeral: true
                    });
                    for (const [key, value] of bot.aliases.entries()) {
                        if (value === command.command.name) bot.aliases.delete(key)
                    }

                    delete require.cache[require.resolve(command.getFilePath())];
                    bot.commands.delete(command.command.name);

                    const filePull = require(command.getFilePath());
                    let pull = new filePull()
                    pull._setFilePath(command.getFilePath())

                    if (pull.validateStructure()) {
                        if (bot.commands.get(pull.command.name)) return interaction.followUp({
                            embeds: [bot.modules.embed.create(pseudoMessage, `Multiple commands have the same name: \`${pull.command.name.toUpperCase()}\``, 'ERROR')]
                        });
                        bot.commands.set(pull.command.name, pull);
                        logger.info(`[COMMAND] [RELOAD] Loaded ${pull.command.name}.`);
                    }

                    if (Array.isArray(pull.command?.aliases)) {
                        pull.command.aliases.forEach(alias => {
                            if (bot.aliases.get(alias)) return interaction.followUp({
                                embeds: [bot.modules.embed.create(pseudoMessage, `Multiple commands have the same alias: \`${alias.toUpperCase()}\``, 'ERROR')]
                            });
                            bot.aliases.set(alias, pull.command.name);
                        });
                    }

                    let isValid = (pull.command.arguments?.length > 0) ? await bot.modules.verifiers.rcArguments(pull.command) : true
                    if (isValid) {
                        await db.set('SYSTEM:last_reload', {
                            type: 'command',
                            value: value
                        })
                        return interaction.followUp({
                            embeds: [bot.modules.embed.create(pseudoMessage, `Successfully reloaded command \`${command.command.name.toUpperCase()}\``, 'SUCCESS')]
                        });
                    } else {
                        return interaction.followUp({
                            embeds: [bot.modules.embed.create(pseudoMessage, `Could not reload command \`${command.command.name.toUpperCase()}\`:\n\`Invalid Arguments\``, 'ERROR')]
                        });
                    }
                    break;
                }
                case 'category': {
                    let categories = readdirSync(path.join(__dirname, '../'))
                    if (!categories.includes(value)) return interaction.followUp({
                        embeds: [bot.modules.embed.create(pseudoMessage, `Unexistent category: \`${value}\`.`, 'ERROR')],
                        ephemeral: true
                    });

                    let categoryCmds = bot.commands.filter(c => c.command.category === value),
                        reloaded     = []

                    for (let categoryCmd of categoryCmds) {
                        let cmd = categoryCmd[1]
                        for (const [key, value] of bot.aliases.entries()) {
                            if (value === cmd.command.name) bot.aliases.delete(key)
                        }

                        delete require.cache[require.resolve(cmd.getFilePath())];
                        bot.commands.delete(cmd.command.name);

                        const filePull = require(cmd.getFilePath());
                        let pull = new filePull()
                        pull._setFilePath(cmd.getFilePath())

                        if (pull.validateStructure()) {
                            if (bot.commands.get(pull.command.name)) return interaction.followUp({
                                embeds: [bot.modules.embed.create(pseudoMessage, `Multiple commands have the same name: \`${pull.command.name.toUpperCase()}\``, 'ERROR')]
                            });
                            bot.commands.set(pull.command.name, pull);
                            logger.info(`[COMMAND] [RELOAD] Loaded ${pull.command.name}.`);
                        }

                        if (Array.isArray(pull.command?.aliases)) {
                            pull.command.aliases.forEach(alias => {
                                if (bot.aliases.get(alias)) return interaction.followUp({
                                    embeds: [bot.modules.embed.create(pseudoMessage, `Multiple commands have the same alias: \`${alias.toUpperCase()}\``, 'ERROR')]
                                });
                                bot.aliases.set(alias, pull.command.name);
                            });
                        }

                        let isValid = (pull.command.arguments?.length > 0) ? await bot.modules.verifiers.rcArguments(pull.command) : true
                        if (isValid) {
                            reloaded.push(cmd.command.name)
                        } else {
                            return interaction.followUp({
                                embeds: [bot.modules.embed.create(pseudoMessage, `Could not reload command \`${command.command.name.toUpperCase()}\`:\n\`Invalid Arguments\``, 'ERROR')]
                            });
                        }
                    }
                    await db.set('SYSTEM:last_reload', {
                        type: 'category',
                        value: value
                    })
                    return interaction.followUp({
                        embeds: [bot.modules.embed.create(pseudoMessage, `Successfully reloaded category \`${value.toUpperCase()}\`.\nReloaded commands \`(${reloaded.length})\`: \`${reloaded.join(', ')}\``, 'SUCCESS')],
                        ephemeral: true
                    });
                    break;
                }
                case 'last': {
                    if (!last) return interaction.followUp({
                        embeds: [bot.modules.embed.create(pseudoMessage, `No data stored on cache from last reload.`, 'ERROR')],
                        ephemeral: true
                    })
                    await reload(last.type, last.value)
                    break;
                }
            }
        }

        await reload(command, value)
    }
}

module.exports = command