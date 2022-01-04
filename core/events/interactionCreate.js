const Discord = require("discord.js");
const path = require('path');
const fs = require("fs");

module.exports = async (bot, interaction) => {
    //console.log(interaction)
    if (!interaction.isCommand()) return;

    const cmd = bot.commands.get(interaction.commandName);
    if (!cmd) return;
	let message = {
            member: interaction.member,
            author: interaction.user
        }

    try {
        if (![0, 2].includes(cmd.command.restricted)) {
            logger.warn(`[EVENTS] [MESSAGE] ${message.author.tag} attempted to execute the command ${cmd.command.name}, but it was restricted to message mode`)
            message.reply({
              embeds: [
                bot.modules.embed.create(message, `Please execute this command as a message with prefix ${bot.config.messageCommands.prefix}.`, "UNAUTHORIZED")
              ]
            })
      
            return;
          }

        const level = await bot.modules.verifiers.permLevel(message);
        let isEnabled = await bot.modules.parsers.ecl.get(cmd.command)

        let dbTable = await bot.modules.db.tables.get('Tokens')
        let userToken = await dbTable.get(`${message.author.id}.global`)

        //console.log(userToken)

        //console.log('INTERACTION: ', level, isEnabled)
        if (isEnabled) {
            if (level >= cmd.command.permlevel) {
                logger.warn(`[EVENTS] [IC] ${message.author.tag} executed the command ${cmd.command.name}`)
                try {
					await interaction.deferReply();
					await cmd.executeInteraction(bot, interaction)
				} catch (e) {
					function genReport() {
						let reportID = bot.modules.generators.makeID(6)
						let reportPath = path.join(__dirname, "../../logs/error_reports", `${reportID}.md`)
						// console.log(reportPath)
						if (fs.existsSync(reportPath)) {
							genReport()
						} else {
							// console.log(cmd.getFilePath())
							let cmdFile = fs.readFileSync(cmd.getFilePath())
							let data = [
								`# Error Report`,
								`**Report ID:** ${reportID}  `,
								`**Executed By:** ${message.author.username} (${message.author.id})  `,
								`**Command:** ${cmd.command.name}  `,
								`**Arguments**: \n\`\`\`json\n${JSON.stringify(interaction.options.data, null, 4)}\n\`\`\``,
								`**Mode:** Interaction  `,
								`**Date:** ${bot.modules.parsers.formatTime(Date.now(), "pt", "DD/MM/YYYY HH:mm:ss UTC ZZ")}  \n`,
								`## Error log`,
								`\`\`\`\n`,
								e.message,
								e.stack,
								`\`\`\``,
								`## Command Data`,
								`\`\`\`js`,
								cmdFile.toString(),
								`\`\`\``
							].join("\n")

							try {
								fs.mkdirSync(path.dirname(reportPath), { recursive: true })
								fs.writeFileSync(reportPath, data);

								logger.warn(`[EVENTS] [IC] Error report generated: ${reportPath}`)
								interaction.followUp({
									embeds: [
										bot.modules.embed.create(message, `An error happened executing this command.\nPlease inform the developers about this error.\n**Error ID:** \`${reportID}\``, "CRITICAL")
									]
								})
							} catch (err) {
								logger.error(`[EVENTS] [IC] Could not write error report file:`, err)
								interaction.followUp({
									embeds: [
										bot.modules.embed.create(message, `A critical error happened executing this command.\nPlease inform the developers about this error.`, "CRITICAL")
									]
								})

								return;
							}
						}
					}
					
					genReport()
				}
                if (userToken?.type == "UBOT") await dbTable.add(`${message.author.id}.global.uses`, 1)
            } else {
                logger.warn(`[EVENTS] [IC] ${message.author.tag} attempted to execute the command ${cmd.command.name} without valid permission`)
                interaction.reply({
                    embeds: [bot.modules.embed.create(message, `- Required permission: ${cmd.command.permlevel} (${bot.modules.parsers.permLevels(cmd.command.permlevel)})\n- Current permission: ${level} (${bot.modules.parsers.permLevels(level)})`, 'UNAUTHORIZED')],
                    ephemeral: true
                })
            }
        } else {
            if (level >= bot.constants.commands.OVERRIDE_MIN_PERM_LEVEL && level >= cmd.command.permlevel) {
                logger.warn(`[EVENTS] [IC] ${message.author.tag} executed the disabled command ${cmd.command.name}`)
                try {
					await cmd.executeInteraction(bot, interaction)
				} catch (e) {
					function genReport() {
						let reportID = bot.modules.generators.makeID(6)
						let reportPath = path.join(__dirname, "../../logs/error_reports", `${reportID}.md`)
						// console.log(reportPath)
						if (fs.existsSync(reportPath)) {
							genReport()
						} else {
							// console.log(cmd.getFilePath())
							let cmdFile = fs.readFileSync(cmd.getFilePath())
							let data = [
								`# Error Report`,
								`**Report ID:** ${reportID}  `,
								`**Executed By:** ${message.author.username} (${message.author.id})  `,
								`**Command:** ${cmd.command.name}  `,
								`**Arguments**: \n\`\`\`json\n${JSON.stringify(interaction.options.data, null, 4)}\n\`\`\``,
								`**Mode:** Interaction  `,
								`**Date:** ${bot.modules.parsers.formatTime(Date.now(), "pt", "DD/MM/YYYY HH:mm:ss UTC ZZ")}  \n`,
								`## Error log`,
								`\`\`\`\n`,
								e.message,
								e.stack,
								`\`\`\``,
								`## Command Data`,
								`\`\`\`js`,
								cmdFile.toString(),
								`\`\`\``
							].join("\n")

							try {
								fs.mkdirSync(path.dirname(reportPath), { recursive: true })
								fs.writeFileSync(reportPath, data);

								logger.warn(`[EVENTS] [IC] Error report generated: ${reportPath}`)
								interaction.reply({
									embeds: [
										bot.modules.embed.create(message, `An error happened executing this command.\nPlease inform the developers about this error.\n**Error ID:** \`${reportID}\``, "CRITICAL")
									]
								})
							} catch (err) {
								logger.error(`[EVENTS] [IC] Could not write error report file:`, err)
								interaction.reply({
									embeds: [
										bot.modules.embed.create(message, `A critical error happened executing this command.\nPlease inform the developers about this error.`, "CRITICAL")
									]
								})

								return;
							}
						}
					}
					
					genReport()
				}
                if (userToken?.type == "UBOT") await dbTable.add(`${message.author.id}.global.uses`, 1)
            } else {
                logger.warn(`[EVENTS] [IC] ${message.author.tag} attempted to execute the disabled command ${cmd.command.name}`)
                interaction.followUp({
                    embeds: [bot.modules.embed.create(message, `- Required permission: ${bot.constants.commands.OVERRIDE_MIN_PERM_LEVEL > cmd.command.permlevel ? bot.constants.commands.OVERRIDE_MIN_PERM_LEVEL : cmd.command.permlevel} (${bot.modules.parsers.permLevels(bot.constants.commands.OVERRIDE_MIN_PERM_LEVEL > cmd.command.permlevel ? bot.constants.commands.OVERRIDE_MIN_PERM_LEVEL : cmd.command.permlevel)})\n- Current permission: ${level} (${bot.modules.parsers.permLevels(level)})`, 'UNAUTHORIZED')],
                    ephemeral: true
                })
            }
        }
        //await command.executeInteraction(bot, interaction);
    } catch (error) {
        logger.error(`[EVENTS] [IC] Error while running ${interaction.commandName}:`, error);
        await interaction.followUp({
            embeds: [
                bot.modules.embed.create(message, 'An error occured while executing the command.', 'ERROR')
            ],
            ephemeral: true
        });
    }
}