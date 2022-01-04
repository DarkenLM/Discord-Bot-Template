/*
*   MODULE
*       Manipulators
*       By: DarkenLM
*       First Version: 03/12/2021 | Last Update: 03/12/2021
*       Documentation Page: modules/manipulators
*/

const _Module = bot.bases.modules
class Module extends _Module {
    constructor() {
        super();
        this.declarations.name = 'manipulators'

        this.string = {
            shuffle: this._string_shuffle
        }
        
        this.array = {
            checkEquality: this._array_equality_compare
        }
    }

    /**
     * Shuffles all characters of a string
     * @param {string} string The string to shuffle
     * @returns 
     */
    _string_shuffle(string) {
        let a = string.split(""),
        n = a.length;

        for(let i = n - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
        }
        return a.join("");
    }

    /**
     * Deep nested comparison of equality between two arrays
     * 
     * @author mindinsomnia
     * Source: https://gist.github.com/mindinsomnia/d1c6889604b52062fa5136d17c75daff
     * 
     * @param {Array} a The first array
     * @param {Array} b The second array
     * @returns 
     */
    _array_equality_compare(a, b) {
        let aType;
        let bType;
        if(Array.isArray(a)) {
            aType = 'array';
        } else {
            aType = typeof(a);
        }
        if(Array.isArray(b)) {
            bType = 'array';
        } else {
            bType = typeof(b);
        }
        if(aType !== bType) return false;
        switch(aType) {
            case 'array':
                if(a.length !== b.length) return false;
                for(let i = 0; i < a.length; i++) {
                    if(!this.checkEquality(a[i], b[i])) return false;
                }
                return true;
            case 'object':
                if(Object.keys(a).length !== Object.keys(b).length) return false;
                for(let prop_name in a) {
                    if(!b.hasOwnProperty(prop_name)) {
                        return false;
                    }
                    if(!this.checkEquality(a[prop_name], b[prop_name])) return false;
                }
                return true;
            default:
                return (a === b);
        }
    }
}

module.exports = Module