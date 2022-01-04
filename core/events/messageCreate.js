const Discord = require("discord.js");
const db = require("quick.db");
const path = require('path');
const fs = require("fs");

module.exports = async (bot, message) => {
	if (message.author.bot) return;

	let prefix = bot.config.messageCommands.prefix;
	if (message.channel.type !== "dm") {
		const prefixMention = new RegExp(`^<@!?${bot.user.id}>( |)$`);
		if (message.content.match(prefixMention)) {
			let embed = bot.constants.messages.mentions.self

		  	return message.channel.send({ embeds: [bot.modules.embed.create(message, embed.content(bot.config.messageCommands.prefix), embed.embedType, {title: embed.overrides(message)})] })
		}
	}

	const _args		= message.content.slice(prefix.length).trim().split(/ +/g);
	const command	= _args.shift().toLowerCase();
	const level		= await bot.modules.verifiers.permLevel(message);
	const cmd		= bot.commands.get(command) || bot.commands.get(bot.aliases.get(command));
	const dbTable	= await bot.modules.db.tables.get('Tokens')
  	const userToken = await dbTable.get(`${message.author.id}.global`)

	if (!cmd) return;

	try {
		if (![0, 1].includes(cmd.command.restricted)) {
			logger.warn(`[EVENTS] [MC] ${message.author.tag} attempted to execute the command ${cmd.command.name}, but it was restricted to interaction mode`)
			message.reply({
			  embeds: [
				bot.modules.embed.create(message, `Please execute this command as a Slash Command.`, "UNAUTHORIZED")
			  ]
			}).then(msg => {
				setTimeout(() => {
					msg.delete()
				}, 5000)
			})
	  
			return;
		}

		let isEnabled = await bot.modules.parsers.ecl.get(cmd.command)
		if (isEnabled) {
			if (level >= cmd.command.permlevel) {
				let { validity, argMap } = await bot.modules.parsers.messageArguments(message, _args, cmd.command)
				if (validity === true) {
					logger.warn(`[EVENTS] [MC] ${message.author.tag} executed the command ${cmd.command.name}`)
					try {
						await cmd.execute(bot, message, argMap)
					} catch (e) {
						function genReport() {
							let reportID = bot.modules.generators.makeID(6)
							let reportPath = path.join(__dirname, "../../logs/error_reports", `${reportID}.md`)

							if (fs.existsSync(reportPath)) {
								genReport()
							} else {
								let cmdFile = fs.readFileSync(cmd.getFilePath())
								let data = [
									`# Error Report`,
									`**Report ID:** ${reportID}  `,
									`**Executed By:** ${message.author.username} (${message.author.id})  `,
									`**Command:** ${cmd.command.name}  `,
									`**Arguments**: \n\`\`\`json\n${JSON.stringify(argMap._dump(), null, 4)}\n\`\`\``,
									`**Mode:** Message  `,
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

									logger.warn(`[EVENTS] [MC] Error report generated: ${reportPath}`)
									message.reply({
										embeds: [
											bot.modules.embed.create(message, `An error happened executing this command.\nPlease inform the developers about this error.\n**Error ID:** \`${reportID}\``, "CRITICAL")
										]
									})
								} catch (err) {
									logger.error(`[EVENTS] [MC] Could not write error report file:`, err)
									message.reply({
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

					if (userToken?.type == "UBOT") await dbTable.add(`${userID}.global.uses`, 1)
				} else {
					message.reply({ 
						embeds: [ 
							bot.modules.embed.create(message, `${validity}`, 'UNAUTHORIZED') 
						] 
					}).then(msg => {
						setTimeout(() => {
							msg.delete()
						}, 5000)
					})
					logger.warn(`[EVENTS] [MC] ${message.author.tag} attempted to execute the command ${cmd.command.name} with invalid arguments: ${validity}`)
				}
			} else {
				logger.warn(`[EVENTS] [MC] ${message.author.tag} attempted to execute the command ${cmd.command.name} without valid permission`)
				message.reply({ 
					embeds: [ 
						bot.modules.embed.create(message, `- Required permission: ${cmd.command.permlevel} (${bot.modules.parsers.permLevels(cmd.command.permlevel)})\n- Current permission: ${level} (${bot.modules.parsers.permLevels(level)})`, 'UNAUTHORIZED') 
					] 
				}).then(msg => {
					setTimeout(() => {
						msg.delete()
					}, 5000)
				})
			}
		} else {
			if (level >= bot.constants.commands.OVERRIDE_MIN_PERM_LEVEL && level >= cmd.command.permlevel) {
				let { validity, argMap } = await bot.modules.parsers.messageArguments(message, _args, cmd.command)
				if (validity === true) {
					logger.warn(`[EVENTS] [MC] ${message.author.tag} executed the disabled command ${cmd.command.name}`)
					try {
						await cmd.execute(bot, message, argMap)
					} catch (e) {
						function genReport() {
							let reportID = bot.modules.generators.makeID(6)
							let reportPath = path.join(__dirname, "../../logs/error_reports", `${reportID}.md`)
							
							if (fs.existsSync(reportPath)) {
								genReport()
							} else {
								let cmdFile = fs.readFileSync(cmd.getFilePath())
								let data = [
									`# Error Report`,
									`**Report ID:** ${reportID}  `,
									`**Executed By:** ${message.author.username} (${message.author.id})  `,
									`**Command:** ${cmd.command.name}  `,
									`**Arguments**: \n\`\`\`json\n${JSON.stringify(argMap._dump(), null, 4)}\n\`\`\``,
									`**Mode:** Message  `,
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

									logger.warn(`[EVENTS] [MC] Error report generated: ${reportPath}`)
									message.reply({
										embeds: [
											bot.modules.embed.create(message, `An error happened executing this command.\nPlease inform the developers about this error.\n**Error ID:** \`${reportID}\``, "CRITICAL")
										]
									})
								} catch (err) {
									logger.error(`[EVENTS] [MC] Could not write error report file:`, err)
									message.reply({
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
					if (userToken?.type == "UBOT") await dbTable.add(`${userID}.global.uses`, 1)
				} else {
					message.reply({ embeds: [ bot.modules.embed.create(message, `${validity}`, 'UNAUTHORIZED') ] }).then(msg => {
						setTimeout(() => {
							msg.delete()
						}, 5000)
					})
					logger.warn(`[EVENTS] [MC] ${message.author.tag} attempted to execute the disabled command ${cmd.command.name} with invalid arguments: ${validity}`)
				}
			} else {
				logger.warn(`[EVENTS] [MC] ${message.author.tag} attempted to execute the disabled command ${cmd.command.name}`)
				message.reply({ 
					embeds: [ 
						bot.modules.embed.create(message, `- Required permission: ${bot.constants.commands.OVERRIDE_MIN_PERM_LEVEL > cmd.command.permlevel ? bot.constants.commands.OVERRIDE_MIN_PERM_LEVEL : cmd.command.permlevel} (${bot.modules.parsers.permLevels(bot.constants.commands.OVERRIDE_MIN_PERM_LEVEL > cmd.command.permlevel ? bot.constants.commands.OVERRIDE_MIN_PERM_LEVEL : cmd.command.permlevel)})\n- Current permission: ${level} (${bot.modules.parsers.permLevels(level)})`, 'UNAUTHORIZED') 
					] 
				}).then(msg => {
					setTimeout(() => {
						msg.delete()
					}, 5000)
				})
			}
		}
	} catch (e) {
		logger.error(`[EVENTS] [MC] Error while running ${cmd.command.name}:`, e)

        await message.reply({
            embeds: [
				bot.modules.embed.create(message, 'An error occured while executing the command.', 'ERROR')
			],
        }).then(msg => {
			setTimeout(() => {
				msg.delete()
			}, 5000)
		})
	}	
}
