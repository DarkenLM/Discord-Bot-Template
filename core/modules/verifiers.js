/*
 *   MODULE
 *       Verifiers
 *       By: DarkenLM
 *       First Version: 23/08/2021 | Last Update: 03/08/2021
 *       Documentation Page: modules/verifiers
 */

const Discord = require('discord.js');
const db = require('quick.db')

const _Module = bot.bases.modules
class Module extends _Module {
	constructor() {
		super();
		this.declarations.name = 'verifiers'
	}

	/* PermLevel */
	async permLevel(message) {
		try {
			let tempPerm = 0
			let isTokenValid = await this.permToken(message.author.id)
			if (typeof (isTokenValid) == "object" && isTokenValid?.valid) {
				let dbTable = await bot.modules.db.tables.get('Tokens')
				let userToken = await dbTable.get(`${message.author.id}.global`)

				let tokenStats = bot.modules.parsers.permToken(userToken.token)

				tempPerm = parseInt(tokenStats.data.level)
			}

			function setOrDropPL(level) {
				if (tempPerm < level) tempPerm = level
			}

			if (bot.config.permissions.owners.includes(message.author.id)) setOrDropPL(100)//return 100;
			if (bot.config.permissions.developers.includes(message.author.id)) setOrDropPL(99)//return 99;
			if (bot.config.permissions.users[message.author.id]) setOrDropPL(bot.config.permissions.users[message.author.id])

			for (let _role of message.member.roles.cache[Symbol.iterator]()) {
				let role = _role[1]
				if (bot.config.permissions.roles.hasOwnProperty(message.member.guild.id) && bot.config.permissions.roles[message.member.guild.id][role.id]) setOrDropPL(bot.config.permissions.roles[message.member.guild.id][role.id])
				if (bot.config.permissions.roles.hasOwnProperty(message.member.guild.id) && bot.config.permissions.overrides.roles[message.member.guild.id]?.hasOwnProperty(role.id)) tempPerm = bot.config.permissions.overrides.roles[message.member.guild.id][role.id]
			}

			if (bot.config.permissions.overrides.users.hasOwnProperty(message.author.id)) tempPerm = bot.config.permissions.overrides.users[message.author.id]

			return tempPerm
		} catch (e) {
			logger.error(`[PARSERS] [PERMLEVEL] Error while determining permission level:`, e);
			logger.error(`[PARSERS] [PERMLEVEL] Defaulting permission to 0.`);
			return 0;
		}
	}

	/* Permission Token */
	async permToken(userID) {
		let dbTable = await bot.modules.db.tables.get('Tokens')
		let userToken = await dbTable.get(`${userID}.global`)
		if (userToken) {
			let tokenVer = bot.modules.parsers.permToken(userToken.token)
			switch (tokenVer.data.type) {
				case 'UBOT': {
					if (userToken.uses < tokenVer.data.uses) return { valid: true }
					else return { valid: false }
					break;
				}
				case 'TOPT': {
					if (parseInt(tokenVer.data.iat) + parseInt(tokenVer.data.exp) >= Date.now()) return { valid: true }
					else return { valid: false }
					break;
				}
			}
		} else return null
	}

	/* Registry Command Arguments */
	async rcArguments(Command) {
		return new Promise(async (resolve, reject) => {
			async function iterateArguments(command, types) {
				let lastRequired = null
				for (let i in command.arguments) {
					let arg = command.arguments[i]
					switch (arg.type) {
						case 'SUBCOMMAND_GROUP': {
							if (types?.subCommandGroup) {
								logger.warn(`[VERIFIERS] [RCA] Could not register ${command.name} for ${Command.name}: Cannot add subCommandGroup nested on subCommandGroup.`)
								stop = true
								break;
							}

							let res = await iterateArguments(arg.subCommands, { subCommandGroup: true })
							if (!res) {
								logger.warn(`[VERIFIERS] [RCA] Could not register ${command.name} for ${Command.name}: Cannot add a required argument after a non-required argument.`)
								return false
							}
						}
						case 'SUC_COMMAND': {
							if (types?.subCommandGroup) {
								logger.warn(`[VERIFIERS] [RCA] Could not register ${command.name} for ${Command.name}: Cannot add subCommand nested on subCommand.`)
								stop = true
								break;
							}

							let res = await iterateArguments(arg, { subCommand: true })
							if (!res) {
								logger.warn(`[VERIFIERS] [RCA] Could not register ${command.name} for ${Command.name}: Cannot add a required argument after a non-required argument.`)
								return false
							}
						}
						default: {
							if (arg.hasOwnProperty('required')) {
								if (lastRequired === false) {
									if (arg.required === true) return false
								} else lastRequired = arg.required
							}
						}
					}
				}

				return true
			}

			let res = await iterateArguments(Command)
			resolve(res)
		})
	}
}

module.exports = Module