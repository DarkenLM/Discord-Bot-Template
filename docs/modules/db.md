# General
This module extends the Node Module `quick.db`, copying it's methods and extending the table method.
### <span style="color:red">**WARNING:** This module is instable and under development. The original node module quick.db should be used.</span>

## Use cases
This module should be used when a table different than the default one is required ***AND*** if a pointer to the table should be cached in memory.

## Notes
This module was created due to potential misunderstanding of the [Original Module's documentation](https://quickdb.js.org) and may be removed in a near update.

# Usage
This module is accessible via `bot.modules.embed`.  

This module contains all normal quick.db methods, except the table, which was replaced by custom methods:
- `tables.get(tableName)`: Gets a table from the database file (Creates one if non-existent).
- `tables.reset(tableName)`: Removes the pointer from the cache.
- `tables.fReset(tableName)`: Clears the database table and removes it's pointer from the cache. <span style="color:red">**WARNING:** THIS ACTION IS NOT REVERSIBLE</span>

Where
- `tableName` is the name of the table.