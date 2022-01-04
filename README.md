<h1 align="center"> Discord Bot Template</h1>
<h3 align="center">Template for Discord Bots using Discord v13</h3>

![](https://img.shields.io/github/issues/DarkenLM/Discord-Bot-Template?style=for-the-badge)
![](https://img.shields.io/github/stars/DarkenLM/Discord-Bot-Template?style=for-the-badge)
![](https://img.shields.io/github/license/DarkenLM/Discord-Bot-Template?style=for-the-badge)
## Requirements
- `Node.js` v16.7.0+ & `NPM` v7.21.0+
- `Discord.js v13`
- `applications.commands` scope enabled on the [Discord Developer Portal](https://discord.com/developers/applications) (Required for Slash Commands)

## Features
- `Automatic Slash Command Builder`: No need to configure two sets of arguments. The arguments are valid for both Message and Slash Commands.
- `Plugin System`: No need to navigate through the core of the bot. Just add what you need to the plugins folder.
- `Module System`: Organize your code using different modules.
- `Logging`: This Template has a built-in logging system with file and console output.
- `Command Crash Report`: A command has crashed? No problem. If the error happens inside the command, a crash report will be generated and your users will be notified.

### Built-in commands
#### **Admin**
| Command   |                                                                    |
|:---------:|:------------------------------------------------------------------:|
| ECL       | Enable or disable commands on the fly, no need for restart.        |
| EVAL      | Evaluate code inside your bot without need for creating new files. |
| PERMTOKEN | Activate Permission Tokens to grant permissions to a user.         |
| REGISTER  | Add commands on test mode without needing to restart the bot.      |
| RELOAD    | Reload a command to apply the changes made to it.                  |

#### **Info**
| Command   |                                                                                      |
|:---------:|:------------------------------------------------------------------------------------:|
| HELP      | Show all commands accessible to the user, or the help message for a specific command |
| PERMLEVEL | Shows the user's current Permission Level                                            |
| PING      | Pong. Shows the Bot's current ping.                                                  |

## Version Support Info
**Label:**
- `Available`: Full support
- `Sunsetting`: Will be discontinued
- `Discontinued`: No support will be provided

| Version | Support Status |
|:-------:|:--------------:|
| v1.0.0  | Available      |

**Notes:**
- Check regularly the [Releases section]() to keep youself informed about the latest updates.
- Versioning follows the [Semver](https://semver.org/) specification.
- All versions ending with `-alpha` have no support.

## Installation
1. Download the latest [Release]()
2. Extract it.
3. Go to the [Discord Developer Portal](https://discord.com/developers/applications) and grab your bot token.
4. Open config.json.
5. Paste your token on the `token` property.
6. Start the bot.

## Documentation
Documentation is available on [this page](./docs/index.md)

## Suggestions
If you have a suggestion for this Template, feel free to open an issue on the [Issues Panel]()

## Issues
Before submiting an issue, make sure you've read the [Documentation](./docs/index.md)

## Contributing
Please refer to [CONTRIBUTING.MD](./CONTRIBUTING.MD)

## Copyright and Licencing
Copyright © 2021-2022 [DarkenLM](https://github.com/DarkenLM) rafaelsantosfernandes660@gmail.com  
This project is under the [GNU v3.0 Licence](./LICENSE)