# General
This module provides a collection of parsers for timestamps, Permission Levels, Permission Tokens, arguments and the Enabled Command List.

## Use Cases
The timestamp parsers can be used in any system that requires converting milliseconds to a date (or vice versa) or to format time using dayjs.
The Permission Level parser converts the integer of the Permission Level to it's meaning.
The Permission Token parser is used to parse Permission Tokens and does not have any safe use case outside of the core system.

# Usage
This module is accessible via `bot.modules.parsers`.  

## Timestamps

The following methods are used to parse timestamps:

- `parseMS(milliseconds)`: Picks the number of milliseconds provided and return an object containing the time interval from days to nanosseconds.
- `parseTime(time)`: Picks a time string and converts it to milliseconds (ex: "1h" » 3600000), where:
  - `time`: A string with relative time with pattern `[TIME][UNIT]` (without the parentheses), where:
    - `TIME`: any number.
    - `UNIT`:
        | Unit         | Symbols                                  |
        |--------------|------------------------------------------|
        | Year         | years year yrs yr y                      |
        | Week         | weeks week w                             |
        | Days         | days day d                               |
        | Minutes      | minutes minute mins min m                |
        | Seconds      | seconds second secs sec s                |
        | Milliseconds | milliseconds millisecond msecs msec ms   |
