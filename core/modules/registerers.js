/*
*   MODULE
*       Registerers
*       By: DarkenLM
*       First Version: 23/08/2021 | Last Update: 03/12/2021
*       Documentation Page: modules/registerers
*/

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

const _Module = bot.bases.modules
class Module extends _Module {
  constructor() {
    super();
    this.declarations.name = 'registerers'
  }

  /**
   * CRITICAL SYSTEM FUNCTION
   * DO NOT USE UNLESS YOU KNOW WHAT YOU'RE DOING
   * 
   * This function registers the Permission Levels for this bot.
   * @returns {null} 
   */

  async permLevels() {
    let permissions = {
      //users: [],
      //roles: [],
      //levels: [],
      //unitary: []
    }

    let origin = bot.config.permissions
    let _keys = []

    if (typeof(bot.config.permissions) !== "object") {
      logger.error(`[REGISTERERS] [PERM] Error while loading permissions: Invalid data type for PERMISSIONS configuration: '${typeof(bot.config.permissions)}' (expected 'object')`)
      return null
    }

    if (typeof(origin.users) == "object") permissions.users = Object.keys(origin.users).length > 0 ? origin.users : {}
    else {
      logger.error(`[REGISTERERS] [PERM] Error while loading permissions: Invalid data type for PERMISSIONS.USERS configuration: '${typeof(origin.users)}' (expected 'object')`)
      return null
    }
    
    _keys = []
    for (let [key, value] of Object.entries(permissions.users)) {
      if (_keys.includes(key)) {
        logger.error(`[REGISTERERS] [PERM] Error while loading permissions: Invalid data for PERMISSIONS.USERS configuration: DUPLICATES`)
        return null
      }

      _keys.push(key)
    }


    if (typeof(origin.roles) == "object") permissions.roles = Object.keys(origin.roles).length > 0 ? origin.roles : {}
    else {
      logger.error(`[REGISTERERS] [PERM] Error while loading permissions: Invalid data type for PERMISSIONS.ROLES configuration: '${typeof(origin.roles)}' (expected 'object')`)
      return null
    }

    _keys = []
    for (let [key, value] of Object.entries(permissions.roles)) {
      if (_keys.includes(key)) {
        logger.error(`[REGISTERERS] [PERM] Error while loading permissions: Invalid data for PERMISSIONS.ROLES configuration: DUPLICATES`)
        return null
      }

      _keys.push(key)

      if (typeof(value) == "object") {
        let __keys = []
        for (let [key2, value2] of Object.entries(value)) {
          if (__keys.includes(key2)) {
            logger.error(`[REGISTERERS] [PERM] Error while loading permissions: Invalid data for PERMISSIONS.ROLES.${key} configuration: DUPLICATES`)
            return null
          }
    
          __keys.push(key2)
        }
      } else {
        logger.error(`[REGISTERERS] [PERM] Error while loading permissions: Invalid data for PERMISSIONS.ROLES configuration: GUILD NOT AN OBJECT`)
        return null
      }

    }

    if (typeof(origin.levels) == "object") permissions.levels = Object.keys(origin.levels).length > 0 ? origin.levels : { "Owner": 100, "Developer": 99, "Admin": 10, "Moderator": 9, "User": 0 }
    else {
      logger.error(`[REGISTERERS] [PERM] Error while loading permissions: Invalid data type for PERMISSIONS.LEVELS configuration: '${typeof(origin.levels)}' (expected 'object')`)
      return null
    }

    _keys = []
    for (let [key, value] of Object.entries(permissions.levels)) {
      if (_keys.includes(key)) {
        logger.error(`[REGISTERERS] [PERM] Error while loading permissions: Invalid data for PERMISSIONS.LEVELS configuration: DUPLICATES`)
        return null
      }

      _keys.push(key)
    }

    // WIP
    //
    // if (typeof(origin.unitary) == "object") permissions.unitary = origin.unitary || {}
    // else  {
    //   logger.error(`[REGISTERERS] [PERM] Error while loading permissions: Invalid data type for PERMISSIONS.UNITARY configuration: '${typeof(origin.unitary)}' (expected 'object')`)
    //   return null
    // }

    if (Array.isArray(origin.owners)) permissions.owners = origin.owners.length > 0 ? origin.owners : []
    else {
      logger.error(`[REGISTERERS] [PERM] Error while loading permissions: Invalid data type for PERMISSIONS.OWNERS configuration: '${typeof(origin.owners)}' (expected 'array')`)
      return null
    }

    _keys = []
    for (let key of permissions.owners) {
      if (_keys.includes(key)) {
        logger.error(`[REGISTERERS] [PERM] Error while loading permissions: Invalid data for PERMISSIONS.OWNERS configuration: DUPLICATES`)
        return null
      }

      _keys.push(key)
    }
    
    if (Array.isArray(origin.developers)) permissions.developers = origin.developers.length > 0 ? origin.developers : []
    else {
      logger.error(`[REGISTERERS] [PERM] Error while loading permissions: Invalid data type for PERMISSIONS.DEVELOPERS configuration: '${typeof(origin.developers)}' (expected 'array')`)
      return null
    }

    _keys = []
    for (let key of permissions.developers) {
      if (_keys.includes(key)) {
        logger.error(`[REGISTERERS] [PERM] Error while loading permissions: Invalid data for PERMISSIONS.DEVELOPERS configuration: DUPLICATES`)
        return null
      }

      _keys.push(key)
    }

    if (typeof(origin.overrides) == "object") permissions.overrides = Object.keys(origin.overrides).length > 0 ? origin.overrides : { users: {}, roles: {} }
    else {
      logger.error(`[REGISTERERS] [PERM] Error while loading permissions: Invalid data type for PERMISSIONS.OVERRIDES configuration: '${typeof(origin.overrides)}' (expected 'object')`)
      return null
    }

    if (typeof(permissions.overrides.users) !== "object") {
      logger.error(`[REGISTERERS] [PERM] Error while loading permissions: Invalid data type for PERMISSIONS.OVERRIDES.USERS configuration: '${typeof(permissions.overrides.users)}' (expected 'object')`)
      return null
    }

    _keys = []
    for (let [key, value] of Object.entries(permissions.overrides.users)) {
      if (_keys.includes(key)) {
        logger.error(`[REGISTERERS] [PERM] Error while loading permissions: Invalid data for PERMISSIONS.OVERRIDES.USERS configuration: DUPLICATES`)
        return null
      }

      _keys.push(key)
    }

    if (typeof(permissions.overrides.roles) !== "object") {
      logger.error(`[REGISTERERS] [PERM] Error while loading permissions: Invalid data type for PERMISSIONS.OVERRIDES.ROLES configuration: '${typeof(permissions.overrides.roles)}' (expected 'object')`)
      return null
    }

    _keys = []
    for (let [key, value] of Object.entries(permissions.overrides.roles)) {
      if (_keys.includes(key)) {
        logger.error(`[REGISTERERS] [PERM] Error while loading permissions: Invalid data for PERMISSIONS.OVERRIDES.ROLES configuration: DUPLICATES`)
        return null
      }

      _keys.push(key)

      if (typeof(value) == "object") {
        let __keys = []
        for (let [key2, value2] of Object.entries(value)) {
          if (__keys.includes(key2)) {
            logger.error(`[REGISTERERS] [PERM] Error while loading permissions: Invalid data for PERMISSIONS.OVERRIDES.ROLES.${key} configuration: DUPLICATES`)
            return null
          }
    
          __keys.push(key2)
        }
      } else {
        logger.error(`[REGISTERERS] [PERM] Error while loading permissions: Invalid data for PERMISSIONS.OVERRIDES.ROLES configuration: GUILD NOT AN OBJECT`)
        return null
      }

    }



    bot.temp = {
      permLevels: permissions.levels
    }

    if (permissions.owners.length == 0) {
      let perm = bot.modules.generators.permissions.topt(Object.entries(permissions.levels).sort(([keyA, valueA], [keyB, valueB]) => valueB - valueA)[0][1], '1h')//.ubot(10, 10)
      if (perm) {
        logger.success(`[TOKEN] Permission Token for LEVEL 10: ${perm}\nUse '/permtoken set <token>'' to activate the Token\nWARNING: DO NOT SEND THIS TOKEN TO ANYONE! THIS TOKEN GRANTS OWNER PERM LEVEL TO ANY USER!`)
      } else {
        logger.error(`[REGISTERERS] [PERM] Failed to register permissions:`, e)
        return null
      }
    }

    bot.config.permissions = permissions
    delete bot.temp.permLevels
    return true

    //console.log(bot.constants.keyMap.get(bot.constants['1ca7140650b31d8ecd02a2a64911dc9c06e9c3fd']))

    /*if (bot.config?.permissions?.levels && (bot.config?.permissions?.users || bot.config?.permissions?.roles || bot.config?.permissions?.unitary)) {
      if (typeof(bot.config.permissions) !== "object") {
        logger.error(`[REGISTERERS] [PERM] Error while loading permissions: Invalid data type for PERMISSIONS configuration: '${bot.config.permissions}' (expected 'object')`)
        return null
      }
    } else {
      logger.warn(`[REGISTERERS] [PERM] No valid PERMISSIONS config found. Using default values.`)

      /*permissions.levels = [
        { level: 100, label: 'Owner' },
        { level: 99, label: 'Developer' },
        { level: 10, label: 'Admin' },
        { level: 9, label: 'Super Moderator' },
        { level: 8, label: 'Moderator' },
        { level: 0, label: 'User' },
      ]* /

      permissions.levels = {
        "Owner": 100,
        "Developer": 99,
        "Admin": 10,
        "Super Moderator": 9,
        "Moderator": 8,
        "User": 0
      }

      bot.temp = {
        permLevels: permissions.levels
      }

      let perm = bot.modules.generators.permissions.topt(100, '1h')//.ubot(10, 10)
      if (perm) {
        logger.success(`[TOKEN] Permission Token for LEVEL 10: ${perm}\nUse '/permtoken set <token>'' to activate the Token\nWARNING: DO NOT SEND THIS TOKEN TO ANYONE! THIS TOKEN GRANTS OWNER PERM LEVEL TO ANY USER!`)
      } else {
        logger.error(`[REGISTERERS] [PERM] Failed to register permissions:`, e)
      }

      delete bot.temp.permLevels
    }*/
  }

