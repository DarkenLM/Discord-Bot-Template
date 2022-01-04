/*
*   MODULE
*       DB
*       By: DarkenLM
*       First Version: 03/12/2021 | Last Update: 06/12/2021
*       Documentation Page: modules/db
*/

const db = require('quick.db')
const sqlite = require('better-sqlite3')
const _db = new sqlite("./json.sqlite")

const _Module = bot.bases.modules
const storage = { tables: {} }
class Module extends _Module {
    /*#storage = {
        tables: {}
    }*/
    constructor() {
        super();
        this.declarations.name = 'db';

        /* ORIGINAL METHODS */
        ({get: this.get, fetch: this.fetch, set: this.set, add: this.add, subtract: this.subtract, push: this.push, delete: this.delete, has: this.has, includes: this.includes, all: this.all, fetchAll: this.fetchAll, type: this.type} = db)
        
        /* TABLE METHODS */
        this.tables = {
            get: this._tableGet,
            reset: this._tableReset,
            fReset: this._forceTableReset
        }

        /*this.test = {
            thisGet: this,
            testMethod: this.testMethod
        }*/
    }

    /*testMethod() {
        console.log(this.#storage)
        return
    }*/

    async _tableGet(table) {

        try {
            if (storage.tables[table]) return storage.tables[table]

            let _table = new db.table(table)
            _table.clear = function() {
                console.log("I'M HERE BITCH")
                // Delete all Rows
                let fetched = _db.prepare(`DELETE FROM ${table.split("--")[0]}`).run();
                if(!fetched) return null;
                
                // Return Amount of Rows Deleted
                return fetched.changes;
            }

            storage.tables[table] = _table

            return storage.tables[table]
        } catch(e) {
            logger.error(`[DB] [TG] Error while initializing table:`, e)
            return false
        }
    }

    async _tableReset(table) {
        if (storage.tables[table]) {
            await storage.tables[table].clear()
            delete storage.tables[table]
            return true
        } else return null
    }

    async _forceTableReset(table) {
        if (storage.tables[table]) {
            await storage.tables[table].clear()
            delete storage.tables[table]
            return true
        } else {
            let _table = new db.table(table)
            _table.clear = function() {
                console.log("I'M HERE BITCH 2")
                // Delete all Rows
                let fetched = _db.prepare(`DELETE FROM ${table.split("--")[0]}`).run();
                if(!fetched) return null;
                
                // Return Amount of Rows Deleted
                return fetched.changes;
            }
            await _table.clear()
            return true
        }
    }

    /*async _tableGet(Table) {
        table.prototype.reset = async (table) => {
            if (this.#storage.tables[table]) {
                await this.#storage.tables[table].clear()
                delete this.#storage.tables[table]
                return true
            } else return null
        }

        let _table = new db.table(Table)
        this.#storage.tables[table] = _table
        ({get: table.prototype.get, fetch: table.prototype.fetch, set: table.prototype.set, add: table.prototype.add, subtract: table.prototype.subtract, push: table.prototype.push, delete: table.prototype.delete, has: table.prototype.has, includes: table.prototype.includes, all: table.prototype.all, fetchAll: table.prototype.fetchAll, type: table.prototype.type} = this.#storage.tables[table])
        /* TABLE METHODS */
        /*this.reset = async (table) => {
            if (this.#storage.tables[table]) {
                await this.#storage.tables[table].clear()
                delete this.#storage.tables[table]
                return true
            } else return null
        }

        try {
            if (this.#storage.tables[table]) return this.#storage.tables[table]

            let _table = new db.table(table)
            this.#storage.tables[table] = _table

            return this.#storage.tables[table]
        } catch(e) {
            logger.error(`[DB] [TI] Error while initializing table:`, e)
            return false
        }* /
    }*/

    /*async #_tableInit(table) {
        console.log(this.#storage)
        try {
            if (this.#storage.tables[table]) return this.#storage.tables[table]

            let _table = new db.table(table)
            this.#storage.tables[table] = _table

            return this.#storage.tables[table]
        } catch(e) {
            logger.error(`[DB] [TI] Error while initializing table:`, e)
            return false
        }
    }

    async #_tableGet(table) {
        if (this.#storage.tables[table]) return this.#storage.tables[table]
        else return null
    }

    async #_tableDelete(table) {
        if (this.#storage.tables[table]) {
            delete this.#storage.tables[table]
            return true
        } else return null
    }

    async #_tableReset(table) {
        if (this.#storage.tables[table]) {
            await this.#storage.tables[table].clear()
            delete this.#storage.tables[table]
            return true
        } else return null
    }*/
}

module.exports = Module