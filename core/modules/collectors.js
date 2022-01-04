/*
*   MODULE
*       Collectors
*       By: DarkenLM
*       First Version: 03/12/2021 | Last Update: 06/12/2021
*       Documentation Page: modules/collectors
*/

const Discord = require('discord.js');
const _Module = bot.bases.modules

class CollectedMap extends Map {
    constructor() {
        super()
    }

    first() {
        return this.entries().next().value[1]
    }

    last() {
        return Array.from(this.values()).pop()
    }

    getIndex(index = 0) {
        return Array.from(this.values())[index] || null
    }
}

class Module extends _Module {
    constructor() {
        super();
        this.declarations.name = 'collectors'
    }

    async messages(message, collectorOptions = {filter: m => true, max: 1, time: 60000, errors: ['time']}) {
        try {
            let collected = await message.channel.awaitMessages(
                {
                    filter: collectorOptions?.filter || (m => true), 
                    max: collectorOptions?.max, 
                    time: collectorOptions?.time, 
                    errors: collectorOptions?.errors
                }
            )
            
            const iterator = collected[Symbol.iterator]();
            let messages = new CollectedMap()

            for (const iter of iterator) {
                messages.set(iter[1].id, iter[1])
            }

            return messages
        } catch (e) {
            bot.utils.logger.error("[COLLECTORS] [MESSAGES] Error while collecting:", e)
            return null
        }
    }

    async reactions(message, collectorOptions = {filter: m => true, max: 1, time: 60000, errors: ['time']}) {
        try {
            let collected = await message.awaitReactions(
                {
                    filter: collectorOptions?.filter || (m => true), 
                    max: collectorOptions?.max, 
                    time: collectorOptions?.time, 
                    errors: collectorOptions?.errors
                }
            )
            
            const iterator = collected[Symbol.iterator]();
            let reactions = new CollectedMap()

            for (const iter of iterator) {
                let obj = {
                    type: /\p{Extended_Pictographic}/u.test(iter[1].emoji.name) ? 1 : 2,
                    reaction: iter[1]
                }
                reactions.set(iter[1].message.id, obj)
            }

            return reactions
        } catch (e) {
            bot.utils.logger.error("[COLLECTORS] [REACTIONS] Error while collecting:", e)
            return null
        }
    }

    /*
        componentType:
            ACTION_ROW
            BUTTON
            SELECT_MENU
    */
    async interactions(message, collectorOptions = {filter: m => true, time: 60000, componentType: ""}) {
        try {
            let collected = await message.channel.awaitMessageComponent(
                {
                    filter: collectorOptions?.filter || (m => true), 
                    time: collectorOptions?.time, 
                    componentType: collectorOptions?.componentType
                }
            )
            

            return collected
        } catch (e) {
            bot.utils.logger.error("[COLLECTORS] [INTERACTIONS] Error while collecting:", e)
            return null
        }
    }
}

module.exports = Module