  /**
   * CRITICAL SYSTEM FUNCTION
   * DO NOT USE UNLESS YOU KNOW WHAT YOU'RE DOING
   * 
   * This function registers the Command Interactions for this bot.
   * @returns {null} 
   */

  async interactions() {
    let commands     = bot.commands,
    interactions = []
    
    const iterator = commands[Symbol.iterator]();
    for (const iter of iterator) {
      let command = iter[1].command
      logger.info(`[REGISTERERS] [INT] Attempting to register interaction for ${command.name}.`)
      try {
        let slashCommand = this._registerInteraction(command)
        if (slashCommand) {
          interactions.push(slashCommand)
          logger.success(`[REGISTERERS] [INT] Successfully registered interaction for ${command.name}.`)
        }
      } catch (e) {
        logger.error(`[REGISTERERS] [INT] Error while registering interaction for ${command.name}:`, e)
      }
    }

    logger.info(`[REGISTERERS] [INT] Registering interactions...`)
    try {
      const rest = new REST({ version: '9' }).setToken(bot.config.token);

      if (bot.config?.environment === "prod") {
        await rest.put(
          Routes.applicationCommands(bot.config.client.id),
          { body: interactions },
        );
      } else {
        await rest.put(
          Routes.applicationGuildCommands(bot.config.client.id, bot.config.client.devServerID), 
          { body: interactions }
        );
      } 
    } catch (e) {
      logger.error(`[REGISTERERS] [INT] Error while registering interactions:`, e)
    }

    //logger.info(`[REGISTERERS] [INT] Registering integrations' permissions...`)

    //await this._registerPermissions(commands)

    /*let commands = await bot.aplication.commands.fetch()
    const iterator2 = commands[Symbol.iterator]();
    for (let iter in iterator2) {
      let command = iter[1]

      if (permissions[command.id]) {

      }
    }*/
  }

