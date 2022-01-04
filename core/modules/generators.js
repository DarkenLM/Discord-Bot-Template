/*
*   MODULE
*       Generators
*       By: DarkenLM
*       First Version: 24/08/2021 | Last Update: 03/12/2021
*       Documentation Page: modules/generators
*/

const UUID = require('uuid')
const crypto = require('crypto');

const _Module = bot.bases.modules
class Module extends _Module {
    constructor() {
        super();
        this.declarations.name = 'generators'

        this.uuid = {
            v4: this._uuid_v4
        }

        this.permissions = {
            ubot: this._permissions_ubot,
            topt: this._permissions_topt
        }
    }

    makeID(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    /**
     * Generator for Permission Tokens using the UBOT (Use Based One Time) Token protocol
     * 
     * @param {number} level The permission level to use in the token
     * @param {number} uses The number of uses before the token is invalid
     * @param {string=} command The command to restrict the permission to
     * 
     * @returns {string} The permission token
     */
    /*_permissions_ubot(snowflake, level, uses, command) {
        let userRegex = /^(?:<@!?)?(\d{17,21})>?$/gm
        let roleRegex = /^(?:<@&)?(\d{17,21})>?$/gm
        let sfRegex = /^(\d{17,21})$/gm

        if (!snowflake || (!roleRegex.test(snowflake) && !userRegex.test(snowflake) && !sfRegex.test(snowflake))) {
            logger.warn(`[GENERATORS] [PERM] [UBOT] Could not generate Permission Token: SNOWFLAKE is not defined or is not a valid user/mention id.`)
            return null;
        }

        if (!level) {
            logger.warn(`[GENERATORS] [PERM] [UBOT] Could not generate Permission Token: LEVEL is not defined.`)
            return null;
        }

        let PermissionToken = ''

        let uuid = this.uuid.v4()
        let verifiers = uuid.split('-').map(v => v.split("").reverse().join(""))
        PermissionToken += `${Buffer.from(uuid).toString('base64')}.`
        PermissionToken += `${Buffer.from(`${verifiers[0]}-${snowflake}`).toString('base64')}.`
        
        let isLevelValid = bot.libraries.permissions ? 
                        bot.libraries.permissions.levels.some(l => l.level === level) : 
                        (bot.temp.permLevels ? bot.temp.permLevels.some(l => l.level === level) : false)
        
        if (!isLevelValid) {
            logger.warn(`[GENERATORS] [PERM] [UBOT] Could not generate Permission Token: LEVEL is invalid.`)
            return null;
        }
        PermissionToken += `${Buffer.from(`${verifiers[1]}-${level}`).toString('base64')}.`

        if (isNaN(uses)) {
            logger.warn(`[GENERATORS] [PERM] [UBOT] Could not generate Permission Token: USES is invalid.`)
            return null;
        }
        PermissionToken += `${Buffer.from(`${verifiers[2]}-${uses}`).toString('base64')}`

        if (command) {
            if (!bot.commands.has(command)) {
                logger.warn(`[GENERATORS] [PERM] [UBOT] Could not generate Permission Token: COMMAND is invalid.`)
                return null;
            }

            PermissionToken += `.${Buffer.from(`${verifiers[3]}-${command}`).toString('base64')}`
        }

        return PermissionToken
    }*/

    _permissions_ubot(level, uses, command) {
        if (!level) {
            logger.warn(`[GENERATORS] [PERM] [UBOT] Could not generate Permission Token: LEVEL is not defined.`)
            return null;
        }

        if (!uses) {
            logger.warn(`[GENERATORS] [PERM] [UBOT] Could not generate Permission Token: USES is not defined.`)
            return null;
        } else if (isNaN(uses)) {
            logger.warn(`[GENERATORS] [PERM] [UBOT] Could not generate Permission Token: USES is invalid.`)
            return null;
        }

        let PermissionToken = ''
        let timestamp = Date.now()
        let uuid_v4 = UUID.v4()
        let verifiers = uuid_v4.split('-').map(v => v.split("").reverse().join(""))
        let isLevelValid = bot.config.permissions ? Object.entries(bot.config.permissions.levels).some(([key, value]) => value === level) : (bot?.temp?.permLevels ? Object.entries(bot.temp.permLevels).some(([key, value]) => value === level) : false)//bot.temp.permLevels.some(l => l.level === level
        
        if (!isLevelValid) {
            logger.warn(`[GENERATORS] [PERM] [UBOT] Could not generate Permission Token: LEVEL is invalid.`)
            return null;
        }

        if (command && !bot.commands.has(command)) {
            logger.warn(`[GENERATORS] [PERM] [UBOT] Could not generate Permission Token: COMMAND is invalid.`)
            return null;
        }

        let uuid = UUID.v5(timestamp.toString(), uuid_v4)
        let PTV = bot.constants.keyMap.get(bot.constants['1ca7140650b31d8ecd02a2a64911dc9c06e9c3fd']).permTokenVer
        let header = encrypt(`${Buffer.from(`h:ubot;l:${level};v:${PTV};u:${uses};${command ? `c:${command}` : ''}`).toString('base64')}`, Buffer.from(uuid.substring(0, 32)).toString('base64'))

        PermissionToken += `${Buffer.from(`${verifiers[0]}-${header.encryptedData}`).toString('base64')}.`

        let ivParts = header.iv.match(/.{1,8}/g)
        let order = bot.modules.manipulators.string.shuffle('0123').split("")
        let count = 0

        for (let ordenator of order) {
            count++
            PermissionToken += `${Buffer.from(`${verifiers[count]}-${ivParts[parseInt(ordenator)]}`).toString('base64')}.`
        }
        /*let count = 0
        for (let part of ivParts) {
            count++
            PermissionToken += `${Buffer.from(`${verifiers[count]}-${part}`).toString('base64')}.`
        }*/
        
        PermissionToken += `${Buffer.from(`${order.join("")}-${timestamp.toString()}`).toString('base64')}`
        //PermissionToken += `${Buffer.from(`${verifiers[1]}-${level}`).toString('base64')}.`

        function encrypt(text, key) {
            const iv = crypto.randomBytes(16);
            let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'base64').toString('utf-8'), iv);//Buffer.from(key)
            let encrypted = cipher.update(Buffer.from(text, "utf-8"));
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
        }

