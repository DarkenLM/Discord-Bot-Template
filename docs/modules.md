# Modules
Modules are code collections accessible via `bot.modules` and are dynamically defined and registered by the system itself.  

## Defining a Module
To define a module, navigate to the directory `plugins/modules` and create a file and insert the following code within:
```js
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
        this.declarations.name = "MODULE_NAME"
        this.declarations.extends = "MODULE_EXTENSION"
    }

    // Add custom functions here
}

module.exports = Module
```

Where
 - `MODULE`: The start of the module header. (SHOULD READ AS IS ON EVERY MODULE)
 - `MODULE_NAME`: The name of the module. [`EXCEPTION`](#plugin-modules)
 - `CREATION_DATE`: The date of the module's initial creation.
 - `UPDATE_DATE`: The date of the module's last update.
 - `DOCUMENTATION_PAGE`: The path to the documentation page for this module. `NONE` if it does not exist.
 - `MODULE_EXTENSION`: Used only on [Plugin Modules](#plugin-modules). It indicates the module that it should attach to.

## Using a Module
All properties of a module are accessible via `bot.modules.MODULE_NAME`. All Modules behave as an ES6 Class.

## Plugin Modules
Plugin Modules differentiate from the Core Modules insofar as the former have the ability to attach to existing modules.  
When extending a module, if the name of the attachment module is different from the parent module, the attachment functions will be accessible via `bot.modules.PARENT_MODULE_NAME.MODULE_NAME`  
When extending a module, if the name of the attachment module is equal to the parent module's, it is called a same-root attachment, and is accessible via `bot.modules.PARENT_MODULE_NAME`  

To avoid conflicts between modules, it is recommended to give the Plugin Module a different name than his parent's.

### Attachment Limitations
The current Module System (as of v2.0.5) has the following known limitations:
 - Private Fields are not supported on same-root attachments
 - Nested attachments are not supported