  /**
   * CRITICAL SYSTEM FUNCTION
   * DO NOT USE UNLESS YOU KNOW WHAT YOU'RE DOING
   * 
   * This function registers the Command Interaction Permissions for this bot.
   * 
   * CURRENTLY UNUSED
   * 
   * @returns {null} 
   */

  async permissions() {
    let commands = bot.commands
    let interactions = await bot.application.commands.fetch()

    //let stop = false
    let control = {
      hasInternal: false
    }  

    const iterator = commands[Symbol.iterator]();
    for (let iter in iterator) {
      //if (stop) return null;

      let command = iter[1]
      let interaction = interactions.filter(i => i.name === command.command.name)[0]

      if (interaction) {
        command.command.permissions.sort(function(a, b) {
          if (a.type === 'internal') return -1; else return 1;
        })

        for (let permission of command.command.permissions) {
          switch (permission.type) {
            case 'internal': {
              if (!permission.id || !permission.type || !permission.hasOwnProperty('permission')) {
                logger.warn(`[REGISTERS] [RP] ${command.command.name} invalid permission error: Missing ID, TYPE or PERMISSION properties.`)
                return null;//stop = true
                //break;
              }

              if (!bot.modules.parsers.permLevels(permission.level, true)) {
                logger.warn(`[REGISTERS] [RP] ${command.command.name} has an invalid internal permLevel: ${permission.level}`)
                return null;//stop = true
                //break;
              }
              control.hasInternal = true
              break;
              /*if (control.hasInternal) {
                logger.warn(`[REGISTERS] [RI] ${command.command.name} has more than one internal`)
              }*/
            }
            case 'user': {
              if (!permission.id || !permission.type || !permission.hasOwnProperty('permission')) {
                logger.warn(`[REGISTERS] [RP] ${command.command.name} invalid permission error: Missing ID, TYPE or PERMISSION properties.`)
                return null;//stop = true
                //break;
              }

              if (control.hasInternal) {
                logger.warn(`[REGISTERS] [RP] ${command.command.name} incompatibility error: Cannot add USER permission over INTERNAL.`)
                return null;//stop = true
                //break;
              }

              let userRegex = /^(?:<@!?)?(\d{17,21})>?$/gm
              let sfRegex = /^(\d{17,21})$/gm
              if (!userRegex.test(permission.id) || !sfRegex.test(permission.id)) {
                logger.warn(`[REGISTERS] [RP] ${command.command.name} has an invalid user id: ${permission.id}`)
                return null;//stop = true
                //break;
              }
              break;
            }
            case 'role': {
              if (!permission.id || !permission.type || !permission.hasOwnProperty('permission')) {
                logger.warn(`[REGISTERS] [RP] ${command.command.name} invalid permission error: Missing ID, TYPE or PERMISSION properties.`)
                return null;//stop = true
                //break;
              }

              if (control.hasInternal) {
                logger.warn(`[REGISTERS] [RP] ${command.command.name} incompatibility error: Cannot add ROLE permission over INTERNAL.`)
                return null;//stop = true
                //break;
              }

              let roleRegex = /^(?:<@&)?(\d{17,21})>?$/gm
              let sfRegex = /^(\d{17,21})$/gm
              if (!roleRegex.test(permission.id) || !sfRegex.test(permission.id)) {
                logger.warn(`[REGISTERS] [RP] ${command.command.name} has an invalid role id: ${permission.id}`)
                return null;//stop = true
                //break;
              }
              break;
            }
          }
        }
        command.permissions.set(command.command.permissions)
      }
    }
    return true
  }

