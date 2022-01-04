/*
*   MODULE
*       DB
*       By: DarkenLM
*       First Version: 03/12/2021 | Last Update: 06/12/2021
*       Documentation Page: modules/db
*/

const db = require('quick.db')
const sqlite = require('better-sqlite3')
const _db = new sqlite("../../json.sqlite")

const _Module = bot.bases.modules
const storage = { tables: {} }
class Module extends _Module {
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
    }

    async _tableGet(table) {

        try {
            if (storage.tables[table]) return storage.tables[table]

            let _table = new db.table(table)
            _table.clear = function() {
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
}

module.exports = Module