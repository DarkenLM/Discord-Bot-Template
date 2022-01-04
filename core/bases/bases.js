class Bases {
  constructor(name, func) {
    this.declarations = {
      name: name,
      description: '',
      func: func
    }
  }
}

module.exports = new Bases('bases', Bases)
module.exports.bases = Bases