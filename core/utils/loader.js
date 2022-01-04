const path = require('path')
const fs = require('fs')
const Discord = require('discord.js')

const { promisify } = require('util')
const { readdirSync } = fs
const readdir = promisify(fs.readdir)

class Loader {
	constructor() {

	}

	async init() {
		logger.info(`[LOADER] Booting up Core...`)
		try {
			await this.ensureStructure()
			await this.loadConfig()
			await this.loadBases()
			await this.loadModules()
			await this.loadDatabase()
			await this.loadEvents()
			await this.loadCommands()
			await this.loadInteractions()
		} catch (e) {
			logger.error(`[LOADER] Could not initialize core:`, e)
			return false
		}

		logger.success(`[LOADER] [COMMANDS] Successfully loaded Core.`)
		return true
	}

	async ensureStructure() {
		try {
			logger.info(`[LOADER] [STRUCTURE] Verifying Core structure...`)
			if (
				!fs.existsSync(path.join(__dirname, "../bases")) ||
				!fs.existsSync(path.join(__dirname, "../commands")) ||
				!fs.existsSync(path.join(__dirname, "../events")) ||
				!fs.existsSync(path.join(__dirname, "../libraries")) ||
				!fs.existsSync(path.join(__dirname, "../modules"))
			) {
				logger.error(`[LOADER] [STRUCTURE] CORE STRUCTURE COMPROMISED. Shutting down.`)
				process.exit(1)
			}

			logger.success(`[LOADER] [STRUCTURE] Core Structure is valid.`)

			logger.info(`[LOADER] [STRUCTURE] Verifying Plugin structure...`)

			if (fs.existsSync(path.join(__dirname, "../../plugins"))) {
				if (!fs.existsSync(path.join(__dirname, "../../plugins/commands"))) fs.mkdirSync(path.join(__dirname, "../../plugins/commands"))
				if (!fs.existsSync(path.join(__dirname, "../../plugins/modules"))) fs.mkdirSync(path.join(__dirname, "../../plugins/modules"))
				if (!fs.existsSync(path.join(__dirname, "../../plugins/events"))) fs.mkdirSync(path.join(__dirname, "../../plugins/events"))
			} else {
				logger.warn(`[LOADER] [STRUCTURE] Plugin directory non-existent. Creating...`)
				fs.mkdirSync(path.join(__dirname, "../../plugins"))
				fs.mkdirSync(path.join(__dirname, "../../plugins/commands"))
				fs.mkdirSync(path.join(__dirname, "../../plugins/modules"))
				fs.mkdirSync(path.join(__dirname, "../../plugins/events"))
				logger.success(`[LOADER] [STRUCTURE] Plugin directory successfully created.`)
			}
			logger.success(`[LOADER] [STRUCTURE] Plugin Structure is valid.`)

			logger.success(`[LOADER] [STRUCTURE] Successfully verified Code structure.`)
		} catch (e) {
			logger.error(`[LOADER] [STRUCTURE] Could not verify Code structure:`, e)
			logger.error(`[LOADER] [CONFIG] Shutting down.`)
			process.exit(1)
		}
	}

