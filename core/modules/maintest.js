/*
*   MODULE
*       MODULE_NAME
*       By: AUTHOR
*       First Version: CREATION_DATE | Last Update: UPDATE_DATE
*       Documentation Page: DOCUMENTATION_PAGE
*/

const _Module = bot.bases.modules
class Module extends _Module {
    constructor() {
        super();
        this.declarations.name = "maintest"
    }

    getThisShit() {
        console.log(this)
    }
}

module.exports = Module