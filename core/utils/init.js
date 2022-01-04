module.exports = async () => {
  bot.utils = {}
  // Logger
  const Logger = require('./logger')
  bot.utils.logger = new Logger()
  global.logger = bot.utils.logger

  // Error Handler
  let EHandler = require('./errorHandler')
  EHandler()

  // Constants
  bot.constants = require('../libraries/Constants')

  // Loader
  let Loader = new(require('./loader'))()
  let hasInit = await Loader.init()

  if (!hasInit) {
    process.exit(1)
  }

  //Store Secret ID
  let keyMap = new WeakMap()
  let id = bot.modules.generators.makeID(128)
  let permID = bot.modules.generators.uuid.v4()
  let keys = {}
  
  keyMap.set(keys, { secretKey: id, permTokenVer: permID })
  bot.constants['1ca7140650b31d8ecd02a2a64911dc9c06e9c3fd'] = keys
  bot.constants.keyMap = keyMap
}