	async loadConfig() {
		logger.info(`\n===========================================\n                LOADING CONFIG                \n===========================================`)
		try {
			let defaultConfig = {
				"token": "",
				"version": "1.0.0",
				"client": {
					"id": "",
					"devServerID": "",
					"presences": {
					  "production": {
						"status": "",
						"activities": [{
							"name": "",
							"type": "",
							"url": ""
						  }
						]
					  },
					  "maintenance": {
						"status": "",
						"activities": [{
						  "name": "🚧 MAINTENANCE ONGOING 🚧",
						  "type": "WATCHING",
						  "url": null
						}]
					  },
					  "interval": "PRESENCE_INTERVAL"
					}
				},
				"messageCommands": {
					"prefix": "!"
				},
				"permissions": {
					"levels": {},
					"roles": {},
					"users": {},
					"owners": [],
					"developers": [],
					"overrides": {
						"roles": {},
						"users": {}
					}
				},
				"maintenance": false,
				"environment": "dev"
			}
			if (fs.existsSync('../../config.json')) {
				let config = require('../../config.json')

				for (let [key, value] of Object.entries(defaultConfig)) {
					if (config.hasOwnProperty(key)) {
						if ( ( Array.isArray(value) && Array.isArray(config[key]) ) || ( typeof(config[key]) == typeof(value) ) ) {
							if (typeof(value) == "object") {
								for (let [key2, value2] of Object.entries(value)) {
									if (config[key].hasOwnProperty(key2)) {
										if ( !( ( Array.isArray(value2) && Array.isArray(config[key][key2]) ) || ( typeof(config[key][key2]) == typeof(value2) ) ) ) {
											logger.error(`[LOADER] [CONFIG] Invalid configuration: Invalid data type for ${key.toUpperCase()}.${key2.toUpperCase()} (expected '${typeof(value2)}')`)
											logger.error(`[LOADER] [CONFIG] Shutting down.`)
											process.exit(1)
										}
									} else {
										logger.error(`[LOADER] [CONFIG] Invalid configuration: Missing ${key.toUpperCase()}.${key2.toUpperCase()}.`)
										logger.error(`[LOADER] [CONFIG] Shutting down.`)
										process.exit(1)
									}
								}
							}
						} else {
							logger.error(`[LOADER] [CONFIG] Invalid configuration: Invalid data type for ${key.toUpperCase()} (expected '${typeof(value)}')`)
							logger.error(`[LOADER] [CONFIG] Shutting down.`)
							process.exit(1)
						}
					} else {
						logger.error(`[LOADER] [CONFIG] Invalid configuration: Missing ${key.toUpperCase()}.`)
						logger.error(`[LOADER] [CONFIG] Shutting down.`)
						process.exit(1)
					}
				}

				bot.config = config

				logger.success(`[LOADER] [CONFIG] Successfully loaded Config.`)
			} else {
				return new Promise((resolve, reject) => {
					logger.warn(`[LOADER] [CONFIG] Could not find configuration file. Attempting to generate a default configuration file...`)
					fs.writeFile(path.join(__dirname, "../../config.json"), JSON.stringify(defaultConfig, null, 4), (err) => {
						if (err) {
							logger.error(`[LOADER] [CONFIG] Error while creating default configuration file:`, e)
							logger.error(`[LOADER] [CONFIG] Shutting down.`)
							process.exit(1)
						}

						logger.success(`[LOADER] [CONFIG] Configuration file created at ${path.join(__dirname, "../../config.json")}\nPlease write the correct information and restart the bot. Read the documentation in order to understand the properties' meaning.`)
						process.exit(1)
					})
				})
			}
		} catch (e) {
			logger.error(`[LOADER] [CONFIG] Error while loading configuration:`, e)
			logger.error(`[LOADER] [CONFIG] Shutting down.`)
			process.exit(1)
		}
	}

	async loadBases() {
		logger.info(`\n===========================================\n               LOADING BASES               \n===========================================`)
		bot.bases = {}
		try {
			readdirSync(path.join(__dirname, '../bases')).forEach(base => {
				try {
					const Class = require(path.join(__dirname, '../bases', base))
					bot.bases[Class.declarations.name] = Class.declarations.func
					logger.info(`[LOADER] [BASES] ${Class.declarations.name} successfuly loaded.`)
				} catch (e) {
					logger.error(`[LOADER] [BASES] Error while loading ${base}:`, e)
				}
			})
			logger.success(`[LOADER] [COMMANDS] Successfully loaded Bases.`)
		} catch (e) {
			logger.error(`[LOADER] [MODULES] Error while loading modules:`, e)
		}
	}

