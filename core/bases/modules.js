const Base = require('./bases').bases

class Modules {
	#baseClass
	constructor(name, description) {
		this.declarations = {
			name: name,
			description: description || ''
		}
	}

	async attach(Class) {
		try {
			if (Class.declarations.name === this.declarations.name) {
				function getAllMethodNames(obj) {
					let methods = new Set();
					while (obj = Reflect.getPrototypeOf(obj)) {
						let keys = Reflect.ownKeys(obj)
						keys.forEach((k) => methods.add(k));
					}
					return methods;
				}

				let baseClass = await Class.getBaseClass()
				let protoClass = {
					constructor: Object.getOwnPropertyNames(Class).filter(v => !this.hasOwnProperty(v)),
					methods: [
						...Array.from(getAllMethodNames(Class)).filter(m => ![
							"constructor", "__defineGetter__", "__defineSetter__", 
							"hasOwnProperty", "__lookupGetter__", "__lookupSetter__", 
							"isPrototypeOf", "propertyIsEnumerable", "toString", 
							"valueOf", "__proto__", "toLocaleString"].includes(m)), 
						...Object.getOwnPropertyNames(baseClass).filter(m => !["length", "name", "prototype"].includes(m))
					]
				}

				for (let variable of protoClass.constructor) {
					if (this.hasOwnProperty(variable) || this[variable]) {
						logger.warn(`[MODULE] [${this.declarations.name.toUpperCase()}] [ATTACH] Could not attach variable '${variable}' because parent module already has a variable / method with said name.`)
					} else this[variable] = Class[variable]
				}

				for (let method of protoClass.methods) {
					if (this.hasOwnProperty(method) || this[method]) {
						logger.warn(`[MODULE] [${this.declarations.name.toUpperCase()}] [ATTACH] Could not attach method '${method}' because parent variable / module already has a method with said name.`)
					} else this[method] = Class[method]
				}
				return true
			} else {
				this[Class.declarations.name] = Class
				return true
			}
		} catch (e) {
			logger.error(`[MODULE] [${this.declarations.name.toUpperCase()}] [ATTACH] Error while attaching: `, e)
			return false
		}
	}

	setBaseClass(baseClass) {
		this.#baseClass = baseClass
	}

	getBaseClass() {
		return this.#baseClass
	}

	validateStructure() {
		return true
	}
}

module.exports = new Base('modules', Modules)