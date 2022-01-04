/*
*   MODULE
*       Parsers
*       By: DarkenLM
*       First Version: 23/08/2021 | Last Update: 07/12/2021
*       Documentation Page: modules/parsers
*/

const UUID = require('uuid')
const crypto = require('crypto');
const dayjs = require('dayjs')
const localizedFormat = require('dayjs/plugin/localizedFormat')
const relativeTime = require('dayjs/plugin/relativeTime')
const db = require('quick.db')

const _Module = bot.bases.modules
class Module extends _Module {
    constructor() {
        super();
        this.declarations.name = 'parsers'
        
        this.ecl = {
            get: this.ecl_get,
            set: this.ecl_set
        }
    }

    /* 
    * Milliseconds Parsers 
    *
    * parseMS: ms » Time
    * parseTime: Time » ms
    * formatTime: ms » Formatted Time
    * 
    */

    parseMS(milliseconds) {
        if (typeof milliseconds !== 'number') {
            throw new TypeError('Expected a number');
        }
    
        return {
            days: Math.trunc(milliseconds / 86400000),
            hours: Math.trunc(milliseconds / 3600000) % 24,
            minutes: Math.trunc(milliseconds / 60000) % 60,
            seconds: Math.trunc(milliseconds / 1000) % 60,
            milliseconds: Math.trunc(milliseconds) % 1000,
            microseconds: Math.trunc(milliseconds * 1000) % 1000,
            nanoseconds: Math.trunc(milliseconds * 1e6) % 1000
        };
    }

    parseTime(val, options = {}) {
        // HELPERS
        let s = 1000;
        let m = s * 60;
        let h = m * 60;
        let d = h * 24;
        let w = d * 7;
        let y = d * 365.25;


        let type = typeof val;
        if (type === 'string' && val.length > 0) {
            return parse(val);
        } else if (type === 'number' && isFinite(val)) {
            return options.long ? fmtLong(val) : fmtShort(val);
        }
        throw new Error(
            'val is not a non-empty string or a valid number. val=' +
            JSON.stringify(val)
        );

        function parse(str) {
            str = String(str);
            if (str.length > 100) {
                return;
            }
            let match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
                str
            );
            if (!match) {
                return;
            }
            let n = parseFloat(match[1]);
            let type = (match[2] || 'ms').toLowerCase();
            switch (type) {
                case 'years':
                case 'year':
                case 'yrs':
                case 'yr':
                case 'y':
                    return n * y;
                case 'weeks':
                case 'week':
                case 'w':
                    return n * w;
                case 'days':
                case 'day':
                case 'd':
                    return n * d;
                case 'hours':
                case 'hour':
                case 'hrs':
                case 'hr':
                case 'h':
                    return n * h;
                case 'minutes':
                case 'minute':
                case 'mins':
                case 'min':
                case 'm':
                    return n * m;
                case 'seconds':
                case 'second':
                case 'secs':
                case 'sec':
                case 's':
                    return n * s;
                case 'milliseconds':
                case 'millisecond':
                case 'msecs':
                case 'msec':
                case 'ms':
                    return n;
                default:
                    return undefined;
            }
        }

        /**
         * Short format for `ms`.
         *
         * @param {Number} ms
         * @return {String}
         * @api private
         */

        function fmtShort(ms) {
            let msAbs = Math.abs(ms);
            if (msAbs >= d) {
                return Math.round(ms / d) + 'd';
            }
            if (msAbs >= h) {
                return Math.round(ms / h) + 'h';
            }
            if (msAbs >= m) {
                return Math.round(ms / m) + 'm';
            }
            if (msAbs >= s) {
                return Math.round(ms / s) + 's';
            }
            return ms + 'ms';
        }

        /**
         * Long format for `ms`.
         *
         * @param {Number} ms
         * @return {String}
         * @api private
         */

        function fmtLong(ms) {
            let msAbs = Math.abs(ms);
            if (msAbs >= d) {
                return plural(ms, msAbs, d, 'day');
            }
            if (msAbs >= h) {
                return plural(ms, msAbs, h, 'hour');
            }
            if (msAbs >= m) {
                return plural(ms, msAbs, m, 'minute');
            }
            if (msAbs >= s) {
                return plural(ms, msAbs, s, 'second');
            }
            return ms + ' ms';
        }