	async loadModules() {
		logger.info(`\n===========================================\n               LOADING MODULES               \n===========================================`)
		bot.modules = {}
		let unloaded = []
		try {
			logger.info(`[LOADER] [MODULES] Loading Core Modules...`)

			readdirSync(path.join(__dirname, "../modules")).forEach(module => {
				try {
					const Class = new(require(path.join(__dirname, "../modules", module)))()
					bot.modules[Class.declarations.name] = Class
					logger.info(`[LOADER] [MODULES] ${Class.declarations.name} successfuly loaded.`)
				} catch (e) {
					logger.error(`[LOADER] [MODULES] Error while loading ${module}:`, e)
				}
			})

			logger.success(`[LOADER] [MODULES] Successfully loaded Core Modules.`)
			logger.info(`[LOADER] [MODULES] Loading Plugin Modules...`)

			let modules = readdirSync(path.join(__dirname, "../../plugins/modules"))
			for (let module of modules) {
				try {
					const baseClass = require(path.join(__dirname, "../../plugins/modules", module))
					const Class = new baseClass()
					if (Class.validateStructure()) {
						if (Class.declarations.extends) {
							Class.setBaseClass(baseClass)
							if (bot.modules[Class.declarations.extends]) {
								let isAttached = await bot.modules[Class.declarations.extends].attach(Class)

								if (isAttached) {
									logger.success(`[LOADER] [MODULES] ${Class.declarations.name} successfuly loaded and attached to ${Class.declarations.extends.toUpperCase()}.`)
								} else {
									logger.error(`[LOADER] [MODULES] Could not attach ${Class.declarations.name} to ${Class.declarations.extends.toUpperCase()}.`)
								}
							} else unloaded.push({
								requires: Class.declarations.extends,
								Class
							})
						} else bot.modules[Class.declarations.name] = Class
					} else {
						logger.error(`[LOADER] [COMMANDS] Error while loading ${Class.declarations.name}: Invalid structure.`);
					}
				} catch (e) {
					logger.error(`[LOADER] [MODULES] Error while loading ${module}:`, e)
				}
			}

			function loadUnloadedModules() {
				let clone = unloaded.slice(0)
				return new Promise(async (resolve, reject) => {
					try {
						for (let i in unloaded) {
							let UModule = unloaded[i]
							if (!bot.modules[UModule.requires]) continue;

							try {
								let Class = UModule.Class

								if (Class.validateStructure()) {
									if (Class.declarations.extends) {
										Class.setBaseClass(baseClass)
										if (bot.modules[Class.declarations.extends]) {
											let isAttached = await bot.modules[Class.declarations.extends].attach(Class)

											if (isAttached) {
												unloaded.splice(i, 1)
												logger.success(`[LOADER] [MODULES] ${Class.declarations.name} successfuly loaded and attached to ${Class.declarations.extends.toUpperCase()}.`)
											} else {
												logger.error(`[LOADER] [MODULES] Could not attach ${Class.declarations.name} to ${Class.declarations.extends.toUpperCase()}.`)
											}
										}
									} else bot.modules[Class.declarations.name] = Class
								} else {
									logger.error(`[LOADER] [COMMANDS] Error while loading ${Class.declarations.name}: Invalid structure.`);
								}
							} catch (e) {
								logger.error(`[LOADER] [MODULES] Error while loading ${Class.declarations.name}:`, e)
							}
						}

						if (unloaded.length == 0) return resolve()

						if (bot.modules.manipulators.array.checkEquality(unloaded, clone)) {
							logger.warn(`[LOADER] [MODULES] Unresolved infinite loop detected. Skipping unloaded modules.`)
							resolve()
						} else await loadUnloadedModules()

						resolve()
					} catch (e) {
						logger.error(`[LOADER] [MODULES] Error while attempting to load unloaded modules:`, e)
						reject()
					}
				})
			}

			if (unloaded.length > 0) {
				logger.info(`[LOADER] [MODULES] Attempting to load Unloaded Plugin Modules...`)
				await loadUnloadedModules()
				logger.success(`[LOADER] [MODULES] Unloaded Plugin Modules resolved.`)
			}

			logger.success(`[LOADER] [MODULES] Successfully loaded Plugin Modules.`)
			logger.success(`[LOADER] [COMMANDS] Successfully loaded Modules.`)
		} catch (e) {
			logger.error(`[LOADER] [MODULES] Error while loading modules:`, e)
		}
	}

	async loadEvents() {
		logger.info(`\n===========================================\n               LOADING EVENTS               \n===========================================`)

		let stats = {
			success: 0,
			fail: 0
		}
		async function loadEventTree(Dir) {
			return new Promise(async (resolve, reject) => {
				const evtFiles = await readdir(path.join(__dirname, Dir))

				evtFiles.forEach(evt => {
					const eventName = evt.split('.')[0]
					try {
						logger.info(`[LOADER] [EVENTS] Loading ${eventName}`)
						const event = require(path.join(__dirname, Dir, evt))
						bot.on(eventName, event.bind(null, bot))
						delete require.cache[require.resolve(path.join(__dirname, Dir, evt))]
						logger.success(`[LOADER] [EVENTS] ${eventName} successfully loaded.`)
						stats.success++
					} catch (e) {
						logger.error(`[LOADER] [EVENTS] Error while loading ${eventName}:`, e)
						stats.fail++
					}
				})

				resolve()
			})
		}
		
		logger.info(`[LOADER] [EVENTS] Loading Core Events...`)
		await loadEventTree('../events').catch(e => {
			logger.error(`[LOADER] [EVENTS] Could not load Core Events:`, e)
		})
		logger.success(`[LOADER] [EVENTS] Successfully loaded Core Events.`)

		logger.info(`[LOADER] [EVENTS] Loading Plugin Events...`)
		await loadEventTree('../../plugins/events').catch(e => {
			logger.error(`[LOADER] [EVENTS] Could not load Plugin Events:`, e)
		})
		logger.success(`[LOADER] [EVENTS] Successfully loaded Plugin Events.`)

		logger.success(`[LOADER] [EVENTS] Successfully loaded Events.\nEVENTS LOADED: ${stats.success}/${stats.success + stats.fail}\nEVENTS FAILED: ${stats.fail}/${stats.success + stats.fail}`)
	}

