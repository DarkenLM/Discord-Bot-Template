const Base = require('./bases').bases
const path = require("path")

class Command {
    #defaultCommand
    #filePath
    constructor() {
        this.command = {
            name: "",
            description: {
                short: "",
                long: ""
            },
            category: "",
            arguments: [],
            aliases: [],
            permlevel: 0,
            restricted: 0 // Automatically defined. Will be redefined if defined by the user.
        }

        this.#defaultCommand = {
            name: "string",
            description: {
                short: "string",
                long: "string|function"
            },
            category: "string",
            arguments: "array",
            aliases: "array",
            permlevel: "number",
            restricted: "number"
        }
    }

    /**
     * Ensure the command has a valid structure.
     */
    validateStructure() {
        if (!this.command) throw new Error(`Missing Command's metadata structure.`)

        for (let [key, value] of Object.entries(this.command)) {
            if (this.#defaultCommand.hasOwnProperty(key)) {
                //if (typeof(value) !== typeof(this.#defaultCommand[key])) throw new Error(`Invalid type for command metadata property ${key}: '${typeof(value)}' (Expected '${typeof(this.#defaultCommand[key])}')`)
                //console.log(key, value)
                const verifyTypes = function(prop) {
                   switch (prop) {
                        case 'string':
                        case 'number':
                            if (typeof(value) !== prop) throw new Error(`Invalid type for command metadata property ${key}: '${typeof(value)}' (Expected '${prop}')`)
                            return true
                            break;
                        case 'array':
                            //console.log(value)
                            if (!Array.isArray(value)) throw new Error(`Invalid type for command metadata property ${key}: '${typeof(value)}' (Expected 'array')`)
                            break;
                        default:
                            if (typeof(prop) === "object") {
                                if (typeof(value) !== typeof(prop)) throw new Error(`Invalid type for command metadata property ${key}: '${typeof(value)}' (Expected 'object')`)
                            } else {
                               if (this.#defaultCommand[key].includes("|")) {
                                    let types = this.#defaultCommand[key].split("|")
                                    types.forEach(t => {
                                        verifyTypes(t)
                                    }) 
                                } 
                            } 
                    } 
                }.bind(this)
                
                verifyTypes(this.#defaultCommand[key])

                switch (key) {
                    case 'category': {
                        if (value.length == 0) {
                            this.command.category = path.basename(path.dirname(this.#filePath))
                        }
                        break;
                    }
                    case 'description': {
                        if (!(value.short && value.long)) {
                            if (value.short) {
                                if (!value.hasOwnProperty("long") || (typeof(value.long) === "string" && value.long.length == 0)) {
                                    Object.defineProperty(this.command.description, "long", {
                                        get: function () {
                                            return this.short;
                                        }
                                    })
                                }
                            } else throw new Error(`Invalid type for command metadata property ${key}: '${typeof(value)}' (Expected '${typeof(this.#defaultCommand[key])}')`)
                        }
                        break;
                    }
                }
                /*if (["null", "undefined"].includes(typeof(value))) {
                    switch (key) {
                        case 'category': {
                            break;
                        }
                        default:
                            throw new Error(`Required property is undefined: '${key}'.`)
                    }
                }*/
            } else throw new Error(`Unexpected property on command definition: '${key}'.`)
        }

        let executes = {
            message: false,
            interaction: false
        }

        if (typeof(this.execute) === "function") executes.message = true
        if (typeof(this.executeInteraction) === "function") executes.interaction = true

        switch (true) {
            case executes.message && executes.interaction: {
                this.command.restricted = 0;
                break;
            }
            case executes.message: {
                this.command.restricted = 1;
                break;
            }
            case executes.interaction: {
                this.command.restricted = 2;
                break;
            }
            default:
                throw new Error("Command requires at least one of the following methods: 'execute', 'executeInteraction'")
        }

        return true
    }

    /**
     * Get the file path of the command
     */
    getFilePath() {
        return this.#filePath
    }

    _setFilePath(cmdPath) {
        if (!this.#filePath) this.#filePath = cmdPath
    }
}

module.exports = new Base('commands', Command)