module.exports = {
  colors: {
    SUCCESS: 0x00ff0d,
    WARN: 0xfff700,
    PARTIAL_ERROR: 0xff7300,
    ERROR: 0xff0000,
    CRITICAL: 0x940000,
    UNAUTHORIZED: 0x940000,
    SYSTEM: 0x7265AD
  },
  titles: {
    SUCCESS: '🔰 SUCCESS',
    WARN: '⚠️ WARNING',
    PARTIAL_ERROR: '⛔ NON-CRITICAL ERROR',
    ERROR: '🛑 ERROR',
    CRITICAL: '☠️ CRITICAL ERROR',
    UNAUTHORIZED: '🚨 UNAUTHORIZED',
    SYSTEM: '📟 SYSTEM'
  },
  commands: {
    OVERRIDE_MIN_PERM_LEVEL: 2
  },
  regex: {
    mentions: {
      user: /^(?:<@!?)?(\d{17,19})>?$/,
      channel: /^(?:<#)?(\d{17,19})>?$/,
      role: /^(?:<@&)?(\d{17,19})>?$/,
      snowflake: /^(\d{17,19})$/,
    },
    misc: {
      emoji: /^(?:<a?:\w{2,32}:)?(\d{17,19})>?$/,
      username: /.{2,32}/,
      invite: /(http(s)?:\/\/)?(www\.)?(discord\.(gg|li|me|io)|discordapp\.com\/invite|invite\.gg)\/.\w+/,
      discriminator: /(#)\d{4}/,
      tag: /.{2,32}(#)\d{4}/,
      token: /[\w]{24}\.[\w]{6}\.[\w-_]{27}/,
    }
  },
  classes: {
    ArgumentMap: class ArgumentMap {
      constructor(args) {
        this.args = {}

        if (typeof(args) !== "object") throw new TypeError("Invalid type for arguments.")

        for (const [key, value] of Object.entries(args)) {
          if (typeof(value) === "object") {
            if (value.hasOwnProperty("type") && value.hasOwnProperty("value")) {
              switch (value.type) {
                case "SUB_COMMAND_GROUP": {
                  if (this.args["subCommandGroup"]) throw new SyntaxError(`Argument List already has a SubCommandGroup.`)

                  this.args["subCommandGroup"] = value.value
                  break;
                }
                case "SUB_COMMAND": {
                  if (this.args["subCommand"]) throw new SyntaxError(`Argument List already has a SubCommand.`)

                  this.args["subCommand"] = value.value
                  break;
                }
                case "STRING":
                case "INTEGER":
                case "NUMBER":
                case "BOOLEAN":
                case "USER":
                case "CHANNEL":
                case "ROLE":
                case "MENTIONABLE": {
                  this.args[key] = value
                  break;
                }
                default:
                  throw new TypeError(`Invalid type for argument ${key}.`)
              }
              /*if (["string", "integer", "number", "boolean", "user", "channel", "role", "mentionable"].includes(value.type)) {
                this.args[key] = value
              } else throw new TypeError(`Invalid type for argument ${key}.`)*/
            } else throw new TypeError(`Invalid values for argument ${key}.`)
          } else throw new TypeError(`Invalid type for argument ${key}.`)
        }
      }

      getString(arg, required = false) {
        let Arg = this.args[arg]

        if (Arg) {
          if (Arg.type === "string") {
            return Arg.value
          } else throw new TypeError(`Cannot fetch argument ${arg} due to it being of type '${Arg.type}' (required 'string')`)
        } else if (required) throw new TypeError(`Required option ${arg} is of type 'undefined' (expected a non-empty value)`)
        else return null
      }

      getInteger(arg, required = false) {
        let Arg = this.args[arg]

        if (Arg) {
          if (Arg.type === "integer") {
            return Arg.value
          } else throw new TypeError(`Cannot fetch argument ${arg} due to it being of type '${Arg.type}' (required 'integer')`)
        } else if (required) throw new TypeError(`Required option ${arg} is of type 'undefined' (expected a non-empty value)`)
        else return null
      }

      getNumber(arg, required = false) {
        let Arg = this.args[arg]

        if (Arg) {
          if (Arg.type === "number") {
            return Arg.value
          } else throw new TypeError(`Cannot fetch argument ${arg} due to it being of type '${Arg.type}' (required 'number')`)
        } else if (required) throw new TypeError(`Required option ${arg} is of type 'undefined' (expected a non-empty value)`)
        else return null
      }

      getBoolean(arg, required = false) {
        let Arg = this.args[arg]

        if (Arg) {
          if (Arg.type === "boolean") {
            return Arg.value
          } else throw new TypeError(`Cannot fetch argument ${arg} due to it being of type '${Arg.type}' (required 'boolean')`)
        } else if (required) throw new TypeError(`Required option ${arg} is of type 'undefined' (expected a non-empty value)`)
        else return null
      }

      getUser(arg, required = false) {
        let Arg = this.args[arg]

        if (Arg) {
          if (Arg.type === "user") {
            return Arg.value
          } else throw new TypeError(`Cannot fetch argument ${arg} due to it being of type '${Arg.type}' (required 'user')`)
        } else if (required) throw new TypeError(`Required option ${arg} is of type 'undefined' (expected a non-empty value)`)
        else return null
      }

      getChannel(arg, required = false) {
        let Arg = this.args[arg]

        if (Arg) {
          if (Arg.type === "channel") {
            return Arg.value
          } else throw new TypeError(`Cannot fetch argument ${arg} due to it being of type '${Arg.type}' (required 'channel')`)
        } else if (required) throw new TypeError(`Required option ${arg} is of type 'undefined' (expected a non-empty value)`)
        else return null
      }

      getRole(arg, required = false) {
        let Arg = this.args[arg]

        if (Arg) {
          if (Arg.type === "role") {
            return Arg.value
          } else throw new TypeError(`Cannot fetch argument ${arg} due to it being of type '${Arg.type}' (required 'role')`)
        } else if (required) throw new TypeError(`Required option ${arg} is of type 'undefined' (expected a non-empty value)`)
        else return null
      }

      getMentionable(arg, required = false) {
        let Arg = this.args[arg]

        if (Arg) {
          if (Arg.type === "mentionable") {
            return Arg.value
          } else throw new TypeError(`Cannot fetch argument ${arg} due to it being of type '${Arg.type}' (required 'mentionable')`)
        } else if (required) throw new TypeError(`Required option ${arg} is of type 'undefined' (expected a non-empty value)`)
        else return null
      }

      getSubcommandGroup(required = false) {
        let Arg = this.args["subCommandGroup"]

        if (Arg) {
          return Arg
        } else if (required) throw new TypeError(`Required option ${arg} is of type 'undefined' (expected a non-empty value)`)
        else return null
      }

      getSubcommand(required = false) {
        let Arg = this.args["subCommand"]
        
        if (Arg) {
          return Arg
        } else if (required) throw new TypeError(`Required option ${Arg} is of type 'undefined' (expected a non-empty value)`)
        else return null
      }

      get(arg, required = false) {
        let Arg = this.args[arg]

        if (Arg) {
            return Arg
        } else if (required) throw new TypeError(`Required option ${arg} is of type 'undefined' (expected a non-empty value)`)
        else return null
      }

      join(separator) {
        let toReturn = []

        for (let [key, value] of Object.entries(this.args)) {
          toReturn.push(value.value)
        }

        return toReturn.join(separator)
      }

      /**
       * Dumps the entire Argument List
       * 
       * WARNING: Only use for debugging purposes.
       * 
       * @returns {Array} Argument List
       */
      _dump() {
        logger.warn("[ARGUMENT MAP] WARNING: ARGUMENT MAP DUMPED.")
        return this.args
      }
    }
  },
  messages: {
    mentions: {
      self: {
        type: "EMBED",
        content: function(...args) {`I'm ${args[1]}, a Multi-tool Discord Bot.\n\nCommand List: \`${args[0]}help\``}, 
        embedType: 'PARTIAL_ERROR', 
        overrides: {title: function(...args) {`Hello, ${args[0].author.username}!`}}
      }
    }
  },
  paths: {
    root: null
  }
}