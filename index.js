/*
*   DISCORD BOT
*     By: DarkenLM
*
*   VERIONS:
*     v1.0.0
*     Discord.js: v13
*
*   WARNING: DO NOT MODIFY THIS FILE UNLESS YOU KNOW WHAT YOU ARE DOING
*/

(async () => {
  const { Client, Intents } = require('discord.js');
  const bot = new Client({ 
    intents: [
      Intents.FLAGS.GUILDS, 
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_MESSAGES, 
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
  });
  global.bot = bot

  let loader = require('./core/utils/init')
  await loader()

  global.bot.constants.paths.root = __dirname

  bot.login(bot.config.token);
})()
