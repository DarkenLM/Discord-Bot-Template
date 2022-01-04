const Discord = require("discord.js");

module.exports = async bot => {
	var cMembers = bot.users.cache.filter(u => u.id !== '1').size;
	var gCount = bot.guilds.cache.size;

	logger.info(`[EVENTS] [READY] Registering interactions' permissions...`)
	let permreg = await bot.modules.registerers.permLevels()

	if (permreg) logger.success(`[EVENTS] [READY] Interactions' permissions successfully registered.`)
	else {
		logger.error(`[LOADER] [INTERACTIONS] Could not load Permissions. Shutting down.`)
		process.exit(1)
	} //logger.warn(`[EVENTS] [READY] Interactions' permissions not registered. Interactions may not work as predicted`)

	function setPresence() {

		if (bot.config.hasOwnProperty("maintenance") && bot.config.maintenance) {
			/*bot.user.setPresence({
				activities: [
					{ name: '🚧 MAINTENANCE ONGOING 🚧' }
				],
				status: 'idle'
			})*/
			let presence = bot.config.client.presences.maintenance

			bot.user.setPresence({
				activities: [presence.activities[Math.floor(Math.random() * presence.activities.length)]],
				status: presence.status
			})
		} else {
			/*bot.user.setPresence({
				activities: [
					{ name: 'Lost? Go fuck yourself.' }, 
					{ name: 'H' }
				],
				status: 'online'
			})*/
			let presence = bot.config.client.presences.production
			bot.user.setPresence({
				activities: [presence.activities[Math.floor(Math.random() * presence.activities.length)]],
				status: presence.status
			})
		}

		setTimeout(() => { setPresence() }, bot.modules.parsers.parseTime(bot.config.client.presences.interval))
	}
	
	setPresence()

	logger.info(`Logged as '${bot.user.tag}' (${bot.user.id}). Serving ${cMembers} users across ${gCount} servers. Bot Version: ${bot.config.version}`);
};