  /**
   * CRITICAL SYSTEM FUNCTION
   * DO NOT USE UNLESS YOU KNOW WHAT YOU'RE DOING
   * 
   * Internal System Call for permissions
   * @returns {null} 
   */
   _registerInteraction(Command) {
    //console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
    let slashCommand = new SlashCommandBuilder()
    .setName(Command.name)
    .setDescription(Command.description.short || 'No description provided.')

    //console.log('SCB', slashCommand)

    let stop = false

    function registerArguments(interactionPart, command, types) {
      //console.log(arguments)
      if (command.arguments) {
        for (let arg of command.arguments) {
          if (arg?.messageOnly) continue;
          //console.log(arg)
          switch (arg.type) {
            case 'SUB_COMMAND_GROUP': {
              if (types?.subCommandGroup) {
                logger.warn(`[REGISTERERS] [RI] Could not register ${command.name} for ${Command.name}: Cannot add subCommandGroup nested on subCommandGroup.`)
                stop = true
                break;
              }
              interactionPart.addSubcommandGroup((group) => {
                group
                .setName(arg.name)
                .setDescription(arg.description)

                /*arg.subCommands.forEach(subCommand => {
                  registerArguments(group, subCommand, { subCommandGroup: true })
                })*/
                registerArguments(group, {arguments: arg.subCommands}, { subCommandGroup: true })

                return group
              })
              break;
            }
            case 'SUB_COMMAND': {
              if (types?.subCommand) {
                logger.warn(`[REGISTERERS] [RI] Could not register ${command.name} for ${Command.name}: Cannot add subCommand nested on subCommand.`)
                stop = true
                break;
              }
              interactionPart.addSubcommand(option => {
                option
                .setName(arg.name)
                .setDescription(arg.description)

                /*for (let subArg of arg.arguments) {
                  registerArguments(option, subArg, { subCommand: true })
                }*/
                //console.log(arg)
                registerArguments(option, arg, { subCommand: true })

                return option
              })
              break;
            }
            case 'STRING': {
              //console.log('ADDED1', integrationPart)
              if (arg?.choices?.length > 0) {
                interactionPart.addStringOption(option => {
                  option
                  .setName(arg.name)
                  .setDescription(arg.description)
                  .setRequired(arg.required)
                  
                  arg.choices.forEach(choice => {
                    option.addChoice(choice.name, choice.value)
                  })

                  return option
                })
              } else {
                interactionPart.addStringOption(option =>
                  option
                  .setName(arg.name)
                  .setDescription(arg.description)
                  .setRequired(arg.required)
                );
              }
              break;
            }
            case 'INTEGER': {
              if (arg?.choices?.length > 0) {
                interactionPart.addIntegerOption(option => {
                  option.setName(arg.name)
                  .setDescription(arg.description)
                  .setRequired(arg.required)
                  
                  arg.choices.forEach(choice => {
                    option.addChoice(choice.name, choice.value)
                  })

                  return option
                })
              } else {
                interactionPart.addIntegerOption(option =>
                  option
                  .setName(arg.name)
                  .setDescription(arg.description)
                  .setRequired(arg.required)
                );
              }
              break;
            }
            case 'NUMBER': {
              interactionPart.addNumberOption(option =>
                option
                .setName(arg.name)
                .setDescription(arg.description)
                .setRequired(arg.required)
              );
              break;
            }
            case 'BOOLEAN': {
              interactionPart.addBooleanOption(option =>
                option
                .setName(arg.name)
                .setDescription(arg.description)
                .setRequired(arg.required)
              );
              break;
            }
            case 'USER': {
              interactionPart.addUserOption(option =>
                option
                .setName(arg.name)
                .setDescription(arg.description)
                .setRequired(arg.required)
              );
              break;
            }
            case 'CHANNEL': {
              interactionPart.addChannelOption(option =>
                option
                .setName(arg.name)
                .setDescription(arg.description)
                .setRequired(arg.required)
              );
              break;
            }
            case 'ROLE': {
              interactionPart.addRoleOption(option =>
                option
                .setName(arg.name)
                .setDescription(arg.description)
                .setRequired(arg.required)
              );
              break;
            }
            case 'MENTIONABLE': {
              interactionPart.addMentionableOption(option =>
                option
                .setName(arg.name)
                .setDescription(arg.description)
                .setRequired(arg.required)
              );
              break;
            }
          }
        }
      }
    }

    registerArguments(slashCommand, Command)

    //console.log(JSON.stringify(slashCommand, null, 4))
    if (stop) return false
    else return slashCommand.toJSON()
  }
}

module.exports = Module