        function removePadding(str) {
            return str.replace(/={1,2}/gm, '');
        }
        return removePadding(PermissionToken)
    }

    /**
     * Generator for Permission Tokens using the TOPT (Time-based One-Time Password) Token protocol
     * 
     * @param {number} level The permission level to use in the token
     * @param {number} time The expiration time
     * @param {string=} command The command to restrict the permission to
     * 
     * @returns {string} The permission token
     */
    _permissions_topt(level, time, command) {
        if (!level) {
            logger.warn(`[GENERATORS] [PERM] [TOPT] Could not generate Permission Token: LEVEL is not defined.`)
            return null;
        }

        if (!time) {
            logger.warn(`[GENERATORS] [PERM] [TOPT] Could not generate Permission Token: TIME is not defined.`)
            return null;
        }

        let parsedTime;
        switch (typeof(time)) {
            case 'number': {
                parsedTime = time
                break;
            }
            case 'string': {
                let parsed = bot.modules.parsers.parseTime(time)
                if (parsed) parsedTime = parsed;
                else {
                    logger.warn(`[GENERATORS] [PERM] [TOPT] Could not generate Permission Token: TIME is invalid.`)
                    return null;
                }
                break;
            }
            default: {
                logger.warn(`[GENERATORS] [PERM] [TOPT] Could not generate Permission Token: TIME is invalid.`)
                return null;
            }
        }


        let PermissionToken = ''
        let timestamp = Date.now()
        let uuid_v4 = UUID.v4()
        let verifiers = uuid_v4.split('-').map(v => v.split("").reverse().join(""))
        let isLevelValid = bot.config.permissions ? Object.entries(bot.config.permissions.levels).some(([key, value]) => value === level) : (bot?.temp?.permLevels ? Object.entries(bot.temp.permLevels).some(([key, value]) => value === level) : false)        
        
        if (!isLevelValid) {
            logger.warn(`[GENERATORS] [PERM] [TOPT] Could not generate Permission Token: LEVEL is invalid.`)
            return null;
        }

        if (command && !bot.commands.has(command)) {
            logger.warn(`[GENERATORS] [PERM] [TOPT] Could not generate Permission Token: COMMAND is invalid.`)
            return null;
        }

        let uuid = UUID.v5(timestamp.toString(), uuid_v4)
        let PTV = bot.constants.keyMap.get(bot.constants['1ca7140650b31d8ecd02a2a64911dc9c06e9c3fd']).permTokenVer
        let header = encrypt(`${Buffer.from(`h:topt;l:${level};v:${PTV};e:${parsedTime};${command ? `c:${command};` : ''}`).toString('base64')}`, Buffer.from(uuid.substring(0, 32)).toString('base64'))

        PermissionToken += `${Buffer.from(`${verifiers[0]}-${header.encryptedData}`).toString('base64')}.`

        let ivParts = header.iv.match(/.{1,8}/g)
        let order = bot.modules.manipulators.string.shuffle('0123').split("")
        let count = 0

        for (let ordenator of order) {
            count++
            PermissionToken += `${Buffer.from(`${verifiers[count]}-${ivParts[parseInt(ordenator)]}`).toString('base64')}.`
        }
        
        PermissionToken += `${Buffer.from(`${order.join("")}-${timestamp.toString()}`).toString('base64')}`

        function encrypt(text, key) {
            const iv = crypto.randomBytes(16);
            let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'base64').toString('utf-8'), iv);
            let encrypted = cipher.update(Buffer.from(text, "utf-8"));
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
        }

        function removePadding(str) {
            return str.replace(/={1,2}/gm, '');
        }
        return removePadding(PermissionToken)
    }

    _uuid_v4() {
        return UUID.v4()
    }
}

module.exports = Module