        /**
         * Pluralization helper.
         */

        function plural(ms, msAbs, n, name) {
            let isPlural = msAbs >= n * 1.5;
            return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
        }
    }

    formatTime(ms, locale = 'pt', format = 'L') {
        try {
            require(`dayjs/locale/${locale}`)
            dayjs.extend(relativeTime)
            dayjs.extend(localizedFormat)
            
            return dayjs(ms).locale(locale).format(format)
        } catch (e) {
            logger.error(`[PARSERS] [FT] Error while formatting time:`, e)
            return null
        }
    }

    /* Permlevel */
    permLevels(level, api) {
        return Object.entries(bot.config.permissions.levels).filter(([key, value]) => value === level)[0][0] || (api ? null : 'Not registered')
    }

    /* Permission Token */
    permToken(token) {
        try {
            let parts = token.split('.')
            let uuidParts = []
            let ivParts = []

            function ensurePadding(str) {
                return str + Array((4 - str.length % 4) % 4 + 1).join('=');
            }

            let decodedParts = parts.map(p => Buffer.from(ensurePadding(p), 'base64').toString('utf-8'))

            uuidParts.push(decodedParts[0].split('-')[0])
            let encrypted = decodedParts[0].split('-')[1]

            for (let i = 1; i <= 4; i++) {
                let splitted = decodedParts[i].split('-')
                uuidParts.push(splitted[0])
                ivParts.push(splitted[1])
            }

            let order = decodedParts[5].split('-')[0].split("")
            let iv = new Array(4)
            let count = 0
            for (let ordenator of order) {
                iv[parseInt(ordenator)] = ivParts[count]
                count++
            }

            let timestamp = decodedParts[5].split('-')[1]
            let uuid_v4 = uuidParts.map(p => p.split("").reverse().join("")).join('-')
            let uuid = UUID.v5(timestamp, uuid_v4)

            function decrypt(enc, iv, key) {
                let IV = Buffer.from(iv, 'hex');
                let encryptedText = Buffer.from(enc, 'hex');
                let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'base64').toString('utf-8'), IV);
                let decrypted = decipher.update(encryptedText);
                decrypted = Buffer.concat([decrypted, decipher.final()]);
                return decrypted.toString();
            }

            function assign(data) {
                let dataParts = data.split(':')
                return {variable: dataParts[0], value: dataParts[1]}
            }

            let decrypted = Buffer.from(decrypt(encrypted, iv.join(""), Buffer.from(uuid.substring(0, 32)).toString('base64')), 'base64').toString('utf-8')
            let decParts = decrypted.split(';')
            let variables = []
            decParts.forEach(part => {
                let data = assign(part)
                variables[data.variable] = data.value
            })

            let PTV = bot.constants.keyMap.get(bot.constants['1ca7140650b31d8ecd02a2a64911dc9c06e9c3fd']).permTokenVer
            if (variables?.v !== PTV) return { error: `Invalid Token` }

            let header = variables.h
            switch (header) {
                case 'ubot': {
                    if (variables.l && variables.u) {
                        let obj = { type: 'UBOT', level: variables.l, uses: variables.u }

                        if (variables.c) obj.command = variables.c

                        return { success: true, data: obj }
                    } else {
                        logger.warn(`[PARSERS] [PERMTOKEN] Invalid Token: L and/or U parameters missing.`)
                        return { error: `Invalid Token` }
                    } 
                    break;
                }
                case 'topt': {
                    if (variables.l && variables.e) {
                        let obj = { type: 'TOPT', level: variables.l, exp: variables.e, iat: timestamp }

                        if (variables.c) obj.command = variables.c

                        return { success: true, data: obj }
                    } else {
                        logger.warn(`[PARSERS] [PERMTOKEN] Invalid Token: L and/or E parameters missing.`)
                        return { error: `Invalid Token` }
                    } 
                    break;
                }
                default: {
                    logger.warn(`[PARSERS] [PERMTOKEN] Invalid Token: Header invalid or missing.`)
                    return { error: `Invalid Token` }
                }
            }
        } catch (e) {
            logger.error(`[PARSERS] [PERMTOKEN] Unable to decrypt Token:`, e)
            return {error: e.message}
        }
    }

    /* Arguments */
    async messageArguments(message, Arguments, command) {
        let _args = {}

        let indexes = {
            0: 0
        }

        let indexData = {
            0: {
                hasSubCommand: false,
                subCommandFound: false,
                hasSubCommandGroup: false,
                subCommandGroupFound: false
            }
        }

        function incrementIndex(index) {
            indexes[index]++;
        }

        let IArg // Index of Current Argument

        function peek(args, arg) {
            return args[arg]
        }

        async function iterateArguments(cmdArgs, args, index) {
            for (let cmdArg of cmdArgs) {
                IArg = indexes[index]
                if (!IArg) {
                    indexes[index] = 0
                    indexData[index] = {
                        hasSubCommand: false,
                        subCommandFound: false,
                        hasSubCommandGroup: false,
                        subCommandGroupFound: false
                    }
                    IArg = 0
                }
                
                let arg = args[IArg]
                let isRequired = cmdArg.type === "SUB_COMMAND_GROUP" ? true : cmdArg.required

                if (indexData[index].hasSubCommandGroup && cmdArg.type !== "SUB_COMMAND_GROUP" && !indexData[index].subCommandGroupFound) return `No SubCommand Group found with name: \`${arg}\`.`
                if (indexData[index].hasSubCommand && cmdArg.type !== "subCommand" && !indexData[index].subCommandFound) return `1 No SubCommand found with name: \`${arg}\`.`

                if (isRequired && !arg) return `Missing required argument: ${cmdArg.name}`
                if (!isRequired && !arg) break;

                switch (cmdArg.type) {
                    case 'STRING': {
                        if (typeof(arg) == "string") {
                            if (typeof(cmdArg?.choices) == "object" && cmdArg?.choices?.length > 0) {
                                if (cmdArg.choices.some(c => c.value === arg)) {
                                    _args[cmdArg.name] = {
                                        type: "STRING",
                                        value: arg
                                    }
                                    incrementIndex(index)
                                    continue;
                                }
                                else return `Invalid choice for argument ${cmdArg.name}: '${arg}' (Expected '${new Intl.ListFormat('en-US', { style: 'short', type: 'disjunction' }).format(cmdArg.choices.map(c => c.value))}')`
                            }
                            _args[cmdArg.name] = {
                                type: "STRING",
                                value: arg
                            }
                        } else return `Invalid type for argument \`${cmdArg.name}\`: '${['undefined', 'null'].includes(typeof(arg)) ? "none" : typeof(arg)}' (Expected 'string')`
                        break;
                    }
                    case 'INTEGER': {
                        if (typeof(arg) == "number" || (typeof(arg) == "string" && !isNaN(arg))) {
                            if (typeof(cmdArg?.choices) == "object" && cmdArg?.choices?.length > 0) {
                                if (cmdArg.choices.some(c => c.value === arg)) {
                                    _args[cmdArg.name] = {
                                        type: "INTEGER",
                                        value: parseInt(arg)
                                    }
                                    incrementIndex(index)
                                    continue;
                                }
                                else return `Invalid choice for argument ${cmdArg.name}: '${arg}' (Expected '${new Intl.ListFormat('en-US', { style: 'short', type: 'disjunction' }).format(cmdArg.choices.map(c => c.value))}')`
                            }
                            _args[cmdArg.name] = {
                                type: "INTEGER",
                                value: parseInt(arg)
                            }
                        } else return `Invalid type for argument \`${cmdArg.name}\`: '${['undefined', 'null'].includes(typeof(arg)) ? "none" : typeof(arg)}' (Expected 'integer')`
                        break;
                    }
                    case 'NUMBER': {
                        let num = typeof(arg) == "number" ? arg : (typeof(arg) == "string" && !isNaN(arg)) ? parseFloat(arg) : false

                        if (!!(num % 1)) {
                            _args[cmdArg.name] = {
                                type: "NUMBER",
                                value: parseFloat(arg)
                            }

                        } else return `Invalid type for argument \`${cmdArg.name}\`: '${['undefined', 'null'].includes(typeof(arg)) ? "none" : typeof(arg)}' (Expected 'integer')`
                        break;
                    }
                    case 'BOOLEAN': {
                        if (typeof(arg) == "boolean" || ( typeof(arg) == "string" && ["true", "false"].includes(arg.toLowerCase()) ) ) {
                            _args[cmdArg.name] = {
                                type: "BOOLEAN",
                                value: { true: true, false: false }[arg.toLowerCase()]
                            }
                        } else return `Invalid type for argument \`${cmdArg.name}\`: '${['undefined', 'null'].includes(typeof(arg)) ? "none" : typeof(arg)}' (Expected 'boolean')`
                        break;
                    }
                    case 'USER': {
                        if (typeof(arg) == "string") {
                            if (bot.constants.regex.user.test(arg) || bot.constants.regex.snowflake.test(arg)) {
                                let user = message.mentions.users.first() || await bot.users.fetch(arg) || {}
                                _args[cmdArg.name] = {
                                    type: "USER",
                                    value: user
                                }
                                incrementIndex(index)
                                continue;
                            }
                            else return `Invalid value for argument \`${cmdArg.name}\`: '${arg}' (Not a valid 'userID' or 'userMention')`
                        } else return `Invalid type for argument \`${cmdArg.name}\`: '${['undefined', 'null'].includes(typeof(arg)) ? "none" : typeof(arg)}' (Expected 'userID' or 'userMention')`
                        break;
                    }
                    case 'CHANNEL': {
                        if (typeof(arg) == "string") {
                            if (bot.constants.regex.channel.test(arg) || bot.constants.regex.snowflake.test(arg)) {
                                let channel = message.mentions.channels.first() || message.guild.channels.cache.get(arg) || {}
                                _args[cmdArg.name] = {
                                    type: "CHANNEL",
                                    value: channel
                                }
                                incrementIndex(index)
                                continue;
                            }
                            else return `Invalid value for argument \`${cmdArg.name}\`: '${arg}' (Not a valid 'channelID' or 'channelMention')`
                        } else return `Invalid type for argument \`${cmdArg.name}\`: '${['undefined', 'null'].includes(typeof(arg)) ? "none" : typeof(arg)}' (Expected 'channelID' or 'channelMention')`
                        break;
                    }
                    case 'ROLE': {
                        if (typeof(arg) == "string") {
                            if (bot.constants.regex.role.test(arg) || bot.constants.regex.snowflake.test(arg)) {
                                let role = message.mentions.roles.first() || message.guild.roles.cache.get(arg) || {}
                                _args[cmdArg.name] = {
                                    type: "ROLE",
                                    value: role
                                }
                                incrementIndex(index)
                                continue;
                            }
                            else return `Invalid value for argument \`${cmdArg.name}\`: '${arg}' (Not a valid 'roleID' or 'roleMention')`
                        } else return `Invalid type for argument \`${cmdArg.name}\`: '${['undefined', 'null'].includes(typeof(arg)) ? "none" : typeof(arg)}' (Expected 'roleID' or 'roleMention')`
                        break;
                    }
                    case 'MENTIONABLE': {
                        if (typeof(arg) == "string") {
                            if (bot.constants.regex.user.test(arg) || bot.constants.regex.role.test(arg) || bot.constants.regex.snowflake.test(arg)) {
                                _args[cmdArg.name] = {
                                    type: "MENTIONABLE",
                                    value: arg
                                }
                                incrementIndex(index)
                                continue;
                            }
                            else return `Invalid value for argument \`${cmdArg.name}\`: '${arg}' (Not a valid 'roleID' or 'roleMention')`
                        } else return `Invalid type for argument \`${cmdArg.name}\`: '${['undefined', 'null'].includes(typeof(arg)) ? "none" : typeof(arg)}' (Expected 'roleID' or 'roleMention')`
                        break;
                    }
                    case 'SUB_COMMAND_GROUP': {
                        indexData[index].hasSubCommandGroup = true
                        if (typeof(arg) == "string") {
                            if (cmdArg.name === arg) {
                                indexData[index].subCommandGroupFound = true
                                _args[cmdArg.name] = {
                                    type: "SUB_COMMAND_GROUP",
                                    value: arg
                                }
                                if (cmdArg?.subCommands?.length > 0) {
                                    let subCmdArg = peek(args, IArg + 1)
                                    
                                    if (subCmdArg) {
                                        let subCmd = cmdArg.subCommands.find(s => s.name === subCmdArg)
                                        if (subCmd) {
                                            _args[subCmd.name] = {
                                                type: "SUB_COMMAND",
                                                value: args[IArg + 1]
                                            }
                                            let newArgs = args.slice(0)
                                            newArgs.splice(0, IArg + 2)
                                            let res = await iterateArguments(subCmd.arguments, newArgs, Object.keys(indexes).length)
                                            
                                            if (res !== true) {
                                                return res;
                                            }
                                        } else return `SubCommand Group \`${cmdArg.name}\` requires one of the following SubCommands: \`${new Intl.ListFormat('en-US', { style: 'short', type: 'disjunction' }).format(cmdArg.subCommands.map(s => s.name))}\`, but got \`${subCmdArg}\`.`
                                    } else return `SubCommand Group \`${cmdArg.name}\` requires one of the following SubCommands: \`${new Intl.ListFormat('en-US', { style: 'short', type: 'disjunction' }).format(cmdArg.subCommands.map(s => s.name))}\`, but got \`none\`.`
                                }
                            }
                        } else return `Invalid type for argument ${cmdArg.name}: '${['undefined', 'null'].includes(typeof(arg)) ? "none" : typeof(arg)}' (Expected 'string')`
                        break;
                    }
                    case 'SUB_COMMAND': {
                        indexData[index].hasSubCommand = true
                        if (typeof(arg) == "string") {
                            if (cmdArg.name === arg) {
                                indexData[index].subCommandFound = true
                                _args[cmdArg.name] = {
                                    type: "SUB_COMMAND",
                                    value: arg
                                }

                                if (cmdArg?.arguments?.length > 0) {
                                    let newArgs = args.slice(0)
                                    newArgs.splice(0, IArg + 1)

                                    let res = await iterateArguments(cmdArg.arguments, newArgs, Object.keys(indexes).length)

                                    return res;
                                }
                            }
                        } else return `Invalid type for argument ${cmdArg.name}: '${['undefined', 'null'].includes(typeof(arg)) ? "none" : typeof(arg)}' (Expected 'string')`
                        break;
                    }
                }

                if (!indexData[index].hasSubCommand && !indexData[index].hasSubCommandGroup) incrementIndex(index);
            }

            if (indexData[index].hasSubCommandGroup && !indexData[index].subCommandGroupFound) return `No SubCommand Group found with name: \`${args.pop()}\`.`
            if (indexData[index].hasSubCommand && !indexData[index].subCommandFound) return `No SubCommand found with name: \`${args.pop()}\`.`
            return true
        }

        if (command.arguments.length > 0) {
            let parsed = await iterateArguments(command.arguments, Arguments, 0)
            let argMap = new bot.constants.classes.ArgumentMap(_args)

            return {
                validity: parsed,
                argMap
            }
        } else {
            for (let i in Arguments) {
                _args[i] = {
                    type: "STRING",
                    value: Arguments[i]
                }
            }

            let argMap = new bot.constants.classes.ArgumentMap(_args)

            return {
                validity: true,
                argMap
            }
        }
    }

    /* Enabled Command List */
    async ecl_get(command) {
        try {
            let file = await db.fetch('SYSTEM:EnabledCommandList')
            let cat = file[command.category]

            if (!cat) return false
            return cat[command.name] || false
        } catch (e) {
            logger.error(`[PARSERS] [ECL_GET] Error while fetching enabled state for ${command.name}:`, e)
        }
    }

    async ecl_set(command, value) {
        try {
            let file = await db.fetch('SYSTEM:EnabledCommandList')
            let cat = file[command.category]

            if (typeof(value) !== 'boolean') return false
            if (!cat) file[command.category] = {}

            file[command.category][command.name] = value
            await db.set('SYSTEM:EnabledCommandList', file)
            return true
        } catch (e) {
            logger.error(`[PARSERS] [ECL_SET] Error while setting enabled state for ${command.name}:`, e)
        }
    }
}

module.exports = Module