- `formatTime(ms, locale, format)`: Picks time in milliseconds and formats it to a readable date, where:
  - `ms`: Any time (timestamp or relative) in milliseconds.
  - `locale`: A [DayJS Locale](https://day.js.org/docs/en/i18n/i18n) (as of v2.0.1, DayJS v1.10.7)
    | Locale   | Name                          |
    |----------|-------------------------------|
    | af       | Afrikaans                     |
    | am       | Amharic                       |
    | ar-dz    | Arabic (Algeria)              |
    | ar-iq    | Arabic (Iraq)                 |
    | ar-kw    | Arabic (Kuwait)               |
    | ar-ly    | Arabic (Lybia)                |
    | ar-ma    | Arabic (Morocco)              |
    | ar-sa    | Arabic (Saudi Arabia)         |
    | ar-tn    | Arabic (Tunisia)              |
    | ar       | Arabic                        |
    | az       | Azerbaijani                   |
    | be       | Belarusian                    |
    | bg       | Bulgarian                     |
    | bi       | Bislama                       |
    | bm       | Bambara                       |
    | bn       | Bengali                       |
    | bo       | Tibetan                       |
    | br       | Breton                        |
    | bs       | Bosnian                       |
    | ca       | Catalan                       |
    | cs       | Czech                         |
    | cv       | Chuvash                       |
    | cy       | Welsh                         |
    | da       | Danish                        |
    | de-at    | German (Austria)              |
    | de-ch    | German (Switzerland)          |
    | de       | German                        |
    | dv       | Maldivian                     |
    | el       | Greek                         |
    | en-au    | English (Australia)           |
    | en-ca    | English (Canada)              |
    | en-gb    | English (United Kingdom)      |
    | en-ie    | English (Ireland)             |
    | en-il    | English (Israel)              |
    | en-in    | English (India)               |
    | en-nz    | English (New Zealand)         |
    | en-sg    | English (Singapore)           |
    | en-tt    | English (Trinidad & Tobago)   |
    | en       | English                       |
    | eo       | Esperanto                     |
    | es-do    | Spanish (Dominican Republic)  |
    | es-mx    | Spanish (Mexico)              |
    | es-pr    | Spanish (Puerto Rico)         |
    | eu       | Basque                        |
    | fa       | Persian                       |
    | fi       | Finnish                       |
    | fo       | Faroese                       |
    | fr-ca    | French (Canada)               |
    | fr-ch    | French (Switzerland)          |
    | fr       | French                        |
    | fy       | Frisian                       |
    | ga       | Irish or Irish Gaelic         |
    | gd       | Scottish Gaelic               |
    | gl       | Galician                      |
    | gom-latn | Konkani Latin script          |
    | gu       | Gujarati                      |
    | he       | Hebrew                        |
    | hi       | Hindi                         |
    | hr       | Croatian                      |
    | ht       | Haitian Creole (Haiti)        |
    | hu       | Hungarian                     |
    | hy-am    | Armenian                      |
    | id       | Indonesian                    |
    | is       | Icelandic                     |
    | it-ch    | Italian (Switzerland)         |
    | it       | Italian                       |
    | ja       | Japanese                      |
    | jv       | Javanese                      |
    | ka       | Georgian                      |
    | kk       | Kazakh                        |
    | km       | Cambodian                     |
    | kn       | Kannada                       |
    | ko       | Korean                        |
    | ku       | Kurdish                       |
    | ky       | Kyrgyz                        |
    | lb       | Luxembourgish                 |
    | lo       | Lao                           |
    | lt       | Lithuanian                    |
    | lv       | Latvian                       |
    | me       | Montenegrin                   |
    | mi       | Maori                         |
    | mk       | Macedonian                    |
    | ml       | Malayalam                     |
    | mn       | Mongolian                     |
    | mr       | Marathi                       |
    | ms-my    | Malay                         |
    | ms       | Malay                         |
    | mt       | Maltese (Malta)               |
    | my       | Burmese                       |
    | nb       | Norwegian Bokmål              |
    | ne       | Nepalese                      |
    | nl-be    | Dutch (Belgium)               |
    | nl       | Dutch                         |
    | nn       | Nynorsk                       |
    | oc-lnc   | Occitan, lengadocian dialecte |
    | pa-in    | Punjabi (India)               |
    | pl       | Polish                        |
    | pt-br    | Portuguese (Brazil)           |
    | pt       | Portuguese                    |
    | ro       | Romanian                      |
    | ru       | Russian                       |
    | rw       | Kinyarwanda (Rwanda)          |
    | sd       | Sindhi                        |
    | se       | Northern Sami                 |
    | si       | Sinhalese                     |
    | sk       | Slovak                        |
    | sl       | Slovenian                     |
    | sq       | Albanian                      |
    | sr-cyrl  | Serbian Cyrillic              |
    | sr       | Serbian                       |
    | ss       | siSwati                       |
    | sv-fi    | Finland Swedish               |
    | sv       | Swedish                       |
    | sw       | Swahili                       |
    | ta       | Tamil                         |
    | te       | Telugu                        |
    | tet      | Tetun Dili (East Timor)       |
    | tg       | Tajik                         |
    | th       | Thai                          |
    | tk       | Turkmen                       |
    | tl-ph    | Tagalog (Philippines)         |
    | tlh      | Klingon                       |
    | tr       | Turkish                       |
    | tzl      | Talossan                      |
    | tzm-latn | Central Atlas Tamazight Latin |
    | tzm      | Central Atlas Tamazight       |
    | ug-cn    | Uyghur (China)                |
    | uk       | Ukrainian                     |
    | ur       | Urdu                          |
    | uz-latn  | Uzbek Latin                   |
    | uz       | Uzbek                         |
    | vi       | Vietnamese                    |
    | x-pseudo | Pseudo                        |
    | yo       | Yoruba Nigeria                |
    | zh-cn    | Chinese (China)               |
    | zh-hk    | Chinese (Hong Kong)           |
    | zh-tw    | Chinese (Taiwan)              |
    | zh       | Chinese                       |
    | es-us    | Spanish (United States)       |
    | es       | Spanish                       |
    | et       | Estonian                      |
  - `format`: A [DayJS Format](https://day.js.org/docs/en/display/format)
    | Format | Description                           |
    | ------ | ------------------------------------- |
    | `YY`   | Two-digit year                        |
    | `YYYY` | Four-digit year                       |
    | `M`    | The month, beginning at 1             |
    | `MM`   | The month, 2-digits                   |
    | `MMM`  | The abbreviated month name            |
    | `MMMM` | The full month name                   |
    | `D`    | The day of the month                  |
    | `DD`   | The day of the month, 2-digits        |
    | `d`    | The day of the week, with Sunday as 0 |
    | `dd`   | The min name of the day of the week   |
    | `ddd`  | The short name of the day of the week |
    | `dddd` | The name of the day of the week       |
    | `H`    | The hour                              |
    | `HH`   | The hour, 2-digits                    |
    | `h`    | The hour, 12-hour clock               |
    | `hh`   | The hour, 12-hour clock, 2-digits     |
    | `m`    | The minute                            |
    | `mm`   | The minute, 2-digits                  |
    | `s`    | The second                            |
    | `ss`   | The second, 2-digits                  |
    | `SSS`  | The millisecond, 3-digits             |
    | `Z`    | The offset from UTC, ±HH:mm           |
    | `ZZ`   | The offset from UTC, ±HHmm            |
    | `A`    | Adds AM or PM to the timestamp        |
    | `a`    | Adds am or pm to the timestamp        |

## Permissions

The following methods are used to parse anything Permission related:

- `permLevels(level)`: Returns the meaning of the permission level, where:
  - `level`: The Permission Level as integer
- `permToken(token)`: <span style="color:lightblue">(Internal System Call)</span> Parses the Permission Token and returns it's properties, where:
  - `token`: The Permission Token.

## Arguments

This category only possesses one method (as of v2.0.1):

- `messageArguments(args, command)`: Parses the arguments for a certain command and returns `{validity: boolean, argMap: argMap}` (`validity`: whenever the arguments are valid or not; `argMap`: An [`Argument Map`](../libraries/constants.md#Argument-Map)), where:
  - `args`: The arguments.
  - `command`: The command.

## Enabled Command List

The Enabled Command List controls the enabled states for all commands of the bot. The ECL has two methods (as of v2.0.1):
- `get(command)`: Returns `boolean`: `true` if the command is enabled, `false` if it is disabled, where:
  - `command`: The command to fetch the ECL state from.
- `set(command, state)`: Returns `boolean`: `true` if the operation successful, `false` if it fails, where:
  - `command`: The command to modify the ECL state.
  - `state`: The state (`Boolean`)