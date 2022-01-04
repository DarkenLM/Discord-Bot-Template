# General
This module adds one manipulator (as of v2.0.1):
 - `string.shuffle`: Shuffles the characters on a string.

## Use cases
Any system that requires a content manipulation.

# Usage
This module is accessible via `bot.modules.manipulators`.  

- `string`: Manipulators for strings.
  - `shuffle(string)`: Shuffles the characters on a string, where:
    - `string`: The string to be shuffled.
- `array`: Manipulators for arrays.
  - `checkEquality(arrayA, arrayB)`: Checks if two arrays are equal using a deep nested comparison method. Made by [mindinsomnia](https://gist.github.com/mindinsomnia/d1c6889604b52062fa5136d17c75daff)
    - `arrayA`: The first array to compare.
    - `arrayB`: The second array to compare.