	async loadCommands() {
		logger.info(`\n===========================================\n               LOADING COMMANDS               \n===========================================`)
		bot.commands = new Discord.Collection();
		bot.aliases = new Discord.Collection();

		async function loadCommandTree(Dir = '../commands') {
			try {
				let dir = path.join(__dirname, Dir)
				let Dirs = readdirSync(dir)
				for (let dirs of Dirs) {
					const commands = readdirSync(`${dir}${path.sep}${dirs}${path.sep}`).filter(files => files.endsWith(".js"));
					for (const file of commands) {
						logger.info(`[LOADER] [COMMANDS] Loading ${file}...`)
						const filePull = require(`${dir}/${dirs}/${file}`);
						let pull = new filePull()
						pull._setFilePath(`${dir}${path.sep}${dirs}${path.sep}${file}`)
						if (pull.validateStructure()) {
							if (bot.commands.get(pull.command.name)) return logger.warn(`[LOADER] [COMMANDS] Multiple commands have the same name: ${pull.command.name}.`);
							bot.commands.set(pull.command.name, pull);
							logger.success(`[LOADER] [COMMANDS] ${pull.command.name} successfully loaded.`);
						} else {
							logger.error(`[LOADER] [COMMANDS] Error while loading ${pull.command.name}: Invalid structure.`);
							continue;
						}

						if (Array.isArray(pull.command?.aliases)) {
							pull.command.aliases.forEach(alias => {
								if (bot.aliases.get(alias)) return logger.warn(`[LOADER] [COMMANDS] Multiple commands have the same alias: ${alias}`);
								bot.aliases.set(alias, pull.command.name);
							});
						}

						let isValid = (pull.command.arguments?.length > 0) ? await bot.modules.verifiers.rcArguments(pull.command) : true
						if (isValid) {
							logger.info(`[LOADER] [COMMANDS] Successfully loaded ${pull.command.name} with ${pull.command?.aliases?.length} aliases registered.`)
						} else {
							logger.warn(`[LOADER] [COMMANDS] Could not load ${pull.command.name} as it possesses invalid arguments.`)
							bot.commands.delete(pull.command.name)
						}
					}
				};
			} catch (e) {
				throw `[COMMANDS] Error while loading commands: ${e.message}\n${e.stack}`
			}
		}

		try {
			logger.info(`[LOADER] [COMMANDS] Loading Core Commands...`)

			await loadCommandTree()

			logger.success(`[LOADER] [COMMANDS] Successfully loaded Core Commands.`)
			logger.info(`[LOADER] [COMMANDS] Loading Plugin Commands...`)

			await loadCommandTree("../../plugins/commands")

			logger.success(`[LOADER] [COMMANDS] Successfully loaded Plugin Commands.`)
			logger.success(`[LOADER] [COMMANDS] Successfully loaded Commands.`)
		} catch (e) {
			throw e
		}
	}

	async loadInteractions() {
		logger.info(`\n===========================================\n            LOADING INTERACTIONS            \n===========================================`)

		if (bot.commands) await bot.modules.registerers.interactions()
		else logger.warn(`[LOADER] [INTERACTIONS] Could not initialize interactions because there is no commands available.`)

		logger.success(`[LOADER] [COMMANDS] Successfully loaded Interactions.`)
	}

	async loadDatabase() {
		logger.info(`\n===========================================\n              LOADING DATABASE            \n===========================================`)

		await bot.modules.db.tables.fReset('Tokens')

		logger.info(`[LOADER] Database Routines executed.`)
		logger.success(`[LOADER] [COMMANDS] Successfully loaded Database.`)
	}
}

module.exports = Loader